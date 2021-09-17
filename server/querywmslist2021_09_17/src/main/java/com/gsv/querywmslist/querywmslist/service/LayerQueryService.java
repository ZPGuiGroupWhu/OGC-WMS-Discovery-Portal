package com.gsv.querywmslist.querywmslist.service;

import com.csvreader.CsvReader;
import com.gsv.querywmslist.querywmslist.bean.*;
//import com.gsv.querywmslist.querywmslist.bean.LayerResult;
import com.gsv.querywmslist.querywmslist.commons.ImageDemo;
import com.gsv.querywmslist.querywmslist.commons.Similarity;
import com.gsv.querywmslist.querywmslist.repository.HashCodeMapper;
import com.gsv.querywmslist.querywmslist.repository.LayerQueryMapper;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Slf4j
@Service
public class LayerQueryService {
    @Autowired
    LayerQueryMapper layerQueryMapper;
	@Autowired
    HashCodeMapper hashcodemapper;

//    @Autowired
//    Environment env;
//    InfoConfig infoconfig;
	@Value("${info.path.hashcode}")
	private String hashcodePath;
    
    @Getter
//    private Map<Integer, String> hashcodes;
    private Map<Integer, Integer[]> hashcodes;
    
    @Getter
    private Long createAt;
    
    public LayerQueryService() {
    	this.createAt = System.currentTimeMillis();
    }
    
    /*
     * 初始化，载入文件系统中的hashcode
     */
    private void init() {
//    	this.hashcodes = new HashMap<Integer, String>();
    	this.hashcodes = new HashMap<Integer, Integer[]>();
//    	String homeDir = System.getProperty("user.home");
//    	this.hashcodePath = homeDir + File.separator + this.hashcodePath;
		System.out.println(this.hashcodePath);
    	String hashcode_path = this.hashcodePath;
    	if(new File(hashcode_path).exists()) {
    		try {
    			CsvReader reader = new CsvReader(hashcode_path, ',', Charset.forName("UTF-8"));
    			reader.readHeaders();
    			while(reader.readRecord()) {
    				Integer tmp_id = Integer.parseInt(reader.get(0));
    				Integer[] tmp_hashcode = new Integer[8];
    				for(int i = 1; i < 9; i++) {
    					tmp_hashcode[i - 1] = Integer.parseInt(reader.get(i));
    				}
//    				String hashcode = reader.get(1);
//    				this.hashcodes.put(tmp_id, hashcode);
    				this.hashcodes.put(tmp_id, tmp_hashcode);
    			}
    		} catch(IOException e) {
    			
    		}
    	}

    }

    // 初始化 从数据库中读取所有图片的哈希码
    private void initBydatabase(){
		this.hashcodes = new HashMap<Integer, Integer[]>();
		List<HashCode> tmp_hashcodes=hashcodemapper.getHashCode();

		for (HashCode tmp_hashcode:tmp_hashcodes){
			tmp_hashcode.getHashCode();
			this.hashcodes.put(tmp_hashcode.id,tmp_hashcode.hashcode);
		}
	}

    /*
     * 根据样例图片查询
     */
    public LayerResult2 getLayerListByTemplateId(Integer[] templateId, Integer pageNum, Integer pageSize) {
    	
    	long t1 = System.currentTimeMillis();
    	
    	if(this.hashcodes == null) {
    		initBydatabase();
    	}
    	// System.out.println("hashcodes length: " + this.hashcodes.size());
    	// System.out.println("templateId length: " + templateId.length);

    	long t2 = System.currentTimeMillis();
    	
    	List<ObjectSimilarity> similarities = new ArrayList <ObjectSimilarity> ();
//    	String hashcode0 = this.hashcodes.get(id);
    	List<Integer[]> templateHashCodes = new ArrayList<>();
    	for(Integer tmp_templateId : templateId) {
    		templateHashCodes.add(this.hashcodes.get(tmp_templateId));
    	}
//    	Integer[] hashcode0 = this.hashcodes.get(templateId);
    	this.hashcodes.forEach((k, v) -> {
    		Float simi = 0f;
    		for(Integer[] tmp_templateHashcode : templateHashCodes) {
        		Float tmp_simi = new Float(Similarity.hammingDistance(v, tmp_templateHashcode));
        		simi += tmp_simi;
    		}
//    		Float tmp_simi = new Float(Similarity.hammingDistance(v, hashcode0));
    		// 通过排除差异较大的图片减少内存使用，认为如果汉明距离i小于20就不相似了，20为经验值
    		if(simi / templateHashCodes.size() < 32f ) {
        		similarities.add(new ObjectSimilarity(k, simi));
    		}
//    		similarities.add(new ObjectSimilarity(k, tmp_simi));
    	});
    	
    	long t3 = System.currentTimeMillis();
    	Collections.sort(similarities);
    	long t4 = System.currentTimeMillis();
    	int start = (pageNum - 1) * pageSize;
    	int layerNum = Math.min(pageSize, similarities.size() - start);
    	Integer[] layerIdArray = new Integer[layerNum];
    	for(int i = start; i < Math.min(start + pageSize, similarities.size()); i++) {
    		layerIdArray[i - start] = similarities.get(i).getId();
    	}
    	long t5 = System.currentTimeMillis();
    	// System.out.println("id length:" + layerIdArray.length);
    	List<LayerList_temp> layerList_temps1=layerQueryMapper.getLayerListById(layerIdArray);
    	long t6 = System.currentTimeMillis();
    	List<LayerList_temp> layerList_temps= ImageDemo.readLayerList(layerList_temps1);
    	List<LayerList> layerLists=new ArrayList<>();
    	for(LayerList_temp layerList_temp:layerList_temps){
            LayerList layerList=new LayerList();
            layerList.setAbstr(layerList_temp.getAbstr());
            layerList.setAttribution(layerList_temp.getAttribution());
            layerList.setId(layerList_temp.getId());
            layerList.setKeywords(layerList_temp.getKeywords());
            layerList.setName(layerList_temp.getName());
            layerList.setTitle(layerList_temp.getTitle());
            layerList.setUrl(layerList_temp.getUrl());
            layerList.setTopic(layerList_temp.getTopic());
            layerList.setProjection(layerList_temp.getBoundingbox().split(" ")[0]);
            layerList.setBbox(layerList_temp);
            layerList.setPhoto(layerList_temp.getPhoto());
            layerLists.add(layerList);
        }

    	long t7 = System.currentTimeMillis();
    	List<String> searchTemplateIdList = new ArrayList<>();
    	for(Integer id : templateId) {
    		searchTemplateIdList.add(String.valueOf(id));
    	}
    	String searchTemplateIds = "样例ID:" + String.join(",", searchTemplateIdList);
    	String timeUse = 
    			"生成:" + (t2 - t1) + ";"
    			+ "按照样例查询:" + (t7 - t2) + ";"
    			+ "计算相似度:" + (t3 - t2) + ";"
    			+ "排序:" + (t4 - t3) + ";"
    			+ "分页:" + (t5 - t4) + ";"
    			+ "查询:" + (t6 - t5) + ";"
    			+ "转换:" + (t7 - t6);
    	// log.debug(searchTemplateIds + ";" + timeUse);
    	
    	LayerResult2 layerResult=new LayerResult2();
    	layerResult.setErrCode(1001);
//    	layerResult.setTotal((int)Math.ceil(similarities.size() / pageSize));
    	layerResult.setTotalLayerNum(similarities.size());
//        layerResult.setCurrentPageSize(layerLists.size());
        layerResult.setLayerNum(layerLists.size());
        layerResult.setData(layerLists);
        if(layerResult.getData()==null || layerResult.getLayerNum()==0){
            layerResult.setErrCode(1002);
        }
        
    	return layerResult;
    }
    
    public List<LayerList>  getlayerlist(String keywords,float[] bound,String topic,Integer pageNum, Integer pageSize){
        List<LayerList>layerLists=new ArrayList<>();
        List<LayerList_temp> layerList_temps1=new ArrayList<>();
        List<LayerList_temp> layerList_temps=new ArrayList<>();
        String keywordsNew=new String();
        String Polygon=new String();

        if(keywords!=null & keywords!="")
        {  keywordsNew=keywords.toLowerCase();}
        String topicNew=new String();

        if(topic!=null & topic!="")
        {topicNew=topic.toLowerCase();}
        String [] topicArray=new String[100];
        if(topic!=null){
            topicArray=topicNew.split(",");
        }

        if(bound!=null){
            float maxLat,maxLon,minLat,minLon;
            minLon=bound[0];maxLon=bound[1];
            minLat=bound[2];maxLat=bound[3];
            Polygon="Polygon(("+maxLat+" "+minLon+","+
                    maxLat+" "+maxLon+","+
                    minLat+" "+maxLon+","+
                    minLat+" "+minLon+","+
                    maxLat+" "+minLon+"))";
            //从左上角开始顺时针写矩形，矩形第一个点和最后一个点必须一致
        }else{
            Polygon="";
        }

        layerList_temps1=layerQueryMapper.getlayerlist(keywordsNew,Polygon,topicArray,pageNum,pageSize);
        layerList_temps= ImageDemo.readLayerList(layerList_temps1);
        for(LayerList_temp layerList_temp:layerList_temps){
            LayerList layerList=new LayerList();
            layerList.setAbstr(layerList_temp.getAbstr());
            layerList.setAttribution(layerList_temp.getAttribution());
            layerList.setId(layerList_temp.getId());
            layerList.setKeywords(layerList_temp.getKeywords());
            layerList.setName(layerList_temp.getName());
            layerList.setTitle(layerList_temp.getTitle());
            layerList.setUrl(layerList_temp.getUrl());
            layerList.setTopic(layerList_temp.getTopic());
            layerList.setProjection(layerList_temp.getBoundingbox().split(" ")[0]);
            layerList.setBbox(layerList_temp);
            layerList.setPhoto(layerList_temp.getPhoto());
            layerLists.add(layerList);
        }
        
        

        return layerLists;
    }
    
    
//    /*
//     * 根据样例图片查询
//     */
//    public LayerResult2 getLayerListByTemplateId(Integer[] templateId, Integer resultFromIndex, Integer resultToIndex) {
//    	
////    	long t1 = System.currentTimeMillis();
//    	
//    	if(this.hashcodes == null) {
//    		init();
//    	}
//    	
////    	long t2 = System.currentTimeMillis();
//    	
//    	List<ObjectSimilarity> similarities = new ArrayList<ObjectSimilarity>();
////    	String hashcode0 = this.hashcodes.get(id);
//    	List<Integer[]> templateHashCodes = new ArrayList<>();
//    	for(Integer tmp_templateId : templateId) {
//    		templateHashCodes.add(this.hashcodes.get(tmp_templateId));
//    	}
////    	Integer[] hashcode0 = this.hashcodes.get(templateId);
//    	this.hashcodes.forEach((k, v) -> {
//    		Float simi = 0f;
//    		for(Integer[] tmp_templateHashcode : templateHashCodes) {
//        		Float tmp_simi = new Float(Similarity.hammingDistance(v, tmp_templateHashcode));
//        		simi += tmp_simi;
//    		}
////    		Float tmp_simi = new Float(Similarity.hammingDistance(v, hashcode0));
//    		// 通过排除差异较大的图片减少内存使用，认为如果汉明距离i小于20就不相似了，20为经验值
//    		if(simi / templateHashCodes.size() < 32f ) {
//        		similarities.add(new ObjectSimilarity(k, simi));
//    		}
////    		similarities.add(new ObjectSimilarity(k, tmp_simi));
//    	});
//    	
////    	long t3 = System.currentTimeMillis();
//    	Collections.sort(similarities);
////    	long t4 = System.currentTimeMillis();
////    	int start = (pageNum - 1) * pageSize;
//    	int layerNum = resultToIndex - resultFromIndex + 1;
//    	Integer[] layerIdArray = new Integer[layerNum];
////    	for(int i = start; i < Math.min(start + pageSize, similarities.size()); i++) {
////    		layerIdArray[i - start] = similarities.get(i).getId();
////    	}
//    	for(int i = Math.min(resultFromIndex, similarities.size()); 
//    			i <= Math.min(resultToIndex, similarities.size());
//    			i++) {
//    		layerIdArray[i - resultFromIndex] = similarities.get(i).getId();
//    	}
////    	long t5 = System.currentTimeMillis();
//    	List<LayerList_temp> layerList_temps1=layerQueryMapper.getLayerListById(layerIdArray);
////    	long t6 = System.currentTimeMillis();
//    	List<LayerList_temp> layerList_temps= ImageDemo.readLayerList(layerList_temps1);
//    	List<LayerList> layerLists=new ArrayList<>();
//    	for(LayerList_temp layerList_temp:layerList_temps){
//            LayerList layerList=new LayerList();
//            layerList.setAbstr(layerList_temp.getAbstr());
//            layerList.setAttribution(layerList_temp.getAttribution());
//            layerList.setId(layerList_temp.getId());
//            layerList.setKeywords(layerList_temp.getKeywords());
//            layerList.setName(layerList_temp.getName());
//            layerList.setTitle(layerList_temp.getTitle());
//            layerList.setUrl(layerList_temp.getUrl());
//            layerList.setTopic(layerList_temp.getTopic());
//            layerList.setProjection(layerList_temp.getBoundingbox().split(" ")[0]);
//            layerList.setBbox(layerList_temp);
//            layerList.setPhoto(layerList_temp.getPhoto());
//            layerLists.add(layerList);
//        }
//
////    	long t7 = System.currentTimeMillis();
//
////    	System.out.println("生成：" + (t2 - t1) + ",\n"
////    			+ "按照样例查询：" + (t7 - t2) + ",\n"
////    			+ "计算相似度：" + (t3 - t2) + ",\n"
////    			+ "排序" + (t4 - t3) + ",\n"
////    			+ "分页" + (t5 - t4) + ",\n"
////    			+ "查询" + (t6 - t5) + ",\n"
////    			+ "转换" + (t7 - t6) + "");
//    	
//    	LayerResult2 layerResult=new LayerResult2();
//    	layerResult.setErrCode(1001);
////    	layerResult.setTotal((int)Math.ceil(similarities.size() / pageSize));
//    	layerResult.setTotalLayerNum(similarities.size());
////        layerResult.setCurrentPageSize(layerLists.size());
//        layerResult.setLayerNum(layerLists.size());
//        layerResult.setData(layerLists);
//        if(layerResult.getData()==null || layerResult.getLayerNum()==0){
//            layerResult.setErrCode(1002);
//        }
//        
//    	return layerResult;
//    }
}
