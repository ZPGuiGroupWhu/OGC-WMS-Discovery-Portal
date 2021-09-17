package com.gsv.querywmslist.querywmslist.bean;

public class WMSList {
    private Integer id;
    private  String url;
    private  String keywords;
    private String title;
    private  String administrative_unit;
    private  String abstr;
    private  String topic;
    private  float latitude;
    private  float longitude;

    public WMSList() {
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getKeywords() {
        return keywords;
    }

    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAdministrative_unit() {
        return administrative_unit;
    }

    public void setAdministrative_unit(String administrative_unit) {
        this.administrative_unit = administrative_unit;
    }

    public String getAbstr() {
        return abstr;
    }

    public void setAbstr(String abstr) {
        this.abstr = abstr;
    }

    public float getLatitude() {
        return latitude;
    }

    public void setLatitude(float latitude) {
        this.latitude = latitude;
    }

    public float getLongitude() {
        return longitude;
    }

    public void setLongitude(float longitude) {
        this.longitude = longitude;
    }
}
