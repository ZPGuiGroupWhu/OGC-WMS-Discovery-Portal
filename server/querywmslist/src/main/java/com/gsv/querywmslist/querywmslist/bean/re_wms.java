package com.gsv.querywmslist.querywmslist.bean;

import java.util.ArrayList;
import java.util.List;

public class re_wms {
    public String abstr;
    public String administrative_unit;
    public String ip;
    public String version;
    public float []geoLocation;
    public Integer id;
    public String keywords;
    public String title;
    public String url;
    public String topic;
    public List<re_layers> layer;


    //将经纬度组成一个数组
    public void setLocation(wms wms){
       this.geoLocation=new float [2];
       this.geoLocation[0]=wms.Latitude;
       this.geoLocation[1]=wms.Longitude;
    }
    //将国家、省、地区连接成一个字符串
    public void setAdministrative_unit(wms wms){
        this.administrative_unit=wms.Country+','+wms.stateorprovince+','+wms.City;
    }
    //赋值
    public void setOthers(wms wms){
        this.id=wms.id;
        this.url=wms.url;
        this.ip=wms.IP;
        this.abstr=wms.Abstract;
        this.version=wms.Version;
        this.title=wms.Title;
        this.keywords=wms.Keywords;
        this.topic=wms.Topic;
    }
    //对layer某些属性格式进行修改
    public void setLayerList(List<layers> layers){
        layer=new ArrayList<re_layers>();
        for(int i=0;i<layers.size();i++)
        {
            layers t_layer=layers.get(i);
            re_layers t_relayers=new re_layers();

            t_relayers.setOthers(t_layer);//赋值
            t_relayers.setBbox(t_layer);//将BBox改成二维数组
            this.layer.add(t_relayers);
        }
    }
}

