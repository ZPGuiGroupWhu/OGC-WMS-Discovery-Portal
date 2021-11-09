package com.gsv.querywmslist.querywmslist.repository;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.gsv.querywmslist.querywmslist.dao.HashCode;

import java.util.List;


@Mapper
public interface HashCodeMapper {
    @Select("Select * from hashcode ")
    List<HashCode> getHashCode();
}
