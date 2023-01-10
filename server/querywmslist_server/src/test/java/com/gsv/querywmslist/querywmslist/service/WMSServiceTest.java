package com.gsv.querywmslist.querywmslist.service;

import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.gsv.querywmslist.querywmslist.commons.PhotoTransportType;
import com.gsv.querywmslist.querywmslist.dto.WMSWithContactInfo;
import com.gsv.querywmslist.querywmslist.dto.WMSWithLayer;

@RunWith(SpringRunner.class)
@SpringBootTest
public class WMSServiceTest {

	@Autowired
	private WMSService wmsService;
	
	
	@Test
	public void testGetWMSList() {
		
		String keyword = "water";
		Integer pageNum = 1;
		Integer pageSize = 5;
		List<WMSWithContactInfo> result = wmsService.getWMSList(keyword, null, null, null, null, null, null, pageNum, pageSize);
		for(WMSWithContactInfo wms : result) {
			System.out.println(wms.getId() + ", " + wms.getTitle());
		}
	}
	
	
	@Test
	public void testGetWMSInfo() {
		Integer serviceId = 1;
		PhotoTransportType photoTransportType = PhotoTransportType.STATIC_RESOURCE_PATH;
		WMSWithLayer result = wmsService.getWMSInfo(serviceId, photoTransportType);
		System.out.println(result.getLayers());
	}
}
