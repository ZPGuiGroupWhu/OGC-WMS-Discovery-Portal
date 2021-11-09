package com.gsv.querywmslist.querywmslist.commons;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class ObjectSimilarity implements Comparable<ObjectSimilarity>{
	
	private Integer id;
	private Float similarity;
	
	@Override
	public int compareTo(ObjectSimilarity arg0) {
		// TODO Auto-generated method stub
//		return this.similarity > arg0.getSimilarity() ? 1 : -1;
		return this.similarity.compareTo(arg0.getSimilarity());
	}
	
}
