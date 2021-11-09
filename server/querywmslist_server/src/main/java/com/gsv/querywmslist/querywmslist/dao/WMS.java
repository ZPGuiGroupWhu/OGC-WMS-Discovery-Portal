package com.gsv.querywmslist.querywmslist.dao;

import lombok.Data;

@Data
public class WMS {

    private Integer id;
    private String url;
    private String ip;
    private String abstr;
    private String version;
    private String title;
    private String keywords;
    private String country;
    private String stateorprovince;
    private String city;
    private float latitude;
    private float longitude;
    private String topic;
}
