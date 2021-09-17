package com.gsv.querywmslist.querywmslist.bean;

import lombok.Data;

@Data
// 返回的用户信息 returned user
public class RetUser {
    public Integer userID;
    public String avatar;
    public String career;
    public String email;
    public String[] field;
    public String username;
}
