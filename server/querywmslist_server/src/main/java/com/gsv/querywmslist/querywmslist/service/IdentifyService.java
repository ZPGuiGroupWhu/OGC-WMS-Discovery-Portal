package com.gsv.querywmslist.querywmslist.service;

import com.gsv.querywmslist.querywmslist.bean.Response;
import com.gsv.querywmslist.querywmslist.dao.RecUser;
import com.gsv.querywmslist.querywmslist.dao.RetUser;
import com.gsv.querywmslist.querywmslist.repository.IdentifyMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class IdentifyService {
    @Autowired
    IdentifyMapper identifyMapper;

    // 注册响应
    public Response registerRes(RecUser recUser){
        Response response=new Response();

        // 将field数组转化为以','为间隔的字符串
        recUser.transformFieldToString();

        identifyMapper.registerInUserinf(recUser);
        Integer newUserID = recUser.getUserID();
        // System.out.println("New inserted data ID: "+newUserID);
        identifyMapper.registerInUserauth(newUserID, "email", recUser.getEmail(), recUser.getPassword(), "True", null);
        identifyMapper.registerInUserauth(newUserID, "username", recUser.getUsername(), recUser.getPassword(), "True", null);

        return response;
    }

    // 检查表中某个字段的值是否重复(true为重复，false为不重复）
    public boolean valueIsRepeat (String property, String value) throws IllegalArgumentException{

        Integer propertyStatus = identifyMapper.propertyIsNull(property);
        if(propertyStatus==1){
            Integer valueStatus = identifyMapper.valueIsRepeat(property,value);
            if(valueStatus==0){
                return false;
            }
            else{
                return true;
            }
        }
        else {
            // 该字段在数据库中不存在，抛出异常
            throw new IllegalArgumentException("Property is not existing in the database. Please try another.");
        }

    }

    // 用户登录
    public RetUser login(RecUser recUser) throws IllegalArgumentException,NoSuchFieldException{
        RecUser retUserInf;
        if (recUser.getLoginType().equals("email")){
            retUserInf = identifyMapper.login(recUser.getLoginType(),recUser.getEmail(), recUser.getPassword());
        }else if (recUser.getLoginType().equals("username")) {
            retUserInf = identifyMapper.login(recUser.getLoginType(), recUser.getUsername(), recUser.getPassword());
        }else{
            throw new IllegalArgumentException("LoginType is illegal! Please check it again.");
        }

        if(retUserInf == null){
            throw new NoSuchFieldException("LoginType is illegal! Please check it again.");
        }else{
            RetUser retUser = new RetUser();
            retUser.setUserID(retUserInf.getUserID());
            retUser.setUsername(retUserInf.getUsername());
            retUser.setAvatar(retUserInf.getAvatar());
            retUser.setEmail(retUserInf.getEmail());
            retUser.setCareer(retUserInf.getCareer());
            retUser.setField(retUserInf.transformNewfieldToArray());

            return retUser;
        }

    }

    // 找回密码
    public String findPwd(String findType, String identifier) throws IllegalArgumentException,NoSuchFieldException{

        // 找回密码的方式不符合要求
        if (!findType.equals("email") && !findType.equals("username")){
            throw new IllegalArgumentException("FindPasswordType is illegal! Please check it again.");
        }

        String password = identifyMapper.findPwd(findType, identifier);
        if (password == null){
            // 数据库中不存在该账户
            throw new NoSuchFieldException("Can not find this identifier in the database.Please input correct account.");
        }
        else{
            return password;
        }
    }
}
