package com.gsv.querywmslist.querywmslist.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

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
		
		SearchLayerByTempleteResult result = layerService.getLayerListByTemplateId(templeteIdArray, pageNum, pageSize, photoTransportType);
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
		List<LayerWithFloatBBox> result = layerService.getLayerList(keyword, null, null, pageNum, pageSize, photoTransportType);
		for(LayerWithFloatBBox layer : result) {
			System.out.println(layer.getId() + ", " + layer.getName() + ", " + layer.getPhoto() == null);
		}
	}
	
	
	@Ignore
	@Test
	public void testGetLayerInfo() {
		
		Integer layerId = 1;
		PhotoTransportType photoTransportType = PhotoTransportType.STATIC_RESOURCE_PATH;
		LayerWithFloatBBox result = layerService.getLayerInfo(layerId, photoTransportType);
		System.out.println(result.toString());
	}

	@Test
	public void testGetLayerListByIntentionID() throws IOException {

		Integer pageNum = 1;
		Integer pageSize = 5;
		Integer id[][]={{1,2,3},{4,5,6}};
		String sessionID="";
		PhotoTransportType photoTransportType = PhotoTransportType.STATIC_RESOURCE_PATH;
		SearchLayerByTempleteResult result1 = layerService.getLayerListByIntentionLayerIds(sessionID,id,  1,10,photoTransportType);
		List<LayerWithFloatBBox> layersWithFloatBBox=result1.getLayers();
		String str=layerService.getIntentionByLayerIds(id);
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
		intention.subIntention.add("water");

		PhotoTransportType photoTransportType = PhotoTransportType.STATIC_RESOURCE_PATH;
		SearchLayerByTempleteResult result1 = layerService.getLayerListByIntention(sessionID,intention,  1,10,photoTransportType);
		List<LayerWithFloatBBox> layersWithFloatBBox=result1.getLayers();
		for(LayerWithFloatBBox layer : layersWithFloatBBox) {
			System.out.println(layer.getId());
		}
	}
}
