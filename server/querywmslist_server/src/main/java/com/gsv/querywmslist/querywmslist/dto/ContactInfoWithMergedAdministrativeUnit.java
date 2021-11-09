package com.gsv.querywmslist.querywmslist.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ContactInfoWithMergedAdministrativeUnit {

    private String organization;
    private String person;
    private String position;
    private String address;
    private String city;
    private String state_province;
    private String administrative_unit;
    private String post_code;
    private String voice_tel;
    private String fascimile_tel;
    private String email;
}
