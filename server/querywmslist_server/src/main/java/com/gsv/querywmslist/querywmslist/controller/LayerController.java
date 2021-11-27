package com.gsv.querywmslist.querywmslist.controller;

import java.util.List;

import com.alibaba.fastjson.JSON;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

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
        @ApiImplicitParam(name = "pageNum",value = "输入请求页面编号,1表示第一页",required = true),
        @ApiImplicitParam(name = "pageSize",value = "输入每页的数据条数",required = true)
	})
	public String getLayerList(String keywords, float[] bound, String topic,Integer pageNum, Integer pageSize) {
		// MultiLayersResponse
		
		MultiLayersResponse response = new MultiLayersResponse();
		
		// TODO 错误类型分类不够细致，如可细分为代码运行错误、返回为空、参数错误等
		try {
			// 查询
			List<LayerWithFloatBBox> layersWithFloatBBox = layerService.getLayerList(keywords, bound, topic, pageNum, pageSize);
			Integer totalLayerNum = layerService.getLayerListNum(keywords, bound, topic);
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
            @ApiImplicitParam(name = "pageSize",value = "输入每页的数据条数",required = true)
    })
    public String getLayerList(Integer[] templateId, Integer pageNum, Integer pageSize){
		// MultiLayersResponse
    	MultiLayersResponse response = new MultiLayersResponse();
    	
    	try {
    		SearchLayerByTempleteResult searchResult = layerService.getLayerListByTemplateId(templateId, pageNum, pageSize);
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
    @GetMapping("/search/queryLayerInfo")
    @ApiOperation(value = "根据id进行查询")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id",value = "输入id", required = true),
    })
    public String queryLayerInfo(Integer id){
		// LayerWithWMSResponse

		LayerWithWMSResponse response = new LayerWithWMSResponse();
    	try {
    		LayerWithWMS data = layerService.getLayerInfo(id);
    		response.setData(data);
    		response.setErrCode(0);
    	} catch(Exception e) {
			response.setErrCode(1002);
			response.setReqMsg("出现错误");
		}

		String result=JSON.toJSONString(response);
    	return result;
    }
}
