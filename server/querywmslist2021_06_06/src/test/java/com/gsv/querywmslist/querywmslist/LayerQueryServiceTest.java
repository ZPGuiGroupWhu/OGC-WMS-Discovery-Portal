//package com.gsv.querywmslist.querywmslist;
//
//import org.junit.Test;
//import org.junit.runner.RunWith;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.core.env.Environment;
//import org.springframework.test.context.junit4.SpringRunner;
//
//import com.gsv.querywmslist.querywmslist.service.LayerQueryService;
//
////测试将哈希码放在内存中
//@RunWith(SpringRunner.class)
//@SpringBootTest
//public class LayerQueryServiceTest {
//
//	@Autowired
//	LayerQueryService layerQueryService;
//	@Autowired
//	Environment env;
//	
//	@Test
//	public void testHashCodes() {
////		System.out.println(layerQueryService.getCreateAt());
////		System.out.println(env.getProperty("info.path.hashcode"));
//		for(int i = 0; i < 2; i++) {
//			int size = layerQueryService.getLayerListByTemplateId(new Integer[] {13884}, 1, 9).getData().size();
//			System.out.println(i + ", " + size + "\n");
//		}
//	}
//}
