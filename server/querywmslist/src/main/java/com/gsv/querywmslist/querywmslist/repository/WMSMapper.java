package com.gsv.querywmslist.querywmslist.repository;

import com.gsv.querywmslist.querywmslist.bean.WMSList;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface WMSMapper {
    @Select("SELECT id,url,Keywords,Title,CONCAT(Country,',',StateOrProvince,',',City),Abstract as abstr,Latitude,Longitude from wms WHERE " +
            "(Title LIKE CONCAT('%',#{keywords},'%') " +
            "OR Abstract like CONCAT('%',#{keywords},'%') " +
            "OR url LIKE CONCAT('%',#{keywords},'%')) " +
            "AND Latitude BETWEEN #{bound[0]} AND #{bound[1]} " +
            "AND Longitude BETWEEN #{bound[2]} AND #{bound[3]} " +
            "AND Continent=#{continent} " +
            "ORDER BY id  ")
    List<WMSList> findBykeywordsAndBoundAndContinent(@Param("keywords") String keywords,@Param("bound") float[] bound,@Param("continent") String continent,@Param("pageNum") Integer pageNum,@Param("pageSize") Integer pageSize);

    @Select("SELECT id,url,Keywords,Title,CONCAT(Country,',',StateOrProvince,',',City),Abstract as abstr,Latitude,Longitude from wms WHERE " +
            "(Title LIKE CONCAT('%',#{keywords},'%') " +
            "OR Abstract like CONCAT('%',#{keywords},'%') " +
            "OR url LIKE CONCAT('%',#{keywords},'%')) " +
            "AND Latitude BETWEEN #{bound[0]} AND #{bound[1]} " +
            "AND Longitude BETWEEN #{bound[2]} AND #{bound[3]} " +
            "ORDER BY id  ")
    List<WMSList> findBykeywordsAndBound(@Param("keywords") String keywords,@Param("bound") float[] bound,@Param("continent") String continent,@Param("pageNum") Integer pageNum,@Param("pageSize") Integer pageSize);

    @Select("SELECT id,url,Keywords,Title,CONCAT(Country,',',StateOrProvince,',',City),Abstract as abstr,Latitude,Longitude from wms WHERE " +
            "(Title LIKE CONCAT('%',#{keywords},'%') " +
            "OR Abstract like CONCAT('%',#{keywords},'%') " +
            "OR url LIKE CONCAT('%',#{keywords},'%')) " +
            "AND Continent=#{continent} " +
            "ORDER BY id  ")
    List<WMSList> findBykeywordsAndContinent(@Param("keywords") String keywords,@Param("bound") float[] bound,@Param("continent") String continent,@Param("pageNum") Integer pageNum,@Param("pageSize") Integer pageSize);

    @Select("SELECT id,url,Keywords,Title,CONCAT(Country,',',StateOrProvince,',',City),Abstract as abstr,Latitude,Longitude from wms WHERE " +
            "Title LIKE CONCAT('%',#{keywords},'%') " +
            "OR Abstract like CONCAT('%',#{keywords},'%') " +
            "OR url LIKE CONCAT('%',#{keywords},'%') " +
            "ORDER BY id  ")
    List<WMSList> findBykeywords(@Param("keywords") String keywords,@Param("bound") float[] bound,@Param("continent") String continent,@Param("pageNum") Integer pageNum,@Param("pageSize") Integer pageSize);

    @Select("SELECT id,url,Keywords,Title,CONCAT(Country,',',StateOrProvince,',',City),Abstract as abstr,Latitude,Longitude from wms WHERE " +
            " Latitude BETWEEN #{bound[0]} AND #{bound[1]} " +
            "AND Longitude BETWEEN #{bound[2]} AND #{bound[3]} " +
            "AND Continent=#{continent} " +
            "ORDER BY id  ")
    List<WMSList> findByBoundAndContinent(@Param("keywords") String keywords,@Param("bound") float[] bound,@Param("continent") String continent,@Param("pageNum") Integer pageNum,@Param("pageSize") Integer pageSize);

    @Select("SELECT id,url,Keywords,Title,CONCAT(Country,',',StateOrProvince,',',City),Abstract as abstr,Latitude,Longitude from wms WHERE " +
            "Latitude BETWEEN #{bound[0]} AND #{bound[1]} " +
            "AND Longitude BETWEEN #{bound[2]} AND #{bound[3]} " +
            "ORDER BY id  ")
    List<WMSList> findByBound(@Param("keywords") String keywords,@Param("bound") float[] bound,@Param("continent") String continent,@Param("pageNum") Integer pageNum,@Param("pageSize") Integer pageSize);

    @Select("SELECT id,url,Keywords,Title,CONCAT(Country,',',StateOrProvince,',',City),Abstract as abstr,Latitude,Longitude from wms WHERE " +
            "Continent=#{continent} " +
            "ORDER BY id  ")
    List<WMSList> findByContinent(@Param("keywords") String keywords,@Param("bound") float[] bound,@Param("continent") String continent,@Param("pageNum") Integer pageNum,@Param("pageSize") Integer pageSize);

    @Select("SELECT id,url,Abstract as abstr,Keywords,Title,CONCAT(Country,',',StateOrProvince,',',City) as administrative_unit,Latitude,Longitude from wms ORDER BY id  ")
    List<WMSList> findAll(@Param("keywords") String keywords, @Param("bound") float[] bound, @Param("continent") String continent, @Param("pageNum") Integer pageNum, @Param("pageSize") Integer pageSize);


    @Select("<script>" +
            "SELECT id,url,Abstract as abstr,Keywords,Title,CONCAT(Country,',',StateOrProvince,',',City) as administrative_unit,Latitude,Longitude from wms where 1=1 " +
            "<if test='keywords!=null' >" +
            " and (Title LIKE CONCAT('%',#{keywords},'%') " +
            "OR Abstract like CONCAT('%',#{keywords},'%') " +
            "OR url LIKE CONCAT('%',#{keywords},'%') " +
            "OR Keywords like CONCAT('%',#{keywords},'%'))" +
            "</if>  " +
            "<if test='bound!=null ' > " +
            " and ( Latitude BETWEEN #{bound[0]} AND #{bound[1]} " +
            "AND Longitude BETWEEN #{bound[2]} AND #{bound[3]} )" +
            "</if>  " +
            "<if test='continent !=null '>  " +
            " and Continent=#{continent} " +
            "</if>  " +
            "<if test='topicArray[0]!=null '>  " +
            "and (<foreach collection='topicArray' item='item' index='index' separator='and'> " +
            "Topic like CONCAT('%',#{item},'%')" +
            "</foreach> )" +
            "</if>  " +
            "ORDER BY id  " +
            "</script>")
    List<WMSList> getWMSListResult(@Param("keywords") String keywords, @Param("bound") float[] bound, @Param("continent") String continent,@Param("topicArray")String [] topicArray, @Param("pageNum") Integer pageNum, @Param("pageSize") Integer pageSize);

}
/**
 *

 "<if test='#{keywords}!=null' >" +
 " and (Title LIKE CONCAT('%',#{keywords},'%') " +
 "OR Abstract like CONCAT('%',#{keywords},'%') " +
 "OR url LIKE CONCAT('%',#{keywords},'%') )" +
 "</if>  " +
 "<if test='#{bound}!=null ' > " +
 " and ( Latitude BETWEEN #{bound[0]} AND #{bound[1]} " +
 "AND Longitude BETWEEN #{bound[2]} AND #{bound[3]} )" +
 "</if>  " +
 "<if test='#{continent} !=null '>  " +
 " and Continent=#{continent} " +
 "</if>  " +
 "<if test='#{topicArray}!=null '>  " +
 "and (<foreach collection='topicArray' item='item' index='index' separator='and'> " +
 "Topic like CONCAT('%',#{item},'%')" +
 "</foreach> )" +
 "</if>  " +
 */
