package com.gsv.querywmslist.querywmslist.service;

import com.gsv.querywmslist.querywmslist.bean.LayerList;
import com.gsv.querywmslist.querywmslist.bean.LayerList_temp;
import com.gsv.querywmslist.querywmslist.commons.ImageDemo;
import com.gsv.querywmslist.querywmslist.repository.LayerQueryMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LayerQueryService {
    @Autowired
    LayerQueryMapper layerQueryMapper;
    public List<LayerList>  getlayerlist(String keywords,String topic,Integer pageNum, Integer pageSize){
        List<LayerList>layerLists=new ArrayList<>();
        List<LayerList_temp> layerList_temps1=new ArrayList<>();
        List<LayerList_temp> layerList_temps=new ArrayList<>();
        String keywordsNew=new String();
        if(keywords!=null & keywords!="")
        {  keywordsNew=keywords.toLowerCase();}
        String topicNew=new String();
        if(topic!=null & topic!="")
        {topicNew=topic.toLowerCase();}
        String [] topicArray=new String[100];
        if(topic!=null){
            topicArray=topicNew.split(",");
        }
        layerList_temps1=layerQueryMapper.getlayerlist(keywordsNew,topicArray,pageNum,pageSize);
        layerList_temps= ImageDemo.readLayerList(layerList_temps1);
        for(LayerList_temp layerList_temp:layerList_temps){
            LayerList layerList=new LayerList();
            layerList.setAbstr(layerList_temp.getAbstr());
            layerList.setAttribution(layerList_temp.getAttribution());
            layerList.setId(layerList_temp.getId());
            layerList.setKeywords(layerList_temp.getKeywords());
            layerList.setName(layerList_temp.getName());
            layerList.setTitle(layerList_temp.getTitle());
            layerList.setUrl(layerList_temp.getUrl());
            layerList.setTopic(layerList_temp.getTopic());
            layerList.setProjection(layerList_temp.getBoundingbox().split(" ")[0]);
            layerList.setBbox(layerList_temp);
            layerList.setPhoto(layerList_temp.getPhoto());
            layerLists.add(layerList);
        }

        return layerLists;
    }
}
