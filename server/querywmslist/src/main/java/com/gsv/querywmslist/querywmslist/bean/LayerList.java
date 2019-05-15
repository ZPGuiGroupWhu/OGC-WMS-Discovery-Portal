<<<<<<< HEAD
package com.gsv.querywmslist.querywmslist.bean;

public class LayerList {
    private String  abstr;
    private String attribution;
    private String keywords;
    private String name;
    private String title;
    private String url;
    private float[][] bbox;
    private Integer id;
    private String imagepath;
    private String projection;
    private String topic;
    private String photo;

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public String getAbstr() {
        return abstr;
    }

    public void setAbstr(String abstr) {
        this.abstr = abstr;
    }

    public String getAttribution() {
        return attribution;
    }

    public void setAttribution(String attribution) {
        this.attribution = attribution;
    }

    public String getKeywords() {
        return keywords;
    }

    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public float[][] getBbox() {
        return bbox;
    }

    public void setBbox(LayerList_temp layerList_temp) {
        this.bbox = new float[2][2];
        this.bbox[0][0]=Float.parseFloat(layerList_temp.getBoundingbox().split(" ")[1].split(",")[0]);
        this.bbox[0][1]=Float.parseFloat(layerList_temp.getBoundingbox().split(" ")[1].split(",")[1]);
        this.bbox[1][0]=Float.parseFloat(layerList_temp.getBoundingbox().split(" ")[1].split(",")[2]);
        this.bbox[1][1]=Float.parseFloat(layerList_temp.getBoundingbox().split(" ")[1].split(",")[3]);
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getImagepath() {
        return imagepath;
    }

    public void setImagepath(String imagepath) {
        this.imagepath = imagepath;
    }

    public String getProjection() {
        return projection;
    }

    public void setProjection(String projection) {
        this.projection = projection;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }
}
=======
package com.gsv.querywmslist.querywmslist.bean;

public class LayerList {
    private String  abstr;
    private String attribution;
    private String keywords;
    private String name;
    private String title;
    private String url;
    private float[][] bbox;
    private Integer id;
    private String imagepath;
    private String projection;
    private String topic;
    public String getAbstr() {
        return abstr;
    }

    public void setAbstr(String abstr) {
        this.abstr = abstr;
    }

    public String getAttribution() {
        return attribution;
    }

    public void setAttribution(String attribution) {
        this.attribution = attribution;
    }

    public String getKeywords() {
        return keywords;
    }

    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public float[][] getBbox() {
        return bbox;
    }

    public void setBbox(LayerList_temp layerList_temp) {
        this.bbox = new float[2][2];
        this.bbox[0][0]=Float.parseFloat(layerList_temp.getBoundingbox().split(" ")[1].split(",")[0]);
        this.bbox[0][1]=Float.parseFloat(layerList_temp.getBoundingbox().split(" ")[1].split(",")[1]);
        this.bbox[1][0]=Float.parseFloat(layerList_temp.getBoundingbox().split(" ")[1].split(",")[2]);
        this.bbox[1][1]=Float.parseFloat(layerList_temp.getBoundingbox().split(" ")[1].split(",")[3]);
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getImagepath() {
        return imagepath;
    }

    public void setImagepath(String imagepath) {
        this.imagepath = imagepath;
    }

    public String getProjection() {
        return projection;
    }

    public void setProjection(String projection) {
        this.projection = projection;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }
}
>>>>>>> db691129ce8f031304e662c038c835bae0873f32
