const webpackMerge = require("webpack-merge");
const webpack = require("webpack");
const path = require('path');
const webpackBaseFn = require("./webpack.config.base");
const resolve = (p) => path.resolve(__dirname,"..",p)

const fs = require("fs") 
const temple=require('./temple') //自定义的模板文件
const HTMLWebpackPlugin = require('html-webpack-plugin');
var entryDir= resolve('src/page')
const entryFiles = fs.readdirSync(entryDir)
var pub=[
  //热更新
  new webpack.HotModuleReplacementPlugin()
]
// 创建多页面插件
function combineHTMLWithTemplate(){
  entryFiles.forEach(dir => {
    var str='./src/util/devtemple.html'
    var htmlPlugin
    if(temple.indexOf(dir)==-1){
      htmlPlugin = new HTMLWebpackPlugin({
        filename:`${dir}.html`,
        template:str,
        chunks:[dir]
      })     
    }else{
      htmlPlugin = new HTMLWebpackPlugin({
        filename:`${dir}.html`,
        template:`./src/page/${dir}/${dir}.html`,
        chunks:[dir]
      })     
    }
    pub.push(htmlPlugin)
  })
}
combineHTMLWithTemplate()

module.exports = function(env){
  // const baseConfig = webpackBaseFn(env)
  return webpackMerge(webpackBaseFn,{
    mode:"development",
    devServer:{
      contentBase:resolve("dist"),
      host:"0.0.0.0",
      useLocalIp: true,
      overlay:{
        errors:true,
        warnings:true
      },
      open:true,
      hot:true,
      historyApiFallback: true,
      inline: true,
      disableHostCheck: true,
      stats:{
        assets: false,
        chunks: false,
        chunkGroups: false,
        chunkModules: false,
        chunkOrigins: false,
        modules: false,
        moduleTrace: false,
        source: false,
        builtAt: false,
        children: false,
        hash:false,
      },
      proxy: {
        'http://localhost:8080/test': {
          // target: 'https://w.rushouvip.cn/api/',
          target: 'https://pinw.rushouvip.cn/api/',
          changeOrigin: true,
          pathRewrite:{
            '^/test': '/' 
          }
        }
      }
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use:[
          // {
          //     loader:MiniCssExtractPlugin.loader,
          //     options: {
          //     publicPath: "../../"
          //     }
          // },
          //MiniCssExtractPlugin.loader不能并用
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader'
            },
            // {
            //   loader: 'postcss-loader'
            // }
          ]
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: [
          //   {
          //     loader:MiniCssExtractPlugin.loader,
          //     options: {
          //       publicPath: "../"
          //     }
          //   },
            //vue-style-loader不能和MiniCssExtractPlugin混用
            "vue-style-loader",
            "css-loader",
            // "postcss-loader",
            "sass-loader",
            {
              loader: "sass-resources-loader",
              options: {
                resources: resolve("src/assets/style/main.scss"),
              }
            }
          ]
        }
      ]
    },
    plugins:pub
  });
}
  