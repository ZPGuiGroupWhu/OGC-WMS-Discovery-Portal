package com.gsv.querywmslist.querywmslist.service;

import java.io.File;
import java.io.IOException;
import java.util.*;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.gsv.querywmslist.querywmslist.dao.Intention;
import com.gsv.querywmslist.querywmslist.dto.SearchLayerByIntentionResult;
import org.aspectj.util.FileUtil;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.gsv.querywmslist.querywmslist.commons.PhotoTransportType;
import com.gsv.querywmslist.querywmslist.dto.LayerWithFloatBBox;
import com.gsv.querywmslist.querywmslist.dto.SearchLayerByTempleteResult;
import org.springframework.util.ResourceUtils;

@RunWith(SpringRunner.class)
@SpringBootTest
public class LayerServiceTest {

	
	@Autowired
	private LayerService layerService;
	
	
	@Ignore
	@Test
	public void testGetLayerListByTemplateId() {
		
		Integer[] templeteIdArray = {1};
		Integer pageNum = 1;
		Integer pageSize = 5;
		
		PhotoTransportType photoTransportType = PhotoTransportType.STATIC_RESOURCE_PATH;
		
		SearchLayerByTempleteResult result = layerService.getLayerListByTemplateId(templeteIdArray, pageNum, pageSize, photoTransportType,null);
		for(LayerWithFloatBBox layer : result.getLayers()) {
			System.out.println(layer.getId() + ", " + layer.getName() + ", " + layer.getPhoto() == null);
		}
	}


	@Ignore
	@Test
	public void testGetLayerList() {
		
		String keyword = "water";
		Integer pageNum = 1;
		Integer pageSize = 5;
		PhotoTransportType photoTransportType = PhotoTransportType.STATIC_RESOURCE_PATH;
		List<LayerWithFloatBBox> result = layerService.getLayerList(keyword, null, null, null, pageNum, pageSize, photoTransportType);
		for(LayerWithFloatBBox layer : result) {
			System.out.println(layer.getId() + ", " + layer.getName() + ", " + layer.getPhoto() == null);
		}
	}


	@Ignore
	@Test
	public void testGetLayerInfo() {
		
		Integer layerId = 1;
		PhotoTransportType photoTransportType = PhotoTransportType.STATIC_RESOURCE_PATH;
		LayerWithFloatBBox result = layerService.getLayerInfo(layerId, photoTransportType,null);
		System.out.println(result.toString());
	}
	@Ignore
	@Test
	public void testGetLayerListByIntentionID() throws IOException {

		Integer pageNum = 1;
		Integer pageSize = 5;
//		Integer id[][]={{1,2,3},{4,5,6}};
		Map<String,Object> layers = new HashMap<>();
		Map<String,Object> parameter = new HashMap<>();

		List<Integer> irrelevance = Arrays.asList(454,454,454,454,454,454,454,454,454,454,454,454,454,454,454,454,454,454,454,454,454,454,454,454,454,454);
		List<Integer> relevance =Arrays.asList(2292,2292,2292,2292,2292,2292,2292,2292,2292,2292,2292,2292,2292,2292,2292,2292,2292,2292,2292,2292,2292);
		layers.put("irrelevance",irrelevance);
		layers.put("relevance",relevance);
		parameter.put("random_merge_number",50);
		parameter.put("rule_covered_positive_sample_rate_threshold",0.3);
//		String layers ="{\"irrelevance\": , \"relevance\" :}";
//		String parameter ="{" +
//				"\"random_merge_number\":50," +
//				"\"rule_covered_positive_sample_rate_threshold\":0.3" +
//				"}";
		String sessionID="";
		PhotoTransportType photoTransportType = PhotoTransportType.STATIC_RESOURCE_PATH;
		SearchLayerByTempleteResult result1 = layerService.getLayerListByIntentionLayerIds(sessionID,layers,parameter,1,10,photoTransportType);
		List<LayerWithFloatBBox> layersWithFloatBBox=result1.getLayers();
		Map<String,Object> str=layerService.getIntentionByLayerIds(layers,parameter);
		System.out.println(str);
		for(LayerWithFloatBBox layer : layersWithFloatBBox) {
			System.out.println(layer.getId());
		}
	}

	@Test
	public void testGetLayerListByIntention() throws IOException {

		Integer pageNum = 1;
		Integer pageSize = 5;
		Integer id[][]={{1,2,3},{4,5,6}};
		String sessionID="";
		Intention intention=new Intention();
		intention.subIntention=new ArrayList<>();
		intention.subIntentionNum=1;
		Intention.SubIntention tmpSubIntention= intention.new SubIntention();
		tmpSubIntention.content=Arrays.asList("http://sweetontology.net/propChemical/SaturationProperty");
		tmpSubIntention.location=new ArrayList<>();
		tmpSubIntention.topic=new ArrayList<>();
		tmpSubIntention.style=new ArrayList<>();
		intention.subIntention.add(tmpSubIntention);
		PhotoTransportType photoTransportType = PhotoTransportType.STATIC_RESOURCE_PATH;
		SearchLayerByTempleteResult result1 = layerService.getLayerListByIntention(sessionID,intention,  1,10,photoTransportType);
		List<LayerWithFloatBBox> layersWithFloatBBox=result1.getLayers();
		for(LayerWithFloatBBox layer : layersWithFloatBBox) {
			System.out.println(layer.getId());
		}
	}


	@Test
	public void testSearchSubContents() throws IOException {

		Integer pageNum = 1;
		Integer pageSize = 5;
		Integer id[][]={{1,2,3},{4,5,6}};
		String sessionID="";
		Intention intention=new Intention();
		intention.subIntention=new ArrayList<>();
		intention.subIntentionNum=1;
		Intention.SubIntention tmpSubIntention= intention.new SubIntention();
		tmpSubIntention.content=Arrays.asList("http://sweetontology.net/propChemical/SaturationProperty");
		tmpSubIntention.location=new ArrayList<>();
		tmpSubIntention.topic=new ArrayList<>();
		tmpSubIntention.style=new ArrayList<>();

		intention.subIntention.add(tmpSubIntention);
		for(int j = intention.subIntentionNum -1; j>=0; j--) {
			Intention.SubIntention tempSubIntention= intention.subIntention.get(j);
			// 对子意图中维度是空数组的情况进行改造，即[] => [""], 否则查询会报错
			if (tempSubIntention.content.size() == 0) {
				tempSubIntention.content = Arrays.asList("");
			}
			else{
				//扩展子意图的内容维度
				File file = ResourceUtils.getFile("classpath:all_hyponyms.json");
				JSONObject contents = JSON.parseObject(FileUtil.readAsString(file));

				List<String> subContents = (List<String>)contents.get(tempSubIntention.content.get(0));
				System.out.println(subContents);
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


//		PhotoTransportType photoTransportType = PhotoTransportType.STATIC_RESOURCE_PATH;
//		SearchLayerByTempleteResult result1 = layerService.getLayerListByIntention(sessionID,intention,  1,10,photoTransportType);
//		List<LayerWithFloatBBox> layersWithFloatBBox=result1.getLayers();
//		for(LayerWithFloatBBox layer : layersWithFloatBBox) {
//			System.out.println(layer.getId());
		}
	}


	@Test
	public void testSearchSubContentsGeoNames() throws IOException {

		Integer pageNum = 1;
		Integer pageSize = 5;
		Integer id[][]={{1,2,3},{4,5,6}};
		String sessionID="";
		Intention intention=new Intention();
		intention.subIntention=new ArrayList<>();
		intention.subIntentionNum=1;
		Intention.SubIntention tmpSubIntention= intention.new SubIntention();
		tmpSubIntention.content=Arrays.asList("SaturationProperty");
		tmpSubIntention.location=new ArrayList<>();
		tmpSubIntention.topic=new ArrayList<>();
		tmpSubIntention.style=new ArrayList<>();

		intention.subIntention.add(tmpSubIntention);
		for(int j = intention.subIntentionNum -1; j>=0; j--) {
			List<String> subContents = new ArrayList<>();
			Intention.SubIntention tempSubIntention= intention.subIntention.get(j);
			// 对子意图中维度是空数组的情况进行改造，即[] => [""], 否则查询会报错
			if (tempSubIntention.content.size() == 0) {
				tempSubIntention.content = Arrays.asList("");
			}
			else{
				//扩展子意图的内容维度
				File file = ResourceUtils.getFile("classpath:all_hyponyms.json");
				JSONObject contents = JSON.parseObject(FileUtil.readAsString(file));

				//匹配geonames
				if(!tempSubIntention.content.get(0).contains("http://")){
					List<String> allContents = new ArrayList<>();
					//获取所有概念
					Iterator<String> sIterator = contents.keySet().iterator();
					while (sIterator.hasNext()){
						String key = sIterator.next();
						allContents.add(key);
						String without =key.substring(key.lastIndexOf("/")+1);
						if(without.contains(tempSubIntention.content.get(0))){
							subContents.addAll((List<String>)contents.get(key));
							subContents.add(key);
							System.out.println(subContents);
						}
					}
				}
				else{
					//扩展子意图的内容维度
					subContents = (List<String>)contents.get(tempSubIntention.content.get(0));
				System.out.println(subContents);
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


//		PhotoTransportType photoTransportType = PhotoTransportType.STATIC_RESOURCE_PATH;
//		SearchLayerByTempleteResult result1 = layerService.getLayerListByIntention(sessionID,intention,  1,10,photoTransportType);
//		List<LayerWithFloatBBox> layersWithFloatBBox=result1.getLayers();
//		for(LayerWithFloatBBox layer : layersWithFloatBBox) {
//			System.out.println(layer.getId());
		}
	}
}
