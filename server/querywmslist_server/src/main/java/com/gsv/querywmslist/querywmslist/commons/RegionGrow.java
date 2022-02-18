package com.gsv.querywmslist.querywmslist.commons;

import java.awt.Color;
import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Stack;

import javax.imageio.ImageIO;

class Point {
	
	private int x;
	private int y;
	public Point(int x, int y) {
		this.x = x;
		this.y = y;
	}
	
	public int getX() {
		return this.x;
	}
	
	public int getY() {
		return this.y;
	}
}


public class RegionGrow {

	private static int THRESH = 10;
	private static int P = 1;
	public static int getGrayDiff(int[][] image, Point currentPoint, Point tmpPoint) {
		return Math.abs(image[currentPoint.getX()][currentPoint.getY()] - image[tmpPoint.getX()][tmpPoint.getY()]);	
	}
	
	
	public static int colorToRGB(int alpha, int red, int green, int blue) {
		int result = 0;
		result += alpha;
		result = result << 8;
		result += red;
		result = result << 8;
		result += green;
		result = result << 8;
		result += blue;
		return result;
	}
	
	public static int[][] cvtImageRGBToGray(BufferedImage image){
		int height = image.getHeight();
		int width = image.getWidth();
		int[][] grayImage = new int[height][width];
		for(int i = 0; i < height; i++) {
			for(int j = 0; j < width; j++) {
				int rgb = image.getRGB(j, i);
//				System.out.println(rgb);
				Color color = new Color(rgb);
				int r = color.getRed();
				int g = color.getGreen();
				int b = color.getBlue();
//				int r = (color >> 16) & 0xff;
//				int g = (color >> 8) & 0xff;
//				int b = color & 0xff;
				int gray = (int)(0.3 * r + 0.59 * g + 0.11 * b);
				grayImage[i][j] = gray;
			}
		}
		return grayImage;
	}
	
	public static int[][][] cvtImageRGBToArray(BufferedImage image){
		int height = image.getHeight();
		int width = image.getWidth();
		int[][][] result = new int[height][width][3];
		for(int i = 0; i < height; i++) {
			int[][] tmpArray = new int[width][];
			for(int j = 0; j < width; j++) {
				int rgb = image.getRGB(j, i);
//				System.out.println(rgb);
				Color color = new Color(rgb);
				int r = color.getRed();
				int g = color.getGreen();
				int b = color.getBlue();
				tmpArray[j] = new int[] {r, g, b};
			}
			result[i] = tmpArray;
		}
		return result;
	}
	
	/**
	 * 
	 * @param array int[height][width][band]
	 * @return
	 */
	public static int[][] cvtImageArrayRGBToGray(int[][][] array){
		int height = array.length;
		int width = array[0].length;
		int[][] grayImage = new int[height][width];
		for(int i = 0; i < height; i++) {
			for(int j = 0; j < width; j++) {
				int r = array[i][j][0];
				int g = array[i][j][1];
				int b = array[i][j][2];
				int gray = (int)(0.3 * r + 0.59 * g + 0.11 * b);
				grayImage[i][j] = gray;
			}
		}
		return grayImage;
	}
	
	public static void writeImage(int[][] grayImage, String format, String outputImagePath) throws IOException {
		int height = grayImage.length;
		int width = grayImage[0].length;
	    BufferedImage imag = new BufferedImage(width, height, BufferedImage.TYPE_BYTE_GRAY);
	    byte[] outputImagePixelData = ((DataBufferByte) imag.getRaster().getDataBuffer()).getData() ;


	    for (int y=0, pos=0 ; y < height; y++)
	        for (int x=0 ; x < width; x++, pos++)
	            outputImagePixelData[pos] = (byte) grayImage[y][x] ;
	    ImageIO.write(imag, format, new File(outputImagePath));
	}
	
	
	public static List<Point> selectConnects(int p){
		List<Point> result = new ArrayList<Point>();
		if(p != 0) {
			result = Arrays.asList(new Point(-1, -1), new Point(0, -1), new Point(1, -1), new Point(1, 0), new Point(1, 1), 
					new Point(0, 1), new Point(-1, 1), new Point(-1, 0));
		} else {
			result = Arrays.asList(new Point(0, -1), new Point(1, 0), new Point(0, 1), new Point(-1, 0));
		}
		return result;
	}
	
	public static int[][] regionGrow(int[][] image) {
		List<Point> seeds = Arrays.asList(new Point(10, 10), new Point(20, 200), new Point(20, 350), new Point(100, 370), new Point(190, 360), new Point(190, 100), 
				new Point(190, 10), new Point(100, 10));
		Stack<Point> seedList = new Stack<Point>();
		for(Point seed : seeds) {
			seedList.add(seed);
		}
		int height = image.length;
		int width = image[0].length;
		if(height < 200 || width < 400) {
			return null;
		}
		int[][] seedMark = new int[height][width];

		int label = 1;
		List<Point> connects = selectConnects(RegionGrow.P);
		while(seedList.size() > 0) {
			Point currentPoint = seedList.pop();
			seedMark[currentPoint.getX()][currentPoint.getY()] = label;
			for(int i = 0; i < connects.size(); i++) {
				Point tmpConnect = connects.get(i);
				int tmpX = currentPoint.getX() + tmpConnect.getX();
				int tmpY = currentPoint.getY() + tmpConnect.getY();
				if(tmpX < 0 || tmpY < 0 || tmpX >= height || tmpY >= width) {
					continue;
				}
				Point tmpPoint = new Point(tmpX, tmpY);
				int grayDiff = getGrayDiff(image, currentPoint, tmpPoint);
				if(grayDiff < RegionGrow.THRESH && seedMark[tmpX][tmpY] == 0) {
					seedMark[tmpX][tmpY] = label;
					seedList.add(tmpPoint);
				}
			}
		}
		for(int i = 0; i < height; i++) {
			for(int j = 0; j < width; j++) {
				if(seedMark[i][j] == 0) {
					seedMark[i][j] = 255;
				} else if(seedMark[i][j] == 1) {
					seedMark[i][j] = 0;
				}
			}
		}
		return seedMark;
	}
}
