package com.gsv.querywmslist.querywmslist.repository;

import com.gsv.querywmslist.querywmslist.bean.LayerList_temp;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface LayerQueryMapper {
    @Select("<script>" +
            "SELECT ID as id,Abstract as abstr,Attribution as attribution,Keywords as keywords,`Name` as name,Title as title,URL as url,BoundingBox as boundingbox,Topic as topic from layerlist where 1=1  " +
            "<if test='keywordsNew!=null and  keywordsNew != \"\" ' >" +
            " AND MATCH ( Title, Abstract, `Name`, Attribution, Keywords, URL ) AGAINST ( #{keywordsNew} )" +
            "</if>  " +
            "<if test='polygon!=\"\" '>" +
            // 这里将(Box,ST_GeomFromText('${polygon}', 4326))"中的4326去掉了，默认为0
            // 这样在比较时基于迪卡尔坐标系，而不是WGS84，效果应该不变
            "and MBRCONTAINS (Box,ST_GeomFromText('${polygon}'))" +
            "</if>" +
            "<if test='topicArray[0]!=null '>  " +
            "and (<foreach collection='topicArray' item='item' index='index' separator='and'> " +
            "LOWER(Topic) like CONCAT('%',#{item},'%')" +
            "</foreach> )" +
            "</if>  " +
            "ORDER BY id " +
            "</script>")
    List<LayerList_temp> getlayerlist(@Param("keywordsNew") String keywordsNew, @Param("polygon") String Polygon, @Param("topicArray")String [] topicArray, @Param("pageNum") Integer pageNum, @Param("pageSize") Integer pageSize);
    
    @Select("<script>" + 
    		"select ID as id,Abstract as abstr,Attribution as attribution,Keywords as keywords,`Name` as name,Title as title,URL as url,BoundingBox as boundingbox,Topic as topic from layerlist where " + 
    		"ID in" + 
    		"<foreach item='item' collection='layerIdArray' separator=',' open='(' close=')' index=''>" + 
    		"      #{item, jdbcType=NUMERIC}" + 
    		"    </foreach>" +
    		"</script>")
    List<LayerList_temp> getLayerListById(@Param("layerIdArray") Integer[] layerIdArray);

}
