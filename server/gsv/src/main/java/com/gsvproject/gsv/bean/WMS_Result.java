package com.gsvproject.gsv.bean;
//返回结果类
public class WMS_Result {
    private Integer ErrCode;
    private String reqMsg;
    private String id;
    private String url;
    private String keywords;
    private String title;
    private String administrative_unit;
//    private String topic;

    public WMS_Result() {
    }

    public Integer getErrCode() {
        return ErrCode;
    }

    public void setErrCode(Integer errCode) {
        ErrCode = errCode;
    }

    public String getReqMsg() {
        return reqMsg;
    }

    public void setReqMsg(String reqMsg) {
        this.reqMsg = reqMsg;
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
}
