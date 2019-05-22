package com.gsv.querywmslist.querywmslist.commons;

import com.gsv.querywmslist.querywmslist.bean.LayerList_temp;
import com.gsv.querywmslist.querywmslist.bean.singleWms.LayerOrigin;
import sun.misc.BASE64Encoder;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ImageDemo {

    // 将图片插入数据库
    public static void readImage2DB() {
        File file=new File("E:\\GSV_project\\WMSLayer_image");
        File[] tempList=file.listFiles();
        Connection conn = null;
        PreparedStatement ps = null;
        FileInputStream in = null;
        try {
            for(int i=0;i<tempList.length;i++){
                in = ImageUtil.readImage(tempList[i]);
                conn = DBUtil.getConn();
                String sql = "insert into photo (name,photo)values(?,?)";
                ps = conn.prepareStatement(sql);
//                ps.setInt(1, i+1);
                ps.setInt(1, Integer.parseInt(tempList[i].getName().substring(0,tempList[i].getName().length()-4)));
                ps.setBinaryStream(2, in, in.available());
                ps.executeUpdate();
//                int count = ps.executeUpdate();
//                if (count > 0) {
//                    System.out.println("插入成功！");
//                } else {
//                    System.out.println("插入失败！");
//                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBUtil.closeConn(conn);
            if (null != ps) {
                try {
                    ps.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }

    }

    // 读取数据库中图片
    public static List<LayerList_temp> readLayerList(List<LayerList_temp> layerList_temps1) {
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        String result="";
        List<LayerList_temp> layerList_temps=new ArrayList<>();
        try {
//            conn = DBUtil.getConn();
//            StringBuffer sql=new StringBuffer("SELECT id,photo,Abstract as abstr,Attribution as attribution,Keywords as keywords,`Name` as name,Title as title,URL as url,BoundingBox as boundingbox,imagePath,Topic as topic from layerlist where 1=1 ");
//            if(keywordsNew!=null) {
//                sql.append(" and (Title LIKE CONCAT('%',?,'%') " +
//                    "OR Abstract like CONCAT('%',?,'%') " +
//                    "OR `Name` LIKE CONCAT('%',?,'%') " +
//                    "OR Attribution LIKE CONCAT('%',?,'%') " +
//                    "OR Keywords like CONCAT('%',?,'%'))" );
//            }
//            if(topicArray[0]!=null){
//                        for(int i=0;i<topicArray.length;i++){
//                            sql.append(" and  Topic like CONCAT('%',?,'%')");
//                        }
//                    }
//                   sql.append("ORDER BY id");
//            ps = conn.prepareStatement(sql.toString());
//            if(keywordsNew!=null){
//                ps.setString(1,keywordsNew);
//                ps.setString(2,keywordsNew);
//                ps.setString(3,keywordsNew);
//                ps.setString(4,keywordsNew);
//                ps.setString(5,keywordsNew);
//                if(topicArray[0]!=null){
//                    for(int j=0;j<topicArray.length;j++){ps.setString(6+j,topicArray[j]);}
//                }
//            }
//            else  if(topicArray[0]!=null){
//                for(int j=0;j<topicArray.length;j++){ps.setString(1+j,topicArray[j]);}
//            }

            conn = DBUtil.getConn();
            for(int m=0;m<layerList_temps1.size();m++) {
                String sql = "select photo from photos where name=?";
                ps = conn.prepareStatement(sql);
                ps.setInt(1, layerList_temps1.get(m).getId());
                rs = ps.executeQuery();

                while (rs.next()) {
                    InputStream in = rs.getBinaryStream("photo");
                    ByteArrayOutputStream output = new ByteArrayOutputStream();
                    byte[] buffer = new byte[100];
                    int n = 0;
                    while (-1 != (n = in.read(buffer))) {
                        output.write(buffer, 0, n);
                    }
                    result = new BASE64Encoder().encode(output.toByteArray()).replaceAll("\\r\\n","");
                    output.close();
                    LayerList_temp layerList_temp = new LayerList_temp();
//                    layerList_temp.setAbstr(rs.getString("abstr"));
//                    layerList_temp.setAttribution(rs.getString("attribution"));
//                    layerList_temp.setBoundingbox(rs.getString("boundingbox"));
//                    layerList_temp.setId(rs.getInt("id"));
//                    layerList_temp.setImagepath(rs.getString("imagePath"));
//                    layerList_temp.setKeywords(rs.getString("keywords"));
//                    layerList_temp.setName(rs.getString("name"));
//                    layerList_temp.setTitle(rs.getString("title"));
//                    layerList_temp.setTopic(rs.getString("topic"));
//                    layerList_temp.setUrl(rs.getString("url"));
//                    layerList_temp.setPhoto(result);
                    layerList_temp.setAbstr(layerList_temps1.get(m).getAbstr());
                    layerList_temp.setAttribution(layerList_temps1.get(m).getAttribution());
                    layerList_temp.setBoundingbox(layerList_temps1.get(m).getBoundingbox());
                    layerList_temp.setId(layerList_temps1.get(m).getId());
                    layerList_temp.setKeywords(layerList_temps1.get(m).getKeywords());
                    layerList_temp.setName(layerList_temps1.get(m).getName());
                    layerList_temp.setTitle(layerList_temps1.get(m).getTitle());
                    layerList_temp.setTopic(layerList_temps1.get(m).getTopic());
                    layerList_temp.setUrl(layerList_temps1.get(m).getUrl());
                    layerList_temp.setPhoto(result);
                    layerList_temps.add(layerList_temp);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBUtil.closeConn(conn);
            if (rs != null) {
                try {
                    rs.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }

        }
    return layerList_temps;}

    // 读取数据库中单个图层图片
    public static List<LayerOrigin> readLayer(List<LayerOrigin> layerOrigins) {
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        String result="";
        List<LayerOrigin> layerList_temps=new ArrayList<>();
        try {

            conn = DBUtil.getConn();
            for(int m=0;m<layerOrigins.size();m++) {
                String sql = "select photo from photos where name=?";
                ps = conn.prepareStatement(sql);
                ps.setInt(1, layerOrigins.get(m).getId());
                rs = ps.executeQuery();

                while (rs.next()) {
                    InputStream in = rs.getBinaryStream("photo");
                    ByteArrayOutputStream output = new ByteArrayOutputStream();
                    byte[] buffer = new byte[100];
                    int n = 0;
                    while (-1 != (n = in.read(buffer))) {
                        output.write(buffer, 0, n);
                    }
                    result = new BASE64Encoder().encode(output.toByteArray()).replaceAll("\\r\\n","");
                    output.close();
                    LayerOrigin layerOrigin = new LayerOrigin();
                    layerOrigin.setAbstr(layerOrigins.get(m).getAbstr());
                    layerOrigin.setAttribution(layerOrigins.get(m).getAttribution());
                    layerOrigin.setBoundingbox(layerOrigins.get(m).getBoundingbox());
                    layerOrigin.setId(layerOrigins.get(m).getId());
                    layerOrigin.setKeywords(layerOrigins.get(m).getKeywords());
                    layerOrigin.setName(layerOrigins.get(m).getName());
                    layerOrigin.setTitle(layerOrigins.get(m).getTitle());
                    layerOrigin.setTopic(layerOrigins.get(m).getTopic());
                    layerOrigin.setUrl(layerOrigins.get(m).getUrl());
                    layerOrigin.setPhoto(result);
                    layerList_temps.add(layerOrigin);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBUtil.closeConn(conn);
            if (rs != null) {
                try {
                    rs.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }

        }
        return layerList_temps;}
    // 读取数据库中单个图层图片 singleLayer
    public static LayerOrigin readSingleLayer(LayerOrigin layerOrigin) {
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        String result="";
        LayerOrigin layerOrigin1 = new LayerOrigin();
        try {

            conn = DBUtil.getConn();
                String sql = "select photo from photos where name=?";
                ps = conn.prepareStatement(sql);
                ps.setInt(1, layerOrigin.getId());
                rs = ps.executeQuery();

                while (rs.next()) {
                    InputStream in = rs.getBinaryStream("photo");
                    ByteArrayOutputStream output = new ByteArrayOutputStream();
                    byte[] buffer = new byte[100];
                    int n = 0;
                    while (-1 != (n = in.read(buffer))) {
                        output.write(buffer, 0, n);
                    }
                    result = new BASE64Encoder().encode(output.toByteArray()).replaceAll("\\r\\n","");
                    output.close();

                    layerOrigin1.setAbstr(layerOrigin.getAbstr());
                    layerOrigin1.setAttribution(layerOrigin.getAttribution());
                    layerOrigin1.setBoundingbox(layerOrigin.getBoundingbox());
                    layerOrigin1.setId(layerOrigin.getId());
                    layerOrigin1.setKeywords(layerOrigin.getKeywords());
                    layerOrigin1.setName(layerOrigin.getName());
                    layerOrigin1.setTitle(layerOrigin.getTitle());
                    layerOrigin1.setTopic(layerOrigin.getTopic());
                    layerOrigin1.setUrl(layerOrigin.getUrl());
                    layerOrigin1.setPhoto(result);
                }


        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBUtil.closeConn(conn);
            if (rs != null) {
                try {
                    rs.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }

        }
        return layerOrigin1;}

}