package com.gsv.querywmslist.querywmslist.dto;


import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;
import lombok.EqualsAndHashCode;


@Data
@EqualsAndHashCode(callSuper=false)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LayerWithWMS extends LayerWithFloatBBox{


    private WMSWithContactInfo service;
}
