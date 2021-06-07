package com.gsv.querywmslist.querywmslist.bean;

import java.util.List;

import lombok.Data;

@Data
public class LayerResult2 {
    private  Integer errCode;
    private Integer totalLayerNum;
    private Integer layerNum;
    private List<LayerList> data;

//    public Integer getErrCode() {
//        return errCode;
//    }
//
//    public void setErrCode(Integer errCode) {
//        this.errCode = errCode;
//    }
//
//    public Integer getTotal() {
//        return total;
//    }
//
//    public void setTotal(Integer total) {
//        this.total = total;
//    }
//
//    public void setCurrentPageSize(Integer currentPS){
//        this.currentPageSize=currentPS;
//    }
//
//    public Integer getCurrentPageSize() {return currentPageSize;}
//
//    public List<LayerList> getData() {
//        return data;
//    }
//
//    public void setData(List<LayerList> data) {
//        this.data = data;
//    }
}
