package com.gsv.querywmslist.querywmslist.commons;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class HashcodeCache {

	private Map<String, Integer[][]> cache = new HashMap<>();
	
	public void put(String sessionID, Integer[][] hashcodes) {
		cache.put(sessionID, hashcodes);
	}
	
	public Integer[][] getHashcode(String sessionID){
		return cache.get(sessionID);
	}
	
	public boolean contains(String sessionID) {
		return cache.containsKey(sessionID);
	}
	
	// TODO 需要限制缓存数量与清除过期缓存
	// 用户系统建立后，可以直接以用户ID代替sessionID
}
