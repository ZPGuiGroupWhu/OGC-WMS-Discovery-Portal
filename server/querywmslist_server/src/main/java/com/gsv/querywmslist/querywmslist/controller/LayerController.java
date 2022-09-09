package com.gsv.querywmslist.querywmslist.controller;

import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.gsv.querywmslist.querywmslist.commons.IntentionUtils;
import com.gsv.querywmslist.querywmslist.dao.Intention;
import com.gsv.querywmslist.querywmslist.vo.MultiLayersIntentionResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.gsv.querywmslist.querywmslist.commons.PhotoTransportType;
import com.gsv.querywmslist.querywmslist.dto.LayerWithFloatBBox;
import com.gsv.querywmslist.querywmslist.dto.LayerWithWMS;
import com.gsv.querywmslist.querywmslist.dto.SearchLayerByTempleteResult;
import com.gsv.querywmslist.querywmslist.service.LayerService;
import com.gsv.querywmslist.querywmslist.vo.LayerWithWMSResponse;
import com.gsv.querywmslist.querywmslist.vo.MultiLayersResponse;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

@RestController
@Api(value = "LayerController",tags = "layer接口")
public class LayerController {

	@Autowired
	private LayerService layerService;
	
	
	@CrossOrigin
	@GetMapping("/search/queryLayerList")
	@ApiOperation(value = "根据关键词及主题进行查询")
	@ApiImplicitParams({
        @ApiImplicitParam(name = "keywords",value = "输入与Name，Title，Abstract，Attribution，Keywords匹配的关键词",required = false),
        @ApiImplicitParam(name = "bound",value = "输入经纬度范围",required = false),
        @ApiImplicitParam(name = "topic",value = "输入主题",required = false),
		@ApiImplicitParam(name = "table",value = "检索数据库的表名, 默认为layerlist表，若想使用服务于意图检索的表则取值为layerlist_for_intent",required = false),
        @ApiImplicitParam(name = "pageNum",value = "输入请求页面编号,1表示第一页",required = true),
        @ApiImplicitParam(name = "pageSize",value = "输入每页的数据条数",required = true),
		@ApiImplicitParam(name = "photoType",value = "图层缩略图的传输类型, 默认为静态资源地址，若想使用Base64编码则取值为Base64Str",required = false)
	})
	public String getLayerList(String keywords, float[] bound, String topic,Integer pageNum, Integer pageSize, String photoType, String table) {
		// MultiLayersResponse
		
		MultiLayersResponse response = new MultiLayersResponse();
		
		// TODO 错误类型分类不够细致，如可细分为代码运行错误、返回为空、参数错误等
		try {
			PhotoTransportType photoTransportType = PhotoTransportType.STATIC_RESOURCE_PATH;
			String tableName = "layerlist";
			if("Base64Str".equals(photoType)) {
				photoTransportType = PhotoTransportType.BASE64_STRING;
			}
			if ("layerlist_for_intent".equals(table)) {
				tableName = "layerlist_for_intent";
			}
			// 查询
			List<LayerWithFloatBBox> layersWithFloatBBox = layerService.getLayerList(keywords, bound, topic, tableName, pageNum, pageSize,
					photoTransportType);
			Integer totalLayerNum = layerService.getLayerListNum(keywords, bound, topic, tableName);
			response.setErrCode(0);
			response.setTotalLayerNum(totalLayerNum);
			response.setCurrentLayerNum(layersWithFloatBBox.size());
			response.setData(layersWithFloatBBox);
		} catch(Exception e) {
			response.setErrCode(1002);
			response.setReqMsg("出现错误");
		}

		String result= JSON.toJSONString(response);
		return result;
	}
	
	
    @CrossOrigin
    @GetMapping(value = "/search/queryLayerByTemplate")
    @ResponseBody
    @ApiOperation(value = "根据数据库中已有样例图片查询")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "templateId",value = "样例图片的id，支持多张图片",required = true),
            @ApiImplicitParam(name = "pageNum",value = "输入请求页面编号,1表示第一页",required = true),
            @ApiImplicitParam(name = "pageSize",value = "输入每页的数据条数",required = true),
            @ApiImplicitParam(name = "photoType",value = "图层缩略图的传输类型, 默认为静态资源地址，若想使用Base64编码则取值为Base64Str",required = false),
			@ApiImplicitParam(name = "table",value = "检索数据库的表名, 默认为layerlist表，若想使用服务于意图检索的表则取值为layerlist_for_intent",required = false)
    })
    public String getLayerList(Integer[] templateId, Integer pageNum, Integer pageSize, String photoType, String table){
		// MultiLayersResponse
    	MultiLayersResponse response = new MultiLayersResponse();
    	
    	try {
    		PhotoTransportType photoTransportType = PhotoTransportType.STATIC_RESOURCE_PATH;
			String tableName = "layerlist";
			if("Base64Str".equals(photoType)) {
				photoTransportType = PhotoTransportType.BASE64_STRING;
			}
			if ("layerlist_for_intent".equals(table)) {
				tableName = "layerlist_for_intent";
			}
			
    		SearchLayerByTempleteResult searchResult = layerService.getLayerListByTemplateId(templateId, pageNum, pageSize, photoTransportType, tableName);
    		List<LayerWithFloatBBox> layersWithFloatBBox = searchResult.getLayers();
    		response.setErrCode(0);
			response.setTotalLayerNum(searchResult.getTotalLayerNum());
			response.setCurrentLayerNum(layersWithFloatBBox.size());
			response.setData(layersWithFloatBBox);
    	} catch(Exception e) {
			response.setErrCode(1002);
			response.setReqMsg("出现错误");
		}

		String result=JSON.toJSONString(response);
    	return result;
    }
	
    @CrossOrigin
    @RequestMapping(value = "/search/queryLayerByUploadedTemplate", method = RequestMethod.POST)
    @ResponseBody
    @ApiOperation(value = "根据用户上传的样例图片查询")
    @ApiImplicitParams({
    		@ApiImplicitParam(name = "sessionID",value = "当前会话标识符，取值为空表示当前会话的第一次检索",required = false),
            @ApiImplicitParam(name = "images",value = "使用Base64编码的多张样例图片",required = false),
            @ApiImplicitParam(name = "pageNum",value = "输入请求页面编号,1表示第一页",required = false),
            @ApiImplicitParam(name = "pageSize",value = "输入每页的数据条数",required = false),
			@ApiImplicitParam(name = "photoType",value = "图层缩略图的传输类型, 默认为静态资源地址，若想使用Base64编码则取值为Base64Str",required = false),
			@ApiImplicitParam(name = "table",value = "检索数据库的表名, 默认为layerlist表，若想使用服务于意图检索的表则取值为layerlist_for_intent",required = false)
    })
    public String getLayerList(@RequestBody Map<String, Object> data){
    	
		// MultiLayersResponse
    	MultiLayersResponse response = new MultiLayersResponse();
    	
    	try {
    		// get parameters
        	String imageBase64Strs = String.valueOf(data.get("images"));
        	String sessionID = String.valueOf(data.get("sessionID"));
        	Integer pageNum = Integer.parseInt(String.valueOf(data.get("pageNum")));
        	Integer pageSize = Integer.parseInt(String.valueOf(data.get("pageSize")));
        	String photoType = String.valueOf(data.get("photoType"));
        	String table = String.valueOf(data.get("table"));

        	PhotoTransportType photoTransportType = PhotoTransportType.STATIC_RESOURCE_PATH;
			String tableName = "layerlist";
			if("Base64Str".equals(photoType)) {
				photoTransportType = PhotoTransportType.BASE64_STRING;
			}
			if ("layerlist_for_intent".equals(table)) {
				tableName = "layerlist_for_intent";
			}
//        	System.out.println("imageBase64Strs: " + imageBase64Strs);
//        	System.out.println("sessionID: " + sessionID);
//        	System.out.println("pageNum: " + pageNum);
//        	System.out.println("pageSize: " + pageSize);
    		SearchLayerByTempleteResult searchResult = layerService.getLayerListByTemplateUploaded(sessionID, imageBase64Strs, pageNum, pageSize, photoTransportType, tableName);
    		if(searchResult == null) {
    			response.setErrCode(1002);
    			response.setReqMsg("hashcode generation failure");
    		} else {
    			List<LayerWithFloatBBox> layersWithFloatBBox = searchResult.getLayers();
        		response.setErrCode(0);
    			response.setTotalLayerNum(searchResult.getTotalLayerNum());
    			response.setCurrentLayerNum(layersWithFloatBBox.size());
    			response.setData(layersWithFloatBBox);
    			response.setSessionID(searchResult.getSessionID());
    		}
    	} catch(Exception e) {
    		e.printStackTrace();
			response.setErrCode(1002);
			response.setReqMsg("出现错误");
		}
		String result=JSON.toJSONString(response);
    	return result;
    }

    @CrossOrigin
    @GetMapping("/search/queryLayerInfo")
    @ApiOperation(value = "根据id进行查询")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id",value = "输入id", required = true),
			@ApiImplicitParam(name = "photoType",value = "图层缩略图的传输类型, 默认为静态资源地址，若想使用Base64编码则取值为Base64Str",required = false),
			@ApiImplicitParam(name = "table",value = "检索数据库的表名, 默认为layerlist表，若想使用服务于意图检索的表则取值为layerlist_for_intent",required = false)
    })
    public String queryLayerInfo(Integer id, String photoType, String table){
		// LayerWithWMSResponse

		LayerWithWMSResponse response = new LayerWithWMSResponse();
    	try {
    		PhotoTransportType photoTransportType = PhotoTransportType.STATIC_RESOURCE_PATH;
			String tableName = "layerlist";
			if("Base64Str".equals(photoType)) {
				photoTransportType = PhotoTransportType.BASE64_STRING;
			}
			if ("layerlist_for_intent".equals(table)) {
				tableName = "layerlist_for_intent";
			}
			
    		LayerWithWMS data = layerService.getLayerInfo(id, photoTransportType, tableName);
    		response.setData(data);
    		response.setErrCode(0);
    	} catch(Exception e) {
			response.setErrCode(1002);
			response.setReqMsg("出现错误");
		}

		String result=JSON.toJSONString(response);
    	return result;
    }

	@CrossOrigin
	@ResponseBody
	@PostMapping("/search/queryLayerByMDL")
	@ApiOperation(value = "根据意图样本ID进行查询")
	public String getIntentionLayerIdsLayerList(@RequestBody Map<String, Object> data) {


		MultiLayersIntentionResponse response = new MultiLayersIntentionResponse();

		// TODO 错误类型分类不够细致，如可细分为代码运行错误、返回为空、参数错误等
		try {
			PhotoTransportType photoTransportType = PhotoTransportType.STATIC_RESOURCE_PATH;
			if("Base64Str".equals(data.get("photoType"))) {
				photoTransportType = PhotoTransportType.BASE64_STRING;
			}
			String sessionID = (String) data.get("sessionID");
			Map<String,Object> layers = (Map<String, Object>) data.get("layers");
			Map<String,Object> parameter = (Map<String, Object>) data.get("parameter");
			SearchLayerByTempleteResult searchResult
					= layerService.getLayerListByIntentionLayerIds(sessionID,layers,parameter, (Integer) data.get("pageNum"), (Integer) data.get("pageSize"), photoTransportType);
			List<LayerWithFloatBBox> layersWithFloatBBox = searchResult.getLayers();
			Map<String,Object> mapIntention= layerService.getIntentionByLayerIds(layers,parameter);
			System.out.println(mapIntention);
			response.setSessionID(searchResult.getSessionID());
			response.setErrCode(0);
			response.setTotalLayerNum(searchResult.getTotalLayerNum());
			response.setCurrentLayerNum(layersWithFloatBBox.size());
			response.setData(layersWithFloatBBox);
			response.setIntention(mapIntention);

		} catch(Exception e) {
			response.setErrCode(1002);
			response.setReqMsg("出现错误");
		}

		String result= JSON.toJSONString(response);
		return result;
	}


	@CrossOrigin
	@RequestMapping(value = "/search/queryLayerByIntention", method = RequestMethod.POST)
	@ResponseBody
	@ApiOperation(value = "根据意图进行查询")
	public String getIntentionLayerList(@RequestBody Map<String, Object> data) {


		MultiLayersResponse response = new MultiLayersResponse();

		// TODO 错误类型分类不够细致，如可细分为代码运行错误、返回为空、参数错误等
		try {
			PhotoTransportType photoTransportType = PhotoTransportType.STATIC_RESOURCE_PATH;
			if("Base64Str".equals(data.get("photoType"))) {
				photoTransportType = PhotoTransportType.BASE64_STRING;
			}

			List<Map<String,Object>> mapIntention = (List<Map<String,Object>>) data.get("intention");

//			Intention intention =new Intention();
//			for (int i = 0; i < mapIntention.size(); i++) {
//				Map<String,Object> mapSubIntention=mapIntention.get(i);
//
//			}
////			String strIntention = String.valueOf(data.get("intention"));
////			System.out.println(strIntention);

			Intention intention =new Intention();
			intention= IntentionUtils.JSONArrayToIntention(mapIntention);
			String sessionID = String.valueOf(data.get("sessionID"));

			// 根据意图查询图层
			SearchLayerByTempleteResult searchResult
					= layerService.getLayerListByIntention(sessionID,intention, (Integer) data.get("pageNum"), (Integer) data.get("pageSize"), photoTransportType);
			List<LayerWithFloatBBox> layersWithFloatBBox = searchResult.getLayers();
			response.setSessionID(searchResult.getSessionID());
			response.setErrCode(0);
			response.setTotalLayerNum(searchResult.getTotalLayerNum());
			response.setCurrentLayerNum(layersWithFloatBBox.size());
			response.setData(layersWithFloatBBox);
		} catch(Exception e) {
			response.setErrCode(1002);
			response.setReqMsg("出现错误");
		}

		String result= JSON.toJSONString(response);
		return result;
	}
}
