package com.gsv.querywmslist.querywmslist.dao;

import lombok.Data;

@Data
public class Layer {
    private String  abstr;
    private String  attribution;
    private String  keywords;
    private String  name;
    private String  title;
    private String  url;
    private String  boundingbox;
    private Integer id;
    private byte[] photo;
    private String  topic;
    private Integer  serviceId;
}
