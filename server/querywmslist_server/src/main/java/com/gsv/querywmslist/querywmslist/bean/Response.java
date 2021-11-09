package com.gsv.querywmslist.querywmslist.bean;

import lombok.Data;

@Data
public class Response {

    public Integer errCode;
    public String reqMsg;
    public Object resBody;
}
