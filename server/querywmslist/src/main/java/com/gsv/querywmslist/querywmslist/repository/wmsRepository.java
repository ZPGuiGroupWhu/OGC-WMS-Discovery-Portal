package com.gsv.querywmslist.querywmslist.repository;

import com.gsv.querywmslist.querywmslist.bean.wms;
import org.springframework.data.jpa.repository.JpaRepository;

public interface wmsRepository extends JpaRepository<wms,Integer> {
    public wms findByid(Integer id);
}
