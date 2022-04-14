package com.gsv.querywmslist.querywmslist.dto;
import java.util.List;

import lombok.Data;

@Data
public class SearchLayerByIntentionResult {

    private List<LayerWithFloatBBox> layers;
    private Integer totalLayerNum;
}
