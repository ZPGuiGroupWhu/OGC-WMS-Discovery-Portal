package com.gsv.querywmslist.querywmslist.bean.singleLayer;

import com.gsv.querywmslist.querywmslist.bean.singleWms.ContactInfo;
import com.gsv.querywmslist.querywmslist.bean.singleWms.WmsOrigin;

public class Service_wms {
    private String abstr;
    private String administrative_unit;
    private float[] geoLocation;
    private Integer id;
    private String ip;
    private String keywords;
    private String title;
    private String url;
    private String topic;
    private String version;
    private ContactInfo contact_info;

    public String getAbstr() {
        return abstr;
    }

    public String getAdministrative_unit() {
        return administrative_unit;
    }

    public float[] getGeoLocation() {
        return geoLocation;
    }

    public Integer getId() {
        return id;
    }

    public String getIp() {
        return ip;
    }

    public String getKeywords() {
        return keywords;
    }

    public String getTitle() {
        return title;
    }

    public String getUrl() {
        return url;
    }

    public String getTopic() {
        return topic;
    }

    public String getVersion() {
        return version;
    }

    public ContactInfo getContact_info() {
        return contact_info;
    }

    public void setContact_info(ContactInfo contact_info) {
        this.contact_info = contact_info;
    }

    public void setOthers(WmsOrigin wmsOrigin){
        this.abstr = wmsOrigin.getAbstr();
        this.administrative_unit = wmsOrigin.getCountry()+","+wmsOrigin.getStateorprovince()+","+wmsOrigin.getCity();
        this.geoLocation = new float[2];
        this.geoLocation[0]=wmsOrigin.getLatitude();
        this.geoLocation[1]=wmsOrigin.getLongitude();
        this.id = wmsOrigin.getId();
        this.ip = wmsOrigin.getIp();
        this.keywords = wmsOrigin.getKeywords();
        this.title = wmsOrigin.getTitle();
        this.url = wmsOrigin.getUrl();
        this.topic = wmsOrigin.getTopic();
        this.version = wmsOrigin.getVersion();
    }
}
