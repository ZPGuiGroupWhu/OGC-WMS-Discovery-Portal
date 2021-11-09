package com.gsv.querywmslist.querywmslist.mapper;

import java.util.List;

import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.gsv.querywmslist.querywmslist.dao.Layer;
import com.gsv.querywmslist.querywmslist.repository.LayerMapper;

@RunWith(SpringRunner.class)
@SpringBootTest
public class LayerMapperTest {

	@Autowired
	private LayerMapper layerMapper;
	
	@Ignore
	@Test
	public void testGetLayerList() {
		String keyword = "water";
		Integer pageNum = 1;
		Integer pageSize = 10;
		Integer fromRowNum = (pageNum - 1) * pageSize;
		List<Layer> result = layerMapper.getLayers(keyword, null, null, fromRowNum, pageSize);
		for(Layer layer : result) {
			System.out.println(layer.getName());
		}
	}
	
	@Ignore
	@Test
	public void testGetLayersWithoutPhotoByIdArray()
	{
		Integer[] ids = {1, 2, 3, 4};
		List<Layer> result = layerMapper.getLayersWithoutPhotoByIdArray(ids);
		for(Layer layer : result) {
			System.out.println(layer.getId() + ", " + layer.getName() + ", " + layer.getPhoto() == null);
		}
	}
	
	
//	@Ignore
	@Test
	public void testGetLayersByIdArray()
	{
		Integer[] ids = {1, 2, 4167, 5534, 116100};
		List<Layer> result = layerMapper.getLayersByIdArray(ids);
		
		for(Layer layer : result) {
			System.out.println(layer.getId() + ", " + layer.getName() + ", " + layer.getPhoto() == null);
		}
	}
	
	
	@Ignore
	@Test
	public void testGetLayersByServiceId() {
		Integer serviceId = 2;
		List<Layer> result = layerMapper.getLayersByServiceId(serviceId);
		for(Layer layer : result) {
			System.out.println(layer.getId() + ", " + layer.getName());
		}
	}
}
