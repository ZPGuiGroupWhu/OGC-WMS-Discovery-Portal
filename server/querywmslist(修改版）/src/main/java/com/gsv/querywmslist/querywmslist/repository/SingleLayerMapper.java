package com.gsv.querywmslist.querywmslist.repository;

import com.gsv.querywmslist.querywmslist.bean.singleWms.ContactInfoOrigin;
import com.gsv.querywmslist.querywmslist.bean.singleWms.LayerOrigin;
import com.gsv.querywmslist.querywmslist.bean.singleWms.WmsOrigin;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface SingleLayerMapper {
    @Select("SELECT ID as id, URL as url, IP as ip, Abstract as abstr, Version as version, Title as title," +
            "Keywords as keywords, Country as country, StateOrProvince as stateorprovince, City as city, Latitude as latitude," +
            "Longitude as longitude,Topic as topic from wms WHERE id=#{service_id}")
    WmsOrigin getWMSInfo(@Param("service_id")Integer service_id);
    @Select("SELECT ServiceID as service_id, abstract as abstr, Attribution as attribution, Keywords as keywords,Name as name," +
            "Title as title, URL as url,BoundingBox as boundingbox, ID as id, Topic as topic from layerlist WHERE id=#{id}")
    LayerOrigin  getLayerInfo(@Param("id")Integer id);
    @Select("SELECT Organization as organization, Person as person, Position as position, Address as address, City as city," +
            "StateOrProvince as stateOrProvince, Country as country, PostCode as postCode, VoiceTelephone as voiceTelephone," +
            "FacsimileTelephone as facsimileTelephone, ElectronicMailAddress as electronicMailAddress from contactinformation WHERE ServiceID=#{id}")
    ContactInfoOrigin getContactInfo(@Param("id")Integer id);
}
