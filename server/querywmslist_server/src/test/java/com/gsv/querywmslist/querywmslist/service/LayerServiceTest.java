package com.gsv.querywmslist.querywmslist.service;

import java.io.IOException;
import java.util.*;

import com.gsv.querywmslist.querywmslist.dao.Intention;
import com.gsv.querywmslist.querywmslist.dto.SearchLayerByIntentionResult;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.gsv.querywmslist.querywmslist.commons.PhotoTransportType;
import com.gsv.querywmslist.querywmslist.dto.LayerWithFloatBBox;
import com.gsv.querywmslist.querywmslist.dto.SearchLayerByTempleteResult;

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
	@Ignore
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
		tmpSubIntention.content=Arrays.asList("water") ;
		intention.subIntention.add(tmpSubIntention);
		PhotoTransportType photoTransportType = PhotoTransportType.STATIC_RESOURCE_PATH;
		SearchLayerByTempleteResult result1 = layerService.getLayerListByIntention(sessionID,intention,  1,10,photoTransportType);
		List<LayerWithFloatBBox> layersWithFloatBBox=result1.getLayers();
		for(LayerWithFloatBBox layer : layersWithFloatBBox) {
			System.out.println(layer.getId());
		}
	}
}
