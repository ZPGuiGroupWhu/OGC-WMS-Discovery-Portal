package com.gsv.querywmslist.querywmslist.repository;

import com.gsv.querywmslist.querywmslist.bean.singleWms.ContactInfoOrigin;
import com.gsv.querywmslist.querywmslist.bean.singleWms.LayerOrigin;
import com.gsv.querywmslist.querywmslist.bean.singleWms.WmsOrigin;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface SingleLayerMapper {
    @Select("SELECT id,url,ip,abstract as abstr,version,title,keywords,country,stateorprovince,city,latitude,longitude,topic from wms WHERE id=#{service_id}")
    WmsOrigin getWMSInfo(@Param("service_id")Integer service_id);
    @Select("SELECT service_id,abstract as abstr,attribution,keywords,name,title,url,boundingbox,id,topic from layerlist WHERE id=#{id}")
    LayerOrigin  getLayerInfo(@Param("id")Integer id);
    @Select("SELECT organization,person,position,address,city,stateOrProvince,country,postCode,voiceTelephone,facsimileTelephone,electronicMailAddress from contactinformation WHERE service_id=#{id}")
    ContactInfoOrigin getContactInfo(@Param("id")Integer id);
}
