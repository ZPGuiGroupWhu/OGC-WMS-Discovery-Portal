package com.gsv.querywmslist.querywmslist.commons;

import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

import com.gsv.querywmslist.querywmslist.dao.ContactInfo;
import com.gsv.querywmslist.querywmslist.dao.Layer;
import com.gsv.querywmslist.querywmslist.dao.WMS;
import com.gsv.querywmslist.querywmslist.dto.ContactInfoWithMergedAdministrativeUnit;
import com.gsv.querywmslist.querywmslist.dto.LayerWithFloatBBox;
import com.gsv.querywmslist.querywmslist.dto.LayerWithWMS;
import com.gsv.querywmslist.querywmslist.dto.WMSWithContactInfo;
import com.gsv.querywmslist.querywmslist.dto.WMSWithLayer;

public class TransformUtil {

	public static LayerWithFloatBBox layerToLayerWithFloatBBox(Layer layer, PhotoTransportType photoType) {
		LayerWithFloatBBox result = new LayerWithFloatBBox();
		result.setAbstr(layer.getAbstr());
		result.setAttribution(layer.getAttribution());
		result.setId(layer.getId());
		result.setKeywords(layer.getKeywords());
		result.setName(layer.getName());
		result.setTitle(layer.getTitle());
		result.setUrl(layer.getUrl());
        result.setTopic(layer.getTopic());
        result.setProjection(layer.getBoundingbox().split(" ")[0]);
        float[][] bbox = new float[2][2];
        String[] bboxStrArray = layer.getBoundingbox().split(" ")[1].split(",");
        bbox[0][0]=Float.parseFloat(bboxStrArray[0]);
        bbox[0][1]=Float.parseFloat(bboxStrArray[1]);
        bbox[1][0]=Float.parseFloat(bboxStrArray[2]);
        bbox[1][1]=Float.parseFloat(bboxStrArray[3]);
        result.setBbox(bbox);
        
        if(photoType.equals(PhotoTransportType.BASE64_STRING)) {
        	String photoBase64Str = Base64.getEncoder().encodeToString(layer.getPhoto()).replaceAll("\\r\\n","");
            result.setPhoto(photoBase64Str);
        } else if(photoType.equals(PhotoTransportType.STATIC_RESOURCE_PATH)) {
        	result.setPhoto(layer.getImagePath());
        }
        
        result.setServiceId(layer.getServiceId());
        return result;
	}
	
	
	public static ContactInfoWithMergedAdministrativeUnit mergeContactInfoAdministrativeUnit(ContactInfo contactInfo) {
		ContactInfoWithMergedAdministrativeUnit result = new ContactInfoWithMergedAdministrativeUnit();
        result.setOrganization(contactInfo.getOrganization());
        result.setPerson(contactInfo.getPerson());
        result.setPosition(contactInfo.getPosition());
        result.setAddress(contactInfo.getAddress());
        result.setCity(contactInfo.getCity());
        result.setState_province(contactInfo.getStateOrProvince());
        result.setAdministrative_unit(contactInfo.getCountry()+","+contactInfo.getStateOrProvince()+","+contactInfo.getCity());
        result.setPost_code(contactInfo.getPostCode());
        result.setVoice_tel(contactInfo.getVoiceTelephone());
        result.setFascimile_tel(contactInfo.getFacsimileTelephone());
        result.setEmail(contactInfo.getElectronicMailAddress());
        return result;
	}
	

	public static WMSWithContactInfo mergeWMSAndContactInfo(WMS wms, ContactInfo contactInfo) {
		
		WMSWithContactInfo result = new WMSWithContactInfo();
        result.setAbstr(wms.getAbstr());
        result.setAdministrative_unit(wms.getCountry() + ","+wms.getStateorprovince() + ","+wms.getCity());
        result.setLatitude(wms.getLatitude());
        result.setLongitude(wms.getLongitude());
        result.setGeoLocation(new float[] {wms.getLatitude(), wms.getLongitude()});
        result.setId(wms.getId());
        result.setIp(wms.getIp());
        result.setKeywords(wms.getKeywords());
        result.setTitle(wms.getTitle());
        result.setUrl(wms.getUrl());
        result.setTopic(wms.getTopic());
        result.setVersion(wms.getVersion());
        if(contactInfo == null) {
        	result.setContact_info(null);
        } else {
        	result.setContact_info(TransformUtil.mergeContactInfoAdministrativeUnit(contactInfo));
        }
        return result;
		
	}
	
	
	public static WMSWithLayer mergeLayerAndWMSAndContactInfo(List<Layer> layers, WMS wms, ContactInfo contactInfo, PhotoTransportType photoType) {
		
		WMSWithLayer result = new WMSWithLayer();
        result.setAbstr(wms.getAbstr());
        result.setAdministrative_unit(wms.getCountry()+","+wms.getStateorprovince()+","+wms.getCity());
        result.setGeoLocation(new float[] {wms.getLatitude(), wms.getLongitude()});
        result.setId(wms.getId());
        result.setIp(wms.getIp());
        result.setKeywords(wms.getKeywords());
        result.setTitle(wms.getTitle());
        result.setUrl(wms.getUrl());
        result.setTopic(wms.getTopic());
        result.setVersion(wms.getVersion());
        List<LayerWithFloatBBox> layersWithFloatBBox = layers.stream().map(
        		layer -> TransformUtil.layerToLayerWithFloatBBox(layer, photoType))
        		.collect(Collectors.toList());
        
        result.setLayers(layersWithFloatBBox);
        result.setContact_info(TransformUtil.mergeContactInfoAdministrativeUnit(contactInfo));
		return result;
		
	}
	
	
public static LayerWithWMS mergeLayerAndWMSAndContactInfo(Layer layer, WMS wms, ContactInfo contactInfo, PhotoTransportType photoType) {
		
		LayerWithWMS result = new LayerWithWMS();
		result.setAbstr(layer.getAbstr());
		result.setAttribution(layer.getAttribution());
		result.setId(layer.getId());
		result.setKeywords(layer.getKeywords());
		result.setName(layer.getName());
		result.setTitle(layer.getTitle());
		result.setUrl(layer.getUrl());
        result.setTopic(layer.getTopic());
        result.setProjection(layer.getBoundingbox().split(" ")[0]);
        float[][] bbox = new float[2][2];
        String[] bboxStrArray = layer.getBoundingbox().split(" ")[1].split(",");
        bbox[0][0]=Float.parseFloat(bboxStrArray[0]);
        bbox[0][1]=Float.parseFloat(bboxStrArray[1]);
        bbox[1][0]=Float.parseFloat(bboxStrArray[2]);
        bbox[1][1]=Float.parseFloat(bboxStrArray[3]);
        result.setBbox(bbox);
        
        if(photoType.equals(PhotoTransportType.BASE64_STRING)) {
        	String photoBase64Str = Base64.getEncoder().encodeToString(layer.getPhoto()).replaceAll("\\r\\n","");
            result.setPhoto(photoBase64Str);
        } else if(photoType.equals(PhotoTransportType.STATIC_RESOURCE_PATH)) {
        	result.setPhoto(layer.getImagePath());
        }
        
        result.setServiceId(layer.getServiceId());
        
		WMSWithContactInfo wmsWithContactInfo = TransformUtil.mergeWMSAndContactInfo(wms, contactInfo);
		result.setService(wmsWithContactInfo);
		return result;
		
	}
}
