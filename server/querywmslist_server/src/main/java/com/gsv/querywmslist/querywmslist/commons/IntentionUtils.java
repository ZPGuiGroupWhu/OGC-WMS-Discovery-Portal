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
import java.util.List;

public class IntentionUtils {

    public static Intention JSONArrayToIntention(String Str){
        JSONArray jsonArray = JSONObject.parseArray(Str);
        Intention intention =new Intention();
        intention.subIntention=new ArrayList<>();
        JSONArray jsIntention = jsonArray.getJSONObject(0).getJSONArray("Intention");
        intention.subIntentionNum=jsIntention.size();
        for (int i = 0; i < jsIntention.size(); i++) {
            JSONObject jsonSubIntention = jsIntention.getJSONObject(i);
            String a=String.valueOf(i+1);
            JSONArray subIntentionCon=jsonSubIntention.getJSONArray("Sub-Intention-"+a);
            System.out.println(subIntentionCon);
            String temSubIntention= new String("");
            String content= (String) subIntentionCon .getJSONObject(0).get("value");
            String location= (String) subIntentionCon .getJSONObject(1).get("value");
            String style= (String) subIntentionCon .getJSONObject(2).get("value");
            String topic= (String) subIntentionCon .getJSONObject(3).get("value");
            if (content.equals("Null")==false){temSubIntention+=content.substring(content.lastIndexOf("/")+1)+' ';}
            if (location.equals("Null")==false){temSubIntention+=location+' ';}
            if (style.equals("Null")==false){temSubIntention+=style+' ';}
            if (topic.equals("Null")==false){temSubIntention+=topic;}
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


