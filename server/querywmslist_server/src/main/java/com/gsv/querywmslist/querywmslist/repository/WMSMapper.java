package com.gsv.querywmslist.querywmslist.repository;

import com.gsv.querywmslist.querywmslist.dao.WMS;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface WMSMapper {
//    @Select("SELECT id,url,Keywords,Title,CONCAT(Country,',',StateOrProvince,',',City),Abstract as abstr,Latitude,Longitude from wms WHERE " +
//            "(Title LIKE CONCAT('%',#{keywords},'%') " +
//            "OR Abstract like CONCAT('%',#{keywords},'%') " +
//            "OR url LIKE CONCAT('%',#{keywords},'%')) " +
//            "AND Latitude BETWEEN #{bound[0]} AND #{bound[1]} " +
//            "AND Longitude BETWEEN #{bound[2]} AND #{bound[3]} " +
//            "AND Continent=#{continent} " +
//            "ORDER BY id  ")
//    List<WMSList> findBykeywordsAndBoundAndContinent(@Param("keywords") String keywords,@Param("bound") float[] bound,@Param("continent") String continent,@Param("pageNum") Integer pageNum,@Param("pageSize") Integer pageSize);
//
//    @Select("SELECT id,url,Keywords,Title,CONCAT(Country,',',StateOrProvince,',',City),Abstract as abstr,Latitude,Longitude from wms WHERE " +
//            "(Title LIKE CONCAT('%',#{keywords},'%') " +
//            "OR Abstract like CONCAT('%',#{keywords},'%') " +
//            "OR url LIKE CONCAT('%',#{keywords},'%')) " +
//            "AND Latitude BETWEEN #{bound[0]} AND #{bound[1]} " +
//            "AND Longitude BETWEEN #{bound[2]} AND #{bound[3]} " +
//            "ORDER BY id  ")
//    List<WMSList> findBykeywordsAndBound(@Param("keywords") String keywords,@Param("bound") float[] bound,@Param("continent") String continent,@Param("pageNum") Integer pageNum,@Param("pageSize") Integer pageSize);
//
//    @Select("SELECT id,url,Keywords,Title,CONCAT(Country,',',StateOrProvince,',',City),Abstract as abstr,Latitude,Longitude from wms WHERE " +
//            "(Title LIKE CONCAT('%',#{keywords},'%') " +
//            "OR Abstract like CONCAT('%',#{keywords},'%') " +
//            "OR url LIKE CONCAT('%',#{keywords},'%')) " +
//            "AND Continent=#{continent} " +
//            "ORDER BY id  ")
//    List<WMSList> findBykeywordsAndContinent(@Param("keywords") String keywords,@Param("bound") float[] bound,@Param("continent") String continent,@Param("pageNum") Integer pageNum,@Param("pageSize") Integer pageSize);
//
//    @Select("SELECT id,url,Keywords,Title,CONCAT(Country,',',StateOrProvince,',',City),Abstract as abstr,Latitude,Longitude from wms WHERE " +
//            "Title LIKE CONCAT('%',#{keywords},'%') " +
//            "OR Abstract like CONCAT('%',#{keywords},'%') " +
//            "OR url LIKE CONCAT('%',#{keywords},'%') " +
//            "ORDER BY id  ")
//    List<WMSList> findBykeywords(@Param("keywords") String keywords,@Param("bound") float[] bound,@Param("continent") String continent,@Param("pageNum") Integer pageNum,@Param("pageSize") Integer pageSize);
//
//    @Select("SELECT id,url,Keywords,Title,CONCAT(Country,',',StateOrProvince,',',City),Abstract as abstr,Latitude,Longitude from wms WHERE " +
//            " Latitude BETWEEN #{bound[0]} AND #{bound[1]} " +
//            "AND Longitude BETWEEN #{bound[2]} AND #{bound[3]} " +
//            "AND Continent=#{continent} " +
//            "ORDER BY id  ")
//    List<WMSList> findByBoundAndContinent(@Param("keywords") String keywords,@Param("bound") float[] bound,@Param("continent") String continent,@Param("pageNum") Integer pageNum,@Param("pageSize") Integer pageSize);
//
//    @Select("SELECT id,url,Keywords,Title,CONCAT(Country,',',StateOrProvince,',',City),Abstract as abstr,Latitude,Longitude from wms WHERE " +
//            "Latitude BETWEEN #{bound[0]} AND #{bound[1]} " +
//            "AND Longitude BETWEEN #{bound[2]} AND #{bound[3]} " +
//            "ORDER BY id  ")
//    List<WMSList> findByBound(@Param("keywords") String keywords,@Param("bound") float[] bound,@Param("continent") String continent,@Param("pageNum") Integer pageNum,@Param("pageSize") Integer pageSize);
//
//    @Select("SELECT id,url,Keywords,Title,CONCAT(Country,',',StateOrProvince,',',City),Abstract as abstr,Latitude,Longitude from wms WHERE " +
//            "Continent=#{continent} " +
//            "ORDER BY id  ")
//    List<WMSList> findByContinent(@Param("keywords") String keywords,@Param("bound") float[] bound,@Param("continent") String continent,@Param("pageNum") Integer pageNum,@Param("pageSize") Integer pageSize);
//
//    @Select("SELECT id,url,Abstract as abstr,Keywords,Title,CONCAT(Country,',',StateOrProvince,',',City) as administrative_unit,Latitude,Longitude from wms ORDER BY id  ")
//    List<WMSList> findAll(@Param("keywords") String keywords, @Param("bound") float[] bound, @Param("continent") String continent, @Param("pageNum") Integer pageNum, @Param("pageSize") Integer pageSize);


    @Select("<script>" +
            "select x.* from(select m.* from (SELECT ID as id, Topic as topic, URL as url, Abstract as abstr, Keywords as keywords, Title as title, Country as country, " + 
    		"StateOrProvince as stateorprovince, City as city, Latitude as latitude, Longitude as longitude from wms where 1=1 " +
            "<if test='keywords!=null and  keywords!=\"\" ' >" +
            " and MATCH (Title,Abstract,url,Keywords) AGAINST (#{keywords}) " +
            "</if>  " +
            "<if test='bound!=null ' > " +
            " and ( Latitude BETWEEN #{bound[2]} AND #{bound[3]} " +
            "AND Longitude BETWEEN #{bound[0]} AND #{bound[1]} )" +
            "</if>  " +
            "<if test='continentNew !=null and  continentNew!=\"\" '>  " +
            " and LOWER(Continent)=#{continentNew} " +
            "</if>  " +
            "<if test='topicArray!=null and topicArray[0]!=null '>  " +
            "and (<foreach collection='topicArray' item='item' index='index' separator='and'> " +
            "LOWER(Topic) like CONCAT('%',#{item},'%')" +
            "</foreach> )" +
            "</if>)m  " +
            " right join"+
            " (SELECT  ServiceID  from contactinformation WHERE 1=1"+
            "<if test='organizationArray!=null and organizationArray[0]!=null '>  " +
            " and (<foreach collection='organizationArray' item='item' index='index' separator='and'> " +
            "  MATCH (Organization) AGAINST (#{item})" +
            "</foreach> )" +
            "</if>  " +
            "<if test='organizationTypeArray!=null and organizationTypeArray[0]!=null '>  " +
            " and (<foreach collection='organizationTypeArray' item='item' index='index' separator='and'> " +
            " MATCH (Organization) AGAINST (#{item})" +
            "</foreach> )" +
            "</if> )n " +
            " on m.id=n.ServiceID"+
            " ORDER BY m.id )x where x.id is not null " + 
            "limit #{fromRowNum}, #{pageSize}" + 
            "</script>")
    List<WMS> getWMSList(@Param("keywords") String keywords, @Param("bound") float[] bound, @Param("continentNew") String continentNew,@Param("topicArray")String [] topicArray, @Param("organizationArray")String [] organizationArray, @Param("organizationTypeArray")String [] organizationTypeArray, @Param("fromRowNum") Integer fromRowNum, @Param("pageSize") Integer pageSize);
    // TODO SQL语句查询中的Organization和OrganizationType都是用Organization来匹配的。
    
    
    // 查询符合条件的WMS服务总数
    @Select("<script>" +
            "select count(x.id) from(select m.* from (SELECT ID as id, Topic as topic, URL as url, Abstract as abstr, Keywords as keywords, Title as title, Country as country, " + 
    		"StateOrProvince as stateorprovince, City as city, Latitude as latitude, Longitude as longitude from wms where 1=1 " +
            "<if test='keywords!=null and  keywords!=\"\" ' >" +
            " and MATCH (Title,Abstract,url,Keywords) AGAINST (#{keywords}) " +
            "</if>  " +
            "<if test='bound!=null ' > " +
            " and ( Latitude BETWEEN #{bound[2]} AND #{bound[3]} " +
            "AND Longitude BETWEEN #{bound[0]} AND #{bound[1]} )" +
            "</if>  " +
            "<if test='continentNew !=null and  continentNew!=\"\" '>  " +
            " and LOWER(Continent)=#{continentNew} " +
            "</if>  " +
            "<if test='topicArray!=null and topicArray[0]!=null '>  " +
            "and (<foreach collection='topicArray' item='item' index='index' separator='and'> " +
            "LOWER(Topic) like CONCAT('%',#{item},'%')" +
            "</foreach> )" +
            "</if>)m  " +
            " right join"+
            " (SELECT  ServiceID  from contactinformation WHERE 1=1"+
            "<if test='organizationArray!=null and organizationArray[0]!=null '>  " +
            " and (<foreach collection='organizationArray' item='item' index='index' separator='and'> " +
            "  MATCH (Organization) AGAINST (#{item})" +
            "</foreach> )" +
            "</if>  " +
            "<if test='organizationTypeArray!=null and organizationTypeArray[0]!=null '>  " +
            " and (<foreach collection='organizationTypeArray' item='item' index='index' separator='and'> " +
            " MATCH (Organization) AGAINST (#{item})" +
            "</foreach> )" +
            "</if> )n " +
            " on m.id=n.ServiceID "+
            " )x where x.id is not null " + 
            "</script>")
    Integer getWMSListNum(@Param("keywords") String keywords, @Param("bound") float[] bound, @Param("continentNew") String continentNew,@Param("topicArray")String [] topicArray, @Param("organizationArray")String [] organizationArray, @Param("organizationTypeArray")String [] organizationTypeArray);
    // TODO SQL语句查询中的Organization和OrganizationType都是用Organization来匹配的。
    
    
    @Select("SELECT ID as id, URL as url, IP as ip, abstract as abstr, Version as version, Title as title," +
            "Keywords as keywords, Country as country, StateOrProvince as stateorprovince, City as city," +
            "Latitude as latitude, Longitude as longitude, Topic as topic from wms WHERE id=#{id}")
    WMS getWMSById(@Param("id")Integer id);
    
}


/**
 *


 "right join"+
 "(SELECT  service_id  from contactinformation WHERE 1=1"+
 "<if test='organizationArray[0]!=null '>  " +
 "and (<foreach collection='organizationArray' item='item' index='index' separator='and'> " +
 "Organization like CONCAT('%',#{item},'%')" +
 "</foreach> )" +
 "</if>  " +
 "<if test='organizationTypeArray[0]!=null '>  " +
 "and (<foreach collection='organizationTypeArray' item='item' index='index' separator='and'> " +
 "Organization like CONCAT('%',#{item},'%')" +
 "</foreach> )" +
 "</if> )n " +
 "on id=n.service_id"+














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
