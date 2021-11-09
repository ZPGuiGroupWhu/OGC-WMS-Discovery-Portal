package com.gsv.querywmslist.querywmslist.service;

import java.util.Base64;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.gsv.querywmslist.querywmslist.dao.Photo;

@RunWith(SpringRunner.class)
@SpringBootTest
public class PhotoServiceTest {

	@Autowired
	private PhotoService phtonService;
	
	@Test
	public void testGetPhoto() {
		Integer layerID = 1;
		try {
			Photo photo = phtonService.getPhoto(layerID);
			System.out.println(photo.getId());
	        String photoString = Base64.getEncoder().encodeToString(photo.getImage()).replaceAll("\\r\\n","");
			System.out.println(photoString.length());
		} catch(Exception e) {
			e.printStackTrace();
		}
	}
}
