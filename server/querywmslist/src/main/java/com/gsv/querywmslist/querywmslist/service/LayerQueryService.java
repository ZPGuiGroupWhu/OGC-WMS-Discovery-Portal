package com.gsv.querywmslist.querywmslist.service;

import com.gsv.querywmslist.querywmslist.bean.LayerList;
import com.gsv.querywmslist.querywmslist.bean.LayerList_temp;
import com.gsv.querywmslist.querywmslist.repository.LayerQueryMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LayerQueryService {
    @Autowired
    LayerQueryMapper layerQueryMapper;
    public List<LayerList>  getlayerlist(String keywords,String topic){
        List<LayerList>layerLists=new ArrayList<>();
        List<LayerList_temp> layerList_temps=new ArrayList<>();
        String [] topicArray=new String[100];
        if(topic!=null){
            topicArray=topic.split(",");
        }
        layerList_temps=layerQueryMapper.getlayerlist(keywords,topicArray);
        for(LayerList_temp layerList_temp:layerList_temps){
            LayerList layerList=new LayerList();
            layerList.setAbstr(layerList_temp.getAbstr());
            layerList.setAttribution(layerList_temp.getAttribution());
            layerList.setId(layerList_temp.getId());
            layerList.setImagepath(layerList_temp.getImagepath());
            layerList.setKeywords(layerList_temp.getKeywords());
            layerList.setName(layerList_temp.getName());
            layerList.setTitle(layerList_temp.getTitle());
            layerList.setUrl(layerList_temp.getUrl());
            layerList.setTopic(layerList_temp.getTopic());
            layerList.setProjection(layerList_temp.getBoundingbox().split(" ")[0]);
            layerList.setBbox(layerList_temp);
            layerLists.add(layerList);
        }

        return layerLists;
    }
}
