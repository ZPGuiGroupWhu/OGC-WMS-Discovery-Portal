package com.gsv.querywmslist.querywmslist.controller;

import com.gsv.querywmslist.querywmslist.service.PhotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PhotoController {
@Autowired
    PhotoService photoService;
@CrossOrigin
@GetMapping("/insertPhotos")
public void insertPhotos(){
     photoService.insertPhotos();
}
//    @CrossOrigin
//    @GetMapping("/getPhoto")
//    public String getPhoto() throws Exception {
//       return photoService.getPhoto();
//    }
}
