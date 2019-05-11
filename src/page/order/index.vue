<template>
    <div ref='app'>
      <van-tabs v-model="active" :swipe-threshold="5" :swipeable="true" @change='change' @click='change' color='#333' :sticky="true">
        <van-tab :title="items" v-for="(items,indexs) in titledata" :key="indexs">
<div class="orderbox" v-for="(item,index) in data" :key="index">
            <div class="oredertou">
                <div class='oredertouleft'>
                  <i class="iconfont icon-shangdian" style="color:#FE334B;"></i>
                    <p>{{item.shopname}}</p>
                    <!-- <span class="newright-arrow"></span> -->
                </div>
                <!-- //拼团提示语 -->
                <!-- <p class="orp"  v-if="(item.orderstate == 20 || item.orderstate == 30)&&item.gbid&&!item.orderitems[0].isrefundorder">
                  {{item.gbstate==1?'等待成团，快去邀请小伙伴参与吧..':item.gbstate==2?(item.orderstate==30?'拼团成功，商品已经在路上，请耐心等待...':'拼团成功，商品正在打包中，请耐心等待...'):'拼购失败,已全额退款'}}
                </p>
                <p class="orp"  v-if="inds < 1 && (((item.orderstate == 20 || item.orderstate == 30) && item.gbid === null) || orderitems.isrefundorder)" v-for="(orderitems,inds) in item.orderitems" :key="inds">
        {{orderitems.isrefundorder ? (orderitems.refundstatus === 1 ? '商品退款审核中，请您耐心等待....' : orderitems.refundstatus === 2 ? '商品退款申请被拒绝...' : orderitems.refundstatus === 3 ? (item.gbdata.headfree&&item.gbstate <3 ? '恭喜您，获得团长免单机会，已全额退款':'商品退款成功') : orderitems.refundstatus === 4 ? '商品退款申请已失效...' : '商品退款申请处理中...') : (item.orderstate === 20 ? '商品正在打包中，请耐心等待...' : item.orderstate === 30 ? '商品已经在路上，请耐心等待...' : '')}}
                </p> -->
                <p class="orp">
                  {{item.orderstate|orderstate}}
                </p>
            </div>
            <!-- 商品 -->
            <div class="ordermain" v-for="(list,idx) in item.orderitems" :key="idx" @click="godetail(item.orderid)"> 
                <img :src="list.pic" alt="">
                <div class="ordermainright">
                <div class='ordertitle'>
                  <p>
                    <!-- <span class="ping" v-if="item.gbdata!=null">劲爆拼团</span>
                    <span class="ping"  v-if="list.isrushbuy">限时抢购</span>
                    <span class="chou"  v-if="item.ordetype==110">天天抽奖</span>
                    <span class="chou"  v-if="item.ordetype==4||item.ordetype==12">创业礼包</span> -->
                    {{list.proname}}
                   </p>
                   <!-- <p class="skutext">{{list.skutext}} <span class="procount">x{{list.buycount}}</span></p> -->
                </div>
                <div class="skute">
                  <p class="skutext">{{list.skutext}}</p>
                  <p>x{{list.buycount}}</p>
                </div>
                <div class='orderprice'>
                  <!-- 改正抽奖的商品价格显示 -->
                  <p v-if="list.ordertype == 110">&yen;{{Number(item.ordertotal / list.buycount).toFixed(2)}}</p>
                  <p v-else>&yen;{{list.price}}</p>
                  <!-- <p>x{{list.buycount}}</p> -->
                </div>
                </div>
            </div>
            <!-- 总计 -->
            <div class="allprice">
              <p>共{{item.totalbuycount}}件商品&nbsp;&nbsp;&nbsp;合计：<span>&yen;{{item.total}}</span></p>
            </div>
            <!-- 按钮 -->
            <div class="btnzu">
              <p class='paybtn' v-if="item.orderstate==10"  @click="deletorder(item.orderid)">取消订单</p>
              <p class='quxiapbtn' v-if="item.orderstate==10" @click="openpaybox(item.orderid,item.gbid,item.orderitems[0].ordertype,item.orderitems[0].invitationcode,item.gbdata ? item.gbdata.ogid : '')">付款</p>
              <p class='querenbtn' v-if="item.orderstate==30" @click="ReceiptOrder(item.orderid)">确认收货</p>
              <p class='querenbtn' v-if="item.orderstate==40&&item.isopencomment" @click="toAssess(item.orderid)">评价晒单</p>
            </div>
        </div>
        <!-- 去付款弹窗 -->
        <div v-show="payboxshow">
          <div class='zezao' @click="closebox"></div>
          <div class="paybox" :style="payboxshow?'bottom:0':''">
              <div class="payli payone">
                <div class='paylileft'>
                  <img src="../../img/orderdetail/zhifubao.png" alt="">
                  <p>支付宝</p>
                </div>
                <div>
                    <van-radio-group v-model="paycode">
                        <van-radio name="alipay" checked-color="#ff5541"></van-radio>
                    </van-radio-group>
                </div>
              </div>
              <div class="payli">
                <div class='paylileft'>
                  <img src="../../img/orderdetail/weiXin-pay.png" alt="">
                  <p>微信</p>
                </div>
                <div>
                    <van-radio-group v-model="paycode">
                        <van-radio name="wxpay" checked-color="#ff5541"></van-radio>
                    </van-radio-group>
                </div>
              </div>
              <!-- <div class="payli">
                <div class='paylileft'>
                  <img src="../../img/orderdetail/qianbao-pay.png" alt="">
                  <p>钱包支付</p>
                </div>
                <div>
                    <van-radio-group v-model="paycode">
                        <van-radio name="cashpay" checked-color="#ff5541"></van-radio>
                    </van-radio-group>
                </div>
              </div> -->
              <div class="okpay" @click="PayOrder" :style="safeAreaBottom?'padding-bottom:'+safeAreaBottom+'px':''">
                确认
              </div>
          </div>
        </div>
        <div  id="yaoqinbox" v-show="payopenshop">
          <div class="zhezaos" @click="showmodel(1)"></div>
          <div style="position:relative">
          <div class="tanchuan">
              <div class='inputbox' id="bu1" style="text-align:center" v-show="modelstatu==1">
                <!-- <input type="tel" name="" value="" placeholder="请填写推荐人邀请码" maxlength="6" id="yaoqingnum"> -->
                <p>邀请码不可更改，如需更改请重新下单</p>
              </div>
              <div class="tuijianren" id="bu2" v-show="modelstatu==2">
                <p>推荐人信息</p>
                <img :src="tuiimg ? tuiimg : './img/man.jpg'" alt="" id="tuiimg">
                <p id="tuiname">{{tuiname}}</p>
              </div>
              <div class="appbtn yanbtn" @click="nextgo()" id="next">{{modelstatu==1?'下一步':'确定'}}</div>
            </div>
          </div>
        </div>
        <div class='nodedata' v-if="data.length==0">
            <img src="../../img/noorders.png">
            <div class='wenzi'>
              <p>抱歉，您还没有相关的订单～</p>
            </div>
        </div>
        </van-tab>
      </van-tabs>
    </div>
</template>

<script>
export default {
  components:{},
  props:{},
  data(){
    return {
      data:'',
      stops:false,
      currentPage:1,
      paycode:'wxpay',
      payboxshow:false,//打开规格
      gbidorder:false,//是否是拼团订单
      payorderid:'',//支付用id
      invitationcode:'',//提交用邀请码
      payopenshop:false,//
      modelstatu:1,
      tuiimg:'',
      tuiname:'',
      titledata:['全部','待付款','待发货','待收货','已完成'],
      orderstatus:'',
      active:'',
      safeAreaBottom:'',
      ogid: '',     //  暂时为解决拿不到ogid的问题
      paypwdisnull: 1,
    }
  },
  filters:{
      orderstate:function(value){
   return value == 10? '待付款':value == 11? '待处理': value == 20? '待发货': value == 30? '已发货': value == 40? '交易完成': value == 50? '已退货': value == 60? '已退款': value == 62? '申请换货': value == 70? '交易关闭': '--'
      }
  },
  watch:{},
  computed:{},
  methods:{
    change(index,title){
      var that=this
       that.currentPage=1
        that.stops=false
      if(index==0){
        that.orderstatus='all'
        that.BindData()
      }else if(index==1){
        that.orderstatus='payment'
        that.BindData()
      }else if(index==2){
        that.orderstatus='pending'
        that.BindData()
      }else if(index==3){
        that.orderstatus='receipt'
        that.BindData()
      }else if(index==4){
        that.orderstatus='completion'
        that.BindData()
      }
    },
    BindData(){
      var that=this
           https({
        url:siteUrl + 'Main/Member/GetOrderListJson?devicetype=7',
        data:{
          currpage:that.currentPage,
            pagesize:8,
            uid :getname(),
            // orderstatus :pageParam('orderstatus'),
            orderstatus:that.orderstatus,//'all','payment','pending','receipt','completion'
            //  isgroupby:''+api.pageParam.isgroupby+''
        },
        headers:'1',
        successBack:function(ret){
          if(ret.status==1 &&ret.success && ret.Data!=null){
            if(that.currentPage==1){
               that.data=ret.Data
            }else{
             that.data=that.data.concat(ret.Data)
            }
          }else if(ret.status==2 &&ret.success){
            if(that.currentPage==1){
               that.data=[]
            }
            that.stops=true
          }else{
            promptMsg(ret.err);
          }
          if (window.api) refreshDone()
          
      }
    })
    },
    // 打开支付
    openpaybox(orderid,gbid,ordertype,code, ogid){
      this.ogid = ogid
      var that=this
      if(gbid!=null){
        that.gbidorder=true
      }else{
         that.gbidorder=false
      }
      if(ordertype==4&&getname('SessionShopID')==''){
         that.invitationcode=code,//提交用邀请码
         that.payopenshop=true
      }else{
      that.payboxshow=true
      that.invitationcode=''
      }
      that.payorderid=orderid
    },
    closebox(){
      this.ogid = ''
      this.payboxshow=false
    },
    PayOrder(){
      var that=this
      if(that.payorderid==''){
          promptMsg('参数出错');
          return;
      }
      // if(that.paycode=='wxpay'){
      //         https({
      //            url: siteUrl +'Main/Shopping/GetWeChatPayOrderInfo',
      //            data:{
      //             orderid:that.payorderid,
      //             uid :getname()
      //            },
      //            headers:1,
      //            successBack:function(ret){
      //                  if(ret.success&&ret.status==1&&ret.Data!=null&&ret.Data!=""){
      //                     if(that.gbidorder) {
      //                       wechatpay(ret.Data,'wxpay','buynow','./groups_success.html', that.payorderid, ret.ogid, 'isgroupswechatpay')
      //                     }else {
      //                       //直接开店
      //                       if(that.invitationcode){
      //                         //直接开店
      //                         wechatpay(ret.Data,'wxpay','buynow','./success.html', that.payorderid,'','')
      //                       }else{
      //                         wechatpay(ret.Data,'wxpay','buynow','./success.html', that.payorderid)
      //                       }
      //                     }
      //                   }else{
      //                     promptMsg(ret.err)
      //                   }

      //            }
      //         })
      //   }
      if (that.paycode == 'sinacashpay') {
        checkuser(function(){
          //检测是否设置了密码
          https({
            url:siteUrl +'Main/MemberPay/CheckPayPwd',
            method:'get',
            data:{
              uid: getname(),
              devicetype: 7
            },
            headers:1,
            successBack: ret => {
              if(ret.success&&ret.status==1){
                if(ret.Data.issetpwd=='N'){
                  OpenWebPage(ret.Data.url,'密码设置')
                  return
                }else if(ret.Data.issetpwd=='Y'){
                  that.payNow()
                }
              }else{
                promptMsg(ret.err)
                return
              }
            }
          })
        },'pay')
      } else if (that.paycode == 'cashpay') {
        api.openFrame({
          name: 'paypasswordframe',
          url: './paypasswordframe.html',
          rect: {
            x: 0,
            y: 0,
            w: 'auto',
            h: 'auto'
          },
          pageParam: {
            payAllPrice: this.needpay,
            isSeted: this.paypwdisnull,
            payOrderWinName: api.winName,
            paySuccessBack: "payNow"
          },
          bounces: false,
          bgColor: 'rgba(0,0,0,0.3)'
        });
      } else if(that.paycode=='alipay'){
        https({
           url:siteUrl +'Main/Shopping/GetAliPayOrderInfo?devicetype=7',
           data:{
              orderid:that.payorderid,
              uid :getname()
           },
           headers:1,
           successBack:function(ret){
            if(ret.success&&ret.status==1&&ret.Data!=null&&ret.Data!=""){
              var ogid=ret.ogid
              var aliPayPlus = api.require('aliPayPlus');
              aliPayPlus.payOrder({
                  orderInfo: decodeURIComponent(ret.Data)
              }, function(ret, err) {
                  if(ret.code == "9000"){
                    //支付查状态
                    // ping_ordernow(that.payorderid,ogid,ret.code)
                    if(that.gbidorder) {
                      ShoppingSuccess('',"buynow",'./groups_success.html', that.payorderid, ogid, "isgroupswechatpay")
                    }else {
                      if(that.invitationcode){
                        //直接开店
                        kaidian()
                      }else{
                        ShoppingSuccess('',"buynow",'./success.html', that.payorderid)
                      }
                    }
                  } else {
                     //支付查状态
                     if(ret.code!='6001'){
                        // ping_ordernow(that.payorderid,ogid,ret.code)                       
                     }
                    pushMsg("订单号: ["+ that.payorderid + "] 订单提交成功,等待付款", that.payorderid)
                    api.alert({
                        title: '支付结果',
                        msg:alipayReturnCode(ret.code),
                        buttons: ['确定']
                    });
                  }
                  that.currentPage = 1;
                  that.stops= false;
                  that.BindData();
                  that.closebox();
              });
            }else {
                promptMsg(ret.err);
            }             
           }
        })
      } else {
        this.payNow()
      }
      
    },
    payNow(){
      var that = this
      // var payid = this.paycode == 'sinacashpay' ? '20181120165196549862' : this.paycode == 'wxpay' ? '20190404101726660360' : ''
      var payid = this.paycode == 'cashpay' ? '20170824112865489534' : this.paycode == 'wxpay' ? '20190404101726660360' : ''
      
      // return
      https({
        // url: siteUrl +'Main/ShoppingSinaPay/GetPayOrderInfo',
        url: siteUrl +'Main/Shopping/GetWeChatPayOrderInfo',
        method: 'get',
        data:{
          orderid: that.payorderid,
          uid : getname(),
          payid,
          devicetype: 7,
          devicemac:getname()
        },
        headers: 1,
        successBack:(ret, err) => {
          console.log(JSON.stringify(ret))
          if (ret) {
            if(ret.success&&ret.status==1&&ret.Data!=null&&ret.Data!=""){
              if(that.paycode=='sinacashpay'){
                // if(ret.Data.ogid && ret.Data.ogid.length > 0) {
                //   ShoppingSuccess(paycode,"buynow",'../groups/groups_success.html', ret.Data.orderids, ret.Data.ogid, "isgroupswechatpay");
                // }else {
                //   ShoppingSuccess(paycode,"buynow",'../tool/success.html', ret.Data.orderids);
                // }
                var paydata={
                  orderids:ret.Data.orderids,
                  ogid:ret.Data.ogid,
                  paycode:that.paycode,
                  name:'payshow'
                }
                OpenWebPage(ret.Data.payorderinfo,'支付',paydata)
              }else if(that.paycode=='wxpay'&&ret.Data!=null&&ret.Data!=""){
                
                if(that.gbidorder) {
                  // wechatpay的方法会对订单信息进行字符串转JSON，所以这里就先JSON转字符串了
                  // ret.Data = JSON.stringify(ret.Data)
                  var payorderinfo = ret.Data
                   if (ret.ogid) {
                     wechatpay(payorderinfo, "wxpay", "buynow", "./groups_success.html", that.payorderid, ret.ogid, "isgroupswechatpay");
                   } else {
                     wechatpay(payorderinfo, "wxpay", "buynow", "./groups_success.html", that.payorderid);
                   }
                  // wechatpay(ret.Data.payorderinfo,'wxpay','buynow','./groups_success.html', ret.ogid, that.payorderid, 'isgroupswechatpay')
                }else {
                  //直接开店
                  // if(opendian){
                  //   //直接开店
                  //   wechatpay(ret.Data.payorderinfo,'wxpay','buynow','../tool/success.html', that.payorderid,'','',openimagese)
                  // }else{
                  //   wechatpay(ret.Data.payorderinfo,'wxpay','buynow','../tool/success.html', that.payorderid)
                  // }
                  wechatpay(ret.Data,'wxpay','buynow','./success.html', ret.ogid)
                }
              }
              // if(gbid) {
              //   wechatpay(ret.Data,'wxpay','buynow','../groups/groups_success.html', orderid, ret.ogid, 'isgroupswechatpay')
              // }else {
              //   //直接开店
              //   if(opendian){
              //     //直接开店
              //     wechatpay(ret.Data,'wxpay','buynow','../tool/success.html', orderid,'','',openimagese)
              //   }else{
              //     wechatpay(ret.Data,'wxpay','buynow','../tool/success.html', orderid)
              //   }
              // }
              }else{
                console.log(JSON.stringify(ret))
                promptMsg(ret.err)
              }
          } else {
            console.log(JSON.stringify(err))
            promptMsg(err.msg)
          }
        }
      });
    },
    onScroll() {
      var that=this
      //可滚动容器的高度
      let innerHeight = that.$refs.app.clientHeight;
      //屏幕尺寸高度
      let outerHeight = document.documentElement.clientHeight;
      //可滚动容器超出当前窗口显示范围的高度

      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      //scrollTop在页面为滚动时为0，开始滚动后，慢慢增加，滚动到页面底部时，出现innerHeight < (outerHeight + scrollTop)的情况，严格来讲，是接近底部。
      console.log(innerHeight <= (outerHeight + scrollTop))
      if (innerHeight <= (outerHeight + scrollTop)) {
        //加载更多操作
        if(!that.stops){
          that.currentPage += 1
          that.BindData()
        }
      }
    },
    deletorder(orderid){
      var that=this
        comfirmDialogBox('是否删除订单？',function(){
      https({
        url: siteUrl +'Main/Member/CloseOrder?devicetype=7&uid='+ getname(),
        method: 'post',
        data:{
           orderid: orderid,
           uid: getname()         
        },
        headers:1,
        successBack:function(ret){
            if(ret.success){
                if(ret.status==1){
                  that.currentPage = 1;
                  that.stops= false;
                  that.BindData();
                  pushMsg("订单号: ["+ orderid + "] 关闭成功", orderid)
                  promptMsg('订单关闭成功');
                }
                else{
                  promptMsg(ret.err);
                }
            }
            else{
                if(checkLoginStatus()){
                  promptMsg(err.msg);
                }
            }
        }
      })
    })
    },
    ReceiptOrder(orderid){
      var that=this
        comfirmDialogBox('你确定已收到货物了吗？',function(){
      https({
        url: siteUrl +'Main/Member/ReceiptOrder?devicetype=7&uid='+ getname(),
        method: 'post',
        data:{
           orderid: orderid,
           uid: getname()         
        },
        headers:1,
        successBack:function(ret){
            if(ret.success){
                if(ret.status==1){
                  that.currentPage = 1;
                  that.stops= false;
                  that.BindData();
                  promptMsg('您已确认收货');
                }
                else{
                  promptMsg(ret.err);
                }
            }
            else{
                if(checkLoginStatus()){
                  promptMsg(err.msg);
                }
            }
        }
      })
    })
    },
    godetail(orderid){
      console.log(orderid)
      openWin({
        name:'orderdetail',
        url:'./orderdetail.html',
        pageParam:{
          orderid:orderid,
          title:'订单详情'
        }
      },1)
    },
        //开店框
   showmodel(index){
      if(index){
       this.payopenshop=false
      }
    },
    nextgo(){
      var that=this
      if(that.modelstatu==1){
        https({
          url: siteUrl +'Main/Member/GetCodeUser?uid='+ getname(),
          data:{
            code: that.invitationcode
          },
          headers:1,
          successBack:function(ret){
            if(ret.success&&ret.status==1){
              that.modelstatu=2
              if(ret.reobj.refereeimg){
                that.tuiimg=ret.reobj.refereeimg
              }
              that.tuiname=ret.reobj.referee
            }else{
              promptMsg(ret.err)
            }
          }
        })
      }else if(that.modelstatu==2){
        //填完就开店去
       that.payopenshop=false
       that.payboxshow=true
       that.modelstatu=1
      }
    },
    toAssess(orderId){
        openWin({
        name: 'assess',
        url: './assess.html',
        historyGestureEnabled:true,
        pageParam: {
            orderId: orderId,
            title:'评价晒单'
        }
    },1);
    },
    BindMember() {
      var that = this;
      https({
        url: siteUrl + "Main/Member/GetMemberJson",
        data: {
          uid: getname()
        },
        headers: 1,
        successBack: function(ret) {
          if (ret.status == 1 && ret.success) {
            that.paypwdisnull = ret.Data.paypwdisnull
          } else {
            promptMsg(ret.err);
          }
        }
      });
    },
  },
  created(){
    // 获取会员信息
    this.BindMember()
  },
  mounted(){
    var that=this
    that.safeAreaBottom=getname('safeAreaBottom') || 0
    that.$refs.app.style.paddingBottom = that.safeAreaBottom + 'px'
    if(window.api){
          api.setCustomRefreshHeaderInfo({
      bgColor: '#f8f8f8',
      images: [
          'widget://image/suaxin1.png',
          'widget://image/suaxin2.png',
          'widget://image/suaxin3.png',
          'widget://image/suaxin4.png',
          'widget://image/suaxin5.png',
          'widget://image/suaxin6.png',
          'widget://image/suaxin7.png'
      ],
      tips: {
          pull: '下拉刷新',
          threshold: '松开立即刷新',
          load: '正在刷新'
      }
    }, function() {
        that.stops= false;
        that.currentPage = 1;
        that.BindData();
      });
      api.addEventListener({name: 'scrolltobottom'}, function(ret, err){
        if(!that.stops){
          that.currentPage += 1
          that.BindData()
        }
      });


    } else {
      window.addEventListener('scroll', this.onScroll);
    }

    var index=pageParam('selectindex')
    this.active=index
    this.change(index)
  }
}
</script>
<style lang="scss">
body{
  background: #f5f5f5
}
.van-ellipsis {
  color: #333;
}
.van-tab--active .van-ellipsis{
  color: #FE334B;
}
.van-tabs__content{
  margin-top: rems(40);
}
.van-tabs__line {
  background-color: #FE334B !important;
}
.orderbox{
    margin: 0 rems(30);
    padding: 0 rems(24);
    margin-bottom: rems(20);
    background-color: #fff;
    border-radius: 8px;
}
.oredertou{
    @include item;
    color: #427161;
    padding: rems(30) 0;
    border-bottom: 1px solid #f6f6fa;
    justify-content: space-between;
    font-size: rems(26);
    p {
      color: #000000;
      font-size: rems(28);
    }
    .orp {
      color: #FE334B !important;
      font-size: rems(28);
      margin-right: rems(20);
    }
    .oredertouleft{
      i{
        margin-right: rems(10);
        margin-left: rems(15);
        font-size: rems(36);
      }
      @include item;  
      color: #427161;
      .orp{
        font-weight:500;
      }  
    }
}
.ordermain{
      @include item;
      // padding: rems(30) 0;
      padding-top: rems(30);
      img{
        height: rems(200);
        width: rems(200);
        border-radius: 8px;
        flex-shrink: 0;
        margin-right: rems(20);
      }
      .ordertitle{
        display: flex;
        
        p{
         @include font2;
         font-size: rems(24);
         line-height: rems(40);
        }
        width: 100%;
        flex-direction: column;
        justify-content: space-between;
      }
      .ordermainright{
        display: flex;
        // margin-bottom: rems(80);
        min-height: rems(130);
        width: 100%;
        flex-direction: column;
      }
      .orderprice{
        // text-align: right;
        //  width: 32%;
        p:nth-child(1){
          color: #FE334B;
          font-size: rems(32);
          line-height: rems(44);
          font-weight: 600;
        }
      }
}
.allprice{
  text-align: right;
  border-top: 1px solid #F6F6FA;
  border-bottom: 1px solid #F6F6FA;
  padding: rems(15) 0;
  margin-top: rems(10);
  width: 100%;
  p{
    font-size: rems(28);
    color: #333
  }
  span{
    color: #333;
    font-weight: 600;
  }
}
.btnzu{
  @include item;
  justify-content: flex-end;
  padding: rems(16) 0;
  .paybtn{
    @include item;
    justify-content: center;
    background:rgba(245,172,158,0);
    border:1px solid #999;
    border-radius:25px;
    width:rems(150);
    height:rems(50);
    font-size: rems(26);
    margin-left: rems(20);
    color: #999;
  }
  .quxiapbtn{
    @include item;
    justify-content: center;
    background:rgba(245,172,158,0);
    border:1px solid #FE334B;
    border-radius:25px;
    width:rems(150);
    height:rems(50);
    font-size: rems(26);
    margin-left: rems(20);
    color: #FE334B;
  }
  .querenbtn{
    @include item;
    justify-content: center;
    background:rgba(245,172,158,0);
    border:1px solid #FE334B;
    color: #FE334B;
    margin-left: rems(20);
    border-radius:25px;
    width:rems(150);
    height:rems(50);
    font-size: rems(26);
  }
}
img{
  display: block;
}
.paybox{
  position: fixed;
  bottom: -200px;
  width: 100%;
  z-index: 99999;
  background-color: #fff;
  transition: all 2s;
}
.zezao{
  position: fixed;
  z-index: 9999;
  top: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  width: 100%;
}
.payli{
   @include item; 
     margin: 0 rems(30);
   justify-content: space-between;
   padding: rems(14) 0;
   font-size: rems(28);
   color: #666464;
   img{
     width: rems(50);
     height: rems(50);
     margin-right: rems(16)
   }
   .paylileft{
        @include item; 
   }
}
  .payone{
     border-bottom: 1px solid #DEDEE1
   }
.okpay{
  color: #fff;
  padding: rems(20) 0 rems(40) 0;
  text-align: center;
  background-color: #ff5541;
  font-size: rems(36)
}
.van-radio__input{
    height: 1.1em;

}
  .zhezaos{position: fixed;width: 100%;top: 0;bottom: 0;background-color: rgba(0,0,0,0.4);z-index: 9999}
  .tanchuan{position: fixed;width: 80%;left: 10%;top:30%;background-color: #fff;z-index: 99999;height: 190px;border-radius: 8px;font-size: rems(30)}
  .inputbox{width: 90%;margin: 0 auto;margin-top: 70px;margin-bottom: 40px;}
  .tanchuan input{color: #999;padding: 8px 0;border-bottom: 1px solid #f6f6fa;width: 100%;}
  .appbtn{width: 80%;position: absolute;left: 10%;bottom: 10px;}
  .tuijianren{text-align: center;}
  .tuijianren img{width: 44px;height: 44px;margin: 0 auto;border-radius: 50%;margin-bottom: 8px;}
  .tuijianren p:nth-child(1){color: #999;font-size: 12px;margin-top: 20px;margin-bottom: 13px;}
  .tuijianren p:nth-child(3){color: #333;font-size: 14px;font-weight: 700;}
  .aps1 span{color: #333;font-weight:normal;}
  .nodedata{
  margin: 0 auto;
  margin-top: 15%;
  text-align: center;
  font-size: rems(24);
  padding-top: rems(80);
  img{
    width: 50%;
    margin: 0 auto;
  }
  .wenzi{
    margin-top: -20px;
    color: #999;
  }
  .tag_big{
    font-size: rems(28);
    border: 1px solid #FF5541;
    padding: rems(14) 0;
    width:rems(230);
    margin: 0 auto;
    border-radius: 30px;
    color: #FF5541;
  }
  .fontSize12{
    padding: rems(16) 0;
  }
}
.ping{
  background: #F5AC9E;
  padding: rems(4) rems(10);
  border-radius: 30px;
  color: #fff;
}
.chou{
    background: #427161;
  padding: rems(4) rems(10);
  border-radius: 30px;
  color: #fff;
}
.skutext {
  
  // margin-top: rems(15);
}
.skute {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: rems(5);
  // flex-wrap: wrap;
  p {
    color: #999;
    font-size: rems(24);
    line-height: rems(40);
  }
  p:nth-child(1) {
    width: 85%;
  }
  p:nth-child(2) {
    width: 10%;
  }
}
</style>