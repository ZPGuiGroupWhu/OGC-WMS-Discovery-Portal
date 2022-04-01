package com.gsv.querywmslist.querywmslist.vo;


import java.util.List;

import com.gsv.querywmslist.querywmslist.dto.LayerWithFloatBBox;

import lombok.Data;
import lombok.EqualsAndHashCode;
@Data
@EqualsAndHashCode(callSuper=false)
public class MultiLayersIntentionResponse extends Response{

    private String Intention;
    private Integer totalLayerNum;
    private Integer currentLayerNum;
    private List<LayerWithFloatBBox> data;
    private String sessionID;
}
