package com.gsv.querywmslist.querywmslist.service;

import com.gsv.querywmslist.querywmslist.dao.Photo;
import com.gsv.querywmslist.querywmslist.repository.PhotoMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PhotoService {
    @Autowired
    PhotoMapper photoMapper;
    
    
    public Photo getPhoto(Integer layerID) throws Exception{
        Photo photo=photoMapper.getPhotoByLayerId(layerID);
        return photo;
    }
}
