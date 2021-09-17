package com.gsv.querywmslist.querywmslist.commons;

import com.gsv.querywmslist.querywmslist.bean.PhotoInput;

import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.List;

public class PhotoUtils {
    public List<PhotoInput> getImages()  {
            File file=new File("E:\\GSV_project\\WMSLayer_image111");
            File[] tempList=file.listFiles();
            List<PhotoInput> photos=new ArrayList<>();

        try {
            for(int i=0;i<tempList.length;i++){
                PhotoInput photo=new PhotoInput();
                photo.setId(i+1);
                photo.setName(tempList[i].getName().substring(0,tempList[i].getName().length()-4));
                System.out.println(new FileInputStream(tempList[i]).available());
                photo.setPhoto(new Byte[new FileInputStream(tempList[i]).available()]);
                photos.add(photo);
            }

        }
        catch (Exception e){

        }
        return photos;
    }
}
