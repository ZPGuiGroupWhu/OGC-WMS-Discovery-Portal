package com.gsvproject.gsv.service;



import com.gsvproject.gsv.bean.WMS;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import java.util.List;

public interface WmsService {
//    Page<WMS> findByTopic(String topic, Pageable pageable);
    List<WMS> findByTopic(String topic,Pageable pageable);
    List<WMS> findByKeywords(String keywods,Pageable pageable);
    List<WMS> findByContinent(String continent,Pageable pageable);
}
