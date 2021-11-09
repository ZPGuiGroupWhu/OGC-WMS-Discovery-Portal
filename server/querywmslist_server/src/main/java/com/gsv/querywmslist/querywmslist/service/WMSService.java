package com.gsv.querywmslist.querywmslist.service;

import com.gsv.querywmslist.querywmslist.commons.TransformUtil;
import com.gsv.querywmslist.querywmslist.dao.ContactInfo;
import com.gsv.querywmslist.querywmslist.dao.Layer;
import com.gsv.querywmslist.querywmslist.dao.WMS;
import com.gsv.querywmslist.querywmslist.dto.WMSWithContactInfo;
import com.gsv.querywmslist.querywmslist.dto.WMSWithLayer;
import com.gsv.querywmslist.querywmslist.repository.ContactInfoMapper;
import com.gsv.querywmslist.querywmslist.repository.LayerMapper;
import com.gsv.querywmslist.querywmslist.repository.WMSMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WMSService {
	
    @Autowired WMSMapper wmsMapper;
    @Autowired ContactInfoMapper contactInfoMapper;
    @Autowired LayerMapper layerMapper;
    
    
    // 根据关键词、四至范围、所属大洲、主题词（支持多个）、发布组织（支持多个）、发布组织类型（支持多个）进行查询
    public List<WMSWithContactInfo> getWMSList(String keywords, float[] bound, String continent, String topic, 
    		String organization, String organizationType, Integer pageNum, Integer pageSize){
    	
    	// 参数预处理
        keywords = (keywords == null) ? null : keywords.toLowerCase();
        continent = (continent == null) ? null : continent.toLowerCase();
        String[] topicArray = (topic == null) ? null : topic.toLowerCase().split(",");
        String[] organizationArray = (organization == null) ? null : organization.toLowerCase().split(",");
        String[] organizationTypeArray = (organizationType == null) ? null : organizationType.toLowerCase().split(",");

        Integer fromRowNum = (pageNum - 1) * pageSize;
        List<WMS> wmsList = wmsMapper.getWMSList(keywords, bound, continent, topicArray, 
        		organizationArray, organizationTypeArray, fromRowNum, pageSize);
        List<WMSWithContactInfo> result = wmsList.stream().map(wms -> {
        	WMSWithContactInfo wmsWithContactInfo =  TransformUtil.mergeWMSAndContactInfo(wms, null);
        	wmsWithContactInfo.setIp(null);
        	wmsWithContactInfo.setVersion(null);
        	wmsWithContactInfo.setGeoLocation(null);
        	return wmsWithContactInfo;
        	}).collect(Collectors.toList());
        
        return result;
    }
    
    
    public WMSWithLayer getWMSInfo(Integer id){
    	
    	WMS wms = wmsMapper.getWMSById(id);
    	ContactInfo contactInfo = contactInfoMapper.getContactInfoByServiceId(id);
    	List<Layer> layers = layerMapper.getLayersByServiceId(id);
    	
    	WMSWithLayer result = TransformUtil.mergeLayerAndWMSAndContactInfo(layers, wms, contactInfo);
    	return result;
    }
    
}
