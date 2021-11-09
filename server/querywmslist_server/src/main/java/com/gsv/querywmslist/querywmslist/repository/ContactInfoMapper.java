package com.gsv.querywmslist.querywmslist.repository;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.gsv.querywmslist.querywmslist.dao.ContactInfo;

@Mapper
public interface ContactInfoMapper {

    @Select("SELECT Organization as organization, Person as person, Position as position, Address as address, City as city," +
            "StateOrProvince as stateOrProvince, Country as country, PostCode as postCode, VoiceTelephone as voiceTelephone," +
            "FacsimileTelephone as facsimileTelephone, ElectronicMailAddress as electronicMailAddress from contactinformation WHERE ServiceID=#{serviceId}")
    ContactInfo getContactInfoByServiceId(@Param("serviceId")Integer serviceId);
}
