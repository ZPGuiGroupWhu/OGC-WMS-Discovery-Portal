package com.gsv.querywmslist.querywmslist.controller;

import com.alibaba.fastjson.JSON;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.gsv.querywmslist.querywmslist.bean.WMSList;
import com.gsv.querywmslist.querywmslist.bean.WMSList2;
import com.gsv.querywmslist.querywmslist.bean.WMSResult;
import com.gsv.querywmslist.querywmslist.service.wmsService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@Api(value = "wmsController",tags = "批量WMS接口")
public class wmsController {
    @Autowired
    private  wmsService wmsService;
    @CrossOrigin
    //旧版本
//    @GetMapping("/search/queryWMSListOld")
//    @ApiOperation(value = "根据关键词、经纬度以及大洲进行查询")
//    @ApiImplicitParams({
//            @ApiImplicitParam(name = "keywords",value = "输入与title、Abstract以及url匹配的关键词",required = false),
//            @ApiImplicitParam(name = "bound",value = "输入经纬度",required = false),
//            @ApiImplicitParam(name = "continent",value = "输入所在大洲",required = false),
//            @ApiImplicitParam(name = "pageNum",value = "输入请求页面编号,1表示第一页",required = true),
//            @ApiImplicitParam(name = "pageSize",value = "输入每页的数据条数",required = true)
//    })
//    public String getWMSListOld(String keywords, float[] bound, String continent, Integer pageNum, Integer pageSize){
//        PageHelper.startPage(pageNum,pageSize);
//        List<WMSList> data=wmsService.getWMSList(keywords,bound,continent,pageNum,pageSize);
//        PageInfo<WMSList> wmsResultPageInfo=new PageInfo<>(data);
//        WMSResult wmsResult=new WMSResult();
//        List<WMSList2>list2s=new ArrayList<>();
//        for(int i=0;i<data.size();i++){
//        WMSList origin=data.get(i);
//        WMSList2 result=new WMSList2();
//        result.setId(origin.getId());
//        result.setAbstr(origin.getAbstr());
//        result.setAdministrative_unit(origin.getAdministrative_unit());
//        result.setGeoLocation(origin);
//        result.setKeywords(origin.getKeywords());
//        result.setTitle(origin.getTitle());
//        result.setUrl(origin.getUrl());
//        list2s.add(result);
//        }
//        try {
//            wmsResult.setErrCode(1001);
//        }catch (Exception e){
//            wmsResult.setErrCode(1002);
//        }
//        wmsResult.setTotal((int) wmsResultPageInfo.getTotal());
//        wmsResult.setData(list2s);
//        if(wmsResult.getData()==null|| wmsResult.getTotal()==0){
//            wmsResult.setErrCode(1002);
//        }
//        return JSON.toJSONString(wmsResult);
//
//    }
//


    @GetMapping("/search/queryWMSList")
    @ApiOperation(value = "根据关键词、经纬度、大洲及主题进行查询")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "keywords",value = "输入与title、Abstract、keywords以及url匹配的关键词",required = false),
            @ApiImplicitParam(name = "bound",value = "输入经纬度",required = false),
            @ApiImplicitParam(name = "continent",value = "输入所在大洲",required = false),
            @ApiImplicitParam(name = "topic",value = "输入主题",required = false),
            @ApiImplicitParam(name = "pageNum",value = "输入请求页面编号,1表示第一页",required = true),
            @ApiImplicitParam(name = "pageSize",value = "输入每页的数据条数",required = true)
    })
    public String getWMSList(String keywords, float[] bound, String continent, String topic, Integer pageNum, Integer pageSize){
        PageHelper.startPage(pageNum,pageSize);
        List<WMSList> data=wmsService.getWMSListResult(keywords,bound,continent,topic,pageNum,pageSize);
        PageInfo<WMSList> wmsResultPageInfo=new PageInfo<>(data);
        WMSResult wmsResult=new WMSResult();
        List<WMSList2>list2s=new ArrayList<>();
        for(int i=0;i<data.size();i++){
            WMSList origin=data.get(i);
            WMSList2 result=new WMSList2();
            result.setId(origin.getId());
            result.setAbstr(origin.getAbstr());
            result.setAdministrative_unit(origin.getAdministrative_unit());
            result.setGeoLocation(origin);
            result.setKeywords(origin.getKeywords());
            result.setTitle(origin.getTitle());
            result.setUrl(origin.getUrl());
            list2s.add(result);
        }
        try {
            wmsResult.setErrCode(1001);
        }catch (Exception e){
            wmsResult.setErrCode(1002);
        }
        wmsResult.setTotal((int) wmsResultPageInfo.getTotal());
        wmsResult.setData(list2s);
        if(wmsResult.getData()==null|| wmsResult.getTotal()==0){
            wmsResult.setErrCode(1002);
        }
        return JSON.toJSONString(wmsResult);

    }
}
