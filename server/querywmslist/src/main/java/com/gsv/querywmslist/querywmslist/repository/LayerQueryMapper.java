package com.gsv.querywmslist.querywmslist.repository;

import com.gsv.querywmslist.querywmslist.bean.LayerList_temp;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface LayerQueryMapper {
    @Select("<script>" +
            "SELECT id,Abstract as abstr,Attribution as attribution,Keywords as keywords,`Name` as name,Title as title,URL as url,BoundingBox as boundingbox,imagePath,Topic as topic from layerlist where 1=1 " +
            "<if test='keywords!=null' >" +
            " and (Title LIKE CONCAT('%',#{keywords},'%') " +
            "OR Abstract like CONCAT('%',#{keywords},'%') " +
            "OR `Name` LIKE CONCAT('%',#{keywords},'%') " +
            "OR Attribution LIKE CONCAT('%',#{keywords},'%') " +
            "OR Keywords like CONCAT('%',#{keywords},'%'))" +
            "</if>  " +
            "<if test='topicArray[0]!=null '>  " +
            "and (<foreach collection='topicArray' item='item' index='index' separator='and'> " +
            "Topic like CONCAT('%',#{item},'%')" +
            "</foreach> )" +
            "</if>  " +
            "ORDER BY id  " +
            "</script>")
    List<LayerList_temp> getlayerlist(@Param("keywords") String keywords, @Param("topicArray")String [] topicArray);
}
