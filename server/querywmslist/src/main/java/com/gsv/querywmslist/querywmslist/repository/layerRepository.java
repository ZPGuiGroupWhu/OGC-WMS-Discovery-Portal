package com.gsv.querywmslist.querywmslist.repository;

import com.gsv.querywmslist.querywmslist.bean.layers;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface layerRepository extends JpaRepository<layers,Integer> {
    public List<layers> findByserviceid(Integer service_id);
}
