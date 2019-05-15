package com.gsv.querywmslist.querywmslist.bean;

public class Params_wms {
    private  String keywords;
    private float[] bound;
    private  String continent;
    private Integer pageNum;
    private  Integer pageSize;

    public Params_wms() {
    }

    public String getKeywords() {
        return keywords;
    }

    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }

    public float[] getBound() {
        return bound;
    }

    public void setBound(float[] bound) {
        this.bound = bound;
    }

    public String getContinent() {
        return continent;
    }

    public void setContinent(String continent) {
        this.continent = continent;
    }

    public Integer getPageNum() {
        return pageNum;
    }

    public void setPageNum(Integer pageNum) {
        this.pageNum = pageNum;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }
}
