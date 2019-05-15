package com.gsvproject.gsv.controller;

import com.alibaba.fastjson.JSON;

import com.gsvproject.gsv.bean.Params;
import com.gsvproject.gsv.bean.WMS;
import com.gsvproject.gsv.bean.WMS_Result;
import com.gsvproject.gsv.service.WmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.query.Param;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import javax.persistence.Id;
import java.util.ArrayList;
import java.util.List;

@RestController
public class WmsController {
    @Autowired
    private WmsService wmsService;
//动态查询分页
    @CrossOrigin
    @PostMapping("/search/queryWMSList")
    //page表示分页之后显示的页面，0表示第一页。size表示每页的数据条数，默认显示第一页，每页10条数据，按照id递增排序
    //如果需要改变page和size，只需要改变url即可，形如：/search/queryWMSList？page=1&size=2,表示显示第二页数据，每页2条数据
    public String getWMS(@RequestBody Params params,@PageableDefault(page = 0,size = 10,sort = {"id"},
            direction = Sort.Direction.ASC)Pageable pageable){
        List<WMS> wmsList=  wmsService.findAll(params,pageable).getContent();
        List<WMS_Result> wms_results=new ArrayList<>();
        for(int i=0;i<wmsList.size();i++)
        {
            WMS origin = wmsList.get(i);
            WMS_Result result = new WMS_Result();
            result.setId(origin.getId()+"");
            result.setUrl(origin.getUrl());
            result.setKeywords(origin.getKeywords());
            result.setTitle(origin.getTitle());
            result.setAdministrative_unit(origin.getCountry()+","+origin.getStateOrProvince()+","+origin.getCity());
            wms_results.add(result);

        }
        return JSON.toJSONString(wms_results);
    }



}
