package com.gsv.querywmslist.querywmslist.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class WMSWithLayer {

    private String abstr;
    private String administrative_unit;
    private float[] geoLocation;
    private Integer id;
    private String ip;
    private String keywords;
    private List<LayerWithFloatBBox> layers;
    private String title;
    private String url;
    private String topic;
    private String version;
    private ContactInfoWithMergedAdministrativeUnit contact_info;
}
