package com.gsv.querywmslist.querywmslist.service;

import com.gsv.querywmslist.querywmslist.commons.ImageDemo;
import com.gsv.querywmslist.querywmslist.repository.PhotoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PhotoService {
    @Autowired
    PhotoMapper photoMapper;
    public void insertPhotos(){
//        List<PhotoInput> photoInputs=new PhotoUtils().getImages();
//        return photoMapper.insertPhotos(photoInputs);
        ImageDemo.readImage2DB();
    }
//    public String getPhoto() throws Exception{
//        Byte[] data=null;
//        Blob blob=photoMapper.getPhoto();
//        InputStream inputStream=blob.getBinaryStream();
//        data=new Byte[(int) blob.length()];
//        inputStream.read();
//        return ImageDemo.readDB2Image();
//    }
}
