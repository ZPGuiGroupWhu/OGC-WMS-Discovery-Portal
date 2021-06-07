package com.gsv.querywmslist.querywmslist.commons;


public class Similarity {
	
	public static int hammingDistance(String x, String y) {
		int num = 0;
		if(x.length() != y.length()) {
			return Integer.MAX_VALUE;
		}
		for(int i = 0; i < x.length(); i++) {
			if(x.charAt(i) == y.charAt(i)) {
				num ++;
			}
		}
		return num;
	}
	public static int hammingDistance(Integer[] x, Integer[] y) {
		int num = 0;
		if(x.length != y.length) {
			return Integer.MAX_VALUE;
		}
		for(int i = 0; i < x.length; i++) {
			num += hammingDistance(x[i], y[i]);
		}
		return num;
	}
	public static int hammingDistance(int x, int y) {
		int num = 0;
		x = x ^ y;
		while(x != 0) {
			num ++;
			x = x & (x - 1);
		}
		return num;
	}
}
