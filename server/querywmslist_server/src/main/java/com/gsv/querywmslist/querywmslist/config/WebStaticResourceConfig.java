package com.gsv.querywmslist.querywmslist.config;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebStaticResourceConfig implements WebMvcConfigurer{
	
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {

//		Path path = Paths.get(System.getProperty("user.home"), "gsv/WMSLayer_image");
		String homeDirectory = "file:" + System.getProperty("user.home").replaceAll("\\\\", "/") + "/gsv/WMSLayer_image/";
//		String homeDirectory = path.toUri().toString();
//		System.out.println(homeDirectory);
		registry.addResourceHandler("WMSLayer_image/**").addResourceLocations(homeDirectory, "file:D:/gsv/WMSLayer_image/");
//		registry.addResourceHandler("WMSLayer_image/**").addResourceLocations("file:D:/gsv/WMSLayer_image/");
//		registry.addResourceHandler("WMSLayer_image/**").addResourceLocations("file:C:/Users/Neo/gsv/WMSLayer_image/");
    }
}
