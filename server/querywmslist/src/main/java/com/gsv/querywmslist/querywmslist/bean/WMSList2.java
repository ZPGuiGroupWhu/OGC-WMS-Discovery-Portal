package com.gsv.querywmslist.querywmslist.bean;

public class WMSList2 {
    private Integer id;
    private  String url;
    private  String keywords;
    private String title;
    private  String administrative_unit;
    private  String abstr;
    private  String topic;
    private  float[] geoLocation;
    public WMSList2() {
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

    public float[] getGeoLocation() {
        return geoLocation;
    }

    public void setGeoLocation(WMSList wmsList) {
        this.geoLocation = new float[2];
        this.geoLocation[0]=wmsList.getLatitude();
        this.geoLocation[1]=wmsList.getLongitude();
    }
}
