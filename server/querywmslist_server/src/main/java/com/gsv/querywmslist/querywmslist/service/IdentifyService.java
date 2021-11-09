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
        try{
            // 将field数组转化为以','为间隔的字符串
            recUser.transformFieldToString();

            identifyMapper.registerInUserinf(recUser);
            Integer newUserID = recUser.getUserID();
            System.out.println("New inserted data ID: "+newUserID);
            identifyMapper.registerInUserauth(newUserID, "email", recUser.getEmail(), recUser.getPassword(), "True", null);
            identifyMapper.registerInUserauth(newUserID, "username", recUser.getUsername(), recUser.getPassword(), "True", null);
/*
            Integer newUserID = user.getUserID();
            System.out.println("New inserted data ID: "+newUserID);
*/
            response.setErrCode(0);
            response.setReqMsg("Register successfully.");
        }catch (Exception e){
            System.out.println(e);
            response.setErrCode(1002);
            response.setReqMsg("Service request failed. Please try again later!");
        }
        return response;
    }

    // 检查表中某个字段的值是否重复(true为重复，false为不重复）
    public Response valueIsRepeat(String property, String value){
        Response response=new Response();
        try{
            Integer propertyStatus = identifyMapper.propertyIsNull(property);
            if(propertyStatus == 1){
                Integer valueStatus = identifyMapper.valueIsRepeat(property,value);
                if(valueStatus == 0){
                    response.setResBody(false);
                }
                else {
                    response.setResBody(true);
                }
                response.setErrCode(0);
                response.setReqMsg("Request successfully.");
            }
            else if (propertyStatus == 0){
                response.setErrCode(1001);
                response.setReqMsg("Property is not existing in the database. Please try another.");
            }
        }catch (Exception e){
            System.out.println(e);
            response.setErrCode(1002);
            response.setReqMsg("Service request failed. Please try again later!");
        }
        return response;
    }

    // 用户登录
    public Response login(RecUser recUser){
        Response response=new Response();
        try{
            RecUser retUserInf;
            if (recUser.getLoginType().equals("email")){
                retUserInf = identifyMapper.login(recUser.getLoginType(),recUser.getEmail(), recUser.getPassword());
            }else if (recUser.getLoginType().equals("username")) {
                retUserInf = identifyMapper.login(recUser.getLoginType(), recUser.getUsername(), recUser.getPassword());
            }else{
                throw new Exception("loginType is illegal! Please check it again.");
            }

            if (retUserInf == null){
                response.setErrCode(1001);
                response.setReqMsg("Identifier and password mismatched.Please input correct account.");
            }
            else{
                response.setErrCode(0);
                response.setReqMsg("Login Successfully.");
                // 将用户信息返回给前端(recUser --> retUser)
                RetUser retUser = new RetUser();
                retUser.setUserID(retUserInf.getUserID());
                retUser.setUsername(retUserInf.getUsername());
                retUser.setAvatar(retUserInf.getAvatar());
                retUser.setEmail(retUserInf.getEmail());
                retUser.setCareer(retUserInf.getCareer());
                retUser.setField(retUserInf.transformNewfieldToArray());
                response.setResBody(retUser);
            }
        }catch (Exception e){
            // System.out.println(e);
            response.setErrCode(1002);
            response.setReqMsg(String.valueOf(e));
        }
        return response;
    }

    // 找回密码
    public Response reFindPas(String reFindType, String identifier){
        Response response=new Response();
        try{
            if (!reFindType.equals("email") && !reFindType.equals("username")){
                throw new Exception("reFindPasswordType is illegal! Please check it again.");
            }
            String password = identifyMapper.reFindPas(reFindType, identifier);
            if (password == null){
                response.setErrCode(1001);
                response.setReqMsg("Can not find this identifier in the database.Please input correct account.");
            }
            else{
                response.setErrCode(0);
                response.setReqMsg("Request successfully.");
                response.setResBody(password);
            }
        }catch (Exception e){
            // System.out.println(e);
            response.setErrCode(1002);
            response.setReqMsg(String.valueOf(e));
        }
        return response;
    }
}
