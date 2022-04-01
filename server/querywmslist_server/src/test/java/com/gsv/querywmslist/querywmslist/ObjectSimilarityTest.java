//package com.gsv.querywmslist.querywmslist;
//
//import java.util.ArrayList;
//import java.util.Collections;
//import java.util.List;
//
//import org.junit.Test;
//
//import com.gsv.querywmslist.querywmslist.bean.ObjectSimilarity;
//public class ObjectSimilarityTest {
//
//	@Test
//	public void testSortObjectSimilarity() {
//		Integer[] ids = {1, 2, 3, 4, 5};
//		Float[] simis = {1.23f, 3.23f, 0.32f, 12.34f, 9.3f};
//		List<ObjectSimilarity> similarity_list = new ArrayList<>();
//		for(int i = 0; i < ids.length; i ++) {
//			similarity_list.add(new ObjectSimilarity(ids[i], simis[i]));
//		}
//		Collections.sort(similarity_list);
//		for(ObjectSimilarity os : similarity_list) {
//			System.out.println(os);
//		}
//	}
//
//}
