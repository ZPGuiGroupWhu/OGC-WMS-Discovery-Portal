package com.gsv.querywmslist.querywmslist.dao;

import lombok.Data;

@Data
public class ContactInfo {
	
    private String organization;
    private String person;
    private String position;
    private String address;
    private String city;
    private String stateOrProvince;
    private String country;
    private String postCode;
    private String voiceTelephone;
    private String facsimileTelephone;
    private String electronicMailAddress;
}
