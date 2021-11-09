package com.gsv.querywmslist.querywmslist.vo;

import com.gsv.querywmslist.querywmslist.dto.WMSWithLayer;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
public class WMSWithLayerResponse extends Response{

	private WMSWithLayer data;
}
