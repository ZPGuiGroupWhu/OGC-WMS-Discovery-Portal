package com.gsvproject.gsv.service.impl;


import com.gsvproject.gsv.bean.WMS;
import com.gsvproject.gsv.dao.wmsDao;
import com.gsvproject.gsv.service.WmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class WmsServiceImpl implements WmsService {
    @Autowired
    private wmsDao wmsdao;

//    @Override
//    public Page<WMS> findByTopic(String topic, Pageable pageable) {
//        return wmsdao.findByTopic(topic,pageable);
//    }

    @Override
    public List<WMS> findByTopic(String topic, Pageable pageable) {
        return wmsdao.findByTopic(topic,pageable);
    }

    @Override
    public List<WMS> findByKeywords(String keywods, Pageable pageable) {
        return wmsdao.findByKeywords(keywods,pageable);
    }

    @Override
    public List<WMS> findByContinent(String continent, Pageable pageable) {
        return wmsdao.findByContinent(continent,pageable);
    }
}
