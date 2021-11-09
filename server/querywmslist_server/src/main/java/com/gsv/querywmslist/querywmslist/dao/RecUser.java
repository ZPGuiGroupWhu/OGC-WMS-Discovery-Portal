package com.gsv.querywmslist.querywmslist.dao;

import lombok.Data;
import lombok.EqualsAndHashCode;


@Data
@EqualsAndHashCode(callSuper=false)
// 接收到的用户信息 received user
public class RecUser extends RetUser{
    public String password;
    public String newField;   // 数据库无法存储数组，需将field转化为以','为间隔的字符串
    public String loginType;  // 登录类型标识 email or username

    // 将field转化为以','为间隔的字符串用于数据库存储
    public String transformFieldToString() {
        String tField= new String();
        for (int i = 0; i< this.field.length; i++){
            tField += this.field[i]+',';
        }
        this.newField=tField.substring(0,tField.length()-1);
        return this.newField;
    }

    // 将newField转化为数组返回前端数据
    public String[] transformNewfieldToArray() {
       this.field=this.newField.split(",");
       return this.field;
    }
}
