package com.gsvproject.gsv.controller;

import com.alibaba.fastjson.JSON;

import com.gsvproject.gsv.bean.WMS;
import com.gsvproject.gsv.bean.WMS_Result;
import com.gsvproject.gsv.service.WmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.query.Param;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.Id;
import java.util.ArrayList;
import java.util.List;

@RestController
public class WmsController {
    @Autowired
    private WmsService wmsService;

    @GetMapping("/WMS/topic/{topic}")
    public String findByTopic(@PathVariable String topic, @PageableDefault(page = 0,size = 10,sort = {"id"},
            direction = Sort.Direction.ASC)Pageable pageable){
        List<WMS> wms=wmsService.findByTopic(topic, pageable);
        List<WMS_Result> wms_results=new ArrayList<>();
        for(int i=0;i<wms.size();i++)
        {
            WMS origin = wms.get(i);
            WMS_Result result = new WMS_Result();
            result.setId(origin.getId()+"");
            result.setUrl(origin.getUrl());
            result.setKeywords(origin.getKeywords());
            result.setTitle(origin.getTitle());
            result.setAdministrative_unit(origin.getCountry()+","+origin.getStateOrProvince()+","+origin.getCity());
            result.setTopic(origin.getTopic());
            wms_results.add(result);

        }
        return JSON.toJSONString(wms_results);
    }


    @GetMapping("/WMS/keywords/{keywords}")
    public String findByKeywords(@PathVariable String keywords, @PageableDefault(page = 0,size = 10,sort = {"id"},
            direction = Sort.Direction.ASC)Pageable pageable){
        List<WMS> wms=wmsService.findByKeywords(keywords, pageable);
        List<WMS_Result> wms_results=new ArrayList<>();
        for(int i=0;i<wms.size();i++)
        {
            WMS origin = wms.get(i);
            WMS_Result result = new WMS_Result();
            result.setId(origin.getId()+"");
            result.setUrl(origin.getUrl());
            result.setKeywords(origin.getKeywords());
            result.setTitle(origin.getTitle());
            result.setAdministrative_unit(origin.getCountry()+","+origin.getStateOrProvince()+","+origin.getCity());
            result.setTopic(origin.getTopic());
            wms_results.add(result);

        }
        return JSON.toJSONString(wms_results);
    }


    @GetMapping("/WMS/continent/{continent}")
    public String findByContinent(@PathVariable String continent, @PageableDefault(page = 0,size = 10,sort = {"id"},
            direction = Sort.Direction.ASC)Pageable pageable){
        List<WMS> wms=wmsService.findByContinent(continent, pageable);
        List<WMS_Result> wms_results=new ArrayList<>();
        for(int i=0;i<wms.size();i++)
        {
            WMS origin = wms.get(i);
            WMS_Result result = new WMS_Result();
            result.setId(origin.getId()+"");
            result.setUrl(origin.getUrl());
            result.setKeywords(origin.getKeywords());
            result.setTitle(origin.getTitle());
            result.setAdministrative_unit(origin.getCountry()+","+origin.getStateOrProvince()+","+origin.getCity());
            result.setTopic(origin.getTopic());
            wms_results.add(result);

        }
        return JSON.toJSONString(wms_results);
    }
}
