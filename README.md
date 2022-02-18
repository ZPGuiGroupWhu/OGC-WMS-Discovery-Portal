## 项目名称

Geographic Service Catalogue (以下简称为GSC)项目旨在搭建一个基于Web的地理信息资源检索平台，特别是支持网络地图服务（Web Map Service, WMS）的多模态/跨模态搜索查询功能（如，文本检索、时空查询、主题及提供者检索、以图搜图及WMS推荐功能等），以帮助不同背景与领域的用户快速准确地找到感兴趣的WMS，同时对全球在线WMS资源的基本概况有一个大致的认识。


## 项目地址

https://github.com/ZPGuiGroupWhu/OGC-WMS-Discovery-Portal


## 项目部署
如果想深入了解代码结构与细节，可以参照以下步骤部署前端的开发模式
1.	安装前端软件环境：
	* Node环境：安装Node，安装最新版即可

2.  接口服务与数据库部署在云服务器上，不用部署在本地
	  
3.	运行项目：
* 下载项目文件：在你喜欢的文件路径（如E:）下，点击右键打开git Bash，在其中输入命令：
```
    git clone https://github.com/ZPGuiGroupWhu/OGC-WMS-Discovery-Portal.git
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在cmd命令窗口中转到项目的根目录路径下，输入命令：（如果出现node-sass无法下载的问题，[参考该博客的解决方案](https://blog.csdn.net/df981011512/article/details/78989532)）
```
    npm install 
```
---
* 如果下载速度太慢，可改用镜像仓库网址(依次完成下面三步），即在git Bash中输入命令：
```
    git clone https://github.com.cnpmjs.org/ZPGuiGroupWhu/OGC-WMS-Discovery-Portal.git
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在cmd命令行中输入以下命令，下载淘宝镜像的包管理工具cnpm，安装前端依赖：
```
  npm install -g cnpm --registry=https://registry.npm.taobao.org
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在cmd命令窗口中转到项目的根目录路径下，输入命令：
```
    cnpm install 
```
---
**类型修改**
* 在安装完相关的依赖（install）后，

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;进入node_modules/_@types_node@10.17.60@@types/node/globals.d.ts 在213行 将'declare var require: NodeRequire;'改为
 ```
 declare var require: any;
 ```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在cmd命令窗口中转到项目的根目录路径下，运行以下代码，启动项目，系统会自动打开浏览器，展示前端页面
```
    npm start
```
**Tips:** 如果node_modules依赖包中有报其他错误，可尝试在**报错的位置上一行**添加下列代码，使得tslint忽略对**该行**的检查
```
    @ts-ignore
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;或者可尝试直接在**报错文件的第一行**，添加下列代码，使得tslint忽略对**整个文件**的检查
```
    @ts-nocheck
```




