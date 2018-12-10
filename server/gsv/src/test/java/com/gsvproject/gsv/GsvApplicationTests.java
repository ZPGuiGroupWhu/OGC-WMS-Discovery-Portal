package com.gsvproject.gsv;

import com.alibaba.fastjson.JSON;
import com.gsvproject.gsv.bean.WMS;
import com.gsvproject.gsv.dao.wmsDao;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest
public class GsvApplicationTests {
    @Autowired
    private wmsDao wmsdao;
    @Test
    public void contextLoads() {

    }

}
