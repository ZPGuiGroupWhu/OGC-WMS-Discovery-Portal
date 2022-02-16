package com.gsv.querywmslist.querywmslist.service;

import java.util.List;

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
}
