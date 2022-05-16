package com.gsv.querywmslist.querywmslist.commons;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.gsv.querywmslist.querywmslist.dao.Intention;
import com.gsv.querywmslist.querywmslist.dao.Layer;
import okhttp3.*;

import java.io.*;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class IntentionUtils {

    public static Intention JSONArrayToIntention(String Str){
        Intention intention =new Intention();
        intention.subIntention=new ArrayList<>();
//        JSONObject jsonObject = JSON.parseObject(Str);
//        JSONArray result = jsonObject.getJSONArray("result");
//
//        JSONArray jsintention = result.getJSONObject(0).getJSONArray("intention");

        JSONArray jsintention = JSON.parseArray(Str);

        intention.subIntentionNum=jsintention.size();
        for (int ii = 0; ii < jsintention.size(); ii++) {
            String temSubIntention= new String("");
            JSONObject jsonIntention = JSON.parseObject(jsintention.get(ii).toString());
            JSONArray contentArray=jsonIntention.getJSONArray("content");
            JSONArray locationArray=jsonIntention.getJSONArray("location");
            JSONArray styleArray=jsonIntention.getJSONArray("style");
            JSONArray topicArray=jsonIntention.getJSONArray("topic");

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
        }
        return intention;
    }
    public String getIntentionJson(List<Layer> relevance, List<Layer> irrelevance) throws IOException {
        OkHttpClient client = new OkHttpClient();
        //例子
        URL resource = this.getClass().getClassLoader().getResource("json.json");
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(resource.openStream()));
        String jsonStr = new String();
        String line;
        while ((line = bufferedReader.readLine()) != null) {
            jsonStr+=line;
        }
        RequestBody body = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), jsonStr);
        Request request = new Request.Builder()
                .url("http://127.0.0.1:5000/process/recognizeIntention")
                .post(body)
                .build();
        Response response = client.newCall(request).execute();
        if (response.isSuccessful()) {

            String Str = response.body().string();
            return Str;
        } else {
            throw new IOException("Unexpected code " + response);
        }

    }
}


