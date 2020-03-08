package com.gsv.querywmslist.querywmslist.controller;

import com.gsv.querywmslist.querywmslist.service.SingleLayerService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Api(value = "SingleLayerController",tags = "单个layer接口")
public class SingleLayerController {
    @Autowired
    SingleLayerService singleLayerService;
    @CrossOrigin
    @GetMapping("/search/queryLayerInfo")
    @ApiOperation(value = "根据id进行查询")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id",value = "输入id",required = true),
    })
    public String queryLayerInfo(Integer id){
        return singleLayerService.queryLayerInfo(id);
    }
}
