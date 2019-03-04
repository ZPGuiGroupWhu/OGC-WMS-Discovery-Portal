package com.gsv.querywmslist.querywmslist.bean;

public class re_layers {
    public String abstr;
    public String attribution;
    public String keywords;
    public String name;
    public String title;
    public String url;
    public float [][]bbox;
    public Integer id;
    public String imagepath;
    public String projection;

    public void setBbox(layers layers){
        this.bbox=new float[2][2];
        float []BBOX=new float[5];//提取结果暂存于一维数组中
        int step=0;//从前往后逐个读取字符，step用于定位
        int num=-1;//记录提取的数字数量
        boolean isNum=false;//判断是否是数字
        String temp="";//暂存提取到的数字
        layers.bbox= layers.bbox+"end";

        for(int i=0;i<layers.bbox.length();i++){
            if((layers.bbox.charAt(step)<='9'&&layers.bbox.charAt(step)>='0')||layers.bbox.charAt(step)=='.'||layers.bbox.charAt(step)=='-') {
                temp +=layers.bbox.charAt(step);
                isNum=true;
            }
            else {
                isNum = false;
            }
            if(!isNum&&temp!="") {
                ++num;
                BBOX[num] = Float.valueOf(temp);
                temp= "";
            }
            ++step;
        }
        this.bbox[0][0]=BBOX[1];
        this.bbox[0][1]=BBOX[2];
        this.bbox[1][0]=BBOX[3];
        this.bbox[1][1]=BBOX[4];
    }

    public void setOthers(layers layers){
        this.id=layers.id;
        this.title=layers.Title;
        this.name=layers.Name;
        this.abstr=layers.Abstract;
        this.keywords=layers.Keywords;
        this.attribution=layers.Attribution;
        this.imagepath=layers.imagepath;
        this.url=layers.URL;
        this.projection=layers.projection;
    }
}
