package com.gsvproject.gsv.dao;


import com.gsvproject.gsv.bean.WMS;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;


import java.util.List;

@Mapper
public interface wmsDao extends JpaRepository<WMS, Integer>, JpaSpecificationExecutor<WMS> {
    Page<WMS> findAll(Specification<WMS> specification, Pageable pageable);

}
