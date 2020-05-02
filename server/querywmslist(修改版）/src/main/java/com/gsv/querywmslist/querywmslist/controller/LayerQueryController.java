package com.gsv.querywmslist.querywmslist.controller;

import com.alibaba.fastjson.JSON;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.gsv.querywmslist.querywmslist.bean.LayerList;
import com.gsv.querywmslist.querywmslist.bean.LayerResult;
import com.gsv.querywmslist.querywmslist.service.LayerQueryService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Api(value = "LayerQueryController",tags = "批量layer接口")
public class LayerQueryController {
    @Autowired
    LayerQueryService layerQueryService;
    @CrossOrigin
    @GetMapping("/search/querylayerlist")
    @ApiOperation(value = "根据关键词及主题进行查询")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "keywords",value = "输入与Name，Title，Abstract，Attribution，Keywords匹配的关键词",required = false),
            @ApiImplicitParam(name = "bound",value = "输入经纬度范围",required = false),
            @ApiImplicitParam(name = "topic",value = "输入主题",required = false),
            @ApiImplicitParam(name = "pageNum",value = "输入请求页面编号,1表示第一页",required = true),
            @ApiImplicitParam(name = "pageSize",value = "输入每页的数据条数",required = true)
    })
    public String getLayerList(String keywords,float[] bound, String topic,Integer pageNum, Integer pageSize){
        Page page= PageHelper.startPage(pageNum,pageSize);
        List<LayerList> layerListResult=layerQueryService.getlayerlist(keywords,bound,topic,pageNum,pageSize);
        PageInfo<LayerList> layerListPageInfo=new PageInfo<>(layerListResult);

        LayerResult layerResult=new LayerResult();
        try {
            layerResult.setErrCode(1001);
        }catch (Exception e){
            layerResult.setErrCode(1002);
        }
        layerResult.setTotal((int) page.getTotal());
        layerResult.setCurrentPageSize(layerListPageInfo.getPageSize());
        layerResult.setData(layerListResult);
        if(layerResult.getData()==null || layerResult.getTotal()==0){
            layerResult.setErrCode(1002);
        }
        return JSON.toJSONString(layerResult);
    }
}
