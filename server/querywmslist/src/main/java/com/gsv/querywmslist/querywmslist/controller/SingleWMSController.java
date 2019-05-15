package com.gsv.querywmslist.querywmslist.controller;

import com.gsv.querywmslist.querywmslist.service.SingleWMSService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Api(value = "SingleWMSController",tags = "单个WMS接口")
public class SingleWMSController {
    @Autowired
    private SingleWMSService singleWMSService;
    @CrossOrigin
    @GetMapping("/search/queryWMSInfo")
    @ApiOperation(value = "根据id进行查询")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id",value = "输入id",required = true),
    })
    public String getWMSInfo(Integer id){
        return singleWMSService.getWMSInfo(id);
    }
}
