package com.gsv.querywmslist.querywmslist.repository;

import com.gsv.querywmslist.querywmslist.bean.RecUser;
import org.apache.ibatis.annotations.*;

import java.util.Date;

@Mapper
public interface IdentifyMapper {
    // 新用户注册
    @Insert("INSERT into userinf(Avatar, Career, Email, Field, Username) " +
            "VALUES(#{avatar}, #{career}, #{email}, #{newField}, #{username}) ")
    @Options(useGeneratedKeys = true, keyColumn = "UserID", keyProperty = "userID")
    /**
     * useGeneratedKeys="true":使用自动生成的主键
     * keyProperty:指定主键是(javaBean的)哪个属性,这里的javabean是RecUser ,
     *             插入表中的主键值会通过调用user.setId写入到user的id属性中
     *
     *             注意：插入的主键值是通过javaBean的id获取，而不是通过方法返回值获取
     *
     * keyColumn:是数据库表中自增长主键的字段名为UserID
     * @param RecUser
     * @return void 注意这里返回空，插入的主键值不是通过return返回获取,
     * 插入表中的主键值会通过调用user.setId写入到user的id属性中
     */
    void registerInUserinf(RecUser recUser);

    @Insert("INSERT into userauth(UserID, IdentityType, Identify, Credential, IsFirstParty, LastLoginTime)" +
            "VALUES(#{UserID}, #{IdentityType}, #{Identify}, #{Credential}, #{IsFirstParty}, #{LastLoginTime})")
    @Options(useGeneratedKeys = true, keyColumn = "AuthID", keyProperty = "authID")
    void registerInUserauth(@Param("UserID")Integer userID, @Param("IdentityType")String identityType, @Param("Identify")String identify,
                            @Param("Credential")String credential, @Param("IsFirstParty")String isFirstParty, @Param("LastLoginTime") Date lastLoginTime);

    // 检查表中是否有该字段
    @Select("SELECT count(*) FROM information_schema.columns WHERE table_name = 'userinf' and column_name = #{property}")
    Integer propertyIsNull(String property);
    // 检查表中某个字段的值是否重复
    @Select("SELECT count(*) FROM userinf WHERE ${property} = #{value}")
    Integer valueIsRepeat(String property, String value);

    // 用户登录
    @Select("SELECT UserID as useID, Avatar as avatar, Career as career, Email as email, Field as newField, Username as username" +
            " FROM userinf WHERE UserID = (" +
            "SELECT UserID FROM userauth WHERE IdentityType = #{loginType} AND Identify = #{identifier} AND Credential = #{password})")
    RecUser login(String loginType,  String identifier,  String password);

    // 找回密码
    @Select("SELECT Credential as password FROM userauth WHERE IdentityType = #{RFType} AND Identify = #{identifier}")
    String reFindPas(String RFType, String identifier);
}
