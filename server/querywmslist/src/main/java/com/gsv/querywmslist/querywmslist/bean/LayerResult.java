package com.gsv.querywmslist.querywmslist.bean;

import java.util.List;

public class LayerResult {
    private  Integer errCode;
    private Integer total;
    private List<LayerList> data;

    public Integer getErrCode() {
        return errCode;
    }

    public void setErrCode(Integer errCode) {
        this.errCode = errCode;
    }

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }

    public List<LayerList> getData() {
        return data;
    }

    public void setData(List<LayerList> data) {
        this.data = data;
    }
}
