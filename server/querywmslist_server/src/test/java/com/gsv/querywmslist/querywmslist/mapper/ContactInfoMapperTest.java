package com.gsv.querywmslist.querywmslist.mapper;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.gsv.querywmslist.querywmslist.dao.ContactInfo;
import com.gsv.querywmslist.querywmslist.repository.ContactInfoMapper;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ContactInfoMapperTest {

	@Autowired
	private ContactInfoMapper contactInfoMapper;
	
	@Test
	public void testGetContactInfoByServiceId(){
		Integer serviceId = 1;
		ContactInfo contactInfo = contactInfoMapper.getContactInfoByServiceId(serviceId);
		System.out.println(contactInfo.toString());
	}
}
