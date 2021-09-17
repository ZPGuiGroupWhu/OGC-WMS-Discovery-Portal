package com.gsv.querywmslist.querywmslist.service;

import com.alibaba.fastjson.JSON;
import com.gsv.querywmslist.querywmslist.bean.singleLayer.LayerData;
import com.gsv.querywmslist.querywmslist.bean.singleLayer.Service_wms;
import com.gsv.querywmslist.querywmslist.bean.singleLayer.SingleLayer;
import com.gsv.querywmslist.querywmslist.bean.singleWms.ContactInfo;
import com.gsv.querywmslist.querywmslist.bean.singleWms.ContactInfoOrigin;
import com.gsv.querywmslist.querywmslist.bean.singleWms.LayerOrigin;
import com.gsv.querywmslist.querywmslist.bean.singleWms.WmsOrigin;
import com.gsv.querywmslist.querywmslist.commons.ImageDemo;
import com.gsv.querywmslist.querywmslist.repository.SingleLayerMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SingleLayerService {
    @Autowired
    SingleLayerMapper singleLayerMapper;
    public String queryLayerInfo(Integer id){
        SingleLayer singleLayer=new SingleLayer();
        LayerData data=new LayerData();
        Service_wms service_wms=new Service_wms();
        ContactInfo contactInfo=new ContactInfo();
        LayerOrigin layerOrigin=singleLayerMapper.getLayerInfo(id);
        WmsOrigin wmsOrigin=singleLayerMapper.getWMSInfo(layerOrigin.getService_id());
        ContactInfoOrigin contactInfoOrigin=singleLayerMapper.getContactInfo(wmsOrigin.getId());
        LayerOrigin layerOrigin1= ImageDemo.readSingleLayer(layerOrigin);
        try {
            if(id>=1 && id<=348108){singleLayer.setErrCode("1001");}
            else {singleLayer.setErrCode("1002");}
            data.setAll(layerOrigin1);
            service_wms.setOthers(wmsOrigin);
            contactInfo.setAll(contactInfoOrigin);
            service_wms.setContact_info(contactInfo);
            data.setService(service_wms);
            singleLayer.setData(data);
        }catch (Exception e){
            singleLayer.setErrCode("1001");
        }


        return JSON.toJSONString(singleLayer);
    }
}
