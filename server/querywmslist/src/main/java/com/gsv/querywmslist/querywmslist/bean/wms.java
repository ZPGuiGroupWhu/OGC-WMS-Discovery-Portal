package com.gsv.querywmslist.querywmslist.bean;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;



@Entity
@Table(name = "wms")
public class wms {
    @Id
    public Integer id;
    public String url;
    public String IP;
    public String Abstract;
    public String Version;
    public String Title;
    public String Keywords;
    public String Country;
    public String stateorprovince;
    public String City;
    public float Latitude;
    public float Longitude;
    public String Topic;
}