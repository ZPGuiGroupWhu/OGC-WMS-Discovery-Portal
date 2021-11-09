package com.gsv.querywmslist.querywmslist;

import javax.annotation.PostConstruct;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@SpringBootApplication
@EnableSwagger2
public class QuerywmslistApplication {

    public static void main(String[] args) {
        SpringApplication.run(QuerywmslistApplication.class, args);
    }
    
    @PostConstruct
    private void init() {
    	
    }
}

