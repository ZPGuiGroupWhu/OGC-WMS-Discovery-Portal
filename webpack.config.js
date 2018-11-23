const path = require('path');

module.exports = {
    entry: './src/index.js', //相对路径
    output: {
        path: path.resolve(__dirname, 'build'), //打包文件的输出路径
        filename: 'bundle.js' //打包文件名
    },
    module: {
        loaders: [{
                test: /\.js[x]?$/,
                exclude: /node_modules/,
                loader: 'babel-loader?presets[]=es2015&presets[]=react'//jsx加载
            },
            { test: /\.css$/, loader: 'style-loader!css-loader?modules' },//样式加载
            { test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader' },//不使用sass可以不写
       	]
    },
}