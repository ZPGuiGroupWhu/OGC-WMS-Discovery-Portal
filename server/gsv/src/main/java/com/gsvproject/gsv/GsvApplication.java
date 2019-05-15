package com.gsvproject.gsv;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
//public class GsvApplication extends SpringBootServletInitializer
public class GsvApplication
{
//    @Override
//    protected SpringApplicationBuilder configure(SpringApplicationBuilder applicationBuilder){
//        return applicationBuilder.sources(GsvApplication.class);
//    }
    public static void main(String[] args) {
        SpringApplication.run(GsvApplication.class, args);
    }
}
