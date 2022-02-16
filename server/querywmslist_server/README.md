#项目说明

* 20220216更新

增加了对静态资源文件形式的图层缩略图的支持

查询图层时，现在的返回结果中photo字段值默认是静态资源地址，如"WMSLayer_image/1.jpg"，访问时使用http://localhost:8081/WMSLayer_image/XXX.jpg，其中XXX是图片ID。

部署时需要将图层缩略图文件放在${user.home}/gsv/WMSLayer_image目录或D:\gsv\WMSLayer_image下才能正常使用，如果想要以Base64编码传输，需要在请求时添加photoType参数，参数值设置为Base64Str。
