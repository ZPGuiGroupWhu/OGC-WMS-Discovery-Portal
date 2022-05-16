package com.gsv.querywmslist.querywmslist;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.gsv.querywmslist.querywmslist.commons.IntentionUtils;
import com.gsv.querywmslist.querywmslist.dao.Intention;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.*;
import org.junit.Test;
import springfox.documentation.spring.web.json.Json;

import java.io.File;
import java.io.IOException;
import java.sql.DriverManager;



import java.io.*;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class RecognizeIntentionTest {
    @Test

    public void testsearchByIntention(){
        String url = "http://127.0.0.1:8081/search/searchByIntention";
        String a ="{\"positive samples\":[1,2,3],\"negative samples\":[4,5,6]}";
        JSONObject jsonObject = JSON.parseObject(a);
        //System.out.println(jsonObject);
        JSONArray positive=jsonObject.getJSONArray("positive samples");
        JSONArray negative=jsonObject.getJSONArray("negative samples");
        //System.out.println(positive);
        Integer[][] b= new Integer[2][];
        b[0]=positive.toArray(new Integer[]{});
        b[1]=negative.toArray(new Integer[]{});



    }

    @Test
     public void testflask() throws IOException {
        String url = "http://127.0.0.1:5000/process/recognizeIntention";
        Intention intention =new Intention();
        intention.subIntention=new ArrayList<>();
        OkHttpClient client = new OkHttpClient();
         File file=new File("src/main/resources/json.json");
         FileReader fileReader = new FileReader(file);
         Reader reader = new InputStreamReader(new FileInputStream(file), "Utf-8");
         int ch = 0;
         StringBuffer sb = new StringBuffer();
         while ((ch = reader.read()) != -1) {
             sb.append((char) ch);
         }
         fileReader.close();
         reader.close();
         String jsonStr = sb.toString();

        RequestBody body = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), jsonStr);
        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .build();
        Response response = client.newCall(request).execute();
        if (response.isSuccessful()) {
            String Str = response.body().string();
            System.out.println(Str);
            JSONObject jsonObject = JSON.parseObject(Str);
            JSONArray result = jsonObject.getJSONArray("result");

            JSONArray jsintention = result.getJSONObject(0).getJSONArray("intention");

            intention.subIntentionNum=jsintention.size();
            jsintention.stream().forEach(subIntention -> {

                JSONObject jsonIntention = JSON.parseObject(subIntention.toString());
                String content= (String) jsonIntention.get("content");
                JSONArray contentArray=jsonIntention.getJSONArray("content");
                JSONArray locationArray=jsonIntention.getJSONArray("location");
                JSONArray styleArray=jsonIntention.getJSONArray("style");
                JSONArray topicArray=jsonIntention.getJSONArray("topic");

                String temSubIntention="";
                for(int i = 0; i < contentArray.size(); i++) {
                    String content = contentArray.get(i).toString();
                    temSubIntention+=content.substring(content.lastIndexOf("/")+1)+" ";
                }
                for(int i = 0; i < locationArray.size(); i++) {
                    String location=locationArray.get(i).toString();
                    String temp=locationArray.get(i).toString()+temSubIntention+" ";
                    temSubIntention+=temp;
                }
                for(int i = 0; i < styleArray.size(); i++) {
                    temSubIntention+=styleArray.get(i).toString()+" ";

                }
                for(int i = 0; i < topicArray.size(); i++) {
                    temSubIntention+=topicArray.get(i).toString()+" ";
                }

                intention.subIntention.add(temSubIntention);
                System.out.println(temSubIntention);
            });

            JSONArray negative=jsonObject.getJSONArray("negative samples");

        } else {
            throw new IOException("Unexpected code " + response);
        }
    }
//    @Test
//
//    public void readIntention() throws IOException {
//        //例子
//        File file=new File("G://1文档//intension2022.1.30.json");
//        Intention intention =new Intention();
//        intention.subIntention=new ArrayList<>();
//        Reader reader = new InputStreamReader(new FileInputStream(file), "Utf-8");
//        FileReader fileReader = new FileReader(file);
//        int ch = 0;
//        StringBuffer sb = new StringBuffer();
//        while ((ch = reader.read()) != -1) {
//            sb.append((char) ch);
//        }
//        fileReader.close();
//        reader.close();
//        String Str = sb.toString();
//
//        JSONArray jsonArray = JSONObject.parseArray(Str);
//        intention=IntentionUtils.JSONArrayToIntention(Str);
//        System.out.println(intention);
//        JSONArray jsIntention = jsonArray.getJSONObject(0).getJSONArray("Intention");
//
//        for (int i = 0; i < jsIntention.size(); i++) {
//            JSONObject jsonSubIntention = jsIntention.getJSONObject(i);
//            String a=String.valueOf(i+1);
//            JSONArray subIntentionCon=jsonSubIntention.getJSONArray("Sub-Intention-"+a);
//            System.out.println(subIntentionCon);
//            String temSubIntention= new String("");
//            String content= (String) subIntentionCon .getJSONObject(0).get("value");
//            String location= (String) subIntentionCon .getJSONObject(1).get("value");
//            String style= (String) subIntentionCon .getJSONObject(2).get("value");
//            String topic= (String) subIntentionCon .getJSONObject(3).get("value");
//            if (content.equals("Null")==false){temSubIntention+=content.substring(content.lastIndexOf("/")+1)+' ';}
//            if (location.equals("Null")==false){temSubIntention+=location+' ';}
//            if (style.equals("Null")==false){temSubIntention+=style+' ';}
//            if (topic.equals("Null")==false){temSubIntention+=topic;}
//            intention.subIntention.add(temSubIntention);
//            System.out.println(temSubIntention);
//        }

//    }

}
