package com.gsvproject.gsv.bean;

import javafx.util.converter.FloatStringConverter;

import java.lang.reflect.Array;
import java.util.ArrayList;

//查询参数类
public class Params {
    private String keywords;
    private float[] bound;
    public Params() {
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
}
