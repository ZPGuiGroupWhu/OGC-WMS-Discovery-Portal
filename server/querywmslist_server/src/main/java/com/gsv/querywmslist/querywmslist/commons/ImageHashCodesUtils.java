package com.gsv.querywmslist.querywmslist.commons;


import java.awt.image.BufferedImage;
import java.awt.Color;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.concurrent.TimeUnit;
import java.util.Base64;
import java.util.Base64.Decoder;
import java.util.Base64.Encoder;

import javax.imageio.ImageIO;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.mathworks.toolbox.javabuilder.MWException;
import com.mathworks.toolbox.javabuilder.MWNumericArray;

import MCPkg.MC;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;

public class ImageHashCodesUtils {
	
	private static MC mc;
	private static OkHttpClient client = new OkHttpClient.Builder()
			.connectTimeout(100, TimeUnit.SECONDS)
			.readTimeout(100, TimeUnit.SECONDS)
			.writeTimeout(100, TimeUnit.SECONDS)
			.build();
//	private static String imageBase64DecodeURL = "http://127.0.0.1:5000/imageBase64Decode";
	private static String hashCodesURL = "http://127.0.0.1:5000/process/getImageHashcodes";
	
	public static double[][][] imageJSONStr2DoubleArray(String imageJSONStr){
		JSONArray imageData = JSON.parseArray(imageJSONStr);
		double[][][] result = imageJSON2DoubleArray(imageData);
		return result;
	}
	
	public static double[][][] imageJSON2DoubleArray(JSONArray imageData){
		double[][][] result = new double[imageData.size()][][];
		for(int i = 0; i < imageData.size(); i++) {
			JSONArray jsonarr1 = (JSONArray)imageData.get(i);
			double[][] arr1 = new double[jsonarr1.size()][];
			for(int j = 0; j < jsonarr1.size(); j++) {
				JSONArray jsonarr2 = (JSONArray)jsonarr1.get(j);
				double[] arr2 = new double[jsonarr2.size()];
				for(int k = 0; k < jsonarr2.size(); k++) {
					double value = jsonarr2.getDoubleValue(k);
					arr2[k] = value;
				}
				arr1[j] = arr2;
			}
			result[i] = arr1;
		}
		return result;
	}
	
	
	public static int[][][] doubleArray2intArray(double[][][] array) {
		int[][][] result = new int[array.length][][];
		for(int i = 0; i < array.length; i++) {
			int[][] arr1 = new int[array[i].length][];
			for(int j = 0; j < array[i].length; j++) {
				int[] arr2 = new int[array[i][j].length];
				for(int k = 0; k < array[i][j].length; k++) {
					int value = (int)array[i][j][k];
					arr2[k] = value;
				}
				arr1[j] = arr2;
			}
			result[i] = arr1;
		}
		return result;
	}
	
	
	public static double[][][] intArray2doubleArray(int[][][] array) {
		double[][][] result = new double[array.length][][];
		for(int i = 0; i < array.length; i++) {
			double[][] arr1 = new double[array[i].length][];
			for(int j = 0; j < array[i].length; j++) {
				double[] arr2 = new double[array[i][j].length];
				for(int k = 0; k < array[i][j].length; k++) {
					double value = array[i][j][k];
					arr2[k] = value;
				}
				arr1[j] = arr2;
			}
			result[i] = arr1;
		}
		return result;
	}
	
	public static double[][] getMainPartMC(double[][][] image) throws MWException{

		if(mc == null) {
//			System.out.println("#############3");
			mc = new MC();
		}
		
//		long time0 = System.currentTimeMillis();
		Object[] result = mc.GetMC(1, image);
//		long time1 = System.currentTimeMillis();
		MWNumericArray mwArray = (MWNumericArray)result[0];
		double[][] mainpart_MC = (double[][])mwArray.toDoubleArray();
		return mainpart_MC;
	}
	
	public static int[][] getMainPartMCInt(double[][][] image) throws MWException {
		
		double[][] mainpart_MC = getMainPartMC(image);
		int[][] result = new int[mainpart_MC.length][];
		for(int i = 0; i < mainpart_MC.length; i++) {
			int[] tmpRowValues = new int[mainpart_MC[i].length];
			for(int j = 0; j < mainpart_MC[i].length; j++) {
				tmpRowValues[j] = (int)(mainpart_MC[i][j] * 255);
			}
			result[i] = tmpRowValues;
		}
		return result;
	}
	
	
//	public static double[][][][] imageBase64Strs2DoubleArray(String imageBase64Strs) throws IOException{
//		okhttp3.RequestBody body = okhttp3.RequestBody.create(MediaType.parse("application/json; charset=utf-8"), imageBase64Strs);
//		okhttp3.Request request = new okhttp3.Request.Builder()
//				.post(body)
//                .url(imageBase64DecodeURL)
//                .build();
//		
//		//通过client发起请求
//		okhttp3.Response response = client.newCall(request).execute();
//		String imageJSONStrs = response.body().string();
//		JSONArray imagesData = JSON.parseArray(imageJSONStrs);
//		
//		double[][][][] result = new double[imagesData.size()][][][];
//		for(int i = 0; i < imagesData.size(); i++) {
//			JSONArray jsonarr1 = (JSONArray)imagesData.get(i);
//			result[i] = imageJSON2DoubleArray(jsonarr1);
//		}
//		return result;
//	}
	
	public static int[][] getHashCodes(double[][][][] images, double[][][] mainpart_MCs)  throws IOException{
		// build json str
		JSONArray jsonArray = new JSONArray();
		for(int i = 0; i < images.length; i++) {
			JSONArray tmpImageJSONArray = new JSONArray();
			tmpImageJSONArray.add(images[i]);
			tmpImageJSONArray.add(mainpart_MCs[i]);
			jsonArray.add(tmpImageJSONArray);
		}
		String jsonStr = JSON.toJSONString(jsonArray);
		
		// get hashcodes
		okhttp3.RequestBody body = okhttp3.RequestBody.create(MediaType.parse("application/json; charset=utf-8"), jsonStr);
		okhttp3.Request request = new okhttp3.Request.Builder()
				.post(body)
                .url(hashCodesURL)
                .build();
		
		//通过client发起请求
		okhttp3.Response response = client.newCall(request).execute();
		String hashcodesStr = response.body().string();
		JSONArray hashcodesJSONArray = JSON.parseArray(hashcodesStr);
		
		int[][] result = new int[hashcodesJSONArray.size()][];
		for(int i = 0; i < hashcodesJSONArray.size(); i++) {
			JSONArray jsonarr1 = (JSONArray)hashcodesJSONArray.get(i);
			int[] tmpHashcode = new int[jsonarr1.size()];
			for(int j = 0; j < jsonarr1.size(); j++) {
				tmpHashcode[j] = jsonarr1.getIntValue(j);
			}
			result[i] = tmpHashcode;
		}
		return result;
	}
	
	public static BufferedImage array2Image(int[][] array) {
		// 获取数组宽度和高度
		int width = array[0].length;
		int height = array.length;
		// 将数据写入BufferedImage
		BufferedImage bf = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
		  

		// 将二维数组转换为一维数组
		int[] data = new int[width * height];
		for(int i = 0; i < height; i++) {
			for(int j = 0; j < width; j++) {
				int value = array[i][j];
				int tmp_rgb = new Color(value, value, value).getRGB();
				data[i * width + j] = tmp_rgb;
//				bf.setRGB(i, j, tmp_rgb);
			}
		}
		bf.setRGB(0, 0, width, height, data, 0, width);
		return bf;	
	}
	
	
	public static BufferedImage array2Image(int[][][] array) {
		// 获取数组宽度和高度
		int width = array[0].length;
		int height = array.length;
		// 将数据写入BufferedImage
		BufferedImage bf = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
		  

		// 将二维数组转换为一维数组
		int[] data = new int[width * height];
		for(int i = 0; i < height; i++) {
			for(int j = 0; j < width; j++) {
				int r = array[i][j][0];
				int g = array[i][j][1];
				int b = array[i][j][2];
				int tmp_rgb = new Color(r, g, b).getRGB();
				data[i * width + j] = tmp_rgb;
//				bf.setRGB(i, j, tmp_rgb);
			}
		}
		bf.setRGB(0, 0, width, height, data, 0, width);
		return bf;
	}

	
	
	public static String bufferedImage2Base64Str(BufferedImage image) throws IOException{
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		ImageIO.write(image, "jpg", baos);
		byte[] bytes = baos.toByteArray();
		Encoder encoder = Base64.getEncoder();
		String imageBase64Str = encoder.encodeToString(bytes);
		return imageBase64Str;
	}
	
	
	public static double[][][] cvtImageRGBToArray(BufferedImage image){
		int height = image.getHeight();
		int width = image.getWidth();
		double[][][] result = new double[height][width][3];
		for(int i = 0; i < height; i++) {
			double[][] tmpArray = new double[width][];
			for(int j = 0; j < width; j++) {
				int rgb = image.getRGB(j, i);
//				System.out.println(rgb);
				Color color = new Color(rgb);
				int r = color.getRed();
				int g = color.getGreen();
				int b = color.getBlue();
				tmpArray[j] = new double[] {r, g, b};
			}
			result[i] = tmpArray;
		}
		return result;
	}
	
	
	public static BufferedImage base64StrToBufferedImage(String base64Str) throws IOException {
		Decoder decoder = Base64.getDecoder();
		byte[] bytes = decoder.decode(base64Str);
		ByteArrayInputStream bais = new ByteArrayInputStream(bytes);
		return ImageIO.read(bais);
	}
	
	
	public static int[][] getHashCodes(JSONArray imageBase64Strs, JSONArray mainpartMCBase64Strs)  throws IOException{
		// build json str
		JSONArray jsonArray = new JSONArray();
		for(int i = 0; i < imageBase64Strs.size(); i++) {
			JSONArray tmpImageJSONArray = new JSONArray();
			tmpImageJSONArray.add(imageBase64Strs.get(i));
			tmpImageJSONArray.add(mainpartMCBase64Strs.get(i));
			jsonArray.add(tmpImageJSONArray);
		}
		String jsonStr = JSON.toJSONString(jsonArray);
		
		// get hashcodes
		okhttp3.RequestBody body = okhttp3.RequestBody.create(MediaType.parse("application/json; charset=utf-8"), jsonStr);
		okhttp3.Request request = new okhttp3.Request.Builder()
				.post(body)
                .url(hashCodesURL)
                .build();
		
		//通过client发起请求
		okhttp3.Response response = client.newCall(request).execute();
		String hashcodesStr = response.body().string();
		JSONArray hashcodesJSONArray = JSON.parseArray(hashcodesStr);
		
		int[][] result = new int[hashcodesJSONArray.size()][];
		for(int i = 0; i < hashcodesJSONArray.size(); i++) {
			JSONArray jsonarr1 = (JSONArray)hashcodesJSONArray.get(i);
			int[] tmpHashcode = new int[jsonarr1.size()];
			for(int j = 0; j < jsonarr1.size(); j++) {
				tmpHashcode[j] = jsonarr1.getIntValue(j);
			}
			result[i] = tmpHashcode;
		}
		return result;
	}
	
	
	public static int[][] getHashCodes(JSONArray imageBase64Strs, JSONArray mainpartMCBase64Strs, JSONArray mainpartRGBase64Strs)  throws IOException{
		// build json str
		JSONArray jsonArray = new JSONArray();
		for(int i = 0; i < imageBase64Strs.size(); i++) {
			JSONArray tmpImageJSONArray = new JSONArray();
			tmpImageJSONArray.add(imageBase64Strs.get(i));
			tmpImageJSONArray.add(mainpartMCBase64Strs.get(i));
			tmpImageJSONArray.add(mainpartRGBase64Strs.get(i));
			jsonArray.add(tmpImageJSONArray);
		}
		String jsonStr = JSON.toJSONString(jsonArray);
		
		// get hashcodes
		okhttp3.RequestBody body = okhttp3.RequestBody.create(MediaType.parse("application/json; charset=utf-8"), jsonStr);
		okhttp3.Request request = new okhttp3.Request.Builder()
				.post(body)
                .url(hashCodesURL)
                .build();
		
		//通过client发起请求
		okhttp3.Response response = client.newCall(request).execute();
		String hashcodesStr = response.body().string();
//		System.out.println(hashcodesStr);
		JSONArray hashcodesJSONArray = JSON.parseArray(hashcodesStr);
		
		int[][] result = new int[hashcodesJSONArray.size()][];
		for(int i = 0; i < hashcodesJSONArray.size(); i++) {
			JSONArray jsonarr1 = (JSONArray)hashcodesJSONArray.get(i);
			int[] tmpHashcode = new int[jsonarr1.size()];
			for(int j = 0; j < jsonarr1.size(); j++) {
				tmpHashcode[j] = jsonarr1.getIntValue(j);
			}
			result[i] = tmpHashcode;
		}
		return result;
	}
}
