package com.gsv.querywmslist.querywmslist.dto;

import java.util.List;

import lombok.Data;

@Data
public class SearchLayerByTempleteResult {

	private List<LayerWithFloatBBox> layers;
	private Integer totalLayerNum;
	private String sessionID;
}
