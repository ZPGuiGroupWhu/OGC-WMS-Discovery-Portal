package com.gsv.querywmslist.querywmslist.dao;

import java.util.List;

public class Intention {
    public Integer subIntentionNum;
    public List<String> subIntention;

    public void getSubNum (){
        this.subIntentionNum =subIntention.size();
    }
}
