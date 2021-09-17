package com.gsv.querywmslist.querywmslist.controller;

import com.alibaba.fastjson.JSON;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.gsv.querywmslist.querywmslist.bean.LayerList;
import com.gsv.querywmslist.querywmslist.bean.LayerResult;
import com.gsv.querywmslist.querywmslist.bean.LayerResult2;
import com.gsv.querywmslist.querywmslist.service.LayerQueryService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
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
    
    @CrossOrigin
    @GetMapping(value = "/search/querylayerbytemplate")
    @ResponseBody
    @ApiOperation(value = "根据数据库中已有样例图片查询")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "templateId",value = "样例图片的id，支持多张图片",required = true),
            @ApiImplicitParam(name = "pageNum",value = "输入请求页面编号,1表示第一页",required = true),
            @ApiImplicitParam(name = "pageSize",value = "输入每页的数据条数",required = true)
    })
    public String getLayerList(Integer[] templateId, Integer pageNum, Integer pageSize){
    	LayerResult2 layerResult =layerQueryService.getLayerListByTemplateId(templateId, pageNum, pageSize);
//    	long t1 = System.currentTimeMillis();
    	String result = JSON.toJSONString(layerResult);
//    	long t2 = System.currentTimeMillis();
//    	System.out.println("转换成JSON" + (t2 - t1));
        return result;
    }
    
   
// 这里使用的是resultFromIndex 和 resultToIndex，并且输出为字符串
//    @CrossOrigin
//    @GetMapping(value = "/search/querylayerbytemplate", produces = "application/json;charset=utf-8")
//    @ResponseBody
//    @ApiOperation(value = "根据数据库中已有样例图片查询")
//    @ApiImplicitParams({
//            @ApiImplicitParam(name = "templateId",value = "样例图片的id，支持多张图片",required = true),
//            @ApiImplicitParam(name = "resultFromIndex",value = "相似度排序后结果的起始索引，从0开始",required = true),
//            @ApiImplicitParam(name = "resultToIndex",value = "相似度排序后结果截至索引，包括",required = true)
//    })
//    public String getLayerList(Integer[] templateId, Integer resultFromIndex, Integer resultToIndex){
//    	LayerResult2 layerResult =layerQueryService.getLayerListByTemplateId(templateId, resultFromIndex, resultToIndex);
////    	long t1 = System.currentTimeMillis();
//    	String result = JSON.toJSONString(layerResult);
////    	long t2 = System.currentTimeMillis();
////    	System.out.println("转换成JSON" + (t2 - t1));
//        return result;
//    }
}
