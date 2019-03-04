package com.gsv.querywmslist.querywmslist.controller;

import com.alibaba.fastjson.JSON;
import com.gsv.querywmslist.querywmslist.bean.wmsAndLayer;
import com.gsv.querywmslist.querywmslist.service.myService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
public class webController {
    @Autowired
    private myService service;
    @CrossOrigin
    @RequestMapping(value = "/search/queryWMSInfo")
    public String getWmsInfo(@RequestParam("id") String id)
    {
        wmsAndLayer err1=new wmsAndLayer();
        err1.errorCode=1001;
        err1.data=null;
        wmsAndLayer err2=new wmsAndLayer();
        err2.errorCode=1002;
        err2.data=null;

        //判断前端传递的Id是否为数字，且在规定的区间内
        try {
            Integer true_id = Integer.valueOf(id);
            if(true_id>0&&true_id<48109)
                try{//判断是否出现其他错误
                    wmsAndLayer WMLInfo=service.findByid(true_id);
                    return JSON.toJSONString(WMLInfo);//返回JSON格式
                }catch (Throwable e)
                {
                    return JSON.toJSONString(err2);
                }
            else
                return JSON.toJSONString(err1);
        }catch (NumberFormatException e)
        {
            return JSON.toJSONString(err1);
        }

    }
}
