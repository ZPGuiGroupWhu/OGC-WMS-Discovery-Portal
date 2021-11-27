//package com.gsv.querywmslist.querywmslist.mapper;
//
//import java.util.List;
//
//import org.junit.Test;
//import org.junit.runner.RunWith;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.test.context.junit4.SpringRunner;
//
//import com.gsv.querywmslist.querywmslist.dao.WMS;
//import com.gsv.querywmslist.querywmslist.repository.WMSMapper;
//
//@RunWith(SpringRunner.class)
//@
//SpringBootTest
//public class WMSMapperTest {
//
//	@Autowired
//	private WMSMapper wmsMapper;
//
//
//	@Test
//	public void testGetWMSListResult() {
//
//		String keyword = "water";
//		List<WMS> result = wmsMapper.getWMSList(keyword, null, null, null, null, null, null, null);
//		for(WMS wms : result) {
//			System.out.println(wms.getId() + ", " + wms.getAbstr());
//		}
//	}
//
//
//	@Test
//	public void tesetGetWMSById() {
//		Integer id = 1;
//		WMS wms = wmsMapper.getWMSById(id);
//		System.out.println(wms.getId() + ", " + wms.getAbstr());
//	}
//}
