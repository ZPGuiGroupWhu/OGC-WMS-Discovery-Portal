package com.gsv.querywmslist.querywmslist.dao;

import java.util.List;

public class Intention {
    public Integer subIntentionNum;
    public List<SubIntention> subIntention;
    public class SubIntention{
        public List<String> content;
        public List<String> location;
        public List<String> style;
        public List<String> topic;
    }
    public void getSubNum (){
        this.subIntentionNum =subIntention.size();
    }
}
