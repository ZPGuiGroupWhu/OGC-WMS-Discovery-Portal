package com.gsv.querywmslist.querywmslist.service;

import java.awt.image.BufferedImage;
import java.io.*;
import java.net.URL;
import java.util.*;
import java.util.stream.Collectors;

import com.alibaba.fastjson.JSONObject;
import com.gsv.querywmslist.querywmslist.commons.*;
import com.gsv.querywmslist.querywmslist.dao.*;
import lombok.SneakyThrows;
import okhttp3.*;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.aspectj.util.FileUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.gsv.querywmslist.querywmslist.dto.LayerWithFloatBBox;
import com.gsv.querywmslist.querywmslist.dto.LayerWithWMS;
import com.gsv.querywmslist.querywmslist.dto.SearchLayerByTempleteResult;
import com.gsv.querywmslist.querywmslist.repository.ContactInfoMapper;
import com.gsv.querywmslist.querywmslist.repository.HashCodeMapper;
import com.gsv.querywmslist.querywmslist.repository.LayerMapper;
import com.gsv.querywmslist.querywmslist.repository.WMSMapper;
import com.mathworks.toolbox.javabuilder.MWException;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.util.ResourceUtils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;


@Service
public class LayerService {


	@Autowired private LayerMapper layerMapper;
	@Autowired private WMSMapper wmsMapper;
	@Autowired private ContactInfoMapper contactInfoMapper;
	@Autowired private HashCodeMapper hashcodeMapper;
	
	private Map<Integer, Integer[]> hashcodes;
	private Long createAt;
	private HashcodeCache hashcodeCache = new HashcodeCache();
	private IntentionCache intentionCache = new IntentionCache();
	private InitialPageCache initialPageCache = new InitialPageCache();
	
	public LayerService() {
		this.createAt = System.currentTimeMillis();
	}
	
	
    // 初始化 从数据库中读取所有图片的哈希码
    private void initBydatabase(){
		this.hashcodes = new HashMap<Integer, Integer[]>();
		List<HashCode> tmp_hashcodes=hashcodeMapper.getHashCode();

		for (HashCode tmp_hashcode:tmp_hashcodes){
			tmp_hashcode.getHashCode();
			this.hashcodes.put(tmp_hashcode.id,tmp_hashcode.hashcode);
		}
	}
    
    
    
    @SneakyThrows
	public SearchLayerByTempleteResult getLayerListByHashcodeSimilarity(Integer[][] templateHashCodes, Integer pageNum, Integer pageSize, PhotoTransportType photoType, String table) {
    	
    	List<ObjectSimilarity> similarities = new ArrayList <ObjectSimilarity> ();
    	// 计算图片库中每张图片与样例图片的64位哈希码的平均汉明距离，然后过滤得到相似度大于32的图片id
    	this.hashcodes.forEach((k, v) -> {
    		Float simi = 0f;
    		for(Integer[] tmp_templateHashcode : templateHashCodes) {
        		Float tmp_simi = new Float(Similarity.hammingDistance(v, tmp_templateHashcode));
        		simi += tmp_simi;
    		}

    		// 通过排除差异较大的图片减少内存使用，认为如果汉明距离i小于32就不相似了，32为64位哈希码的一半
    		if(simi / templateHashCodes.length < 32f ) {
        		similarities.add(new ObjectSimilarity(k, simi));
    		}
    	});
    	
    	// 将图片按照相似度由大到小排序
    	Collections.sort(similarities);

		List<Integer> similaritiesID = new ArrayList<>();           // 最终符合相似度条件的图层ID
		for (int i = 0; i < similarities.size(); i++) {
			similaritiesID.add(similarities.get(i).getId()) ;
		}


		// 如果是layer_for_intent的标注数据表，需要剔除原始layerlist表中没有的id，以获得准确的相似图层总数
		if ("layerlist_for_intent".equals(table)) {
			List<Integer> intentSimID = new ArrayList<>();    // layerlist_for_intent表中符合相似度条件的图层
			// 读取resources文件夹下的layerlist_for_intent的ID列表
//			File file = new File ("src/main/resources/layerlist_for_intentID.json");
//			FileReader fileReader = new FileReader(file);
//			Reader reader = new InputStreamReader(new FileInputStream(file), "Utf-8");

			InputStream in = this.getClass().getResourceAsStream("/" + "layerlist_for_intentID.json");
			Reader reader = new InputStreamReader(in, "Utf-8");
			int ch = 0;
			StringBuffer sb = new StringBuffer();
			while ((ch = reader.read()) != -1) {
				sb.append((char) ch);
			}
			// fileReader.close();
			reader.close();
			String jsonStr = sb.toString();

			JSONArray tmp = JSON.parseObject(jsonStr).getJSONArray("layerID");
			intentSimID = JSON.parseArray(tmp.toJSONString(),Integer.class);

			similaritiesID.retainAll(intentSimID);

		}

    	// 根据页码数确定结果图层ID
    	int start = (pageNum - 1) * pageSize;
    	int layerNum = Math.min(pageSize, similaritiesID.size() - start);
    	Integer[] layerIdArray = new Integer[layerNum];
    	for(int i = start; i < Math.min(start + pageSize, similaritiesID.size()); i++) {
    		layerIdArray[i - start] = similaritiesID.get(i);
    	}

    	
    	// 查询Layer，根据图像传输类型选择是否查询图片Base64字符串
    	List<Layer> layers = null;
    	if(photoType.equals(PhotoTransportType.BASE64_STRING)) {
    		layers = layerMapper.getLayersByIdArray(layerIdArray, table);
    	} else if(photoType.equals(PhotoTransportType.STATIC_RESOURCE_PATH)) {
    		layers = layerMapper.getLayersWithoutPhotoByIdArray(layerIdArray, table);
    	}
    	
    	
    	// 转换BBox字段
    	List<LayerWithFloatBBox> layersWithFloatBBox = layers.stream().map(layer -> 
    			TransformUtil.layerToLayerWithFloatBBox(layer, photoType)).collect(Collectors.toList());


    	Integer totalLayerNum = similaritiesID.size();
    	SearchLayerByTempleteResult result = new SearchLayerByTempleteResult();
    	result.setLayers(layersWithFloatBBox);
    	result.setTotalLayerNum(totalLayerNum);
    	return result;
    }
    
    /*
     * 根据图层库中已有样例图片查询
     */
    public SearchLayerByTempleteResult getLayerListByTemplateId(Integer[] templateId, Integer pageNum, Integer pageSize, PhotoTransportType photoType, String table) {
    	
    	
    	if(this.hashcodes == null) {
    		initBydatabase();
    	}
    	Integer[][] templateHashCodes = new Integer[templateId.length][];
    	
    	for(int i = 0; i < templateId.length; i++) {
    		Integer tmp_templateId = templateId[i];
    		templateHashCodes[i] = this.hashcodes.get(tmp_templateId);
    	}
    	return getLayerListByHashcodeSimilarity(templateHashCodes, pageNum, pageSize, photoType, table);
    	
    }
    
    
    /*
     * 根据用户上传的样例图片查询
     */
    public SearchLayerByTempleteResult getLayerListByTemplateUploaded(String sessionID, String imageBase64Strs, Integer pageNum, Integer pageSize, PhotoTransportType photoType, String table) {
    	
    	if(this.hashcodes == null) {
    		initBydatabase();
    	}
    	Integer[][] templateHashCodes;
    	
    	if(hashcodeCache.contains(sessionID)) {
    		templateHashCodes = hashcodeCache.getHashcode(sessionID);
    	} else {
    		JSONArray imageBase64StrsJSON = JSON.parseArray(imageBase64Strs);
    		double[][][][] imagesArray = new double[imageBase64StrsJSON.size()][][][];
    		for(int i = 0; i < imageBase64StrsJSON.size(); i++) {
    			String tmpImageBase64Str = imageBase64StrsJSON.getString(i);
    			BufferedImage tmpImage = null;
    			try {
    				tmpImage = ImageHashCodesUtils.base64StrToBufferedImage(tmpImageBase64Str);
    			} catch (IOException e) {
    				// TODO Auto-generated catch block
    				System.out.println("ERROR: base64StrToBufferedImage");
    				return null;
    				
    			}
    			imagesArray[i] = ImageHashCodesUtils.cvtImageRGBToArray(tmpImage);
    		}
    		
    		// get image mainpart by MC 
    		int[][][] mainpart_MCs = new int[imagesArray.length][][];
    		for(int i = 0; i < imagesArray.length; i++) {
    			double[][][] tmpImage = imagesArray[i];
    			try {
    				mainpart_MCs[i] = ImageHashCodesUtils.getMainPartMCInt(tmpImage);
    			} catch (MWException e) {
    				// TODO Auto-generated catch block
    				System.out.println("ERROR: getMainPartMC");
    				return null;
    			}
    		}
    		// get image mainpart by RG
    		// get image gray
    		JSONArray mainpartRGBase64Strs = new JSONArray();
    		for(int i = 0; i < imagesArray.length; i++) {

    			try {
    				int[][][] tmpImage = ImageHashCodesUtils.doubleArray2intArray(imagesArray[i]);
    				int[][] tmpGrayImage = RegionGrow.cvtImageArrayRGBToGray(tmpImage);
    				int[][] tmpMainPartRG = RegionGrow.regionGrow(tmpGrayImage);
    				String tmpMainpartRGBase64Str = ImageHashCodesUtils.bufferedImage2Base64Str(ImageHashCodesUtils.array2Image(tmpMainPartRG));
    				mainpartRGBase64Strs.add(tmpMainpartRGBase64Str);
    			} catch (Exception e) {
    				// TODO Auto-generated catch block
    				System.out.println("ERROR: get image mainpart by RG");
    				return null;
    			}
    		}
    		
    		// get hashcodes
    		int[][] hashcodes;
    		try {
    			// convert imageBase64Strs from JSONArrayStr to JSONArray
    			JSONArray images = JSON.parseArray(imageBase64Strs);
    			// convert mainpart_MCs from double[][][] to
    			JSONArray mainpartMCBase64Strs = new JSONArray();
    			int[][][] mainpart_MCsInt = mainpart_MCs;
    			for(int i = 0; i < mainpart_MCsInt.length; i++) {
    				int[][] mainpartMCInt = mainpart_MCsInt[i];
    				String tmpMainpartMCBase64Str = ImageHashCodesUtils.bufferedImage2Base64Str(ImageHashCodesUtils.array2Image(mainpartMCInt));
    				mainpartMCBase64Strs.add(tmpMainpartMCBase64Str);
    			}
    			hashcodes = ImageHashCodesUtils.getHashCodes(images, mainpartMCBase64Strs, mainpartRGBase64Strs);
    		} catch (IOException e) {
    			// TODO Auto-generated catch block
    			System.out.println("ERROR: getHashCodes");
    			return null;
    		}
    		
    		templateHashCodes = new Integer[hashcodes.length][];
    		for(int i = 0; i < hashcodes.length; i++) {
    			Integer[] tmpHashcode = new Integer[hashcodes[i].length - 1];
    			// 第一个整数是图片ID，因此从第二个开始
    			for(int j = 1; j < hashcodes[i].length; j++) {
    				tmpHashcode[j - 1] = hashcodes[i][j];
    			}
    			templateHashCodes[i] = tmpHashcode;
    		}
    		
    		sessionID = UUID.randomUUID().toString().replaceAll("-", "");
    		// 缓存
    		this.hashcodeCache.put(sessionID, templateHashCodes);
    		
    	}
    	SearchLayerByTempleteResult result = getLayerListByHashcodeSimilarity(templateHashCodes, pageNum, pageSize, photoType, table);
    	result.setSessionID(sessionID);
    	return result;
    }
    
    
    public List<LayerWithFloatBBox>  getLayerList(String keywords, float[] bound, String topic,  String table, Integer pageNum, Integer pageSize, PhotoTransportType photoType){
        
        // 参数预处理
        keywords = (keywords == null) ? keywords : keywords.toLowerCase();
        String polygon = new String();
        if(bound != null) {
            float maxLat, maxLon, minLat, minLon;
            minLon = bound[0];
            maxLon = bound[1];
            minLat = bound[2];
            maxLat = bound[3];
            polygon = "Polygon((" + 
            		maxLat + " " + minLon + "," + 
                    maxLat + " " + maxLon + "," + 
                    minLat + " " + maxLon + "," +
                    minLat + " " + minLon + "," +
                    maxLat + " " + minLon + "))";
            //从左上角开始顺时针写矩形，矩形第一个点和最后一个点必须一致
        } else {
            polygon = "";
        }
        String[] topicArray = (topic == null) ? null : topic.toLowerCase().split(",");
        
        Integer fromRowNum = (pageNum - 1) * pageSize;
        List<Layer> layers = layerMapper.getLayers(keywords, polygon, topicArray, table, fromRowNum, pageSize);
        
        // 转换BBox字段
    	List<LayerWithFloatBBox> layersWithFloatBBox = layers.stream().map(layer -> 
    			TransformUtil.layerToLayerWithFloatBBox(layer, photoType)).collect(Collectors.toList());
        
        return layersWithFloatBBox;
    }
    
    
    public Integer getLayerListNum(String keywords, float[] bound, String topic, String table){
        
        // 参数预处理
        keywords = (keywords == null) ? keywords : keywords.toLowerCase();
        String polygon = new String();
        if(bound != null) {
            float maxLat, maxLon, minLat, minLon;
            minLon = bound[0];
            maxLon = bound[1];
            minLat = bound[2];
            maxLat = bound[3];
            polygon = "Polygon((" + 
            		maxLat + " " + minLon + "," + 
                    maxLat + " " + maxLon + "," + 
                    minLat + " " + maxLon + "," +
                    minLat + " " + minLon + "," +
                    maxLat + " " + minLon + "))";
            //从左上角开始顺时针写矩形，矩形第一个点和最后一个点必须一致
        } else {
            polygon = "";
        }
        String[] topicArray = (topic == null) ? null : topic.toLowerCase().split(",");
        
        Integer result = layerMapper.getLayersNum(keywords, polygon, topicArray, table);
        return result;
    }

    public LayerWithWMS getLayerInfo(Integer layerId,  PhotoTransportType photoType, String table) {
    	Integer[] layerIdArray = {layerId};
    	List<Layer> layers = layerMapper.getLayersByIdArray(layerIdArray, table);
    	
    	if(layers.isEmpty()) {
    		return null;
    	}
    	
    	Layer layer = layers.get(0);
    	WMS wms = wmsMapper.getWMSById(layer.getServiceId());
    	ContactInfo contactInfo = contactInfoMapper.getContactInfoByServiceId(layer.getServiceId());

    	LayerWithWMS layerWithWMS = TransformUtil.mergeLayerAndWMSAndContactInfo(layer, wms, contactInfo, photoType);
    	
    	return layerWithWMS;
    	
    }

	public Map<String,Object> getIntentionByLayerIds(Map<String,Object> layers, Map<String,Object> parameter) throws IOException {
		//根据正负反馈样本图层编号查询正负样本集
		//samples的正负样本集的key分别relevance和irrelevance
		List<Layer>totalLayers=new ArrayList<>();
		IntentionUtils utils=new IntentionUtils();
		Map<String,Object> mapIntent =utils.getIntentionJson(layers, parameter);
		return mapIntent;
	}



	public SearchLayerByTempleteResult getLayerListByIntentionLayerIds(String sessionID,Map<String,Object> layerIds,Map<String,Object> parameter, Integer pageNum, Integer pageSize, PhotoTransportType photoType) throws IOException {

		List<Layer>totalLayers=new ArrayList<>();
		if(intentionCache.contains(sessionID)) {
			totalLayers = intentionCache.getHashcode(sessionID);
		} else {
			//根据样本集查询意图
			Intention intention= new Intention();

			//调用接口三
			intention = queryIntention(layerIds, parameter);

			totalLayers =getLayersByIntention(intention);
			sessionID = UUID.randomUUID().toString().replaceAll("-", "");
			// 缓存
			this.intentionCache.put(sessionID, totalLayers);
		}


		// 根据页码数确定结果图层ID
		int start = (pageNum - 1) * pageSize;
		int layerNum = Math.min(pageSize, totalLayers.size() - start);
		List<Layer> layers = Arrays.asList(new Layer[layerNum]);
		for(int i = start; i < Math.min(start + pageSize, totalLayers.size()); i++) {
			layers.set(i - start, totalLayers.get(i));
		}
		// 转换BBox字段
		List<LayerWithFloatBBox> layersWithFloatBBox = layers.stream().map(layer ->
				TransformUtil.layerToLayerWithFloatBBox(layer, photoType)).collect(Collectors.toList());

		Integer totalLayerNum = totalLayers.size();
		SearchLayerByTempleteResult result = new SearchLayerByTempleteResult();
		result.setLayers(layersWithFloatBBox);
		result.setTotalLayerNum(totalLayerNum);
		result.setSessionID(sessionID);
		return result;
	}

	public SearchLayerByTempleteResult getLayerListByIntention(String sessionID,Intention intention, Integer pageNum, Integer pageSize, PhotoTransportType photoType) throws IOException {
		//根据意图查询正负样本集
		List<Layer>totalLayers=new ArrayList<>();
		if(intentionCache.contains(sessionID)) {
			totalLayers = intentionCache.getHashcode(sessionID);
		} else {
			//意图查询接口
			Integer fromRowNum = (pageNum - 1) * pageSize;
			totalLayers =getLayersByIntention(intention);
			sessionID = UUID.randomUUID().toString().replaceAll("-", "");
			// 缓存
			this.intentionCache.put(sessionID, totalLayers);
		}
		// 根据页码数确定结果图层ID
		int start = (pageNum - 1) * pageSize;
		int layerNum = Math.min(pageSize, totalLayers.size() - start);
		List<Layer> layers = Arrays.asList(new Layer[layerNum]);
		for(int i = start; i < Math.min(start + pageSize, totalLayers.size()); i++) {
			layers.set(i - start, totalLayers.get(i));
		}
		// 转换BBox字段
		List<LayerWithFloatBBox> layersWithFloatBBox = layers.stream().map(layer ->
				TransformUtil.layerToLayerWithFloatBBox(layer, photoType)).collect(Collectors.toList());

		Integer totalLayerNum = totalLayers.size();
		SearchLayerByTempleteResult result = new SearchLayerByTempleteResult();
		result.setLayers(layersWithFloatBBox);
		result.setTotalLayerNum(totalLayerNum);
		result.setSessionID(sessionID);
		return result;
	}

	private Intention queryIntention(Map<String,Object> layers, Map<String,Object> parameter) throws IOException {
		OkHttpClient client = new OkHttpClient();
		Intention intention =new Intention();
		intention.subIntention=new ArrayList<>();
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("layers", layers);
		map.put("parameter", parameter);
		String jsonStr = JSONObject.toJSONString(map);
//		System.out.println(jsonStr);
		RequestBody body = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), jsonStr);
		Request request = new Request.Builder()
				.url("http://127.0.0.1:8090/process/recognizeIntention")
				.post(body)
				.build();
		Response response = client.newCall(request).execute();
		if (response.isSuccessful()) {
			String Str = response.body().string();
			JSONObject jsonObject = JSON.parseObject(Str);
			JSONArray result = jsonObject.getJSONArray("result");
			//JSONArray  jsintention  = jsonObject.getJSONArray("intention");
			JSONArray jsintention = result.getJSONObject(0).getJSONArray("intention");

			intention.subIntentionNum=jsintention.size();
			jsintention.stream().forEach(subIntention -> {
				JSONObject jsonIntention = JSON.parseObject(subIntention.toString());
				List<String> content= (List<String>) jsonIntention.get("content");
				List<String> location= (List<String>) jsonIntention.get("location");
				List<String> style= (List<String>) jsonIntention.get("style");
				List<String> topic= (List<String>) jsonIntention.get("topic");
				Intention.SubIntention temSubIntention=intention.new SubIntention();

				if (content.size() != 0) {
					temSubIntention.content = Arrays.asList(content.get(0).substring(content.get(0).lastIndexOf("/") + 1));
				} else {
					temSubIntention.content = Arrays.asList("");
				}
				temSubIntention.location = location;
				temSubIntention.style = style;
				temSubIntention.topic = topic;
				intention.subIntention.add(temSubIntention);
//				System.out.println(temSubIntention);
			});
		} else {
			throw new IOException("Unexpected code " + response);
		}
		return intention;
	}


	public List<Layer> getLayersByIntention(Intention intention) throws IOException {
		List<Layer>resultLayers=new ArrayList<>();

//		File file = ResourceUtils.getFile("classpath:all_hyponyms.json");
//		JSONObject contents = JSON.parseObject(FileUtil.readAsString(file));

		InputStream in = this.getClass().getResourceAsStream("/" + "all_hyponyms.json");
		Reader reader = new InputStreamReader(in, "Utf-8");
		int ch = 0;
		StringBuffer sb = new StringBuffer();
		while ((ch = reader.read()) != -1) {
			sb.append((char) ch);
		}
		// fileReader.close();
		reader.close();
		String jsonStr = sb.toString();
		JSONObject contents = JSON.parseObject(jsonStr);

		for(int j = intention.subIntentionNum -1; j>=0; j--) {
			Intention.SubIntention tempSubIntention= intention.subIntention.get(j);
			List<String> subContents = new ArrayList<>();
			// 对子意图中维度是空数组的情况进行改造，即[] => [""], 否则查询会报错
			if (tempSubIntention.content.size() == 0) {
				tempSubIntention.content = Arrays.asList("");
			}
			else{

				//匹配geonames
				if(!tempSubIntention.content.get(0).contains("http://")){
					List<String> allContents = new ArrayList<>();
					//获取所有概念
					Iterator<String> sIterator = contents.keySet().iterator();
					while (sIterator.hasNext()){
						String key = sIterator.next();
						allContents.add(key);
						if(key.substring(key.lastIndexOf("/")+1).contains(tempSubIntention.content.get(0))){
							subContents.addAll((List<String>)contents.get(key));
							subContents.add(key);
//							System.out.println(subContents);
						}
					}
				}
				else{
				//扩展子意图的内容维度
				subContents = (List<String>)contents.get(tempSubIntention.content.get(0));
				subContents.add(tempSubIntention.content.get(0));
//				System.out.println(subContents);
				}
			}
			if (tempSubIntention.location.size() == 0) {
				tempSubIntention.location = Arrays.asList("");
			}
			if (tempSubIntention.style.size() == 0) {
				tempSubIntention.style = Arrays.asList("");
			}
			if (tempSubIntention.topic.size() == 0) {
				tempSubIntention.topic = Arrays.asList("");
			}
			for(String subContent : subContents){
			List<Layer> tempLayers = layerMapper.getLayersbySubIntention(subContent, tempSubIntention.location.get(0), tempSubIntention.style.get(0), tempSubIntention.topic.get(0));

			int max = resultLayers.size() > tempLayers.size() ? resultLayers.size() : tempLayers.size();
			//新建一个数组list，来接受最终结果
			List<Layer> list = new ArrayList<>(resultLayers.size() + tempLayers.size());
			//遍历较大长度，保证所有数据都能取到
			for (int i = 0; i < max; i++) {
				if (i < resultLayers.size()) {
					list.add(resultLayers.get(i));
				}

				if (i < tempLayers.size()) {
					list.add(tempLayers.get(i));
				}
			}
			resultLayers=list;
		}
		}
		return resultLayers;
	}

    public List<LayerWithFloatBBox> getLayerListNew(String sessionID,String keywords, float[] bound, String topic,  String table, Integer pageNum, Integer pageSize, PhotoTransportType photoType) {
		// 参数预处理
		keywords = (keywords == null) ? keywords : keywords.toLowerCase();
		String polygon = new String();
		if (bound != null) {
			float maxLat, maxLon, minLat, minLon;
			minLon = bound[0];
			maxLon = bound[1];
			minLat = bound[2];
			maxLat = bound[3];
			polygon = "Polygon((" +
					maxLat + " " + minLon + "," +
					maxLat + " " + maxLon + "," +
					minLat + " " + maxLon + "," +
					minLat + " " + minLon + "," +
					maxLat + " " + minLon + "))";
			//从左上角开始顺时针写矩形，矩形第一个点和最后一个点必须一致
		} else {
			polygon = "";
		}
		String[] topicArray = (topic == null) ? null : topic.toLowerCase().split(",");
		List<Layer> layers = new ArrayList<>();
		//判断初始化页面
		if (keywords == null && bound == null && topic == null) {
//			System.out.println("计算totalLayerNum：");
			List<Integer> totalLayerIDs=layerMapper.getLayersIDs(keywords, polygon, topicArray, table);
			Integer totalLayerNum = totalLayerIDs.size();
//			System.out.println(totalLayerNum);
			Integer[] LayersOrder = totalLayerIDs.toArray(new Integer[0]);
			if (initialPageCache.contains(sessionID)) {
				LayersOrder = initialPageCache.getHashcode(sessionID);
			} else {
				//意图查询接口
//				for(int a=0;a<totalLayerNum;a++){
//					LayersOrder[a]=a;
//				}
				for(int i=0;i<totalLayerNum;i++){
					int j=new Random().nextInt(totalLayerNum);
					int t=LayersOrder[i];
					LayersOrder[i]=LayersOrder[j];
					LayersOrder[j]=t;
				}
//				System.out.println(LayersOrder);
				sessionID = UUID.randomUUID().toString().replaceAll("-", "");
				// 缓存
				this.initialPageCache.put(sessionID, LayersOrder);
			}
			Integer fromRowNum = (pageNum - 1) * pageSize;
			Integer[] tmpLayersIDs= new Integer[pageSize];
			for(int i=0;i<pageSize;i++){
				if(fromRowNum+i>=LayersOrder.length){
					break;
				}
				tmpLayersIDs[i]=LayersOrder[fromRowNum+i];
			}
			layers=layerMapper.getLayersByIdArray(tmpLayersIDs,table);
		} else {


			Integer fromRowNum = (pageNum - 1) * pageSize;
			layers = layerMapper.getLayers(keywords, polygon, topicArray, table, fromRowNum, pageSize);

		}
			// 转换BBox字段
		List<LayerWithFloatBBox> layersWithFloatBBox = layers.stream().map(layer ->
				TransformUtil.layerToLayerWithFloatBBox(layer, photoType)).collect(Collectors.toList());

		return layersWithFloatBBox;
	}
}