package com.gsv.querywmslist.querywmslist.vo;

import java.util.List;

import com.gsv.querywmslist.querywmslist.dto.LayerWithFloatBBox;

import lombok.Data;
import lombok.EqualsAndHashCode;


@Data
@EqualsAndHashCode(callSuper=false)
public class MultiLayersResponse extends Response{

	private Integer totalLayerNum;
    private Integer currentLayerNum;
    private List<LayerWithFloatBBox> data;
}
