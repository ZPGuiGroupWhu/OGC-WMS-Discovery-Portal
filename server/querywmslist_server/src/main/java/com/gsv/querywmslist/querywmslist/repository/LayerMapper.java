package com.gsv.querywmslist.querywmslist.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.gsv.querywmslist.querywmslist.dao.Layer;


@Mapper
public interface LayerMapper {
	/*
	    单一数据库版本
	 */
	//    @Select("<script>" +
//            "SELECT l.ID as id, l.ServiceID as serviceId, l.Abstract as abstr, l.Attribution as attribution, l.Keywords as keywords, " +
//    		"l.`Name` as name, l.Title as title, l.URL as url, l.BoundingBox as boundingbox, l.Topic as topic, l.ImagePath as imagePath, p.Image as photo " +
//            "from ${table} l inner join photos p on l.ID = p.LayerID " +
//            "<if test='keywordsNew!=null and  keywordsNew != \"\" ' >" +
//            " AND MATCH ( Title, Abstract, `Name`, Attribution, Keywords, URL ) AGAINST ( #{keywordsNew} )" +
//            "</if>  " +
//            "<if test='polygon!=null and polygon!=\"\"'> " +
//            // 这里将(Box,ST_GeomFromText('${polygon}', 4326))"中的4326去掉了，默认为0
//            // 这样在比较时基于迪卡尔坐标系，而不是WGS84，效果应该不变
//            "and MBRCONTAINS (Box,ST_GeomFromText('${polygon}'))" +
//            "</if>" +
//            "<if test='topicArray!=null and topicArray[0]!=null'>  " +
//            "and (<foreach collection='topicArray' item='item' index='index' separator='and'> " +
//            "LOWER(Topic) like CONCAT('%',#{item},'%')" +
//            "</foreach> )" +
//            "</if>  " +
//            "ORDER BY id " +
//            "limit #{fromRowNum}, #{pageSize}" +
//    		"</script>")
//    List<Layer> getLayers(@Param("keywordsNew") String keywordsNew, @Param("polygon") String Polygon,
//						  @Param("topicArray")String [] topicArray,  @Param("table") String table,
//						  @Param("fromRowNum") Integer fromRowNum, @Param("pageSize") Integer pageSize);

//	@Select("<script>" +
//			"SELECT count(ID) " +
//			"from layerlist where 1=1  " +
//			"<if test='keywordsNew!=null and  keywordsNew != \"\" ' >" +
//			" AND MATCH ( Title, Abstract, `Name`, Attribution, Keywords, URL) AGAINST ( #{keywordsNew} )" +
//			"</if>  " +
//			"<if test='polygon!=null and polygon!=\"\"'> " +
//			// 这里将(Box,ST_GeomFromText('${polygon}', 4326))"中的4326去掉了，默认为0
//			// 这样在比较时基于迪卡尔坐标系，而不是WGS84，效果应该不变
//			"and MBRCONTAINS (Box,ST_GeomFromText('${polygon}'))" +
//			"</if>" +
//			"<if test='topicArray!=null and topicArray[0]!=null'>  " +
//			"and (<foreach collection='topicArray' item='item' index='index' separator='and'> " +
//			"LOWER(Topic) like CONCAT('%',#{item},'%')" +
//			"</foreach> )" +
//			"</if>  " +
//			"</script>")
//	Integer getLayersNum(@Param("keywordsNew") String keywordsNew, @Param("polygon") String Polygon,
//						 @Param("topicArray")String [] topicArray);

//	@Select("<script>" +
//			"select ID as id,Abstract as abstr, ServiceID as serviceId, Attribution as attribution,Keywords as keywords," +
//			"`Name` as name,Title as title,URL as url,BoundingBox as boundingbox,Topic as topic, ImagePath as imagePath " +
//			" from layerlist where " +
//			"ID in" +
//			"<foreach item='item' collection='layerIdArray' separator=',' open='(' close=')' index=''>" +
//			"      #{item, jdbcType=NUMERIC}" +
//			"    </foreach>" +
//			"</script>")
//	List<Layer> getLayersWithoutPhotoByIdArray(@Param("layerIdArray") Integer[] layerIdArray);

//	@Select("<script>" +
//			"select la.ID as id, la.Abstract as abstr, la.ServiceID as serviceId, la.Attribution as attribution, la.Keywords as keywords, " +
//			"la.`Name` as name, la.Title as title, la.URL as url, la.BoundingBox as boundingbox, la.Topic as topic, la.ImagePath as imagePath, ph.Image as photo " +
//			"from layerlist la inner join photos ph on la.ID = ph.LayerID and la.ID in" +
//			"<foreach item='item' collection='layerIdArray' separator=',' open='(' close=')' index=''>" +
//			"      #{item, jdbcType=NUMERIC}" +
//			"    </foreach>" +
//			"</script>")
//	List<Layer> getLayersByIdArray(@Param("layerIdArray") Integer[] layerIdArray);

//	@Select("<script>" +
//			"select l.ID as id, l.Abstract as abstr, l.ServiceID as serviceId, l.Attribution as attribution, l.Keywords as keywords, " +
//			"l.`Name` as name, l.Title as title, l.URL as url, l.BoundingBox as boundingbox, l.Topic as topic, l.ImagePath as imagePath, p.Image as photo " +
//			"from layerlist l inner join photos p on l.ID = p.LayerID and " +
//			"serviceId = #{serviceId} " +
//			"</script>")
//	List<Layer> getLayersByServiceId(@Param("serviceId") Integer serviceId);
//
//	@Select("<script>" +
//			"SELECT l.ID as id, l.ServiceID as serviceId, l.Abstract as abstr, l.Attribution as attribution, l.Keywords as keywords, " +
//			"l.`Name` as name, l.Title as title, l.URL as url, l.BoundingBox as boundingbox, l.Topic as topic, p.Image as photo " +
//			"from layerlist l inner join photos p on l.ID = p.LayerID " +
//			"<if test='keywordsNew!=null and  keywordsNew != \"\" ' >" +
//			" AND MATCH ( Title, Abstract, `Name`, Attribution, Keywords, URL ) AGAINST ( +#{keywordsNew} )"  + "</if>  " +
//			"</script>")
//	List<Layer> getLayersbySubIntention(@Param("keywordsNew") String keywordsNew);

	/*
    多数据库版本
    */
	@Select("<script>" +
			"<if test='table!=\"layerlist_for_intent\" ' >" +
			"SELECT l.ID as id, l.ServiceID as serviceId, l.Abstract as abstr, l.Attribution as attribution, l.Keywords as keywords, " +
			"l.`Name` as name, l.Title as title, l.URL as url, l.BoundingBox as boundingbox, l.Topic as topic, l.ImagePath as imagePath, p.Image as photo " +
			"from layerlist l inner join photos p on l.ID = p.LayerID " +
			"<if test='keywordsNew!=null and  keywordsNew != \"\" ' >" +
			" AND MATCH ( Title, Abstract, `Name`, Attribution, Keywords, URL ) AGAINST ( #{keywordsNew} )" +
			"</if>  " +
			"<if test='polygon!=null and polygon!=\"\"'> " +
			// 这里将(Box,ST_GeomFromText('${polygon}', 4326))"中的4326去掉了，默认为0
			// 这样在比较时基于迪卡尔坐标系，而不是WGS84，效果应该不变
			"and MBRCONTAINS (Box,ST_GeomFromText('${polygon}'))" +
			"</if>" +
			"<if test='topicArray!=null and topicArray[0]!=null'>  " +
			"and (<foreach collection='topicArray' item='item' index='index' separator='and'> " +
			"LOWER(Topic) like CONCAT('%',#{item},'%')" +
			"</foreach> )" +
			"</if>  " +
			"ORDER BY id " +
			"limit #{fromRowNum}, #{pageSize}" +
			"</if>" +
			"" +
			"<if test='table==\"layerlist_for_intent\" '>" +
			"SELECT l.ID as id, l.ServiceID as serviceId, l.Abstract as abstr, l.Attribution as attribution, l.Keywords as keywords, " +
			"l.`Name` as name, l.Title as title, l.URL as url, l.BoundingBox as boundingbox, l.Topic as topic, l.ImagePath as imagePath, " +
			"l.FContent as FContent, l.FSpace as FSpace, l.FStyle as FStyle, l.topic as FTopic, p.Image as photo " +
			"from layerlist_for_intent l inner join photos p on l.ID = p.LayerID " +
			"<if test='keywordsNew!=null and  keywordsNew != \"\" ' >" +
			" AND MATCH ( Title, Abstract, `Name`, Attribution, Keywords, URL, FContent, FSpace, FTopic, FStyle ) AGAINST ( #{keywordsNew} )" +
			"</if>  " +
			"<if test='polygon!=null and polygon!=\"\"'> " +
			// 这里将(Box,ST_GeomFromText('${polygon}', 4326))"中的4326去掉了，默认为0
			// 这样在比较时基于迪卡尔坐标系，而不是WGS84，效果应该不变
			"and MBRCONTAINS (Box,ST_GeomFromText('${polygon}'))" +
			"</if>" +
			"<if test='topicArray!=null and topicArray[0]!=null'>  " +
			"and (<foreach collection='topicArray' item='item' index='index' separator='and'> " +
			"LOWER(Topic) like CONCAT('%',#{item},'%')" +
			"</foreach> )" +
			"</if>  " +
			"ORDER BY id " +
			"limit #{fromRowNum}, #{pageSize}" +
			"</if>" +
			"</script>")
	List<Layer> getLayers(@Param("keywordsNew") String keywordsNew, @Param("polygon") String Polygon,
						  @Param("topicArray")String [] topicArray,  @Param("table") String table,
						  @Param("fromRowNum") Integer fromRowNum, @Param("pageSize") Integer pageSize);

	@Select("<script>" +
			"<if test='table!=\"layerlist_for_intent\" ' >" +
			"SELECT count(ID) " +
			"from layerlist where 1=1  " +
			"<if test='keywordsNew!=null and  keywordsNew != \"\" ' >" +
			" AND MATCH ( Title, Abstract, `Name`, Attribution, Keywords, URL) AGAINST ( #{keywordsNew} )" +
			"</if>  " +
			"<if test='polygon!=null and polygon!=\"\"'> " +
			// 这里将(Box,ST_GeomFromText('${polygon}', 4326))"中的4326去掉了，默认为0
			// 这样在比较时基于迪卡尔坐标系，而不是WGS84，效果应该不变
			"and MBRCONTAINS (Box,ST_GeomFromText('${polygon}'))" +
			"</if>" +
			"<if test='topicArray!=null and topicArray[0]!=null'>  " +
			"and (<foreach collection='topicArray' item='item' index='index' separator='and'> " +
			"LOWER(Topic) like CONCAT('%',#{item},'%')" +
			"</foreach> )" +
			"</if>  " +
			"</if>  " +
			"" +
			"<if test='table==\"layerlist_for_intent\" '>" +
			"SELECT count(ID) " +
			"from layerlist_for_intent where 1=1  " +
			"<if test='keywordsNew!=null and  keywordsNew != \"\" ' >" +
			" AND MATCH ( Title, Abstract, `Name`, Attribution, Keywords, URL, FContent, FSpace, FStyle, FTopic) AGAINST ( #{keywordsNew} )" +
			"</if>  " +
			"<if test='polygon!=null and polygon!=\"\"'> " +
			// 这里将(Box,ST_GeomFromText('${polygon}', 4326))"中的4326去掉了，默认为0
			// 这样在比较时基于迪卡尔坐标系，而不是WGS84，效果应该不变
			"and MBRCONTAINS (Box,ST_GeomFromText('${polygon}'))" +
			"</if>" +
			"<if test='topicArray!=null and topicArray[0]!=null'>  " +
			"and (<foreach collection='topicArray' item='item' index='index' separator='and'> " +
			"LOWER(Topic) like CONCAT('%',#{item},'%')" +
			"</foreach> )" +
			"</if>  " +
			"</if>" +
			"</script>")
	Integer getLayersNum(@Param("keywordsNew") String keywordsNew, @Param("polygon") String Polygon,
						 @Param("topicArray")String [] topicArray, @Param("table") String table);

    @Select("<script>" +
            "SELECT ID as id, ServiceID as serviceId, Abstract as abstr, Attribution as attribution, Keywords as keywords, " + 
    		"`Name` as name, Title as title, URL as url, BoundingBox as boundingbox, Topic as topic, ImagePath as imagePath from layerlist where 1=1 " + 
            "<if test='keywordsNew!=null and  keywordsNew != \"\" ' >" +
            " AND MATCH ( Title, Abstract, `Name`, Attribution, Keywords, URL ) AGAINST ( #{keywordsNew} )" +
            "</if>  " +
            "<if test='polygon!=null and polygon!=\"\"'> " +
            // 这里将(Box,ST_GeomFromText('${polygon}', 4326))"中的4326去掉了，默认为0
            // 这样在比较时基于迪卡尔坐标系，而不是WGS84，效果应该不变
            "and MBRCONTAINS (Box,ST_GeomFromText('${polygon}'))" +
            "</if>" +
            "<if test='topicArray!=null and topicArray[0]!=null'>  " +
            "and (<foreach collection='topicArray' item='item' index='index' separator='and'> " +
            "LOWER(Topic) like CONCAT('%',#{item},'%')" +
            "</foreach> )" +
            "</if>  " +
            "ORDER BY id " +
            "limit #{fromRowNum}, #{pageSize}" + 
    		"</script>")
    List<Layer> getLayersWithoutPhoto(@Param("keywordsNew") String keywordsNew, @Param("polygon") String Polygon,
									  @Param("topicArray")String [] topicArray, @Param("fromRowNum") Integer fromRowNum, @Param("pageSize") Integer pageSize);


    @Select("<script>" +
			"<if test='table!=\"layerlist_for_intent\" ' >" +
			"select ID as id,Abstract as abstr, ServiceID as serviceId, Attribution as attribution,Keywords as keywords," +
			"`Name` as name,Title as title,URL as url,BoundingBox as boundingbox,Topic as topic, ImagePath as imagePath " +
			" from layerlist where " +
			"ID in" +
			"<foreach item='item' collection='layerIdArray' separator=',' open='(' close=')' index=''>" +
			"      #{item, jdbcType=NUMERIC}" +
			"    </foreach>" +
			"</if>" +
			"" +
			"<if test='table==\"layerlist_for_intent\" '>" +
    		"select ID as id,Abstract as abstr, ServiceID as serviceId, Attribution as attribution,Keywords as keywords," +
			"`Name` as name,Title as title,URL as url,BoundingBox as boundingbox,Topic as topic, ImagePath as imagePath, " +
			"FContent as FContent, FSpace as FSpace, FStyle as FStyle, FTopic as FTopic from layerlist_for_intent where " +
    		"ID in" + 
    		"<foreach item='item' collection='layerIdArray' separator=',' open='(' close=')' index=''>" + 
    		"      #{item, jdbcType=NUMERIC}" + 
    		"    </foreach>" +
			"</if>" +
    		"</script>")
    List<Layer> getLayersWithoutPhotoByIdArray(@Param("layerIdArray") Integer[] layerIdArray, @Param("table") String table);


    // 使用嵌套结果方式实现连接查询
    @Select("<script>" +
			"<if test='table!=\"layerlist_for_intent\" ' >" +
    		"select la.ID as id, la.Abstract as abstr, la.ServiceID as serviceId, la.Attribution as attribution, la.Keywords as keywords, " + 
    		"la.`Name` as name, la.Title as title, la.URL as url, la.BoundingBox as boundingbox, la.Topic as topic, la.ImagePath as imagePath, ph.Image as photo from layerlist la inner join photos ph on la.ID = ph.LayerID and " +
    		"la.ID in" + 
    		"<foreach item='item' collection='layerIdArray' separator=',' open='(' close=')' index=''>" + 
    		"      #{item, jdbcType=NUMERIC}" + 
    		"    </foreach>" +
			"</if>" +
			"" +
			"<if test='table==\"layerlist_for_intent\" '>" +
			"select la.ID as id, la.Abstract as abstr, la.ServiceID as serviceId, la.Attribution as attribution, la.Keywords as keywords, " +
			"la.`Name` as name, la.Title as title, la.URL as url, la.BoundingBox as boundingbox, la.Topic as topic, la.ImagePath as imagePath, " +
			"ph.Image as photo, la.FContent as FContent, la.FSpace as FSpace, la.FTopic as FTopic, la.FStyle as FStyle from layerlist_for_intent la inner join photos ph on la.ID = ph.LayerID and " +
			"la.ID in" +
			"<foreach item='item' collection='layerIdArray' separator=',' open='(' close=')' index=''>" +
			"      #{item, jdbcType=NUMERIC}" +
			"    </foreach>" +
			"</if>" +
    		"</script>")
    List<Layer> getLayersByIdArray(@Param("layerIdArray") Integer[] layerIdArray, @Param("table") String table);
    
    
    @Select("<script>" + 
    		"select l.ID as id, l.Abstract as abstr, l.ServiceID as serviceId, l.Attribution as attribution, l.Keywords as keywords, " + 
    		"l.`Name` as name, l.Title as title, l.URL as url, l.BoundingBox as boundingbox, l.Topic as topic, l.ImagePath as imagePath, p.Image as photo " + 
    		"from layerlist l inner join photos p on l.ID = p.LayerID and " + 
    		"serviceId = #{serviceId} " +
    		"</script>")
    List<Layer> getLayersByServiceId(@Param("serviceId") Integer serviceId);

	@Select("<script>" +
			"SELECT l.ID as id, l.ServiceID as serviceId, l.Abstract as abstr, l.Attribution as attribution, l.Keywords as keywords, " +
			"l.`Name` as name, l.Title as title, l.URL as url, l.BoundingBox as boundingbox, l.Topic as topic, l.ImagePath as imagePath, " +
			"l.FContent as FContent, l.FSpace as FSpace, l.FStyle as FStyle, l.FTopic as FTopic, p.Image as photo " +
			"from layerlist_for_intent l inner join photos p on l.ID = p.LayerID " +
			"<if test='content!=null and  content != \"\" ' >" +
			" AND FContent like CONCAT('%',#{content},'%')"  +
			"</if> " +
			"<if test='space!=null and  space != \"\" ' >" +
			" AND FSpace like CONCAT('%',#{space},'%')"  +
			"</if> " +
			"<if test='style!=null and  style != \"\" ' >" +
			" AND FStyle like CONCAT('%',#{style},'%')"  +
			"</if> " +
			"<if test='topic!=null and  topic != \"\" ' >" +
			" AND FTopic like CONCAT('%',#{topic},'%')"  +
			"</if> " +
			"</script>")
	List<Layer> getLayersbySubIntention(@Param("content") String content, @Param("space") String space, @Param("style") String style, @Param("topic") String topic);

	@Select("<script>" +
			"<if test='table!=\"layerlist_for_intent\" ' >" +
			"SELECT ID " +
			"from layerlist where 1=1  " +
			"<if test='keywordsNew!=null and  keywordsNew != \"\" ' >" +
			" AND MATCH ( Title, Abstract, `Name`, Attribution, Keywords, URL) AGAINST ( #{keywordsNew} )" +
			"</if>  " +
			"<if test='polygon!=null and polygon!=\"\"'> " +
			// 这里将(Box,ST_GeomFromText('${polygon}', 4326))"中的4326去掉了，默认为0
			// 这样在比较时基于迪卡尔坐标系，而不是WGS84，效果应该不变
			"and MBRCONTAINS (Box,ST_GeomFromText('${polygon}'))" +
			"</if>" +
			"<if test='topicArray!=null and topicArray[0]!=null'>  " +
			"and (<foreach collection='topicArray' item='item' index='index' separator='and'> " +
			"LOWER(Topic) like CONCAT('%',#{item},'%')" +
			"</foreach> )" +
			"</if>  " +
			"</if>  " +
			"" +
			"<if test='table==\"layerlist_for_intent\" '>" +
			"SELECT ID " +
			"from layerlist_for_intent where 1=1  " +
			"<if test='keywordsNew!=null and  keywordsNew != \"\" ' >" +
			" AND MATCH ( Title, Abstract, `Name`, Attribution, Keywords, URL, FContent, FSpace, FStyle, FTopic) AGAINST ( #{keywordsNew} )" +
			"</if>  " +
			"<if test='polygon!=null and polygon!=\"\"'> " +
			// 这里将(Box,ST_GeomFromText('${polygon}', 4326))"中的4326去掉了，默认为0
			// 这样在比较时基于迪卡尔坐标系，而不是WGS84，效果应该不变
			"and MBRCONTAINS (Box,ST_GeomFromText('${polygon}'))" +
			"</if>" +
			"<if test='topicArray!=null and topicArray[0]!=null'>  " +
			"and (<foreach collection='topicArray' item='item' index='index' separator='and'> " +
			"LOWER(Topic) like CONCAT('%',#{item},'%')" +
			"</foreach> )" +
			"</if>  " +
			"</if>" +
			"</script>")
	List<Integer> getLayersIDs(@Param("keywordsNew") String keywordsNew, @Param("polygon") String Polygon,
						 @Param("topicArray")String [] topicArray, @Param("table") String table);
}

