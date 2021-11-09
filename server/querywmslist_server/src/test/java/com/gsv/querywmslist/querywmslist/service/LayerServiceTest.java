package com.gsv.querywmslist.querywmslist.service;

import java.util.List;

import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.gsv.querywmslist.querywmslist.dto.LayerWithFloatBBox;

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
		List<LayerWithFloatBBox> result = layerService.getLayerListByTemplateId(templeteIdArray, pageNum, pageSize);
		for(LayerWithFloatBBox layer : result) {
			System.out.println(layer.getId() + ", " + layer.getName() + ", " + layer.getPhoto() == null);
		}
	}
	
	
	@Ignore
	@Test
	public void testGetLayerList() {
		
		String keyword = "water";
		Integer pageNum = 1;
		Integer pageSize = 5;
		List<LayerWithFloatBBox> result = layerService.getLayerList(keyword, null, null, pageNum, pageSize);
		for(LayerWithFloatBBox layer : result) {
			System.out.println(layer.getId() + ", " + layer.getName() + ", " + layer.getPhoto() == null);
		}
	}
	
	
	@Ignore
	@Test
	public void testGetLayerInfo() {
		
		Integer layerId = 1;
		LayerWithFloatBBox result = layerService.getLayerInfo(layerId);
		System.out.println(result.toString());
	}
}
