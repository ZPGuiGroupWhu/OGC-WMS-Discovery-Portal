package com.gsv.querywmslist.querywmslist.bean;

public class HashCode {
    public Integer id;
    public Integer hashcode0;
    public Integer hashcode1;
    public Integer hashcode2;
    public Integer hashcode3;
    public Integer hashcode4;
    public Integer hashcode5;
    public Integer hashcode6;
    public Integer hashcode7;
    public Integer[] hashcode;

    public void getHashCode (){
        Integer[] tmp_hashcode = new Integer[8];
        tmp_hashcode[0]=this.hashcode0;
        tmp_hashcode[1]=this.hashcode1;
        tmp_hashcode[2]=this.hashcode2;
        tmp_hashcode[3]=this.hashcode3;
        tmp_hashcode[4]=this.hashcode4;
        tmp_hashcode[5]=this.hashcode5;
        tmp_hashcode[6]=this.hashcode6;
        tmp_hashcode[7]=this.hashcode7;
        this.hashcode=tmp_hashcode;
    }
}

