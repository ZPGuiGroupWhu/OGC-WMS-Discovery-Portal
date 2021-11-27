package com.gsv.querywmslist.querywmslist.controller;

import com.alibaba.fastjson.JSON;
import com.gsv.querywmslist.querywmslist.bean.Response;
import com.gsv.querywmslist.querywmslist.dao.RecUser;
import com.gsv.querywmslist.querywmslist.dao.RetUser;
import com.gsv.querywmslist.querywmslist.service.IdentifyService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@Api(value = "identify", tags="用户身份验证接口")
public class IdentifyController {
      @Autowired
      IdentifyService identifyService;
      
      
      // 新用户注册POST接口
      @CrossOrigin
      @ResponseBody
      @PostMapping("/identify/register")
      @ApiOperation(value = "新用户注册")
      public String register(@RequestBody RecUser recUser){
            Response response=new Response();
            try{
                  identifyService.registerRes(recUser);
                  response.setErrCode(0);
                  response.setReqMsg("Register successfully.");
            }catch (Exception e){
                  System.out.println(e);
                  response.setErrCode(1002);
                  response.setReqMsg("Service request failed. Please try again later!");
            }
          String result = JSON.toJSONString(response);
          return result;
      }

      
      // 判断值是否重复GET接口
      @CrossOrigin
      @GetMapping("/identify/valueIsRepeat")
      @ApiOperation(value = "判断值是否有重复（True为有重复；False为无重复）")
      @ApiImplicitParams({
              @ApiImplicitParam (name="property", value= "输入字段名", required = true),
              @ApiImplicitParam (name="value", value= "输入字段值", required = true),})
      public String valueIsRepeat(String property, String value){
            Response response=new Response();

            try{
                  boolean res=identifyService.valueIsRepeat(property, value);
                  response.setResBody(res);
                  response.setErrCode(0);
                  response.setReqMsg("Request successfully.");

            }catch (IllegalArgumentException e){
                  System.out.println(e);
                  response.setErrCode(1001);
                  response.setReqMsg("Property is illegal. Please input correct account.");
            }catch (Exception e){
                  System.out.println(e);
                  response.setErrCode(1002);
                  response.setReqMsg("Service request failed. Please try again later!");
            }
            String result = JSON.toJSONString(response);
            return result;
      }

      
      // 用户登录POST接口
      @CrossOrigin
      @ResponseBody
      @PostMapping("/identify/login")
      @ApiOperation(value = "用户登录")
       public String login(@RequestBody RecUser recUser){
             Response response = new Response ();
             try{
                   RetUser res=identifyService.login(recUser);
                   response.setResBody(res);
                   response.setErrCode(0);
                   response.setReqMsg("Login successfully.");
             }catch(IllegalArgumentException e){
                   System.out.println(e);
                   response.setErrCode(1001);
                   response.setReqMsg("LoginType is illegal! Please check it again.");
             }catch(NoSuchFieldException e){
                   System.out.println(e);
                   response.setErrCode(1001);
                   response.setReqMsg("Identifier and password mismatched.Please input correct account.");
             }catch (Exception e){
                   System.out.println(e);
                   response.setErrCode(1002);
                   response.setReqMsg("Service request failed. Please try again later!");
             }

             String result = JSON.toJSONString(response);
             return result;
      }

      
      // 找回密码GET接口
      @CrossOrigin
      @GetMapping("/identify/findPwd")
      @ApiOperation(value = "找回密码")
      @ApiImplicitParams({
              @ApiImplicitParam (name="findType", value= "输入找回密码的方式（username or email）", required = true),
              @ApiImplicitParam (name="identifier", value= "输入用户身份标识", required = true),})
      public String findPwd(String findType, String identifier){
            Response response = new Response();

            try{
                  String res=identifyService.findPwd(findType, identifier);
                  response.setResBody(res);
                  response.setErrCode(0);
                  response.setReqMsg("Request successfully.");
            }catch(IllegalArgumentException e){
                  System.out.println(e);
                  response.setErrCode(1001);
                  response.setReqMsg("FindPasswordType is illegal! Please check it again.");
            }catch (NoSuchFieldException e){
                  System.out.println(e);
                  response.setErrCode(1001);
                  response.setReqMsg("Can not find this identifier in the database.Please input correct account.");
            }
            catch (Exception e){
                  System.out.println(e);
                  response.setErrCode(1002);
                  response.setReqMsg("Service request failed. Please try again later!");
            }

            String result = JSON.toJSONString(response);
            return result;
      }

}
