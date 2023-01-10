package com.gsv.querywmslist.querywmslist.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LayerWithFloatBBox {
    private String abstr;
    private String attribution;
    private float[][] bbox;
    private Integer id;
    private String photo;
    private String keywords;
    private String name;
    private String projection;
    private String title;
    private String url;
    private String topic;
    private Integer  serviceId;

    private String FContent;
    private String FSpace;
    private String FStyle;
    private String FTopic;
}
