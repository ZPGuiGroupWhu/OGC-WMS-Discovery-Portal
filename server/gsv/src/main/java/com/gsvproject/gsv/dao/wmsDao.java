package com.gsvproject.gsv.dao;


import com.gsvproject.gsv.bean.WMS;
import com.sun.org.apache.bcel.internal.generic.NEW;
import com.sun.org.apache.bcel.internal.generic.NEWARRAY;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.lang.reflect.Array;
import java.util.List;

@Mapper
public interface wmsDao extends JpaRepository<WMS, Integer> {
    List<WMS> findByTopic(String topic,Pageable pageable);
    List<WMS> findByKeywords(String keywods,Pageable pageable);
    List<WMS> findByContinent(String continent,Pageable pageable);
    List<WMS> findByLatitudeBetweenAndlAndLongitudeBetween();


}
