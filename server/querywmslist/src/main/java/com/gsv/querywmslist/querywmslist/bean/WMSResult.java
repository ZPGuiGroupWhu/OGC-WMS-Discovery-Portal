package com.gsv.querywmslist.querywmslist.bean;

import java.util.List;

public class WMSResult {
    private Integer errCode;
    private Integer total;
    private List<WMSList2> data;

    public WMSResult() {
    }

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

    public List<WMSList2> getData() {
        return data;
    }

    public void setData(List<WMSList2> data) {
        this.data = data;
    }
}
