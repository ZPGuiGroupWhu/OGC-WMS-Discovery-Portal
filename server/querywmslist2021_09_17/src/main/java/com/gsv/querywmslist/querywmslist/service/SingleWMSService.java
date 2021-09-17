package com.gsv.querywmslist.querywmslist.service;

import com.alibaba.fastjson.JSON;
import com.gsv.querywmslist.querywmslist.bean.singleWms.*;
import com.gsv.querywmslist.querywmslist.commons.ImageDemo;
import com.gsv.querywmslist.querywmslist.repository.SingleWMSMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SingleWMSService {
    @Autowired
    SingleWMSMapper singleWMSMapper;
    public String getWMSInfo(Integer id){
        SingleWms singleWms=new SingleWms();
        Data data=new Data();
        WmsOrigin wmsOrigin=singleWMSMapper.getWMSInfo(id);
        ContactInfoOrigin contactInfoOrigin=singleWMSMapper.getContactInfo(id);
        List<LayerOrigin> layerOrigins=singleWMSMapper.getLayerInfo(id);
        List<LayerOrigin> layerOrigins1= ImageDemo.readLayer(layerOrigins);
        List<Layer>layers = new ArrayList<>();
        ContactInfo contactInfo=new ContactInfo();
        try {
            if(id>=1 && id<=47884){singleWms.setErrCode("1001");}
            else{singleWms.setErrCode("1002");}
            data.setOthers(wmsOrigin);
            for (int i=0;i<layerOrigins1.size();i++){
                Layer layer=new Layer();
                layer.setAll(layerOrigins1.get(i));
                layers.add(layer);
            }
            data.setLayer(layers);
            contactInfo.setAll(contactInfoOrigin);
            data.setContact_info(contactInfo);
            singleWms.setData(data);
        }catch (Exception e){
            singleWms.setErrCode("1002");
        }
        return JSON.toJSONString(singleWms);
    }
}
