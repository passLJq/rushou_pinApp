const fs = require("fs") 
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");//分离样式
const VueLoaderPlugin = require("vue-loader/lib/plugin") //vue文件解析
const CopyWebpackPlugin = require("copy-webpack-plugin");//复制文件
const temple=require('./temple') //自定义的模板文件
const resolve = (p) => path.resolve(__dirname,"..",p)

var entryDir= resolve('src/page')
const entryFiles = fs.readdirSync(entryDir)
const
  entry = {},
  output = {}
  htmlPlugins = [];


//插件配置
var plugins=[
  new VueLoaderPlugin(),
  new MiniCssExtractPlugin({
    filename: "css/[name].css",
  }),
  new CopyWebpackPlugin([
    {
      from: path.join(__dirname,'..', 'src/common'),
      to: path.join(__dirname, '..','dist/common'),
      force :true
    },
    {
      from: path.join(__dirname,'..', 'src/html'),
      to: path.join(__dirname, '..','dist'),
      force :true
    },
    {
      from: path.join(__dirname,'..', 'src/image'),
      to: path.join(__dirname, '..','dist/image'),
      force :true  
    }
  ])
]
// 配置多入口
function resolveEntryAndOutput(env){
  entryFiles.forEach(dir => {
    entry[dir] =resolve( `${entryDir}/${dir}/${dir}.js`)
  })
}

resolveEntryAndOutput()
module.exports = {
  entry: entry,
  output: {
    path: resolve('dist'),
    filename: 'js/[name].bundle.js'
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, '..', 'src'),
      '@img': path.resolve(__dirname, '..', 'src/img'),
      '@image': path.resolve(__dirname, '..', 'src/image'),
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(png|svg|jpeg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: "[name].[ext]",
              outputPath:"img",
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
                pngquant: {
                  quality: '70-90',
                },
                // optipng: { // 使用 imagemin-optipng 压缩 png，enable: false 为关闭
                //   enabled: true,
                // },
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      }
    ]
  },
  //生产环境不打包这几个模块
  externals:{
    "vue": "Vue",
    "axios": "axios"
  },
  plugins: plugins
};
