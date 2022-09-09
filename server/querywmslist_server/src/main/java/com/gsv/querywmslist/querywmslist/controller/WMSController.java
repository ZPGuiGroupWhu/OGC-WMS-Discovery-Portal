package com.gsv.querywmslist.querywmslist.controller;

import com.alibaba.fastjson.JSON;
import com.gsv.querywmslist.querywmslist.commons.PhotoTransportType;
import com.gsv.querywmslist.querywmslist.dto.WMSWithContactInfo;
import com.gsv.querywmslist.querywmslist.dto.WMSWithLayer;
import com.gsv.querywmslist.querywmslist.service.WMSService;
import com.gsv.querywmslist.querywmslist.vo.MultiWMSResponse;
import com.gsv.querywmslist.querywmslist.vo.WMSWithLayerResponse;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Api(value = "wmsController",tags = "WMS接口")
public class WMSController {
	
    @Autowired
    private  WMSService wmsService;
    
    
    @CrossOrigin
    @GetMapping("/search/queryWMSList")
    @ApiOperation(value = "根据关键词、经纬度、大洲、主题、组织、组织类型进行查询")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "keywords",value = "输入与title、Abstract、keywords以及url匹配的关键词",required = false),
            @ApiImplicitParam(name = "bound",value = "输入经纬度范围",required = false),
            @ApiImplicitParam(name = "continent",value = "输入所在大洲",required = false),
            @ApiImplicitParam(name = "topic",value = "输入主题",required = false),
            @ApiImplicitParam(name = "organization",value = "输入组织",required = false),
            @ApiImplicitParam(name = "organization_type",value = "输入组织类型",required = false),
            @ApiImplicitParam(name = "table",value = "检索数据库的表名, 默认为wms表，若想使用服务于意图检索的表则取值为wms_for_intent",required = false),
            @ApiImplicitParam(name = "pageNum",value = "输入请求页面编号,1表示第一页",required = true),
            @ApiImplicitParam(name = "pageSize",value = "输入每页的数据条数",required = true)
    })
    public String getWMSList(String keywords, float[] bound, String continent, String topic,
    		String organization, String organization_type, String table, Integer pageNum, Integer pageSize){

        // MultiWMSResponse
    	MultiWMSResponse response = new MultiWMSResponse();
    	try {
            String tableName = "wms";
            if ("wms_for_intent".equals(table)) {
                tableName = "wms_for_intent";
            }
    		List<WMSWithContactInfo> wmsList = wmsService.getWMSList(keywords, bound, continent, topic, 
    				organization, organization_type, tableName, pageNum, pageSize);
    		Integer totalWMSNum = wmsService.getWMSListNum(keywords, bound, continent, topic, organization, organization_type, tableName);
    		response.setData(wmsList);
    		response.setErrCode(0);
    		response.setCurrentWMSNum(wmsList.size());
    		response.setTotalWMSNum(totalWMSNum);
    		
    	} catch(Exception e) {
    		response.setErrCode(1002);
    	}

        String result=JSON.toJSONString(response);
    	return result;
//        PageHelper.startPage(pageNum,pageSize);
//        List<WMSList> data=wmsService.getWMSList(keywords,bound,continent,topic,organization,organization_type,pageNum,pageSize);
//        PageInfo<WMSList> wmsResultPageInfo=new PageInfo<>(data);
//        WMSResult wmsResult=new WMSResult();
//        List<WMSList2>list2s=new ArrayList<>();
//        for(int i=0;i<data.size();i++){
//            WMSList origin=data.get(i);
//            WMSList2 result=new WMSList2();
//            result.setId(origin.getId());
//            result.setAbstr(origin.getAbstr());
//            result.setAdministrative_unit(origin.getAdministrative_unit());
//            result.setGeoLocation(origin);
//            result.setKeywords(origin.getKeywords());
//            result.setTitle(origin.getTitle());
//            result.setUrl(origin.getUrl());
//            result.setTopic(origin.getTopic());
//            list2s.add(result);
//        }
//        try {
//            wmsResult.setErrCode(1001);
//        }catch (Exception e){
//            wmsResult.setErrCode(1002);
//        }
//        wmsResult.setTotal((int) wmsResultPageInfo.getTotal());
//        wmsResult.setData(list2s);
//        if(wmsResult.getData()==null|| wmsResult.getTotal()==0){
//            wmsResult.setErrCode(1002);
//        }
//        return JSON.toJSONString(wmsResult);
    }
    
    @CrossOrigin
    @GetMapping("/search/queryWMSInfo")
    @ApiOperation(value = "根据id进行查询")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id",value = "输入id",required = true),
            @ApiImplicitParam(name = "photoType",value = "图层缩略图的传输类型, 默认为静态资源地址，若想使用Base64编码则取值为Base64Str",required = false)
    })
    public String getWMSInfo(Integer id, String photoType) {
    	// WMSWithLayerResponse

        WMSWithLayerResponse response = new WMSWithLayerResponse();
    	try {
    		PhotoTransportType photoTransportType = PhotoTransportType.STATIC_RESOURCE_PATH;
			if("Base64Str".equals(photoType)) {
				photoTransportType = PhotoTransportType.BASE64_STRING;
			}

            WMSWithLayer result = wmsService.getWMSInfo(id, photoTransportType);
            response.setErrCode(0);
            response.setData(result);
        }catch (Exception e){
            response.setErrCode(1002);
        }

        String result= JSON.toJSONString(response);
    	return result;
    }
}
