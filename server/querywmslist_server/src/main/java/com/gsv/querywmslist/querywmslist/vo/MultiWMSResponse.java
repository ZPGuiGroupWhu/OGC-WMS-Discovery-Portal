package com.gsv.querywmslist.querywmslist.vo;

import java.util.List;

import com.gsv.querywmslist.querywmslist.dto.WMSWithContactInfo;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
public class MultiWMSResponse extends Response{
	
    private Integer totalWMSNum;
    private Integer currentWMSNum;
    private List<WMSWithContactInfo> data;
}
