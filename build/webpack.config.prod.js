const webpackMerge = require("webpack-merge");
const webpack = require("webpack");
const path = require('path');
const webpackBaseFn = require("./webpack.config.base");
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");                  // 分离样式
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");                        // 压缩js
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");    // 压缩css
const resolve = (p) => path.resolve(__dirname,"..",p)

const fs = require("fs") 
const temple=require('./temple') //自定义的模板文件
const HTMLWebpackPlugin = require('html-webpack-plugin');
var entryDir= resolve('src/page')
const entryFiles = fs.readdirSync(entryDir)
var pub=[]
pub.push(new CleanWebpackPlugin({
  verbose: true, //开启在控制台输出信息
  dry: false,
}))
// 创建多页面插件
function combineHTMLWithTemplate(){
  entryFiles.forEach(dir => {
    var str='./src/util/temple.html'
    var htmlPlugin
    if(temple.indexOf(dir)==-1){
      htmlPlugin = new HTMLWebpackPlugin({
        filename:`${dir}.html`,
        template:str,
        chunks:[dir],
        minify: {
          // 压缩 HTML 的配置
          collapseWhitespace: true,
          removeComments: true,
          useShortDoctype: true
        }
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
  return webpackMerge(webpackBaseFn,{
    mode:"production",
    optimization:{
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              // warnings: false,
              drop_debugger: false,
              drop_console: true
            }
          }
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            safe: true
          }
        })
      ]
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use:[
            {
                loader:MiniCssExtractPlugin.loader,
                options: {
                  publicPath: "../../"
                }
            },
            //MiniCssExtractPlugin.loader不能并用
            // {
            //   loader: 'style-loader'
            // },
            {
              loader: 'css-loader'
            }
          ]
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: [
            {
              loader:MiniCssExtractPlugin.loader,
              options: {
                publicPath: "../"
              }
            },
            //vue-style-loader不能和MiniCssExtractPlugin混用
            // "vue-style-loader",
            "css-loader",
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