!function(s){var n={};function i(e){if(n[e])return n[e].exports;var t=n[e]={i:e,l:!1,exports:{}};return s[e].call(t.exports,t,t.exports,i),t.l=!0,t.exports}i.m=s,i.c=n,i.d=function(e,t,s){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(i.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)i.d(s,n,function(e){return t[e]}.bind(null,n));return s},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i(i.s=256)}({0:function(e,t){e.exports=Vue},121:function(e,t,s){e.exports=s.p+"img/weixin_logo.png"},122:function(e,t,s){e.exports=s.p+"img/weixin_logo_white.png"},123:function(e,t,s){e.exports=s.p+"img/logoshou.png"},124:function(e,t,s){"use strict";var n=s(53);s.n(n).a},2:function(e,t,s){"use strict";function n(e,t,s,n,i,o,a,r){var c,p="function"==typeof e?e.options:e;if(t&&(p.render=t,p.staticRenderFns=s,p._compiled=!0),n&&(p.functional=!0),o&&(p._scopeId="data-v-"+o),a?(c=function(e){(e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),i&&i.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(a)},p._ssrRegister=c):i&&(c=r?function(){i.call(this,this.$root.$options.shadowRoot)}:i),c)if(p.functional){p._injectStyles=c;var d=p.render;p.render=function(e,t){return c.call(t),d(e,t)}}else{var l=p.beforeCreate;p.beforeCreate=l?[].concat(l,c):[c]}return{exports:e,options:p}}s.d(t,"a",function(){return n})},256:function(e,t,n){"use strict";n.r(t);function s(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[t._m(0),t._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:t.showInput,expression:"showInput"}],attrs:{id:"logo_page"}},[s("div",{staticClass:"content"},[s("div",{staticClass:"form"},[s("div",{staticClass:"input-wrap"},[s("input",{directives:[{name:"model",rawName:"v-model",value:t.telphone,expression:"telphone"}],staticClass:"txt",attrs:{type:"tel",placeholder:"请输入手机号",id:"telphone",maxlength:"11"},domProps:{value:t.telphone},on:{input:function(e){e.target.composing||(t.telphone=e.target.value)}}})]),t._v(" "),s("div",{staticClass:"input-wrap"},[s("div",{staticClass:"input-wrap-list"},[s("input",{directives:[{name:"model",rawName:"v-model",value:t.smscode,expression:"smscode"}],staticClass:"txt code-input",attrs:{type:"tel",placeholder:"请输入短信验证码",id:"smscode",maxlength:"4"},domProps:{value:t.smscode},on:{input:function(e){e.target.composing||(t.smscode=e.target.value)}}})]),t._v(" "),s("div",{staticClass:"nput-wrap-list-ft",staticStyle:{display:"flex"}},[s("span",{directives:[{name:"show",rawName:"v-show",value:120==t.times,expression:"times==120"}],staticClass:"code-btn",attrs:{id:"sendValidcode"},on:{click:t.getSmsCode}},[t._v("获取验证码")]),t._v(" "),s("span",{directives:[{name:"show",rawName:"v-show",value:120!=t.times,expression:"times!=120"}],staticClass:"code-btn",staticStyle:{color:"rgb(219, 219, 219)"}},[t._v(t._s(t.times)+"S后重新获取")])])])]),t._v(" "),s("div",{staticClass:"button margin-top-25",style:t.smskey&&4==t.smscode.length?"background: -webkit-linear-gradient(left, #ff4200, #f72213);color:#fff;":"",attrs:{tapmode:""},on:{click:t.LoginIn}},[t._v("登 录")])]),t._v(" "),s("div",{staticClass:"clearfix"}),t._v(" "),s("div",{staticClass:"footer-ft hide",attrs:{id:"divwechat"}},[s("div",{staticStyle:{color:"#DBDBDB","font-size":"12px","margin-bottom":"5%"}},[t._v("────── 第三方登录 ──────")]),t._v(" "),s("div",{staticClass:"btn_weixin",on:{click:t.WeLoginIn}},[s("img",{attrs:{src:n(121)}}),t._v("微信快捷登录\n      ")])])]),t._v(" "),t.showWx?s("div",{attrs:{id:"main_page"}},[s("div",{staticClass:"weixin_btn_index",on:{click:t.WeLoginIn}},[s("img",{attrs:{src:n(122)}}),t._v("微信快捷登录\n    ")]),t._v(" "),s("div",{staticClass:"line_center"}),t._v(" "),s("div",{staticClass:"to_tel_logo",on:{click:t.changeLogoPage}},[t._v("使用手机号码登录")])]):t._e(),t._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:t.showInv,expression:"showInv"}],staticClass:"inv"},[s("div",{staticClass:"inv_box"},[s("span",[t._v("填写邀请码")]),t._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:t.invcode,expression:"invcode"}],staticClass:"inv_inp",staticStyle:{outline:"none"},attrs:{maxlength:"6",type:"number"},domProps:{value:t.invcode},on:{input:function(e){e.target.composing||(t.invcode=e.target.value)}}}),t._v(" "),s("div",{staticClass:"btn",on:{click:t.nextStep}},[t._v("下一步")]),t._v(" "),s("div",{staticClass:"boxirem"})])]),t._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:t.showInv2,expression:"showInv2"}],staticClass:"inv"},[s("div",{staticClass:"inv_box"},[s("span",[t._v("确认邀请人")]),t._v(" "),s("div",{staticClass:"inv_man"},[s("img",{attrs:{src:t.invMsg.refereeimg}}),t._v(" "),s("span",[t._v(t._s(t.invMsg.referee))])]),t._v(" "),s("div",{staticClass:"boxirem"},[s("div",{staticClass:"btns",on:{click:t.quxiao}},[t._v("取消")]),t._v(" "),s("div",{staticClass:"btns",on:{click:t.openShop}},[t._v("确定")])])])])])}var i=n(0),o=n.n(i),a=[function(){var e=this.$createElement,t=this._self._c||e;return t("header",[t("div",{staticClass:"title"},[t("span",[t("img",{staticStyle:{width:"72px",height:"72px"},attrs:{src:n(123),alt:"社交化美食分享平台"}})])])])}];s._withStripped=!0;var r=null,c={components:{},props:{},data:function(){return{showWx:!1,showInput:!1,telphone:"",smscode:"",smskey:"",times:120,showInv:!1,showInv2:!1,invcode:"",invMsg:"",status:0}},watch:{telphone:function(e){this.telphone=$api.trim(e)},smscode:function(e){this.smscode=$api.trim(e)}},computed:{},methods:{WeLoginIn:function(){api.require("wx").auth({apiKey:""},function(e,t){if(e.status)api.ajax({url:siteUrl+"Main/Login/LoginInWeChat?devicetype=7",method:"get",dataType:"json",data:{values:{code:e.code}}},function(e,t){e?e.success?1==e.status?(api.setPrefs({key:"SessionUserID",value:e.data.userid}),api.setPrefs({key:"SessionKey",value:e.data.sessionkey}),api.setPrefs({key:"SessionShopID",value:e.data.fxshopid}),api.setPrefs({key:"loginStatus",value:"loginSuccess"}),$api.rmStorage("sessionsmscode"),api.require("push").bind({userName:"pushname",userId:e.data.userid},function(e,t){}),api.closeWin({type:"none",duration:100}),api.pageParam.isIndexComming&&api.execScript({name:"root",frameName:"new_showcoupon",script:"clos();"}),api.execScript({name:"root",frameName:"mycenter_body",script:"BindData()"}),api.sendEvent({name:"loginSuccess"}),null!=e.data.fxshopid&&""!=e.data.fxshopid&&api.sendEvent({name:"hasshopid"})):100==e.status?null!=e.data.accesstoken&&null!=e.data.openid?api.openWin({name:"login_bindmobile",url:"./login_bindmobile.html",pageParam:{accesstoken:e.data.accesstoken,openid:e.data.openid,refreshtoken:e.data.refreshtoken,expiresin:e.data.expiresin,headphoto:e.data.headphoto,userName:e.data.username,isIndexComming:api.pageParam.isIndexComming}}):promptMsg("返回参数错误"):promptMsg(e.err):promptMsg(e.err):promptMsg(t.msg)});else switch(t.code){case-1:promptMsg("当前设备未安装微信，请使用账号以及验证码登录");break;case 1:promptMsg("您已取消授权登录");break;case 2:promptMsg("您拒绝授权，登录失败");break;case 3:default:promptMsg("当前设备未安装微信，请使用账号以及验证码登录")}})},quxiao:function(){this.showInv=!1,this.showInv2=!1,this.invcode="",this.invMsg=""},nextStep:function(){var s=this;https({url:siteUrl+"Main/Member/GetCodeUser?uid="+getname(),data:{code:this.invcode},successBack:function(e){var t=e;t.success&&1==t.status?(s.invMsg={referee:t.reobj.referee,refereeimg:t.reobj.refereeimg},s.$nextTick(function(){s.showInv=!1,s.showInv2=!0})):promptMsg(t.err)}})},changeLogoPage:function(){this.showInput=!0,this.showWx=!1},getSmsCode:function(){var i=this;null!=this.telphone&&""!=this.telphone?/^[1]+[3,4,5,6,7,8,9]+\d{9}$/.test(this.telphone)?https({url:siteUrl+"Main/Login/SendSMSCode",data:{telphone:this.telphone},successBack:function(e){if(e.success&&1==e.status){i.smskey=e.Data,promptMsg("发送成功");var t=new Date,s={code:e.Data,time:t.getTime()},n=$api.jsonToStr(s);$api.setStorage("sessionsmscode",n),i.countTime()}else promptMsg(e.err)}}):promptMsg("手机号码格式错误"):promptMsg("请输入手机号码")},countTime:function(){var e=this;r=setInterval(function(){--e.times,e.times<=0&&(clearInterval(r),r=null,e.times=120)},1e3)},LoginIn:function(e){var t=this;if(this.status="","15989289012"==this.telphone){var s={code:"4b49fd74e877d70276951435d388a319",time:(new Date).getTime()},n=$api.jsonToStr(s);$api.setStorage("sessionsmscode",n)}if(null!=this.telphone&&""!=this.telphone)if(null!=this.smscode&&""!=this.smscode)if(/^[1]+[3,4,5,6,7,8,9]+\d{9}$/.test(this.telphone))if(4==this.smscode.length){var i=$api.getStorage("sessionsmscode");if(null!=i){var o=$api.strToJson(i).time;if(12e4<(new Date).getTime()-o)return promptMsg("验证码已过期"),void $api.rmStorage("sessionsmscode");https({url:siteUrl+"Main/Login/LoginIn",data:{telphone:this.telphone,smscode:this.smscode,smspassword:this.smskey,devicetype:7,code:e?this.invcode:""},successBack:function(e){if(t.status=e.status,e.success)if(99==e.status)t.showInv=!0;else if(100==e.status)t.showInv=!0;else if(1==e.status){setname("SessionUserID",e.data.userid),setname("SessionName",e.data.telphone),setname("SessionKey",e.data.sessionkey),setname("SessionShopID",e.data.fxshopid),setname("loginStatus","loginSuccess"),$api.rmStorage("sessionsmscode"),0!=e.data.newcouponnum?(api.sendEvent({name:"newuser",extra:{key1:e.data.newcouponnum}}),pageParam("isIndexComming")&&api.execScript({name:"root",frameName:"new_showcoupon",script:"getMsg();"})):pageParam("isIndexComming")&&api.execScript({name:"root",frameName:"new_showcoupon",script:"clos();"}),api.require("push").bind({userName:e.data.telphone,userId:e.data.userid},function(e,t){}),api.closeWin(),api.sendEvent({name:"loginSuccess"}),api.execScript({name:"root",frameName:"mycenter_body",script:"BindData()"}),api.execScript({name:"root",script:"ShoppingCartCount();"}),null!=e.data.fxshopid&&""!=e.data.fxshopid&&api.sendEvent({name:"hasshopid"})}else promptMsg(e.err);else promptMsg(e.err)}})}else promptMsg("验证码已过期")}else promptMsg("验证码错误");else promptMsg("手机号码格式错误");else promptMsg("请输入验证码");else promptMsg("请输入手机号码")},openShop:function(){var t=this;if(100!=this.status){https({method:"POST",url:siteUrl+"/Main/Member/OpenPracticeShop?uid="+getname()+"&devicetype=7",data:{uid:getname(),code:this.invcode,devicetype:7,shopname:this.telphone,txtwx:this.telphone,ruid:"",notice:"入手全球尖货，优选品质生活",formid:"the formId is a mock one"},headers:1,successBack:function(e){1==e.status&&e.success?t.LoginIn(1):promptMsg(e.err)}})}else this.LoginIn(1)}},created:function(){},mounted:function(){var s=this;window.api?api.require("wx").isInstalled(function(e,t){e.installed?s.showWx=!0:(s.showWx=!1,s.showInput=!0)}):s.showWx=!0}},p=(n(124),n(2)),d=Object(p.a)(c,s,a,!1,null,null,null);d.options.__file="src/page/login/index.vue";var l=d.exports;openapp?window.apiready=function(){new o.a({render:function(e){return e(l)}}).$mount("#app")}:new o.a({render:function(e){return e(l)}}).$mount("#app")},53:function(e,t,s){}});