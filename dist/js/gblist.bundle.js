!function(e){var i={};function r(t){if(i[t])return i[t].exports;var s=i[t]={i:t,l:!1,exports:{}};return e[t].call(s.exports,s,s.exports,r),s.l=!0,s.exports}r.m=e,r.c=i,r.d=function(t,s,e){r.o(t,s)||Object.defineProperty(t,s,{enumerable:!0,get:e})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(s,t){if(1&t&&(s=r(s)),8&t)return s;if(4&t&&"object"==typeof s&&s&&s.__esModule)return s;var e=Object.create(null);if(r.r(e),Object.defineProperty(e,"default",{enumerable:!0,value:s}),2&t&&"string"!=typeof s)for(var i in s)r.d(e,i,function(t){return s[t]}.bind(null,i));return e},r.n=function(t){var s=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(s,"a",s),s},r.o=function(t,s){return Object.prototype.hasOwnProperty.call(t,s)},r.p="",r(r.s=230)}({0:function(t,s){t.exports=Vue},114:function(t,s,e){"use strict";var i=e(48);e.n(i).a},2:function(t,s,e){"use strict";function i(t,s,e,i,r,o,u,n){var a,p="function"==typeof t?t.options:t;if(s&&(p.render=s,p.staticRenderFns=e,p._compiled=!0),i&&(p.functional=!0),o&&(p._scopeId="data-v-"+o),u?(a=function(t){(t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),r&&r.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(u)},p._ssrRegister=a):r&&(a=n?function(){r.call(this,this.$root.$options.shadowRoot)}:r),a)if(p.functional){p._injectStyles=a;var c=p.render;p.render=function(t,s){return a.call(s),c(t,s)}}else{var d=p.beforeCreate;p.beforeCreate=d?[].concat(d,a):[a]}return{exports:t,options:p}}e.d(s,"a",function(){return i})},230:function(t,s,e){"use strict";e.r(s);function i(){var i=this,t=i.$createElement,r=i._self._c||t;return r("div",[r("div",{directives:[{name:"show",rawName:"v-show",value:i.showMark,expression:"showMark"}],staticClass:"zhezhao",on:{click:i.closeAll}}),i._v(" "),r("div",{staticClass:"member"},i._l(i.groupBuyList.gblist,function(s,e){return r("div",{staticClass:"member-item flex"},[r("img",{attrs:{src:s.imgphoto},on:{error:function(t){return i.imgErr(e)}}}),i._v(" "),r("div",{staticClass:"flex flex_v flex_pack_justify_between flex_1"},[r("span",{staticClass:"line_over_1"},[i._v(i._s(s.realname)+"的拼团")]),i._v(" "),r("span",{},[i._v("还差"+i._s(s.num)+"人，还剩"+i._s(i.countDownTime[e]))])]),i._v(" "),r("div",{staticClass:"btn gradient",on:{click:function(t){return i.openGroup(s.isingroup,e)}}},[i._v(i._s(s.isingroup?"已参团":"快速参团"))])])}),0),i._v(" "),i.showPt?r("div",{staticClass:"ptPop flex flex_v flex_align_center flex_pack_justify_between clear",style:{top:i.showPt?"50%":"-999%"}},[r("span",{},[i._v("还差"+i._s(i.ptDetailData.count)+"人，快来拼团吧")]),i._v(" "),r("div",{staticClass:"avatar flex",class:{tomore:i.ptAvatar},attrs:{id:"avatar"}},[r("div",{staticClass:"box"},[r("img",{attrs:{src:i.ptData.imgphoto||"./img/man.jpg"}}),i._v(" "),r("div",{staticClass:"gradient name"},[i._v("团长")])]),i._v(" "),i._l(i.resobj,function(t,s){return 0<i.resobj.length?r("div",{staticClass:"box boxx"},[r("img",{attrs:{src:t.userimg||"./img/man.jpg"}})]):i._e()}),i._v(" "),i._l(i.ptCount,function(t){return i.ptCount?r("div",{staticClass:"box boxx"},[r("img",{staticStyle:{border:"1px solid #d8d8d8"},attrs:{src:e(30)}})]):i._e()})],2),i._v(" "),r("div",{staticClass:"btn gradient flex flex_align_center flex_pack_center",on:{click:function(t){return i.goGroupDetail(i.ptDetailData.orderid,i.ptData.isingroup)}}},[i._v("\n      "+i._s(i.ptData.isingroup?"已参团":"与他拼团")+"\n    ")])]):i._e(),i._v(" "),r("specpop",{directives:[{name:"show",rawName:"v-show",value:i.showSpec,expression:"showSpec"}],attrs:{pid:i.msg.productid,orderid:i.orderid,gbskuid_prop:i.groupBuyList.gbskuid,gbPrice:i.groupBuyList.gbprice,gbid:i.groupBuyList.gbid,openGroupbuy:i.openGroupbuy}})],1)}var r=e(0),o=e.n(r);i._withStripped=!0;var u={components:{specpop:e(40).a},props:{},data:function(){return{msg:{},groupBuyList:{},ptData:"",ptDetailData:"",resobj:"",ptCount:null,timer:[],countDownTime:[],showSpec:!1,openGroupbuy:0,orderid:"",showPt:!1,showMark:!1}},watch:{},computed:{ptAvatar:function(){return 3<this.resobj.length+this.ptCount.length}},methods:{closeAll:function(){this.showPt=!1,this.showSpec=!1,this.showMark=!1},getGroupBuyList:function(){var r=this;https({url:siteUrl+"Main/Main/GetGroupBuyProJson",data:{gbid:pageParam("gbid"),uid:getname(),ogid:"",fxshopid:getname("SessionShopID")},successBack:function(t){if(t.success&&1==t.status){r.getProductMsg(t.Data.gbproid),r.groupBuyList=t.Data;for(var s=r,e=0;e<t.Data.gblist.length;e++){var i=t.Data.gblist[e].ts-t.Data.gblist[e].tpgap;i<0||(t.Data.gblist[e].countDownTime=null,s.countLastTimes(i,e))}}else promptMsg(t.err)}})},getProductMsg:function(t){https({url:siteUrl+"Main/Main/GetProductDetailJson",data:{productId:t||pageParam("pid"),gbid:pageParam("gbid"),userid:getname(),fxshopid:getname("SessionShopID")},successBack:this.msgSuccessBack})},msgSuccessBack:function(t){if(t.success&&1==t.status){var s=t.Data;this.msg=s}else promptMsg(t.err)},countLastTimes:function(t,s){var o=this,u=t,n=s,a=this;this.timer[s]=setInterval(function(){(u-=1)<0&&(o.groupBuyList.gblist[n]=null,clearInterval(a.timer[n]));var t=Math.floor(u/60/60/24),s=Math.floor(u/60/60%24),e=Math.floor(u/60%60),i=Math.floor(u%60),r="";t&&(r+=t+"天"),s&&(r+=(s=s<10?"0"+s:s)+":"),(e=e<10?"0"+e:e)&&(r+=e+":"),r+=i=i<10?"0"+i:i,a.countDownTime[n]=r,a.$forceUpdate()},1e3)},openGroup:function(t,u){var n=this;t?openWin({name:"groupbuyDetail",url:"./group_detail.html",useWKWebView:!0,pageParam:{title:"拼团详情",orderid:this.groupBuyList.gblist[u].orderidlist[0].orderid}},1):(this.ptDetailData={},this.ptData=this.groupBuyList.gblist[u],https({url:siteUrl+"Marketing/Groupbuy/GetMyGroupbuyDetails",data:{ogid:this.ptData.opengroupid,uid:getname()},successBack:function(t){if(t.success&&1==t.status){var s=t.Data[0];if(s.orderid=n.groupBuyList.gblist[u].opengroupid,1<(n.ptDetailData=s).resobj.length){var e=n;n.resobj=[];for(var i=s.resobj,r=1;r<i.length;r++)e.resobj.push(i[r])}n.showMark=!0,n.showPt=!0,n.ptCount=[];e=n;for(var o=0;o<s.count;o++)e.ptCount.push(o)}else promptMsg(t.err)}}))},goGroupDetail:function(t,s){var e=!1;s||this.groupBuyList.gblist.forEach(function(t){t.isingroup&&(e=!0)});if(e)return promptMsg("您有尚未结束的拼团活动");checkLoginStatus()&&this.groupbuy(this.ptDetailData.orderid),this.showPt=!1},groupbuy:function(t){if(checkLoginStatus()){if(this.groupBuyList.gbproid="")return promptMsg("商品不存在");if(""==this.groupBuyList.gbid)return promptMsg("团购已不存在");var s="";t&&""!=t&&(s=t),this.openGroupbuy=1,this.showSpec=!0,this.showMark=!0,this.orderid=s}}},created:function(){this.getGroupBuyList()},mounted:function(){window.aaa=this}},n=(e(114),e(2)),a=Object(n.a)(u,i,[],!1,null,null,null);a.options.__file="src/page/gblist/gblist.vue";var p=a.exports;openapp?window.apiready=function(){new o.a({render:function(t){return t(p)}}).$mount("#app")}:new o.a({render:function(t){return t(p)}}).$mount("#app")},30:function(t,s,e){t.exports=e.p+"img/hui.png"},31:function(t,s,e){},40:function(t,s,e){"use strict";function i(){var r=this,t=r.$createElement,o=r._self._c||t;return o("div",[o("div",{staticClass:"sku_prompt_content"},[o("div",[o("div",{staticClass:"flex sku_prompt_top overflow_boxsizing"},[o("div",{staticClass:"box_proimg_container"},[o("img",{attrs:{src:r.msg.pic}})]),r._v(" "),o("div",{staticClass:"flex_1 flex flex_v flex_pack_justify_between sku_top_right"},[o("div",{staticClass:"color_333 fs_14 line_over_2 l"},[o("span",[r._v(r._s(r.msg.name))])]),r._v(" "),o("div",{staticClass:"flex flex_align_center"},[o("div",{staticClass:"new_price_container"},[r._v("￥\r\n                  "),o("span",{staticClass:"new_price"},[r._v(r._s(r._f("toFixed")(r.price*r.buyCount)))]),r._v(" "),o("span",{staticClass:"fs_14 color_999"},[r._v(" ￥"+r._s(r._f("toFixed")(r.oldPrice*r.buyCount)))])])])])]),r._v(" "),o("div",{staticClass:"conBox"},r._l(r.spec,function(t,i){return o("div",{key:i,staticClass:"con"},[o("p",[r._v(r._s(t.specname))]),r._v(" "),o("div",r._l(t.spectext,function(s,e){return o("span",{key:e,staticClass:"btn_sku",class:r.bindClass(i,e),on:{click:function(t){return r.changSku(s.valueid,i,e)}}},[r._v(r._s(s.ctmtext))])}),0)])}),0)]),r._v(" "),o("div",{ref:"foot",staticClass:"btnBox flex flex_pack_center flex_align_center fs_14 overflow_boxsizing b"},[o("div",{directives:[{name:"show",rawName:"v-show",value:!r.isgroupbuy,expression:"!isgroupbuy"}],staticClass:"btn_addCart",on:{click:r.groupbuynow}},[o("span",[r._v("直接买")])]),r._v(" "),o("div",{directives:[{name:"show",rawName:"v-show",value:r.isgroupbuy,expression:"isgroupbuy"}],staticClass:"btn_buy gradient",on:{click:r.gogroupbuy}},[o("span",[r._v("拼团购")])])])])])}i._withStripped=!0;var r={components:{},props:{pid:{type:String,required:!1},gbid:{type:String,required:!1},orderid:{type:String,required:!1},gbPrice:{type:Number,required:!1},gbskuid_prop:{type:String,required:!1},openGroupbuy:{type:Number,required:!1},isopenshop:{type:Boolean,required:!1},packageid:{type:String,required:!1}},data:function(){return{isgroupbuy:!1,groupbuyid:"",stocks:0,msg:"",productid:this.$props.pid,price:0,oldPrice:0,spec:"",sku:"",gbsku:"",rushsku:"",specval:"",skuid:"",gbskuid:"",skutext:"",buyCount:1,minBuyCount:0,maxBuyCount:0,uid:getname(),fxshopid:getname("SessionShopID")}},watch:{pid:function(t){this.getProMsg()},gbid:function(t){this.groupbuyid=t},openGroupbuy:function(t){var e=this;0==(this.isgroupbuy=t)?this.msg.openspec?this.sku.forEach(function(t,s){t.skuid==e.skuid&&(e.price=e.sku[s].saleprice,e.oldPrice=e.sku[s].marketprice)}):(this.price=this.msg.saleprice,this.oldPrice=Number(this.msg.marketingprice)):t&&this.gbsku&&""!=this.gbsku?this.sku.forEach(function(t,s){t.skuid==e.skuid&&(e.price=e.gbsku[s].gbskuPrice,e.oldPrice=e.sku[s].saleprice)}):t?(this.price=this.$props.gbPrice,this.oldPrice=this.msg.saleprice):this.sku?this.sku.forEach(function(t,s){t.skuid==e.skuid&&(e.price=t.saleprice)}):this.price=this.msg.saleprice}},filters:{toFixed:function(t){return t?Number(t).toFixed(2):"0.00"}},computed:{},created:function(){},mounted:function(){var t=this.$refs.foot,s=getname("safeAreaBottom")||0;t.style.paddingBottom=Number(s)+"px"},methods:{getProMsg:function(){var e=this;this.groupbuyid=this.$props.gbid,https({url:siteUrl+"Main/Main/GetProductDetailJson",method:"get",data:{productId:this.$props.pid,gbid:this.$props.gbid,userid:this.uid,fxshopid:this.fxshopid},successBack:function(t){if(t)if(t.success&&1==t.status){var s=t.Data;0<(e.msg=s).propackageprice?e.price=s.propackageprice:s.isrushbuy?(e.rushsku=JSON.parse(s.rushbuy.specjson),e.price=JSON.parse(s.rushbuy.specjson)[0].Price):e.price=s.saleprice,e.minBuyCount=s.minbuycount,e.maxBuyCount=s.maxbuycount,e.stocks=s.stock,s.openspec&&e.getMsg()}else prompt(t.err);else promptMsg(err.Msg)}})},getMsg:function(){var e=this;https({url:siteUrl+"Main/Main/GetProductSkuJson",data:{productId:this.$props.pid,gbid:this.$props.gbid||"",fxshopid:getname("SessionShopID")},successBack:function(t){if(t.success&&1==t.status){var s=t.Data;e.sku=s.sku,e.gbsku=s.gbsku,s.spec.map(function(t){t.spectext=JSON.parse(t.spectext)}),e.$props.isopenshop?e.price=s.sku[0].packageprice:e.msg.isrushbuy||(e.price=s.sku[0].saleprice),e.spec=s.spec,e.skutext=s.sku[0].skutext,e.specval=s.sku[0].specval,e.skuid=s.sku[0].skuid,e.stocks=s.sku[0].stock,e.gbskuid=s.gbsku?s.gbsku[0].gbroductskuid:""}}})},changSku:function(t,s,e){var i=this,r=this,o=this.specval.split(",");o[s]=t,this.specval=o.toString(),this.sku.forEach(function(t,s){var e="";e=r.$props.isopenshop?Number(i.sku[s].packageprice).toFixed(2):i.isgroupbuy?Number(i.gbsku[s].gbskuPrice).toFixed(2):Number(i.sku[s].saleprice).toFixed(2),t.specval==i.specval&&(i.skuid=i.sku[s].skuid,i.gbskuid=i.isgroupbuy?i.gbsku[s].gbroductskuid:"",i.specval=i.sku[s].specval,i.skutext=i.sku[s].skutext,i.price=e,i.stocks=i.sku[s].stock)});for(var u=document.getElementsByClassName("sku"+s),n=0;n<u.length;n++)u[n].classList.remove("select"),n==e&&u[n].classList.add("select");this.$emit("changeData",{skutext:this.skutext,buyCount:this.buyCount,skuid:this.skuid})},changCount:function(t){if(!this.$props.gbid){var s=t,e=this.maxBuyCount,i=this.minBuyCount,r=this.stocks,o=this.buyCount;(-1!=s||(0===i||i<o)&&1<o)&&(1!=s||0===e&&o<r||o<e&&o<r)&&(this.buyCount=this.buyCount+s,this.msg.openspec&&this.$emit("changeData",{skutext:this.skutext,buyCount:this.buyCount,skuid:this.skuid}))}},addCar:function(){var s=this;if(checkLoginStatus()){if(!s.$props.pid)return promptMsg("商品不存在");if(null==s.buyCount||""==s.buyCount||s.buyCount<1)return void promptMsg("请输入正确的数量");if(s.msg.openspec&&(""==s.skutext||""==s.skuid||""==s.price||""==s.specval))return void promptMsg("请选择正确的规格");if(s.$props.isopenshop)return void addopencar();https({url:siteUrl+"Main/Shopping/AddCart?uid="+getname(),method:"post",data:{pId:s.$props.pid,qty:s.buyCount,uid:getname(),valids:s.msg.openspec?s.specval:"",rushbuyid:s.msg.isrushbuy?s.msg.rushbuy.rushbuyid:""},headers:1,successBack:function(t){t.success?1==t.status?(promptMsg("添加成功,请到购物车查看"),s.$emit("shopcarNum")):promptMsg(t.err):checkLoginStatus()&&promptMsg(err.msg)}})}},addopencar:function(){var e=this;https({method:"post",url:siteUrl+"Main/PackageShopping/AddCart?uid="+e.uid,data:{qty:e.buyCount,packageid:api.pageParam.packageid,uid:window.api?api.getPrefs({sync:!0,key:"SessionUserID"}):$api.getStorage("SessionUserID"),valids:e.specval},headers:1,successBack:function(t){if(t.success&&1==t.status){var s=e.$props.packageid?"购物袋":"购物车";promptMsg("添加成功,请到"+s+"查看"),e.$emit("shopcarNum")}else promptMsg(t.err)}})},buyNow:function(){var s=this;if(checkLoginStatus()){if(!s.$props.pid)return promptMsg("商品不存在");if(null==s.buyCount||""==s.buyCount||s.buyCount<1)return void promptMsg("请输入正确的数量");if(s.msg.openspec&&(""==s.skutext||""==s.skuid||""==s.price||""==s.specval))return void promptMsg("请选择正确的规格");if(s.msg.isrushbuy&&s.msg.rushbuy.begintimeticks>this.msg.nowtimetick)return void promptMsg("抢购活动尚未开始，请先加入购物车");https({url:siteUrl+"Main/Shopping/CheckProductBuyStatus?devicetype=7",method:"get",data:{uid:window.api?api.getPrefs({sync:!0,key:"SessionUserID"}):$api.getStorage("SessionUserID"),pid:s.$props.pid,buycount:s.buyCount,skuid:s.skuid,rushbuyid:""},headers:1,successBack:function(t){t.success&&1==t.status?openWin({name:"ordercomfirm",url:"./ordercomfirm.html",pageParam:{way:"buynow",qty:s.buyCount,skutext:s.skutext,skuid:s.skuid,gbskuid:s.gbskuid,skuprice:s.price,pid:s.$props.pid,rushbuyid:s.msg.isrushbuy?s.msg.rushbuy.rushbuyid:"",title:"订单确认"}},1):promptMsg(t.err)}})}},buyopennow:function(e){var i=this,r=this;https({url:siteUrl+"Main/PackageShopping/CheckPackageBuyStatus",data:{uid:window.api?api.getPrefs({sync:!0,key:"SessionUserID"}):$api.getStorage("SessionUserID"),packageid:r.$props.packageid||"",buycount:e,skuid:r.skuid},headers:1,successBack:function(t){if(t.success&&1==t.status){var s=[];s.push({PackageID:r.$props.packageid,BuyCount:e,SkuID:i.skuid,CompanyID:r.msg.companyid}),openWin({name:"packageordercomfirm",url:"./packageordercomfirm.html",pageParam:{packageselectdata:s,type:1,skuprice:r.price}})}else promptMsg(t.err)}})},bindClass:function(t,s){return 0==s?"sku"+t+" select":"sku"+t},gogroupbuy:function(){var s=(e=this).$props.orderid?e.$props.orderid:"";if(checkLoginStatus()){var e=this;https({url:siteUrl+"Main/Shopping/CheckGroupBuyStatus?devicetype=7",method:"get",data:{uid:getname(),gbid:e.$props.gbid},headers:1,successBack:function(t){1==t.status&&t.success?e.gbsku?openWin({name:"ordercomfirm",url:"./ordercomfirm.html",pageParam:{way:"groupbuynow",qty:1,skutext:e.skutext,skuid:e.skuid,gbskuid:e.gbskuid,gbprice:e.price,pid:e.msg.productid,gbid:e.$props.gbid,opengroupid:s,title:"订单确认",headfree:e.msg.headfree?1:0}},1):openWin({name:"ordercomfirm",url:"./ordercomfirm.html",pageParam:{way:"groupbuynow",qty:1,skutext:"",skuid:e.$props.gbskuid_prop,gbprice:e.price,pid:e.msg.productid,gbid:e.$props.gbid,opengroupid:s,title:"订单确认",headfree:e.msg.headfree?1:0}},1):promptMsg(t.err)}})}},groupbuynow:function(){if(checkLoginStatus()){var e=this;https({url:siteUrl+"Main/Shopping/CheckProductBuyStatus?devicetype=7",method:"get",data:{uid:getname(),pid:e.msg.productid,buycount:e.buyCount},headers:1,successBack:function(t){if(t.success&&1==t.status){var s="";s=e.gbsku?e.skuid:e.$props.gbskuid,openWin({name:"ordercomfirm",url:"./ordercomfirm.html",pageParam:{way:"buynow",qty:1,pid:e.msg.productid,skuid:s,skutext:e.skutext,skuprice:e.price,title:"订单确认"}},1)}else promptMsg(t.err)}})}}}},o=(e(94),e(2)),u=Object(o.a)(r,i,[],!1,null,"7652ebfd",null);u.options.__file="src/components/specpop/specpop.vue";s.a=u.exports},48:function(t,s,e){},94:function(t,s,e){"use strict";var i=e(31);e.n(i).a}});