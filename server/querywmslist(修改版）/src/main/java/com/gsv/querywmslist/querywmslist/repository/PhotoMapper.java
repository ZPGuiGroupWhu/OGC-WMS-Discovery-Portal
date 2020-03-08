package com.gsv.querywmslist.querywmslist.repository;

import com.gsv.querywmslist.querywmslist.bean.PhotoInput;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.sql.Blob;
import java.util.List;

@Mapper
public interface PhotoMapper {
    @Select("<script>" +
            "insert into photo (id,name,photo)" +
            "values" +
            "<foreach collection='list' item='item' index='index' separator=','>" +
            "#{item.id}," +
            "#{item.name}," +
            "#{item.photo}" +
            "</foreach>" +
            "</script>")
 Integer insertPhotos(@Param("list")List<PhotoInput> list);
    @Select("select photo from photos where id=1")
    Blob getPhoto();
}
