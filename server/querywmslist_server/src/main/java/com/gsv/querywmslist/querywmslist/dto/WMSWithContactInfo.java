package com.gsv.querywmslist.querywmslist.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class WMSWithContactInfo {
	
    private String abstr;
    private String administrative_unit;
    private float latitude;
    private float longitude;
    private float[] geoLocation;
    private Integer id;
    private String ip;
    private String keywords;
    private String title;
    private String url;
    private String topic;
    private String version;
    private ContactInfoWithMergedAdministrativeUnit contact_info;
}
