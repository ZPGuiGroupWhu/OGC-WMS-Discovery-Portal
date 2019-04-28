package com.gsv.querywmslist.querywmslist.service;

import com.gsv.querywmslist.querywmslist.bean.WMSList;
import com.gsv.querywmslist.querywmslist.repository.WMSMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class wmsService {
    @Autowired WMSMapper wmsMapper;
//    public  List<WMSResult> getWMSList(Params_wms params_wms){
//        List<WMSResult>wmsResultList=new ArrayList<>();
//
//        if(params_wms.getKeywords()!=null){
//            if(params_wms.getBound()!=null){
//                if (params_wms.getContinent()!=null){
//                    wmsResultList=wmsMapper.findBykeywordsAndBoundAndContinent(params_wms);
//                }else {
//                    wmsResultList=wmsMapper.findBykeywordsAndBound(params_wms);
//                }
//            }else {
//                if(params_wms.getContinent()!=null){
//                    wmsResultList=wmsMapper.findBykeywordsAndContinent(params_wms);
//                }else {
//                    wmsResultList=wmsMapper.findBykeywords(params_wms);
//                }
//            }
//        }
//        else {
//            if(params_wms.getBound()!=null){
//                if (params_wms.getContinent()!=null){
//                    wmsResultList=wmsMapper.findByBoundAndContinent(params_wms);
//                }else {
//                    wmsResultList=wmsMapper.findByBound(params_wms);
//                }
//            }else {
//                if(params_wms.getContinent()!=null){
//                    wmsResultList=wmsMapper.findByContinent(params_wms);
//                }else {
//                    wmsResultList=wmsMapper.findAll(params_wms);
//                }
//            }
//        }
//
//        return wmsResultList;
//    }

    public  List<WMSList> getWMSList(String keywords, float[] bound, String continent, Integer pageNum, Integer pageSize){
        List<WMSList>data=new ArrayList<>();

        if(keywords!=null){
            if(bound!=null){
                if (continent!=null){
                    data=wmsMapper.findBykeywordsAndBoundAndContinent(keywords,bound,continent,pageNum,pageSize);
                }else {
                    data=wmsMapper.findBykeywordsAndBound(keywords,bound,continent,pageNum,pageSize);
                }
            }else {
                if(continent!=null){
                    data=wmsMapper.findBykeywordsAndContinent(keywords,bound,continent,pageNum,pageSize);
                }else {
                    data=wmsMapper.findBykeywords(keywords,bound,continent,pageNum,pageSize);
                }
            }
        }
        else {
            if(bound!=null){
                if (continent!=null){
                    data=wmsMapper.findByBoundAndContinent(keywords,bound,continent,pageNum,pageSize);
                }else {
                    data=wmsMapper.findByBound(keywords,bound,continent,pageNum,pageSize);
                }
            }else {
                if(continent!=null){
                    data=wmsMapper.findByContinent(keywords,bound,continent,pageNum,pageSize);
                }else {
                    data=wmsMapper.findAll(keywords,bound,continent,pageNum,pageSize);
                }
            }
        }

        return data;
    }





    public  List<WMSList> getWMSListResult(String keywords, float[] bound, String continent, String topic, Integer pageNum, Integer pageSize){
        List<WMSList>data=new ArrayList<>();
        String [] topicArray=new String[100];
        if(topic!=null){
            topicArray=topic.split(",");
        }
        data=wmsMapper.getWMSListResult(keywords,bound,continent,topicArray,pageNum,pageSize);
        return data;
    }
}
