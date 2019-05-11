//ajax请求
function https(data){
    var method=data.method||'get'
    var newheader=''
    if(data.headers){
        newheader={
            "Authorization": window.api?api.getPrefs({sync: true,key: 'SessionKey'}):$api.getStorage('SessionKey'),
            "Content-Type": 'application/json; charset=utf-8'
        }
      }
    if(openapp){
      var lodata={}
      if(method=="get"){
        lodata={
            values:data.data
        }
      }else if(method=="post"){
        lodata={
            body:data.data
        }
      }
      api.ajax({
          url:data.url,
          method: method,
          data:lodata,
          headers:newheader,
          timeout:data.timeout||30,
          dataType:data.dataType||'json'
      },function(ret, err){
          if (ret) {
            if(data.successBack){
              data.successBack(ret)
            }
          } else {
            hideLoading()
            if(err.statusCode=='403'){
              console.log(data.url)
              console.log(JSON.stringify(data.data))
              api.removePrefs({ key:'SessionUserID'})
              api.removePrefs({ key:'SessionName'})
              api.removePrefs({ key:'SessionKey'})
              api.removePrefs({ key:'SessionShopID'})
              api.setPrefs({ key:'loginStatus',value:'loginFail'})//过期清除信息
              api.openWin({
                name: 'login',
                url: api.wgtRootDir+'/login.html',
                bgColor:'#fff'
              })
            }
            if(data.errorBack){
              data.errorBack(err)
            }else{
              if (err.statusCode == '503') {
                promptMsg('当前访问峰值过高，请稍候再试...')
              }else{
                promptMsg(err.msg)
              }
            }
          }
        })
      }else{
        // console.log(method)
        if(method!='get'){
          axios({
            method:method,
            url:data.url,
            data: data.data||'',
            headers:newheader
          }).then(function(response) {
            data.successBack(response.data)
          });
        }else{
          axios({
            method:method,
            url:data.url,
            params: data.data||'',
            headers:newheader
          }).then(function(response) {
            data.successBack(response.data)
            
          });
        }
      }
  }

  //跳转
  function openWin(data,pubilchead){
      if(window.api){
        if(pubilchead){
          data.pageParam.url=data.url
          api.openWin({
            name: data.name,
            url: './public_head.html',
            pageParam: data.pageParam,
            bgColor:data.bgColor||'#fff',
            useWKWebView:data.useWKWebView||false,
            progress:{
              type:'page',
              color:'#F5AC9E'
            }
        });
        }else{
          api.openWin({
            name: data.name,
            url: data.url,
            pageParam: data.pageParam,
            bgColor:data.bgColor||'#fff',
            useWKWebView:data.useWKWebView||false,
            progress:{
              type:'page',
              color:'#F5AC9E'
            }
        });
        }
      }else{
          var canshu=''
          if(data.pageParam){
              if(data.url.indexOf("?")==-1){
                canshu='?zhan=1'
              }
            for(var key in data.pageParam){ 
                var i=''  
                var skey=''
                if(typeof(data.pageParam[key])=='object'){
                  skey=JSON.stringify(data.pageParam[key])
                }else{
                  skey=data.pageParam[key]
                }
                i= '&'+key+'='+skey
                canshu+=i
                } 
          }
          console.log(data.url+canshu)
        window.location.href=data.url+canshu; 
      }
  }

  //关闭win
  function closeWin() {
    if (window.api) {
      api.closeWin();
    } else{
      history.go(-1);
    }
  }
  
 //关闭Frame
  function closeFrame(){
    if (window.api) {
        api.closeFrame();
      } else{
        history.go(-1);
      }
  }

  //提示操作信息框
function promptMsg(text) {
  if (!text) return
  if(text) {
    var textLength = text.length>8?'65%':'0';
  }else {
    var textLength = text
  }
  $api.remove($api.byId('prompt'));
  clearTimeout(protimer);
  protimer = null;
  $api.append(document.body,'<div id="prompt" style="position:fixed;top:50%;left:50%;z-index:999999999;-webkit-transform:translate(-50%,-50%);translate(-50%,-50%);min-width:'+textLength+';max-width:'+screen.width*0.8+'px;text-align:center;background-color:rgba(0,0,0,.7);word-wrap:break-word;padding:5px 15px;color:#fff;border-radius:5px;font-size:13px;-moz-transition:all .3s linear;-webkit-transition:all .3s linear;-o-transition:all .3s linear;transition:all .3s linear;">'+text+'</div>');
  var protimer = setTimeout(function() {
    var promptHtml = $api.byId('prompt');
    $api.css(promptHtml,'opacity:0');
    $api.remove(promptHtml);
    clearTimeout(protimer);
    protimer = null;
  },2000)
};

function getQueryString(name,types) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) {
    if(types){
      return JSON.parse(unescape(r[2]))
    }else{
      return unescape(r[2])
    }
  }
  return null
}

//获取参数
function pageParam(name,types){
  // 没有参数就返回全部
  if (!name&&!types) {
    if (window.api) {
      return api.pageParam
    } else {
      var data = unescape(window.location.search)
      data = data.substr(1).split('&')
      if (!data) return null
      let s = {}
      for(var k=0;k<data.length;k++) {
        var obj = data[k].split('=')
        s[obj[0]] = obj[1]
      }
      console.log(s)
      return s
    }
  }
  if(window.api){
    var data=api.pageParam
    if(name in data){
      for(var i in data) {
        if(i==name){
          return data[i]
        }
     }
    }else{
      return ''
    }
  }else{
    return getQueryString(name,types)
  }
}
// 验证登录
function checkLoginStatus(){
  var res = false;
  if (window.api) {
    if(api.getPrefs({sync: true,key: 'loginStatus'})!="loginSuccess"){
      openWin({
        name: 'login',
        url: './login.html',
        bgColor: '#fff'
      });
    } else {
      res = true
    }
  } else {
    if($api.getStorage('loginStatus')!="loginSuccess"){
      openWin({
        name: 'login',
        url: './login.html',
        bgColor: '#fff'
      });
    } else {
      res = true
    }
  }
  return res;
}

// 获取全局数据
function getname(name) {
  if (!name) {
    return window.api ? api.getPrefs({sync: true,key: 'SessionUserID'}) : $api.getStorage('SessionUserID')
  } else {
    return window.api ? api.getPrefs({sync: true,key: name}) : $api.getStorage(name)
  }
}

// 储存全局数据
function setname(name, value) {
  if (name) {
    if (window.api) {
      api.setPrefs({
        key: name,
        value: value
      })
    } else {
      $api.setStorage(name, value)
    }
  }
}

// 移除全局数据
function removeName(name) {
  if (name) {
    if (window.api) {
      api.removePrefs({ key: name})
    } else {
      $api.rmStorage(name)
    }
  }
}

//加载Loading
function showLoading() {
  if (window.api) {
    api.showProgress({
      text: '先喝杯茶...',
      modal: true
    });
  }
}
//隐藏Loading
function hideLoading() {
  if (window.api) {
    api.hideProgress()
  }
}
//可调节文字的loading
function showjindu(text) {
  if (window.api) {
    api.showProgress({
      text: text,
      modal: true
    });
  }
}

// 下拉刷新停止
function refreshDone() {
  if (window.api) {
    api.refreshHeaderLoadDone();
  }
}


//支付
function wechatpay(
  orderinfo,    // 订单信息
  paycode,      // 支付方式
  paysource,    // 购买方式（直接买buynow或拼团购）
  successurl,   // 成功页地址
  orderid,      // 订单id
  cid,          // cloudid
  types,        
  openimagese   // 开店用的信息
){
  console.log(JSON.stringify(orderinfo))
  //openimagese是开店用的信息
  var payorderinfo = $api.strToJson(orderinfo);
  var wxPay = api.require('wxPay');
  wxPay.payOrder({
      apiKey: payorderinfo.AppId,
      orderId: payorderinfo.PrepayId,
      mchId: payorderinfo.MchId,
      nonceStr: payorderinfo.NonceStr,
      timeStamp: payorderinfo.TimeStamp,
      package:payorderinfo.Package,
      sign: payorderinfo.Sign
  }, function(ret, err) {
    console.log($api.jsonToStr(ret));
      if (ret.status) {
        if(cid && types != "isgroupswechatpay") {
          ShoppingSuccess(paycode,paysource,successurl, orderid, cid);
        }else {
          console.log('512112');
          //第一次买礼包开店成功跳转
          if(openimagese){
            kaidian()
            return
          }
          console.log('1231321');
          if(cid) {
            ShoppingSuccess(paycode,paysource,successurl, orderid, cid, types);
          }else {
            ShoppingSuccess(paycode,paysource,successurl, orderid);
          }
        }
          //支付成功
      } else {
        pushMsg("订单号: ["+ orderid + "] 订单提交成功,等待付款", orderid)
        api.alert({
            title: '支付结果',
            msg:wxpayReturnCode(err.code),
            buttons: ['确定']
        });
        setTimeout(function(){
          api.closeWin({
            name: 'ordercomfirm'
          });
        },1000)
        setTimeout(function(){
          api.closeWin({
            name: 'packageordercomfirm'
          });
        },1000)
      }
  });
}

//拼团支付查状态
function ping_ordernow(orderid,ogid,code) {
  https({
    url:siteUrl +'Main/Shopping/OrderPayStatus',
    data:{
      orderid:orderid,
      uid:getname(),
      ogid:ogid,
      code:code
    },
    headers:1,
    successBack:function(ret){
        console.log($api.jsonToStr(ret))
    }
  })
}

function wxpayReturnCode(code){
  api.sendEvent({
      ///支付取消刷新购物车
      name: 'alipay',
  });
  var res = "";
  switch (code) {
    case 0:
      res = "支付成功";
      break;
    case -1:
        res = "未知错误，请联系平台管理员";
        break;
    case -2:
        res = "中途取消支付操作，请到订单列表支付";
        break;
    default: res ="未知错误，请联系平台管理员";
  }
  return res;
}

//购买成功后操作
//source 来源 buynow-立即购买 shoppingcart-购物车购买 groupbuy-拼团 packagebuy-套餐购买
function ShoppingSuccess(paycode,source,successurl, orderid, cid, types){
  if (window.api) {
    pushMsg("订单号: ["+ orderid + "] 支付成功", orderid)
  }
  console.log(successurl)
  switch(source){
    case "buynow":
     //关闭订单确认
     if(cid && types != "isgroupswechatpay") {
       api.openWin({
           name: 'success',
           url: successurl,
           bgColor:'#fff',
           pageParam: {
             cid: cid
           }
       });
     }else {
       if(cid) {
         api.openWin({
             name: 'success',
             url: successurl,
             bgColor:'#fff',
             pageParam: {ogid: cid}
         });
       }else {
         api.openWin({
             name: 'success',
             url: successurl,
             bgColor:'#fff'
         });
       }
     }
     break;
   case "shoppingcart":
     ChangeIndexPage(4);
     //关闭订单确认
     api.openWin({
         name: 'success',
         url: successurl,
         bgColor:'#fff'
     });
     //更新购物车
     api.execScript({
         name: 'shoppingcart',
         frameName:'shoppingcart_body',
         script: 'BindData()'
     });
     break;
   case "groupbuy":
     ChangeIndexPage(4);
     //关闭订单确认
     api.openWin({
         name: 'success',
         url: successurl,
         bgColor:'#fff'
     });
     api.execScript({
         name: 'groupbuy',
         script: 'BindData();'
     });
     break;
   case "packagebuy":
     //关闭订单确认
     api.openWin({
         name: 'pack_success',
         url: successurl,
         bgColor:'#fff',
     });
     setTimeout(function(){
       api.closeWin({
         name: 'packageordercomfirm'
       });
     },1000)
     break;
   case "orderdetailpay":
     api.execScript({
         name: 'orderdetail',
         script: 'BindData();'
     });
     break;
 }
}

function alipayReturnCode(code){
  api.sendEvent({
    name: 'alipay',
  });
  var res = "";
  switch (code) {
    case '9000':
      res = "支付成功";
      break;
    case '8000':
        res = "正在处理中,请稍后确认订单状态";
        break;
    case '4000':
        res = "订单支付失败，请到订单列表支付";
        break;
    case '6001':
        res = "中途取消支付操作，请到订单列表支付";
        break;
    case '6002':
        res = "网络连接出错，请到订单列表支付";
        break;
    default: res ="未知错误，请联系平台管理员";
  }
  return res;
}

//关闭窗口回到主页，index代表回到主页哪个frame
function ReturnToIndex(index){
  api.execScript({
      name: 'root',
      script: 'ReturnToIndexPage('+index+')'
  });
  api.closeToWin({
    name: 'root'
  });
}
function ChangeIndexPage(index){
  api.execScript({
      name: 'root',
      script: 'ReturnToIndexPage('+index+')'
  });

}

// 
function OpenProdctPage(pid,yshopid, e, isUU){
  if(e) {
    if(e.target.innerHTML == "取消收藏") return;
  }
  openWin({
      name: 'product_'+pid,
      url: './productDetail.html',
      historyGestureEnabled:true,
      bgColor:"#fff",
      pageParam: {
          pid : pid,
          yshopid : yshopid,
          isUU: isUU
      },
       useWKWebView:true
  })
}

//头部导航
function headTitle(el,title, isShare, shareCallBack){
  var statustop=$api.getStorage('statustop');
  var hee=45+Number(statustop)+'px'
  var shtml=''
  var newWidth = window.innerWidth - 140
  if(isShare) {
    if(shareCallBack) {
  shtml += '<header class="commoneheadeclass" id="header" style="padding-top:'+statustop+'px">'
  shtml += '  <div class="commoneheaderleft commoneheaditem" onclick="closeWin()">'
  shtml += '     <img src="./img/icon-back.png">'
  shtml += '   </div>'
  shtml += '  <div class="commoneheaderright commoneheaditem" id="share" onclick="'+shareCallBack+'()">'
  shtml += '      <img src="./img/share_black.png">'
  shtml += '  </div>'
  shtml += '  <div class="commoneheadermain commoneheaditem">'
  shtml += '    <p id="title">'+title+'</p>'
  shtml += '  </div>'
  shtml += ' </header>'
    }else{
      shtml += '<header class="commoneheadeclass" id="header" style="padding-top:'+statustop+'px">'
      shtml += '  <div class="commoneheaderleft commoneheaditem" onclick="closeWin()">'
      shtml += '     <img src="./img/icon-back.png">'
      shtml += '   </div>'
      shtml += '  <div class="commoneheaderright commoneheaditem" id="share" onclick="'+shareCallBack+'()" style="display:none">'
      shtml += '      <img src="./img/share_black.png">'
      shtml += '  </div>'
      shtml += '  <div class="commoneheadermain commoneheaditem">'
      shtml += '    <p id="title">'+title+'</p>'
      shtml += '  </div>'
      shtml += ' </header>'
    }
  }else{
    shtml += '<header class="commoneheadeclass" id="header" style="padding-top:'+statustop+'px">'
    shtml += '  <div class="commoneheaderleft commoneheaditem" onclick="closeWin()">'
    shtml += '     <img src="./img/icon-back.png">'
    shtml += '   </div>'
    shtml += '  <div class="commoneheadermain commoneheaditem">'
    shtml += '    <p id="title">'+title+'</p>'
    shtml += '  </div>'
    shtml += ' </header>'  
  }
  // if(isShare) {
  //   if(shareCallBack) {
  //     shtml += '<div class="ym_head" style="padding-top:'+statustop+'px'+';height:'+hee+'px'+';-moz-box-shadow:0px 0px 14px #f5f4f4; -webkit-box-shadow:0px 0px 14px #f5f4f4; box-shadow:0px 0px 14px #f5f4f4; border: 0;"><div class="ym_head_back" style="transform: translateY(-50%);" onclick="backUrl()"><img src="./image/icon-back.png" style="vertical-align: top;display:block;"></div><div class="ym_head_title"><p style="width:'+newWidth+'px;margin: 0 auto;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;color:#2C5B33;">'+title+'</p></div><div class="yu_head_share" onclick="'+shareCallBack+'()"><img src="./image/share_black.png" style="vertical-align: top;"></div></div>';
  //   }else {
  //     shtml += '<div class="ym_head" style="padding-top:'+statustop+'px'+';height:'+hee+'px'+';-moz-box-shadow:0px 0px 14px #f5f4f4; -webkit-box-shadow:0px 0px 14px #f5f4f4; box-shadow:0px 0px 14px #f5f4f4; border: 0;"><div class="ym_head_back" style="transform: translateY(-50%);" onclick="backUrl()"><img src="./image/icon-back.png" style="vertical-align: top;display:block;"></div><div class="ym_head_title"><p style="width:'+newWidth+'px;margin: 0 auto;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;color:#2C5B33;">'+title+'</p></div><div class="yu_head_share"><img src="./image/share_black.png" style="vertical-align: top;"></div></div>';
  //   }
  // }else {
  //   shtml += '<div class="ym_head" style="padding-top:'+statustop+'px'+';height:'+hee+'px'+';-moz-box-shadow:0px 0px 14px #f5f4f4; -webkit-box-shadow:0px 0px 14px #f5f4f4; box-shadow:0px 0px 14px #f5f4f4; border: 0;"><div class="ym_head_back" style="transform: translateY(-50%);" onclick="backUrl()"><img src="./image/icon-back.png" style="vertical-align: top;display:block;"></div><div class="ym_head_title"><p style="width:'+newWidth+'px;margin: 0 auto;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;color:#2C5B33;">'+title+'</p></div></div>';
  // }
  $api.html(el,shtml);
}

//小数后两位变小
function smallpirce(price){
  price=Number(price).toFixed(2)
  var result = price.substring(price.indexOf(".")+1,price.indexOf(".")+3);
  var price=price.substring(0,price.indexOf("."))
  return price+'.'+'<small>'+result+'</small>'
}

//推送通知
function pushMsg(title, content) {
  var AppKey = "1736A1E0-0B5B-BE80-2928-119C321F1202";
    // if (api.systemType == "ios") {
    //    AppKey = "1736A1E0-0B5B-BE80-2928-119C321F1202";
    // }else{
    //    AppKey = "1736A1E0-0B5B-BE80-2928-119C321F1202";
    // }
    // console.log(api.appId)
    var now = Date.now()
    var newAppKey = SHA1(api.appId + "UZ" + AppKey + "UZ" + now) + "." + now;
    api.ajax({
        url : 'https://p.apicloud.com/api/push/message',
        method : "post",
        headers: {
        "X-APICloud-AppId": api.appId,
        "X-APICloud-AppKey": newAppKey,
        "Content-Type": "application/json"
        },
        dataType: "json",
        data: {
            "body": {
                "title": title,
                "content": content,
                "type": 1, //– 消息类型，1:消息 2:通知
                "platform": 0, //0:全部平台，1：ios, 2：android
                "userIds": getname()
            }
        }
        }, function(ret, err) {
    });
}

//确认操作提示框
function comfirmDialogBox(title, callback, addressid,errback){
  if (!window.api) return
  var dialogBox = api.require('dialogBox');
  dialogBox.alert({
      texts: {
          content: title,
          leftBtnTitle: '取消',
          rightBtnTitle: '确认'
      },
      styles: {
          bg: '#fff',
          w: 290,
          content: {
              color: '#000',
              size: 14,
              marginT: 40,
              marginB: 40
          },
          left: {
              marginB: 7,
              marginL: 10,
              w: 130,
              h: 35,
                color: '#fff',
              corner: 2,
              bg: '#D8D8D8',
              size: 15
          },
          right: {
              marginB: 7,
              marginL: 10,
              w: 130,
              h: 35,
              color: '#fff',
              corner: 2,
              bg: '#ff5541',
              size: 15
          }
      }
  }, function(ret) {
      if (ret.eventType == 'left') {
        if(errback){
          errback()
        }
      }
      else if (ret.eventType == 'right'){
        if(addressid) {
          callback(addressid);
        }else {
          callback();
        }
      }
      var dialogBox = api.require('dialogBox');
      dialogBox.close({
         dialogName: 'alert'
      });
  });

}

//返回上一页
function backUrl() {
  // api.historyBack({
  // frameName: 'callback'
  //   }, function(ret, err) {
  //       if (!ret.status) {
  //           api.closeWin();
  //       }
  //   });
  api.closeWin({
    name: api.winName
  })
}

//支付密码
function getPayPassCode() {
  var container = document.getElementById("inputBoxContainer");
  boxInput = {
    maxLength: "",
    realInput: "",
    bogusInput: "",
    bogusInputArr: "",
    callback: "",
    init: function(fun) {
      var that = this;
      this.callback = fun;
      that.realInput = container.children[0];
      that.bogusInput = container.children[1];
      that.bogusInputArr = that.bogusInput.children;
      that.maxLength = that.bogusInputArr[0].getAttribute("maxlength");
      that.realInput.oninput = function() {
        that.setValue();
      }
      that.realInput.onpropertychange = function() {
        that.setValue();
      }
    },
    setValue: function() {
      this.realInput.value = this.realInput.value.replace(/\D/g, "");
      var real_str = this.realInput.value;
      for (var i = 0; i < this.maxLength; i++) {
        var newValue = real_str[i] ? real_str[i] : ""
				this.bogusInputArr[i].id = newValue
				this.bogusInputArr[i].value = newValue;
				this.bogusInputArr[i].value=this.bogusInputArr[i].value.replace(/./g,'*');
      }
      if (real_str.length >= this.maxLength) {
        this.realInput.value = real_str.substring(0, 6);
        this.callback();
      }
    },
    getBoxInputValue: function() {
      var realValue = "";
      for (var i in this.bogusInputArr) {
        if (!this.bogusInputArr[i].id) {
          break;
        }
        realValue += this.bogusInputArr[i].id;
      }
      return realValue.substring(0, 6);
    },
    clearBoxInputValue: function () {
      for (var i in this.bogusInputArr) {
        this.bogusInputArr[i].value = ""
        this.bogusInputArr[i].id = ""
      }
      this.realInput.value = ""
    }
  }
}

function OpenWebPage(url,title,data){
  openWin({
      name: 'webframe',
      url: './webframepage.html',
      historyGestureEnabled:true,
      bgColor:"#fff",
      pageParam: {
          url : url,
          title:title,
          data:data||''
      }
  });
}

function amountDialogBox(title,defaultnum,callback){
  var dialogBox = api.require('dialogBox');
dialogBox.amount({
  texts: {
      title: title,
      default: defaultnum,
      leftBtnTitle: '取消',
      rightBtnTitle: '确定'
  },
  styles: {
      bg: '#fff',
      corner: 0.5,
      w: 300,
      h: 180,
      title: {
          marginT: 20,
          size: 14,
          color: '#000'
      },
      input: {
          w: 150,
          h: 44,
          marginT: 15,
          size: 14,
          color: '#000'
      },
      dividingLine: {
          marginT: 10,
          width: 0.5,
          color: '#696969'
      },
      left: {
          marginL: 10,
          w: 135,
          h:45,
          bg: '#999',
          color: '#fff',
          size: 14
      },
      right: {
          marginR: 10,
          w: 135,
          h: 45,
          bg: '#ff4244',
          color: '#fff',
          size: 14
      }
  }
}, function(ret) {
    if (ret.eventType == 'left') {
    }else
    {
      if(ret.amount>9999999){
        promptMsg('数字过大')
        callback(999);
      }else{
        callback(ret.amount);
      }
    }
    var dialogBox = api.require('dialogBox');
    dialogBox.close({
        dialogName: 'amount'
    });
});
}
function openour(columnid,columnname){
  openWin({
      name: 'aboutmain',
      url: './aboutmain.html',
      pageParam: {
          columnid:columnid,
          title:columnname
      }
  },1);
}
//消息红点开始
function toMessagePage() {
  openWin({
      name: 'messagelist',
      url: './messagelist.html',
      pageParam: {
        title: '消息中心'
      }
  },1);
}

//去除空格换行
function iGetInnerText(testStr) {
  var resultStr = testStr.replace(/\ +/g, "");
  resultStr = testStr.replace(/[ ]/g, "");
  resultStr = testStr.replace(/[\r\n]/g, "");
  //resultStr = testStr.replace(/^\"/g, "");
  return resultStr;
}

//上下架
function AddPro(pid,obj,state,types){
  window.event? window.event.cancelBubble = true : e.stopPropagation();
https({
    url: siteUrl +'Main/Member/UpProduct',
    method: 'get',
    data: {
            proid:pid,
            uid:getname(),
            state:state
    },
    headers:1,
    successBack:function(ret){
      if(ret.status==1&&state==0){
        promptMsg('攸店上架成功');
        if(types){
          //商品详情
          $api.html($api.byId('addup'),'已上架')
        }else{
          $api.remove(obj);
        }
      }else if(ret.status==1&&state==1){
        promptMsg('攸店下架成功');
        $api.remove($api.closest(obj, 'li'));
        var i =  parseInt($api.html(document.getElementById('yuserprocount')));
        $api.html(document.getElementById('yuserprocount'),i-1);
        var s= document.querySelectorAll("#yshopprolist li")
        if(!s.length){
          api.execScript({
              name: 'yshop',
              script: 'DataBind(1,true);'
          });
        }
      }
      else {
        promptMsg(ret.err);
      }
    }
});

}

//开店接口
function kaidian(){
  //查询订单轮询
  api.showProgress({
    title: '开通店主中...',
    text: '先喝杯茶...',
    modal: true
});
https({
   url:siteUrl +'Main/Member/CheckFxShop',
   data:{
       uid:api.getPrefs({sync: true,key: 'SessionUserID'})
   },
   headers:1,
   successBack:function(ret){
     console.log($api.jsonToStr(ret));
     if(ret.success){
        if(ret.status==1&&ret.fxshopId!=''){
         api.setPrefs({ key:'SessionShopID',value:ret.fxshopId});
          setTimeout(function(){
          ReturnToIndex(2)
          },500)
       }else{
          kaidian()
       }
     }else{
       promptMsg(ret.err)
     }
   }
})
}


function someShare(url,type,title,description,thumb, callBackUrl) {
  api.imageCache({
  url: thumb
  }, function(ret, err) {
      thumb = ret.url;
    var wx = api.require('wx');
    wx.shareWebpage({
      apiKey: '',
      scene: type,
      title: title,
      description: description,
      thumb: thumb,
      contentUrl: url
    }, function(ret, err) {
      if (ret.status) {
          var dialogBox = api.require('dialogBox');
          dialogBox.close({
          dialogName: 'actionMenu'
          });
          if(callBackUrl == "groupbuyorder") {
            if(share_callback_orderid) {
              api.openWin({
                  name: callBackUrl,
                  url: 'widget://html/order/'+ callBackUrl +'.html',
                  pageParam: {
                      orderid: share_callback_orderid
                  }
              });
            }
            groups_cancelOrsuccess_msg("分享成功", "分享3次以上, 拼团成功率高达98%喔~", "widget://image/groups_success_icon.png", "继续分享", "", shareUserGroups, 1)
          }else if(callBackUrl.indexOf("noticeShareCallBack") != -1) {
            var newType = callBackUrl.split("-")[1]
            var newId = callBackUrl.split("-")[2]
            var newItemIdx= callBackUrl.split("-")[3]
            notice_share_CallBack(newType, newId, newItemIdx)
          }else {
            alert('分享成功');
          }
      } else {
          var dialogBox = api.require('dialogBox');
          dialogBox.close({
          dialogName: 'actionMenu'
          });
          if(callBackUrl == "groupbuyorder") {
            groups_cancelOrsuccess_msg("", "你还没有邀请好友拼单, 不邀请好友拼单会失败喔~", "", "去邀请好友", "暂时放弃", shareUserGroups, 1)
          }else {
            alert('分享失败');
          }
      }
    });
  });
}

//获取
function getStorage() {
  var contents = $api.getStorage('inputHisroty')
  return contents || []
}

//缓存最近搜索数据
function setStorage(msg) {
  var storage = []
  if(!$api.getStorage('inputHisroty')) {
    $api.setStorage('inputHisroty', storage);
  }
  storage = $api.getStorage('inputHisroty')
  storage.push({"time": Date.now(), "msg": msg})

  $api.setStorage('inputHisroty', storage);
}


//预览大图
function showBigImages(img,index){
  window.event? window.event.cancelBubble = true : e.stopPropagation()
  var photoBrowser = api.require('photoBrowser');
  photoBrowser.open({
      images:img,
      bgColor: '#000',
      activeIndex:index
  }, function(ret, err) {
      if (ret) {
         if(ret.eventType=='click'){
           var photoBrowser = api.require('photoBrowser');
           photoBrowser.close();
         }
      } else {
         promptMsg(ret.err)
      }
  });
}

// 获取当前屏幕宽高
function client() {
  if (document.documentElement) {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    }
  } else {
    return {
      width: document.body.clientWidth,
      height: document.body.clientHeight,
    }
  }
}

//实名认证
function checkuser(callBack,whoin){
  https({
    url: siteUrl +'Main/MemberPay/CheckUserVerified',
    data:{
      uid:getname()
    },
    headers:1,
    successBack:function(ret){
      console.log($api.jsonToStr(ret))
      if(ret.success&&ret.status==1){
        if(ret.Data.isVerified){
          callBack(ret)
        }else{
          alerts('','请先实名认证','确定',function(){
            openWin({
              name:'add_bank',
              url:'./addbank_card.html',
              pageParam:{
                title:'实名认证',
                status:0,
                whoin:whoin //whoin=pay是支付是来实名认证，下一步就去设置密码
              }
            },1)
          })
          return
        }
      }
    }
  })
}

//弹框
function alerts(title,content,btn,callBack){
  if(window.api){
  var dialogBox = api.require('dialogBox');
    dialogBox.alert({
        texts: {
            title:title,
            content: content,
            leftBtnTitle: '取消',
            rightBtnTitle: btn
        },
        styles: {
            bg: '#fff',
            w: 280,
            corner: 8,
            title:{                //（可选项）JSON对象；弹窗标题栏样式配置，不传则不显示标题区域
                marginT: 20,       //（可选项）数字类型；标题栏与对话框顶端间距；默认：20
                titleSize: 14,     //（可选项）数字类型；标题字体大小；默认：14
                titleColor: '#000' //（可选项）字符串类型；标题字体颜色，支持#、rgb、rgba；默认：#fff
            },
            content: {
                marginT: 15,
                color: '#d5cdba',
                size: 14
            },
            left: {
                w: 140,
                h: 35,
                marginL: 0,
                corner: 8,
                color: '#000',
                bg: '#fff',
                size: 14
            },
            right: {
              w: 140,
              h: 35,
              marginL: 0,
              corner: 8,
              color: '#fa2b3f',
              bg: '#fff',
              size: 14
            },
            horizontalLine:{
          color:'rgba(232,232,232,0.8)', //（可选项）字符串类型；左右按钮上边横线的颜色，支持rgb、rgba、#；默认：'rgba(245,245,245,0)'
          height:1               //（可选项）数字类型；左右边按钮横线的高度；默认：0
        },
          verticalLine:{
              color:'rgba(232,232,232,0.8)', //（可选项）字符串类型；左右按钮中间竖线的颜色，支持rgb、rgba、#；默认：'rgba(245,245,245,0)'
            width:1                //（可选项）数字类型；左右边按钮竖线的高度；默认：0
          }
        }
    }, function(ret) {
        if (ret.eventType == 'left') {
            var dialogBox = api.require('dialogBox');
            dialogBox.close({
                dialogName: 'alert'
            });
        }
        if (ret.eventType == 'right') {
            var dialogBox = api.require('dialogBox');
            dialogBox.close({
                dialogName: 'alert'
            });
            callBack()
        }
    });
  }else{
    alert(content)
    callBack()
  }
}

// 动态插入axios的cdn文件
function getAxios() {
  // 移动端就不用了
  if (!openapp) {
    var a = document.createElement("script")
    a.type = "text/javascript";
    a.src = "https://cdn.bootcss.com/axios/0.18.0/axios.min.js";
    document.body.appendChild(a)
  }
}
// 旧页面(没通过webpack打包)兼容一下浏览器与手机端
function readyOnload(callback) {
  // 获取axios的cdn
  getAxios()
  if (openapp) {
    window.apiready = function () {
      callback && callback()
    }
  } else {
    window.onload = function () {
      callback && callback()
    }
  }
}

//--------------上拉加载更多--------------- 
//获取滚动条当前的位置 
function getScrollTop() {
  var scrollTop = 0;
  if(document.documentElement && document.documentElement.scrollTop) {
    scrollTop = document.documentElement.scrollTop;
  } else if(document.body) {
    scrollTop = document.body.scrollTop;
  }
  return scrollTop;
}
//获取当前可视范围的高度 
function getClientHeight() {
  var clientHeight = 0;
  if(document.body.clientHeight && document.documentElement.clientHeight) {
    clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
  } else {
    clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
  }
  return clientHeight;
}
//获取文档完整的高度 
function getScrollHeight() {
  return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
}
// 下拉触底使用示例             滚动距离+窗口高度 == body完整高度   =   触底
/*======================================================
window.onscroll = () => {
  if (getScrollTop() + getClientHeight() == getScrollHeight()) {
              //  ----  do something  ----
  }
}
========================================================*/
//-----------------结束-------------------- 