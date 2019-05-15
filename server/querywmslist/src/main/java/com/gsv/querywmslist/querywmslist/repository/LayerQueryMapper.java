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
            "<if test='keywordsNew!=null' >" +
            " and (Title LIKE CONCAT('%',#{keywordsNew},'%') " +
            "OR Abstract like CONCAT('%',#{keywordsNew},'%') " +
            "OR `Name` LIKE CONCAT('%',#{keywordsNew},'%') " +
            "OR Attribution LIKE CONCAT('%',#{keywordsNew},'%') " +
            "OR Keywords like CONCAT('%',#{keywordsNew},'%'))" +
            "</if>  " +
            "<if test='topicArray[0]!=null '>  " +
            "and (<foreach collection='topicArray' item='item' index='index' separator='and'> " +
            "Topic like CONCAT('%',#{item},'%')" +
            "</foreach> )" +
            "</if>  " +
            "ORDER BY id " +
            "</script>")
    List<LayerList_temp> getlayerlist(@Param("keywordsNew") String keywordsNew, @Param("topicArray")String [] topicArray, @Param("pageNum") Integer pageNum, @Param("pageSize") Integer pageSize);
}
