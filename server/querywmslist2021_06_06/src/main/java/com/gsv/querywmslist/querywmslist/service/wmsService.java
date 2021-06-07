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

    public  List<WMSList> getWMSListResult(String keywords, float[] bound, String continent, String topic,String organization,String organizationType, Integer pageNum, Integer pageSize){
        List<WMSList>data=new ArrayList<>();
        String keywordsNew=new String();
        if(keywords!=null && keywords!=""){keywordsNew=keywords.toLowerCase();}//toLowerCase()将字符串改成小写
        String continentNew=new String();
        if(continent!=null && continent!=""){continentNew=continent.toLowerCase();}
        String [] topicArray=new String[100];
        String topicNew=new String();
        if(topic!=null && topic!=""){topicNew=topic.toLowerCase();}
        if(topic!=null){topicArray=topicNew.split(",");}//split()以，为界，将topicArray分割成多个字符串

        String [] organizationArray=new String[100];
        String organizationNew=new String();
        if(organization!=null && organization!=""){organizationNew=organization.toLowerCase();}
        if(organization!=null){organizationArray=organizationNew.split(",");}

        String [] organizationTypeArray=new String[100];
        String organizationTypeNew=new String();
        if(organizationType!=null && organizationType!=""){organizationTypeNew=organizationType.toLowerCase();}
        if(organizationType!=null){organizationTypeArray=organizationTypeNew.split(",");}


        data=wmsMapper.getWMSListResult(keywordsNew,bound,continentNew,topicArray,organizationArray,organizationTypeArray,pageNum,pageSize);
        return data;
    }
}
