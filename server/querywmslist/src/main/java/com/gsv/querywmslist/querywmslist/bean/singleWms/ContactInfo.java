package com.gsv.querywmslist.querywmslist.bean.singleWms;

public class ContactInfo {
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

    public String getOrganization() {
        return organization;
    }

    public String getPerson() {
        return person;
    }

    public String getPosition() {
        return position;
    }

    public String getAddress() {
        return address;
    }

    public String getCity() {
        return city;
    }

    public String getState_province() {
        return state_province;
    }

    public String getAdministrative_unit() {
        return administrative_unit;
    }

    public String getPost_code() {
        return post_code;
    }

    public String getVoice_tel() {
        return voice_tel;
    }

    public String getFascimile_tel() {
        return fascimile_tel;
    }

    public String getEmail() {
        return email;
    }

    public void setAll(ContactInfoOrigin contactInfoOrigin){
        this.organization = contactInfoOrigin.getOrganization();
        this.person = contactInfoOrigin.getPerson();
        this.position = contactInfoOrigin.getPosition();
        this.address = contactInfoOrigin.getAddress();
        this.city = contactInfoOrigin.getCity();
        this.state_province = contactInfoOrigin.getStateOrProvince();
        this.administrative_unit = contactInfoOrigin.getCountry()+","+contactInfoOrigin.getStateOrProvince()+","+contactInfoOrigin.getCity();
        this.post_code = contactInfoOrigin.getPostCode();
        this.voice_tel = contactInfoOrigin.getVoiceTelephone();
        this.fascimile_tel = contactInfoOrigin.getFacsimileTelephone();
        this.email = contactInfoOrigin.getElectronicMailAddress();
    }
}
