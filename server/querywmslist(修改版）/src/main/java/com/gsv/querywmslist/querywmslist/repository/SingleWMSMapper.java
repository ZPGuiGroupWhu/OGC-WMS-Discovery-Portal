package com.gsv.querywmslist.querywmslist.repository;

import com.gsv.querywmslist.querywmslist.bean.singleWms.ContactInfoOrigin;
import com.gsv.querywmslist.querywmslist.bean.singleWms.LayerOrigin;
import com.gsv.querywmslist.querywmslist.bean.singleWms.WmsOrigin;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface SingleWMSMapper {
    @Select("SELECT ID as id, URL as url,IP as ip, abstract as abstr, Version as version, Title as title," +
            "Keywords as keywords, Country as country, StateOrProvince as stateorprovince, City as city," +
            "Latitude as latitude, Longitude as longitude, Topic as topic from wms WHERE id=#{id}")
    WmsOrigin getWMSInfo(@Param("id")Integer id);
    @Select("SELECT abstract as abstr, Attribution as attribution, Keywords as keywords, Name as name," +
            "Title as title, URL as url, BoundingBox as boundingbox, ID as id, Topic as topic from layerlist WHERE ServiceID=#{id}")
    List<LayerOrigin> getLayerInfo(@Param("id")Integer id);
    @Select("SELECT Organization as organization, Person as person, Position as position, Address as address," +
            "City as city, StateOrProvince as stateOrProvince, Country as country, PostCode as postCode," +
            "VoiceTelephone as voiceTelephone, FacsimileTelephone as facsimileTelephone, ElectronicMailAddress as electronicMailAddress " +
            "from contactinformation WHERE ServiceID=#{id}")
    ContactInfoOrigin getContactInfo(@Param("id")Integer id);
}
