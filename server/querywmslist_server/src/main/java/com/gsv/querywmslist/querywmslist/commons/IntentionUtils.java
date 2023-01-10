package com.gsv.querywmslist.querywmslist.commons;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.gsv.querywmslist.querywmslist.dao.Intention;
import com.gsv.querywmslist.querywmslist.dao.Layer;
import okhttp3.*;

import java.io.*;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class IntentionUtils {

    public static Intention JSONArrayToIntention(List<Map<String,Object>> mapIntention){
        Intention intention =new Intention();
        intention.subIntention=new ArrayList<>();


        intention.subIntentionNum=mapIntention.size();
        for (int ii = 0; ii < mapIntention.size(); ii++) {

            Intention.SubIntention temSubIntention= intention.new SubIntention();
            List<String> contentArray=((List<String>)mapIntention.get(ii).get("content"));
            List<String> locationArray=((List<String>) mapIntention.get(ii).get("location"));
            List<String> styleArray=((List<String>)mapIntention.get(ii).get("style"));
            List<String> topicArray=((List<String>)mapIntention.get(ii).get("topic"));

            List<String> newContent = new ArrayList<String> ();
            for(int i = 0; i < contentArray.size(); i++) {
                String content = contentArray.get(i).toString();
                if(content.contains("http://")){
                    newContent.add(content.substring(content.lastIndexOf("/")+1));
                }
            }
//            temSubIntention.content=newContent;
            temSubIntention.content = contentArray;
            temSubIntention.location = locationArray;
            temSubIntention.style =styleArray;
            temSubIntention.topic = topicArray;


//          for(int i = 0; i < contentArray.size(); i++) {
//
//                String content = contentArray.get(i).toString();
//                if(content.contains("http://")){
//                    temSubIntention.content=content.substring(content.lastIndexOf("/")+1);
//                }
//
//                temSubIntention.content=content;
//
//            }
//            for(int i = 0; i < locationArray.size(); i++) {
//
//                String location=locationArray.get(i);
////                String temp=locationArray.get(i).toString()+temSubIntention+" ";
//                temSubIntention.location = location;
//            }
//            for(int i = 0; i < styleArray.size(); i++) {
//
////                temSubIntention+=styleArray.get(i).toString()+" ";
//                temSubIntention.style = styleArray.get(i).toString();
//            }
//            for(int i = 0; i < topicArray.size(); i++) {
////                temSubIntention+=topicArray.get(i).toString()+" ";
//                temSubIntention.topic = topicArray.get(i).toString();
//            }

            intention.subIntention.add(temSubIntention);

        }
        return intention;
    }
    public Map<String,Object> getIntentionJson(Map<String,Object> layers,Map<String,Object> parameter) throws IOException {
        OkHttpClient client = new OkHttpClient();
        Map<String, Object> map = new HashMap<String, Object>();
//        map.put("layers", JSONObject.parseObject(layers));
//        map.put("parameter", JSONObject.parseObject(parameter));
        map.put("layers", layers);
        map.put("parameter", parameter);
        String jsonStr = JSONObject.toJSONString(map);

//        //例子
//        URL resource = this.getClass().getClassLoader().getResource("json.json");
//        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(resource.openStream()));
//        String jsonStr = new String();
//        String line;
//        while ((line = bufferedReader.readLine()) != null) {
//            jsonStr+=line;
//        }
        RequestBody body = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), jsonStr);
        Request request = new Request.Builder()
                .url("http://127.0.0.1:8090/process/recognizeIntention")
                .post(body)
                .build();
        Response response = client.newCall(request).execute();
        if (response.isSuccessful()) {

            String Str = response.body().string();
            JSONObject obj= JSON.parseObject(Str);
//            List<Map<String,Object>> mapIntention = (List<Map<String,Object>>)JSONArray.parse(Str);
            Map<String,Object> mapIntention =  JSONObject.parseObject(obj.toJSONString(), new TypeReference<Map<String, Object>>(){});
            return mapIntention;
        } else {
            throw new IOException("Unexpected code " + response);
        }

    }
}


