//package com.gsv.querywmslist.querywmslist;
//
//import java.io.File;
//import java.io.FileWriter;
//import java.io.IOException;
//import java.util.ArrayList;
//import java.util.Arrays;
//import java.util.Collections;
//import java.util.Comparator;
//import java.util.List;
//
//import org.junit.Test;
//import org.junit.runner.RunWith;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.core.env.Environment;
//import org.springframework.test.context.junit4.SpringRunner;
//
//import com.gsv.querywmslist.querywmslist.bean.LayerList;
//import com.gsv.querywmslist.querywmslist.bean.LayerResult2;
//import com.gsv.querywmslist.querywmslist.service.LayerQueryService;
//
//@RunWith(SpringRunner.class)
//@SpringBootTest
//public class LayerQueryPrecisionRecallTest {
//
//	@Autowired
//	private LayerQueryService layerQueryService;
//	@Autowired
//	Environment env;
//	private String testDirPath = "/home/neo-dl/Data/project/wms image/experience/20201218";
//	private String outputPath = "/home/neo-dl/Data/project/wms image/experience/20201218/result.csv";
//	
//	@Test
//	public void test() {
//
//		Comparator<File> filenameComparator = (File a, File b) -> a.getName().compareTo(b.getName());
//		//准备测试数据
//		List<File> testDataDirs = new ArrayList<>();
// 		File[] dirs = new File(testDirPath).listFiles();
//		for(File dir : dirs) {
//			if(dir.getName().matches("^\\d.+")) {
//				testDataDirs.add(dir);
//			}
//		}
//		List<List<List<String>>> testData = new ArrayList<>();
//		testDataDirs.sort(filenameComparator);
//		for(File testDataDir : testDataDirs) {
//			System.out.println(testDataDir.getName());
//			List<List<String>> tmpTestData = new ArrayList<>();
//			File[] subTestDataDirs = testDataDir.listFiles();
//			Arrays.sort(subTestDataDirs, filenameComparator);
//			for(File subTestDataDir : subTestDataDirs) {
//				System.out.println("\t" + subTestDataDir.getName());
//				List<String> subTestDataFilenames = new ArrayList<>();
//				File[] tmpFilenames = subTestDataDir.listFiles();	
//				for(File photoFile : tmpFilenames) {
//					String fileName = photoFile.getName().split("\\.")[0];
//					System.out.println(fileName);
//					subTestDataFilenames.add(fileName);
//				}
//				tmpTestData.add(subTestDataFilenames);
//			}
//			testData.add(tmpTestData);
//		}
//		
//		//开始测试，对于每个样本，随机挑选1、3、5、10张作为查询样例，计算查准率时计算前10、20张的查准率。
//		int[] templateNum = {1, 3, 5, 10};
//		List<Integer> retrieveNum = new ArrayList<>();
//		for(int i = 2; i <= 30; i++) {
//			retrieveNum.add(i);
//		}
//		List<List<List<List<Float[]>>>> result = new ArrayList<>();
//		// 第一层是样例数量，第二层是7个大类，第三层是每个大类的2个小类，最后的Float[]是查准率和查全率
//		for(int k = 0; k < templateNum.length; k++) {
//			List<List<List<Float[]>>> tmpTemplateNumResult = new ArrayList<>();
//			for(int i = 0; i < testData.size(); i++) {
//				List<List<Float[]>> tmpTestDataResult = new ArrayList<>();
//				List<List<String>> tmpTestData = testData.get(i);
//				for(int j = 0; j < tmpTestData.size(); j++) {
//					System.out.println(k + "/" + i + "/" + j);
//					List<String> tmpSubTestData = tmpTestData.get(j);
//					Collections.shuffle(tmpSubTestData);	// 随机打乱
//					int tmpTemplateIdNum = templateNum[k];
//					Integer[] templateIds = new Integer[tmpTemplateIdNum];
//					for(int m = 0; m < tmpTemplateIdNum; m++) {
//						templateIds[m] = Integer.parseInt(tmpSubTestData.get(m));
//					}
////					for(Integer id : templateIds) {
////						System.out.println(id);
////					}
//					// 查询得到样本
//					Integer pageNum = 1;
//					Integer pageSize = 30;
//					LayerResult2 layerResult = 
//							this.layerQueryService.getLayerListByTemplateId(templateIds, pageNum, pageSize);
//					
//					List<Float[]> tmpSubTestDataResult = new ArrayList<>();
//					for(int m = 0; m < retrieveNum.size(); m++) {
//						Float[] tmpRetrieveNumResult = new Float[2];
//						int tmpRetrieveNum = retrieveNum.get(m);
//						int retrievedNum = 0;
//						List<LayerList> layerLists = layerResult.getData();
//						for(int p = 0; p < tmpRetrieveNum; p++) {
//							LayerList tmpLayerList = layerResult.getData().get(p);
//							if(tmpSubTestData.contains(String.valueOf(tmpLayerList.getId()))) {
//								retrievedNum ++;
//							}
//						}
//						float precision = retrievedNum * 1.0f / pageSize;
//						float recall = retrievedNum * 1.0f / 25;	//每个测试集有25张图片
//						tmpRetrieveNumResult[0] = precision;
//						tmpRetrieveNumResult[1] = recall;
//						tmpSubTestDataResult.add(tmpRetrieveNumResult);
//					}
//					tmpTestDataResult.add(tmpSubTestDataResult);
//				}
//				tmpTemplateNumResult.add(tmpTestDataResult);
//			}
//			result.add(tmpTemplateNumResult);
//		}
//		
////		// 输出结果
////		StringBuffer outputStr = new StringBuffer();
////		for(int k = 0; k < templateNum.length; k++) {
////			int tmpTemplateNum = templateNum[k];
////			StringBuffer outputPrecisionStr = new StringBuffer();
////			StringBuffer outputRecallStr = new StringBuffer();
////			List<List<Float[]>> tmpTemplateNumResult = result.get(k);
////			for(int i = 0; i < tmpTemplateNumResult.size(); i++) {
////				int tmpTestDataId = i + 1;
////				List<Float[]> tmpTestDataResult = tmpTemplateNumResult.get(i);
////				for(int j = 0; j < tmpTestDataResult.size(); j++) {
////					Float[] tmpSubTestDataResult = tmpTestDataResult.get(j);
////					outputPrecisionStr.append(String.valueOf(tmpSubTestDataResult[0]));
////					outputPrecisionStr.append(",");
////					outputRecallStr.append(String.valueOf(tmpSubTestDataResult[1]));
////					outputRecallStr.append(",");
////				}
////			}
////			outputPrecisionStr.append("\n");
////			outputRecallStr.append("\n");
////			outputStr.append(outputPrecisionStr.toString());
////			outputStr.append(outputRecallStr.toString());
////		}
////		try {
////			FileWriter fw = new FileWriter(outputPath);
////			fw.write(outputStr.toString());
////			fw.close();
////		} catch (IOException e) {
////			// TODO Auto-generated catch block
////			e.printStackTrace();
////		}
//	}
//}
