package com.gsv.querywmslist.querywmslist.controller;

import com.alibaba.fastjson.JSON;
import com.gsv.querywmslist.querywmslist.bean.Response;
import com.gsv.querywmslist.querywmslist.bean.RecUser;
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
            Response response=identifyService.registerRes(recUser);
            String result= JSON.toJSONString(response);
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
            Response response=identifyService.valueIsRepeat(property,value);
            String result= JSON.toJSONString(response);
            return result;
      }

      // 用户登录POST接口
      @CrossOrigin
      @ResponseBody
      @PostMapping("/identify/login")
      @ApiOperation(value = "用户登录")
       public String login(@RequestBody RecUser recUser){
             Response response=identifyService.login(recUser);
             String result=JSON.toJSONString(response);
             return result;
      }

      // 找回密码GET接口
      @CrossOrigin
      @GetMapping("/identify/reFindPas")
      @ApiOperation(value = "找回密码")
      @ApiImplicitParams({
              @ApiImplicitParam (name="reFindType", value= "输入找回密码的方式（username or email）", required = true),
              @ApiImplicitParam (name="identifier", value= "输入用户身份标识", required = true),})
      public String reFindPas(String reFindType, String identifier){
            Response response=identifyService.reFindPas(reFindType,identifier);
            String result= JSON.toJSONString(response);
            return result;
      }

}
