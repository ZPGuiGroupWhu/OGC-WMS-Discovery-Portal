package com.gsv.querywmslist.querywmslist.service;

import com.gsv.querywmslist.querywmslist.bean.layers;
import com.gsv.querywmslist.querywmslist.bean.re_wms;
import com.gsv.querywmslist.querywmslist.bean.wms;
import com.gsv.querywmslist.querywmslist.bean.wmsAndLayer;
import com.gsv.querywmslist.querywmslist.repository.layerRepository;
import com.gsv.querywmslist.querywmslist.repository.wmsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class myServiceImpl implements myService {
    @Autowired
    private wmsRepository wmsRepository;
    @Autowired
    private layerRepository layerRepository;

    private wms wms1;
    private List<layers> layers1;
    private re_wms re_wms1;
    private wmsAndLayer wAL;


    public wmsAndLayer findByid(Integer id){
        re_wms1=new re_wms();
        wAL=new wmsAndLayer();//返回wms数据的初始化
        wms1= wmsRepository.findByid(id);//用myRepository查找相应id号的原始wms数据
        layers1=layerRepository.findByserviceid(id);//用myRepository查找相应service_id号的原始layer数据

        re_wms1.setLayerList(layers1);//对layer某些属性格式进行修改
        re_wms1.setOthers(wms1);//赋值
        re_wms1.setAdministrative_unit(wms1);//将国家、省、地区连接成一个字符串
        re_wms1.setLocation(wms1);//将经纬度组成一个数组

        wAL.errorCode=0;
        wAL.data=re_wms1;
        return wAL;
    }
}
