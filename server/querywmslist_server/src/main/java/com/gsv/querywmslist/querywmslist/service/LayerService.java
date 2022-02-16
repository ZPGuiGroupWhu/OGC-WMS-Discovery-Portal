package com.gsv.querywmslist.querywmslist.service;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.gsv.querywmslist.querywmslist.commons.HashcodeCache;
import com.gsv.querywmslist.querywmslist.commons.ImageHashCodesUtils;
import com.gsv.querywmslist.querywmslist.commons.ObjectSimilarity;
import com.gsv.querywmslist.querywmslist.commons.RegionGrow;
import com.gsv.querywmslist.querywmslist.commons.Similarity;
import com.gsv.querywmslist.querywmslist.commons.TransformUtil;
import com.gsv.querywmslist.querywmslist.dao.ContactInfo;
import com.gsv.querywmslist.querywmslist.dao.HashCode;
import com.gsv.querywmslist.querywmslist.dao.Layer;
import com.gsv.querywmslist.querywmslist.dao.WMS;
import com.gsv.querywmslist.querywmslist.dto.LayerWithFloatBBox;
import com.gsv.querywmslist.querywmslist.dto.LayerWithWMS;
import com.gsv.querywmslist.querywmslist.dto.SearchLayerByTempleteResult;
import com.gsv.querywmslist.querywmslist.repository.ContactInfoMapper;
import com.gsv.querywmslist.querywmslist.repository.HashCodeMapper;
import com.gsv.querywmslist.querywmslist.repository.LayerMapper;
import com.gsv.querywmslist.querywmslist.repository.WMSMapper;
import com.mathworks.toolbox.javabuilder.MWException;

@Service
public class LayerService {


	@Autowired private LayerMapper layerMapper;
	@Autowired private WMSMapper wmsMapper;
	@Autowired private ContactInfoMapper contactInfoMapper;
	@Autowired private HashCodeMapper hashcodeMapper;
	
	private Map<Integer, Integer[]> hashcodes;
	private Long createAt;
	private HashcodeCache hashcodeCache = new HashcodeCache();
	
	
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
    
    
    
    public SearchLayerByTempleteResult getLayerListByHashcodeSimilarity(Integer[][] templateHashCodes, Integer pageNum, Integer pageSize) {
    	
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
    	// 根据页码数确定结果图层ID
    	int start = (pageNum - 1) * pageSize;
    	int layerNum = Math.min(pageSize, similarities.size() - start);
    	Integer[] layerIdArray = new Integer[layerNum];
    	for(int i = start; i < Math.min(start + pageSize, similarities.size()); i++) {
    		layerIdArray[i - start] = similarities.get(i).getId();
    	}

    	// 查询Layer
    	List<Layer> layers = layerMapper.getLayersByIdArray(layerIdArray);
    	
    	// 转换BBox字段
    	List<LayerWithFloatBBox> layersWithFloatBBox = layers.stream().map(layer -> 
    			TransformUtil.layerToLayerWithFloatBBox(layer)).collect(Collectors.toList());
    	
    	Integer totalLayerNum = similarities.size();
    	SearchLayerByTempleteResult result = new SearchLayerByTempleteResult();
    	result.setLayers(layersWithFloatBBox);
    	result.setTotalLayerNum(totalLayerNum);
    	return result;
    }
    
    /*
     * 根据图层库中已有样例图片查询
     */
    public SearchLayerByTempleteResult getLayerListByTemplateId(Integer[] templateId, Integer pageNum, Integer pageSize) {
    	
    	
    	if(this.hashcodes == null) {
    		initBydatabase();
    	}
    	Integer[][] templateHashCodes = new Integer[templateId.length][];
    	
    	for(int i = 0; i < templateId.length; i++) {
    		Integer tmp_templateId = templateId[i];
    		templateHashCodes[i] = this.hashcodes.get(tmp_templateId);
    	}
    	return getLayerListByHashcodeSimilarity(templateHashCodes, pageNum, pageSize);
    	
    }
    
    
    /*
     * 根据用户上传的样例图片查询
     */
    public SearchLayerByTempleteResult getLayerListByTemplateUploaded(String sessionID, String imageBase64Strs, Integer pageNum, Integer pageSize) {
    	
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
    	SearchLayerByTempleteResult result = getLayerListByHashcodeSimilarity(templateHashCodes, pageNum, pageSize);
    	result.setSessionID(sessionID);
    	return result;
    }
    
    
    public List<LayerWithFloatBBox>  getLayerList(String keywords, float[] bound, String topic, Integer pageNum, Integer pageSize){
        
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
        List<Layer> layers = layerMapper.getLayers(keywords, polygon, topicArray, fromRowNum, pageSize);
        
        // 转换BBox字段
    	List<LayerWithFloatBBox> layersWithFloatBBox = layers.stream().map(layer -> 
    			TransformUtil.layerToLayerWithFloatBBox(layer)).collect(Collectors.toList());
        
        return layersWithFloatBBox;
    }
    
    
    public Integer getLayerListNum(String keywords, float[] bound, String topic){
        
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
        
        Integer result = layerMapper.getLayersNum(keywords, polygon, topicArray);
        return result;
    }

    public LayerWithWMS getLayerInfo(Integer layerId) {
    	Integer[] layerIdArray = {layerId};
    	List<Layer> layers = layerMapper.getLayersByIdArray(layerIdArray);
    	
    	if(layers.isEmpty()) {
    		return null;
    	}
    	
    	Layer layer = layers.get(0);
    	WMS wms = wmsMapper.getWMSById(layer.getServiceId());
    	ContactInfo contactInfo = contactInfoMapper.getContactInfoByServiceId(layer.getServiceId());

    	LayerWithWMS layerWithWMS = TransformUtil.mergeLayerAndWMSAndContactInfo(layer, wms, contactInfo);
    	
    	return layerWithWMS;
    	
    }
    
}
