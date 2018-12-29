package com.gsvproject.gsv.service;



import com.gsvproject.gsv.bean.Params;
import com.gsvproject.gsv.bean.WMS;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;


import java.util.List;

public interface WmsService {
    Page<WMS> findAll( Params params,Pageable pageable);
}
