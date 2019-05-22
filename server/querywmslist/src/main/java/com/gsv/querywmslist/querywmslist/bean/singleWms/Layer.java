package com.gsv.querywmslist.querywmslist.bean.singleWms;

public class Layer {
    private String abstr;
    private String attribution;
    private float[][] bbox;
    private Integer id;
    private String photo;
    private String keywords;
    private String name;
    private String projection;
    private String title;
    private String url;
    private String topic;

    public String getAbstr() {
        return abstr;
    }

    public String getAttribution() {
        return attribution;
    }

    public float[][] getBbox() {
        return bbox;
    }

    public Integer getId() {
        return id;
    }

    public String getPhoto() {
        return photo;
    }

    public String getKeywords() {
        return keywords;
    }

    public String getName() {
        return name;
    }

    public String getProjection() {
        return projection;
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

    public void setAll(LayerOrigin layerOrigin){
        this.id = layerOrigin.getId();
        this.photo = layerOrigin.getPhoto();
        this.keywords = layerOrigin.getKeywords();
        this.name = layerOrigin.getName();
        this.projection = layerOrigin.getBoundingbox().split(" ")[0];
        this.title = layerOrigin.getTitle();
        this.url = layerOrigin.getUrl();
        this.topic = layerOrigin.getTopic();
        this.abstr = layerOrigin.getAbstr();
        this.attribution = layerOrigin.getAttribution();
        this.bbox = new float[2][2];
        this.bbox[0][0]=Float.parseFloat(layerOrigin.getBoundingbox().split(" ")[1].split(",")[0]);
        this.bbox[0][1]=Float.parseFloat(layerOrigin.getBoundingbox().split(" ")[1].split(",")[1]);
        this.bbox[1][0]=Float.parseFloat(layerOrigin.getBoundingbox().split(" ")[1].split(",")[2]);
        this.bbox[1][1]=Float.parseFloat(layerOrigin.getBoundingbox().split(" ")[1].split(",")[3]);
    }
}
