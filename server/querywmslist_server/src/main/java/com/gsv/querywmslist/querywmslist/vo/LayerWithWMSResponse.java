package com.gsv.querywmslist.querywmslist.vo;

import com.gsv.querywmslist.querywmslist.dto.LayerWithWMS;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
public class LayerWithWMSResponse extends Response{

	private LayerWithWMS data;
}
