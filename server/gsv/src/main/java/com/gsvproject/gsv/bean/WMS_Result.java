package com.gsvproject.gsv.bean;

public class WMS_Result {
    private String id;
    private String url;
    private String keywords;
    private String title;
    private String administrative_unit;
    private String topic;

    public WMS_Result() {
    }

    public WMS_Result( String url, String keywords, String title, String administrative_unit, String topic) {
        this.url = url;
        this.keywords = keywords;
        this.title = title;
        this.administrative_unit = administrative_unit;
        this.topic = topic;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getKeywords(String keywords) {
        return this.keywords;
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

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    @Override
    public String toString() {
        return "WMS_Result{" +
                "id='" + id + '\'' +
                ", url='" + url + '\'' +
                ", keywords='" + keywords + '\'' +
                ", title='" + title + '\'' +
                ", administrative_unit='" + administrative_unit + '\'' +
                ", topic='" + topic + '\'' +
                '}';
    }
}
