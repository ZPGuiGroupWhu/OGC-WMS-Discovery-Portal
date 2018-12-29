package com.gsvproject.gsv.service.impl;


import ch.qos.logback.core.net.SyslogOutputStream;
import com.gsvproject.gsv.bean.Params;
import com.gsvproject.gsv.bean.WMS;
import com.gsvproject.gsv.dao.wmsDao;
import com.gsvproject.gsv.service.WmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class WmsServiceImpl implements WmsService {
    @Autowired
    private wmsDao wmsdao;
    @Override
    public Page<WMS> findAll(final Params params,Pageable pageable) {
        Page<WMS> wmsPage=wmsdao.findAll(new Specification<WMS>() {
            @Override
            public Predicate toPredicate(Root<WMS> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates=new ArrayList<>();
                if(params.getKeywords()!=null&&!params.getKeywords().equals("")){
                    predicates.add(criteriaBuilder.or(criteriaBuilder.like(root.get("keywords").as(String.class),"%"+params.getKeywords()+"%"),
                            criteriaBuilder.like(root.get("title").as(String.class),"%"+params.getKeywords()+"%"),
                            criteriaBuilder.like(root.get("Abstract").as(String.class),"%"+params.getKeywords()+"%"),
                            criteriaBuilder.like(root.get("url").as(String.class),"%"+params.getKeywords()+"%")
                            ));
                }
                //按照范围查询[minLatitude,maxLatitude,minLongitude,maxLongitude]
                if(params.getBound()!=null){
                    predicates.add(criteriaBuilder.and(
                            criteriaBuilder.between(root.get("latitude").as(float.class),params.getBound()[0],params.getBound()[1]),
                            criteriaBuilder.between(root.get("longitude").as(float.class),params.getBound()[2],params.getBound()[3])
                    ));
                }
                Predicate[] pre=new Predicate[predicates.size()];
                return criteriaQuery.where(predicates.toArray(pre)).getRestriction();
            }
        },pageable);
        return wmsPage;
    }
}
