package com.gsv.querywmslist.querywmslist.repository;

import com.gsv.querywmslist.querywmslist.dao.Photo;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface PhotoMapper {
    @Select("<script>" +
            "insert into photos (id,LayerID,Image)" +
            "values" +
            "<foreach collection='list' item='item' index='index' separator=','>" +
            "#{item.id}," +
            "#{item.layerId}," +
            "#{item.image}" +
            "</foreach>" +
            "</script>")
    Integer insertPhotos(@Param("list")List<Photo> list);
    
    
    @Select("select id as id, LayerID as layerId, Image as image from photos where LayerID=#{layerId}")
    Photo getPhotoByLayerId(@Param("layerId") Integer layerId);
}
