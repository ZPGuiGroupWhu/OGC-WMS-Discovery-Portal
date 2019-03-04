package com.gsv.querywmslist.querywmslist.bean;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;


@Entity
@Table(name = "layerlist")
public class layers {
        @Id
        public Integer id;
       @Column(name="service_id")
        public Integer serviceid;
        public String Title;
        public String Name;
        public String Abstract;
        public String Keywords;
        public String Attribution;
        public String imagepath;
        public String URL;
        @Column(name="boundingbox")//因数据库与返回的字段名称不同，故用Column指定列名
        public String bbox;
        @Column(name="extcrs")
        public String projection;
}
