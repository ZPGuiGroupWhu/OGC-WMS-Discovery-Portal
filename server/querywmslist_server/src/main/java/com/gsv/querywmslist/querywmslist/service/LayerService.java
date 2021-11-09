package com.gsv.querywmslist.querywmslist.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gsv.querywmslist.querywmslist.commons.ObjectSimilarity;
import com.gsv.querywmslist.querywmslist.commons.Similarity;
import com.gsv.querywmslist.querywmslist.commons.TransformUtil;
import com.gsv.querywmslist.querywmslist.dao.ContactInfo;
import com.gsv.querywmslist.querywmslist.dao.HashCode;
import com.gsv.querywmslist.querywmslist.dao.Layer;
import com.gsv.querywmslist.querywmslist.dao.WMS;
import com.gsv.querywmslist.querywmslist.dto.LayerWithFloatBBox;
import com.gsv.querywmslist.querywmslist.dto.LayerWithWMS;
import com.gsv.querywmslist.querywmslist.repository.ContactInfoMapper;
import com.gsv.querywmslist.querywmslist.repository.HashCodeMapper;
import com.gsv.querywmslist.querywmslist.repository.LayerMapper;
import com.gsv.querywmslist.querywmslist.repository.WMSMapper;

@Service
public class LayerService {


	@Autowired private LayerMapper layerMapper;
	@Autowired private WMSMapper wmsMapper;
	@Autowired private ContactInfoMapper contactInfoMapper;
	@Autowired private HashCodeMapper hashcodeMapper;
	
	private Map<Integer, Integer[]> hashcodes;
	private Long createAt;
	
	
	public LayerService() {
		this.createAt = System.currentTimeMillis();
	}
	
	
    // 初始化 从数据库中读取所有图片的哈希码
    private void initBydatabase(){
		this.hashcodes = new HashMap<Integer, Integer[]>();
		List<HashCode> tmp_hashcodes=hashcodeMapper.getHashCode();

		for (HashCode tmp_hashcode:tmp_hashcodes){
			tmp_hashcode.getHashCode();
			this.hashcodes.put(tmp_hashcode.id,tmp_hashcode.hashcode);
		}
	}
    
    
    /*
     * 根据样例图片查询
     */
    public List<LayerWithFloatBBox> getLayerListByTemplateId(Integer[] templateId, Integer pageNum, Integer pageSize) {
    	
    	
    	if(this.hashcodes == null) {
    		initBydatabase();
    	}
    	List<ObjectSimilarity> similarities = new ArrayList <ObjectSimilarity> ();
    	List<Integer[]> templateHashCodes = new ArrayList<>();
    	
    	for(Integer tmp_templateId : templateId) {
    		templateHashCodes.add(this.hashcodes.get(tmp_templateId));
    	}

    	// 计算图片库中每张图片与样例图片的64位哈希码的平均汉明距离，然后过滤得到相似度大于32的图片id
    	this.hashcodes.forEach((k, v) -> {
    		Float simi = 0f;
    		for(Integer[] tmp_templateHashcode : templateHashCodes) {
        		Float tmp_simi = new Float(Similarity.hammingDistance(v, tmp_templateHashcode));
        		simi += tmp_simi;
    		}

    		// 通过排除差异较大的图片减少内存使用，认为如果汉明距离i小于32就不相似了，32为64位哈希码的一半
    		if(simi / templateHashCodes.size() < 32f ) {
        		similarities.add(new ObjectSimilarity(k, simi));
    		}
    	});
    	
    	// 将图片按照相似度由大到小排序
    	Collections.sort(similarities);
    	// 根据页码数确定结果图层ID
    	int start = (pageNum - 1) * pageSize;
    	int layerNum = Math.min(pageSize, similarities.size() - start);
    	Integer[] layerIdArray = new Integer[layerNum];
    	for(int i = start; i < Math.min(start + pageSize, similarities.size()); i++) {
    		layerIdArray[i - start] = similarities.get(i).getId();
    	}

    	// 查询Layer
    	List<Layer> layers = layerMapper.getLayersByIdArray(layerIdArray);
    	
    	// 转换BBox字段
    	List<LayerWithFloatBBox> layersWithFloatBBox = layers.stream().map(layer -> 
    			TransformUtil.layerToLayerWithFloatBBox(layer)).collect(Collectors.toList());
    	
    	return layersWithFloatBBox;
    }
    
    
    public List<LayerWithFloatBBox>  getLayerList(String keywords, float[] bound, String topic, Integer pageNum, Integer pageSize){
        
        // 参数预处理
        keywords = (keywords == null) ? keywords : keywords.toLowerCase();
        String polygon = new String();
        if(bound != null) {
            float maxLat, maxLon, minLat, minLon;
            minLon = bound[0];
            maxLon = bound[1];
            minLat = bound[2];
            maxLat = bound[3];
            polygon = "Polygon((" + 
            		maxLat + " " + minLon + "," + 
                    maxLat + " " + maxLon + "," + 
                    minLat + " " + maxLon + "," +
                    minLat + " " + minLon + "," +
                    maxLat + " " + minLon + "))";
            //从左上角开始顺时针写矩形，矩形第一个点和最后一个点必须一致
        } else {
            polygon = "";
        }
        String[] topicArray = (topic == null) ? null : topic.toLowerCase().split(",");
        
        Integer fromRowNum = (pageNum - 1) * pageSize;
        List<Layer> layers = layerMapper.getLayers(keywords, polygon, topicArray, fromRowNum, pageSize);
        
        // 转换BBox字段
    	List<LayerWithFloatBBox> layersWithFloatBBox = layers.stream().map(layer -> 
    			TransformUtil.layerToLayerWithFloatBBox(layer)).collect(Collectors.toList());
        
        return layersWithFloatBBox;
    }
    
    
    public LayerWithWMS getLayerInfo(Integer layerId) {
    	Integer[] layerIdArray = {layerId};
    	List<Layer> layers = layerMapper.getLayersByIdArray(layerIdArray);
    	
    	if(layers.isEmpty()) {
    		return null;
    	}
    	
    	Layer layer = layers.get(0);
    	WMS wms = wmsMapper.getWMSById(layer.getServiceId());
    	ContactInfo contactInfo = contactInfoMapper.getContactInfoByServiceId(layer.getServiceId());

    	LayerWithWMS layerWithWMS = TransformUtil.mergeLayerAndWMSAndContactInfo(layer, wms, contactInfo);
    	
    	return layerWithWMS;
    	
    }
    
}
