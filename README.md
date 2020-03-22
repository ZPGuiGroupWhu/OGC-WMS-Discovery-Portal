#项目名称

Geographic Service Catalogue (以下简称为GSC)项目旨在搭建一个基于Web的地理信息资源检索平台，特别是支持WMS（Web Map Service, 网络地图服务）的多模态/跨模态搜索查询功能（如文本检索、时空查询、基于主题及提供者的检索，以及以图搜图等推荐功能），以帮助不同背景与领域的用户快速准确地找到感兴趣的WMS，同时对全球在线WMS资源的基本概况有一个大致的认识。

#数据库下载

下载WMS Portal开发群里最新的layerlist.sql和wms.sql

#项目地址

https://github.com/ZPGuiGroupWhu/geographic-services-catalogue

#项目部署

1.	安装软件环境：
	* Java环境：安装JDK，本人JDK版本号为1.8.0，并配置环境变量
	* Node环境：安装Node，安装最新版即可
	* Git环境：安装Git，并学习[廖雪峰老师的Git教程](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000/001373962845513aefd77a99f4145f0a2c7a7ca057e7570000 )，熟悉Git的使用

2.	配置数据库
*	安装MySQL：安装MySQL，并配置环境变量，数据库账号和密码设置为root, 123456，后端接口中配置了数据库账号密码，请务必保持一致
*	安装Navicat：可选择自己喜欢的MySQL workbench，也可下载navicat
*	配置数据库：在上面的数据库地址中下载数据库，载入MySQL数据库中，[数据库详情说明请点我](https://docs.qq.com/doc/DUGZoZG5iVEVRUGZj)

3.	运行项目：
* 下载项目文件：在你喜欢的文件路径（如E:）下打开git Bash，在其中输入命令：
    git clone https://github.com/ZPGuiGroupWhu/geographic-services-catalogue.git
* 发布后端服务：打开两个终端界面，进入项目文件夹内server目录下，运行
    java -jar querywmslist-0.0.1-SNAPSHOT.jar --server.port=8080
**注意**因为前端定义了接口的端口号，所以请务必保持端口一致，否则，请前往前端接口调用处修改参数。
* 运行前端界面：打开第三个终端界面，进入项目文件夹目录下，运行
    cnpm install 
    npm start
会自动打开浏览器，展示前端页面

**类型修改**
进入node_modules/_@types_node@10.14.10@@types/node/globals.d.ts
在209行 将'declare var require: NodeRequire;'改为
  declare var require: any;

**样式修改**
前端样式配置：进入node_modules/react-script-ts/config/webpack.config.dev.js目录下
在130行添加修改如下代码
  module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.(js|jsx|mjs)$/,
          loader: require.resolve('source-map-loader'),
          enforce: 'pre',
          include: paths.appSrc,
        },
  ` // add scss loader to load scss file for component style
        {
          test: /\.scss$/,
          loader: ['style-loader','css-loader','sass-loader'],
        },`
在238行添加修改如下代码
  {
              // Exclude `js` files to keep "css" loader working as it injects
              // its runtime that would otherwise processed through "file" loader.
              // Also exclude `html` and `json` extensions so they get processed
              // by webpacks internal loaders.
              exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/`,/\.scss$/`],
              loader: require.resolve('file-loader'),
              options: {
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },


