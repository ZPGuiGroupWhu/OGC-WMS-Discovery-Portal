package com.gsv.querywmslist.querywmslist.commons;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBUtil {
    //定义数据库连接参数
    public static final String DRIVER_CLASS_NAME="com.mysql.cj.jdbc.Driver";
    public static final String URL="jdbc:mysql://127.0.0.1:3306/wmsall_0705?serverTimezone=GMT%2B8";
    public static final String USERNAME="root";
    public static final String PASSWORD ="123456";
    //注册数据库驱动
    static {
        try {
            Class.forName(DRIVER_CLASS_NAME);
        }catch (ClassNotFoundException e){
            System.out.println("注册失败");
            e.printStackTrace();
        }
    }
    //获取连接
    public static Connection getConn() throws SQLException{
        return DriverManager.getConnection(URL,USERNAME,PASSWORD);
    }
    //关闭连接
    public static void closeConn(Connection conn){
        if(null !=conn){
            try{
                conn.close();
            }catch (SQLException e){
                System.out.println("关闭连接失败！");
                e.printStackTrace();
            }
        }
    }



}
