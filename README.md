# 入手拼App

入手拼---社群拼团APP，是一个专注赋能社群团长创业及精选好货的拼购服务平台。

### 使用框架（vue + apicloud + webpack）

使用vue+apicloud-api开发，通过webpack打包的方式，配合apicloud云应用打包生成安卓与ios安装包，现已上架安卓应用宝和苹果app store，均可安装使用。

支持微信支付及分享。同时支持支付宝支付，使用apicloud的内置消息推送。

### 目录结构说明

``` bash
├─build //webpack编译配置
├─dist //项目打包输出目录
├─lib //公用插件
├─common //直接打包的一些没有处理的资源
├─src //编译前源代码
│  ├─assets //资源文件
│  ├─components //存放公用vue组建
│  ├─page //页面
│  ├─util //按需用的脚本和模板
│     └─temple.html //模板文件
└─img //图片
```

