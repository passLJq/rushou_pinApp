<template>
  <div>
    <div id="main" style="width: 100%;"></div>
    <div class="my_tou" @click='gologin' style="flex-direction: column;">
      <div style="display: flex;align-items:center">
        <img :src="userMsg&&userMsg.pic ? userMsg.pic : './img/man.jpg'" @click="goUserData">
        <div class="usMsg">
          <div style="display:flex;flex-wrap:wrap;">
            <span class="usn">{{usn}}</span>
            <!-- <span class="iconfont icon-cc-star tuanz " v-if="{{uid}}">团长</span> -->
          </div>
          <span v-if="userMsg.code&&fxshopid">邀请码: {{userMsg.code}}</span>
        </div>
      </div>
      <div class="usernum">
        <div @click="gomyincome">
          <p>{{userMsg.blance || 0}}</p>
          <p>钱包余额</p>
        </div>
        <div @click="gomycounp">
          <p>{{userMsg.couponcount || 0}}</p>
          <p>优惠券</p>
        </div>
        <div @click="gomessagelist">
          <p>{{messageNum}}</p>
          <p>未读消息</p>
        </div>
      </div>
    </div>
    <!-- 我的订单 -->
    <div class="order_box">
      <div class="items my_ordertitle">
        <span>我的订单</span>
        <div class="my_p1 items" @click="toOrder(0)">查看全部
          <i class="right-arrow"></i>
        </div>
      </div>
      <div class="line"></div>
      <div class="items jihuabox">
        <div class="my-item" @click="toOrder(1)">
          <div style="position:relative">
            <img src="../../img/daifuk.png">
            <span class='translateX_icon' v-if="orderState.unpay > 0">{{orderState.unpay}}</span>
          </div>
          <span class="texts">待付款</span>
        </div>
        <div class="my-item" @click="toOrder(2)">
          <div style="position:relative">
            <img src="../../img/daifahuo.png">
            <span class='translateX_icon' v-if="orderState.tobesend > 0">{{orderState.tobesend}}</span>
          </div>
          <span class="texts">待发货</span>
        </div>
        <div class="my-item" @click="toOrder(3)">
          <div style="position:relative">
            <img src="../../img/daishouhuo.png">
            <span class='translateX_icon' v-if="orderState.unreceipt > 0">{{orderState.unreceipt}}</span>
          </div>
          <span class="texts">待收货</span>
        </div>
        <div class="my-item" @click="toAfterSale(0)">
          <div style="position:relative">
            <img src="../../img/shouhou.png">
          </div>
          <span class="texts">售后/退换</span>
        </div>
      </div>
    </div>

    <div class="order_box ">
      <div class="items my_ordertitle">
        <span>我的拼团</span>
        <div class="my_p1 items" @click="gogrouporder(100)">查看全部
          <i class="right-arrow"></i>
        </div>
      </div>
      <div class="line"></div>
      <div class="items jihuabox myping" v-if="uid">
        <div class="my-item" @click="gogrouporder(1)">
          <div style="position:relative">
            <span class="numm">{{userPing.jinxing}}</span>
          </div>
          <span class="texts">正在进行中</span>
        </div>

        <div class="my-item" @click="gogrouporder(2)">
          <div style="position:relative">
            <span class="numm">{{userPing.chengtuan}}</span>
          </div>
          <span class="texts">已成团</span>
        </div>

        <div class="my-item" @click="gogrouporder(100)">
          <div style="position:relative">
            <span class="numm">{{userPing.quanbu}}</span>
          </div>
          <span class="texts">全部拼团</span>
        </div>
      </div>
    </div>

    <div class="order_box" v-if="fxshopid">
      <div class="items my_ordertitle">
        <span>我的收益</span>
        <!-- <div class="my_p1 items" @click="gomyshouyi">查看全部
          <i class="right-arrow"></i>
        </div> -->
      </div>
        <div class="line"></div>
      <div class="shouyibox">
        <div class="shouyi_left">
          <div>总金额(元)</div>
            <div>{{userMsg.totalCommision}}</div>
            <div>即将到账:<span style="color:#FE334B">+{{userMsg.sooncommision}}</span></div>
        </div>
        <div class="shouyi_right">
          <div @click="gomyshouyi">查看明细</div>
          <div @click='goapps'>提  现</div>
        </div>
      </div>
    </div>

    <div class="order_box">
      <div class="items my_ordertitle">
        <span>我的服务</span>
        
      </div>
      <div class="line"></div>
      <div class="items jihuabox pd24" style='flex-wrap: wrap;'>
        <!-- <div class="my-item itemimg" @click="goMylndiana">
          <div style="position:relative">
            <img src="../../img/wdcj.png">
          </div>
          <span class="texts">我的抽奖</span>
        </div> -->

        <div class="my-item itemimg" @click="gomycounp">
          <div style="position:relative">
            <img src="../../img/wdyhq.png">
          </div>
          <span class="texts">我的优惠券</span>
        </div>

        <div class="my-item itemimg" @click="gocouponcenter">
          <div style="position:relative">
            <img src="../../img/lqzx.png">
          </div>
          <span class="texts">领券中心</span>
        </div>

        <div class="my-item itemimg" @click="gomessagelist">
          <div style="position:relative">
            <img src="../../img/xxtz.png">
          </div>
          <span class="texts">消息通知</span>
        </div>

        <div class="my-item itemimg" @click="goaddress">
          <div style="position:relative">
            <img src="../../img/dzgl.png">
          </div>
          <span class="texts">地址管理</span>
        </div>

        <div class="my-item itemimg mt_46" style="padding: 0;background: #fff;margin: 0;line-height: normal;" @click="gokefu">
          <div style="position:relative">
            <img src="../../img/lxdh.png">
          </div>
          <span class="texts">常见问题</span>
        </div>

        <div class="my-item itemimg mt_46" @click="phoneCall">
          <div style="position:relative">
            <img src="../../img/gonghuo.png">
          </div>
          <span class="texts">供货申请</span>
        </div>
        
        <div class="my-item itemimg mt_46" @click="gowechat">
          <div style="position:relative">
            <img src="../../img/wxjb.png">
          </div>
          <span class="texts">微信解绑</span>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  components:{},
  props:{},
  data(){
    return {
      userMsg:'',//个人信息
      uid:'',
      fxshopid: '',
      orderState: {
        unpay: "", //待付款
        tobesend: "", //待发货
        unreceipt: "", //待收货
        Completed: "" //已完成
      },
      userPing: {
        chengtuan: 0,			// 已成团
        jinxing: 0,				// 进行中
        quanbu: 0					// 全部拼单
      },
      usn: '',		// username
      goapp:false,
      messageNum: 0
    }
  },
  watch:{
    
  },
  computed:{},
  methods: {
    goaddress:function(){
      if(checkLoginStatus()) {
        openWin({
          name:'addressList',
          url:'./addressList.html',
          pageParam:{
            title:'地址管理',
            onshow:1
          }
        },1)
      }
    },
    goUserData() {
      if (checkLoginStatus()) {
        openWin({
          name: 'userdata',
          url: './userData.html',
          pageParam: {
            title: '个人设置'
          },
          bgColor: '#f5f5f5'
        }, 1)
      }
    },
    gologin:function(){
      if (!getname()) {
        if(checkLoginStatus()) {
        }
      }
    },
    gowechat: function () {
      if (checkLoginStatus()) {
        openWin({
          url: './change_user_msg.html',
          name: 'unBind',
          pageParam: {
            isBind: 1,
            uname: 1
          }
        })
      }
    },
    gogrouporder:function(index){
      if (checkLoginStatus()) {
        openWin({
          name: 'group_order',
          url: './group_order.html',
          pageParam: {
            title: '我的拼单',
            index
          }
        }, 1)
      }
    },
    // 联系客服
    gokefu() {
      openWin({
        name:'normalProblem',
        url: './normalProblem.html',
        pageParam: {
          title: '常见问题'
        }
      }, 1)
    },
    goapps:function(){
      if(this.userMsg.isintern=='1'){
        promptMsg('实习团长不能提现')
        return
      }else{
          checkuser(function(){
            https({
              url:siteUrl +'Main/MemberPay/CheckPayPwd',
              method:'get',
              data:{
                uid:getname(),
                devicetype:7
              },
              headers:1,
              successBack:function(ret){
                  if(ret.success&&ret.status==1){
                    if(ret.Data.issetpwd=='N'){
                      OpenWebPage(ret.Data.url,'密码设置')
                    }else if(ret.Data.issetpwd=='Y'){
                      openWin({
                        name:'xl_tixian',
                        url:'./xl_tixian.html',
                        pageParam:{
                          title:'提现'
                        }
                      },1)
                    }
                  }else{
                    promptMsg(ret.err)
                  }
              }
            })
          })  
      }
    },
    bindData() {
      this.uid = getname()
      this.fxshopid = getname('SessionShopID')
      if (getname()){
      //获取个人信息
      https({
        url: siteUrl + 'Main/Member/GetMemberJson?devicetype=7',
        data: {
          uid: getname()
        },
        headers: 1,
        successBack: (ret) => {
          refreshDone()
          hideLoading()
          if (ret && ret.status == 1) {
            //在其他客户端开店后这里可以刷新开店
            if (getname('SessionShopID') == ''){
              if(ret.Data.fxshopid!=''){
                setname('SessionShopID', ret.Data.fxshopid)
              }
            }
            this.userMsg = ret.Data,
            this.usn = ret.Data.name
          }
        }
      })
      //获取个人拼单数据
      https({
        url: siteUrl + 'Main/main/GetUserGBJson?devicetype=7',
        data: {
          userid: getname()
        },
        // header: 1,
        successBack: ret => {
          if (ret.success) {
            this.userPing = {
              chengtuan: ret.chengtuan,
              jinxing: ret.jinxing,
              quanbu: ret.quanbu,
            }
          } else {
            promptMsg(ret.err)
          }
        }
      })
      //获取订单数量
      https({
        url: siteUrl + 'Main/Member/GetOrderCountJson?devicetype=7',
        data: {
          uid: getname(),
          wxprogram: 1
        },
        headers: 1,
        successBack: (ret) => {
          if (ret && ret.status == 1) {
            let data = ret.Data
            let unpay = 0
            let tobesend = 0
            let unreceipt = 0
            let Completed = 0
            data.forEach((item, idx) => {
              switch (item.state) {
                case 10: //待付款
                  unpay = item.count
                  break;
                case 20: //待发货
                  tobesend = item.count
                  Completed += item.count
                  break;
                case 30: //待收货
                  unreceipt = item.count
                  Completed += item.count
                  break;
                case 40: //已完成
                  Completed += item.count
                  break;
              }
            })
            this.orderType = ret.Data,
            this.orderState = {
              unpay: unpay, //待付款
              tobesend: tobesend, //待发货
              unreceipt: unreceipt, //待收货
              Completed: Completed, //已完成
            }
          }
        }
      })
      // 查询用户消息
      https({
        url: siteUrl + 'Main/Member/GetMyFirstMessageList?devicetype=7',
        data: {
          uid: getname()
        },
        headers: 1,
        successBack: (ret) => {
          if (ret.success && ret.status == 1) {
            var data = ret.Data[0]
            this.messageNum = Number(data.myassetsurcount) + Number(data.myfxorderurcount) + Number(data.mynoticeurcount) + Number(data.myorderurcount) + Number(data.mysaleorderurcount) + Number(data.myteamurcount)
          } else {
            promptMsg(ret.err)
          }
        }
      })
      } else {
        this.usn = '请登录'
      }
    },
    // 跳转我的夺宝
    goMylndiana() {
      if (checkLoginStatus()) {
        openWin({
          name: 'myLndiana',
          url: './new_my_lndiana.html',
          pageParam: {
            title: '我的抽奖'
          },
          bgColor: '#f5f5f5'
        }, 1)
      }
    },
    gokanjia(){
      promptMsg('尚未开启，敬请期待！')
    },
    // 跳转我的订单
    toOrder(index) {
      if (checkLoginStatus()) {
        openWin({
          name: 'order',
          url: './order.html',
          pageParam: {
            title: '我的订单',
            selectindex: index
          },
          bgColor: '#f5f5f5'
        }, 1)
      }
    },
    // 跳转售后
    toAfterSale(selectindex) {
      if (checkLoginStatus()) {
          openWin({
              name: 'orderrefund',
              url: './orderrefundlist_top.html',
              pageParam:{
                selectindex:selectindex
                // biaoji: 'shouhou'
              }
          })
      }
    },
    // 跳转消息中心
    gomessagelist: function () {
      openWin({
        name: 'messagelist',
        url: './messagelist.html',
        pageParam: {
          title: '消息中心'
        }
      }, 1)
    },
    // 跳转领券中心
    gocouponcenter() {
      if (checkLoginStatus()) {
        openWin({
          name: 'coupon_center',
          url: './coupon_center.html',
          pageParam: {
            title: '领券中心'
          },
          bgColor: '#f5f5f5'
        }, 1)
      }
    },
    // 跳转官方客服
    toShopGroup() {
      // wx.navigateTo({
      //   url: '/pages/other/shopgroup/shopgroup',
      // })
    },
    //跳转我的优惠券
    gomycounp(){
      openWin({
        name: 'my_coupon',
        url: './my_coupon.html',
        pageParam: {
          title: '我的优惠券'
        },
        bgColor: '#f5f5f5'
      }, 1)
    },
    phoneCall(e) {
      // wx.navigateTo({
      //   url: '/pages/other/shopgroup/shopgroup',
      // })
      openWin({
        name: 'shopgroup',
        url: './shopgroup.html',
        pageParam: {
          title: '供货申请'
        }
      }, 1) 
    },
    gomyshouyi(){
      if (checkLoginStatus()) {
        openWin({
          name: 'commDetail',
          url: './commDetail.html',
          pageParam: {
            title: '我的收益'
          },
          bgColor: '#f5f5f5'
        }, 1)
      }
    },
    gomyincome(){
   if (checkLoginStatus()) {
      openWin({
        name:'myincome',
        url:'./myincome.html',
        pageParam:{
          title:'我的钱包',
          sooncommision:this.userMsg.sooncommision
        }
      },1)
    }
    }
  },
  created(){
    var that = this
    this.bindData()
    if (window.api) {
      api.addEventListener({
        name: 'viewappear'
      }, function(ret, err){
        that.bindData()
      })
      api.addEventListener({
        name: 'loginSuccess'
      }, function(ret, err){
        that.bindData()
      })
      api.addEventListener({
        name: 'loginout'
      }, function(ret, err){
        that.userMsg =''
        that.uid =''
        that.fxshopid = ''
        that.orderState = {
          unpay: "",
          tobesend: "",
          unreceipt: "",
          Completed: "" 
        }
        that.userPing = {
          chengtuan: 0,
          jinxing: 0,
          quanbu: 0
        }
        that.usn ='请登录',
        that.messageNum = 0
      })
      //下拉刷新
      api.setCustomRefreshHeaderInfo({
        bgColor: '#fff',
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
          setTimeout(function(){
            if(checkLoginStatus()){
              that.uid = getname()
              that.fxshopid = getname('SessionShopID')
              that.bindData()
            }else{
              refreshDone()
            }
          },1000)
      })
    }
  },
  mounted(){
    var s = getname('statustop') || 0
    $api.byId('main').style.height = s + 'px'
  }
}
</script>
<style lang="scss">
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  .pd24 {
    padding: rems(24) 0;
  }
  #main {
    background-color: rgba(254,51,75,1);
  }
  body {
    background: #fff;
    padding-bottom: rems(20);
  }
  .usernum {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: rems(40);
    div {
      width: 25%;
      display: flex;
      flex-direction: column;
      align-items: center;
      p {
        color: #fff;
        font-size: rems(24);
      }
      p:nth-child(1) {
        font-size: rems(34);
        font-weight: 600;
        margin-bottom: rems(10);
      }
    }
  }
  .my_tou {
    height: rems(400);
    display: flex;
    // align-items: center;
    padding: rems(38) rems(52);
    // padding-top: rems(60);
    justify-content: center;
    background:linear-gradient(180deg,rgba(254,51,75,1) 0%,rgba(255,114,130,1) 100%);
  }

  .my_tou img {
    width: rems(144);
    height: rems(144);
    border-radius: 50%;
    margin-right: rems(21);
  }

  .my_tou .usMsg {
    height: rems(120);
    display: flex;
    flex-direction: column;
  }
  .my_tou .usMsg > span {
    font-size: rems(28);
    font-weight: 400;
    color: #fff;
    margin-top: rems(25);
  }

  .my_tou .usMsg .tuanz {
    font-size: rems(20);
    color: #fff;
    background:rgba(195,26,46,1);
    border-radius:rems(16);
    padding: rems(6) rems(28);
    border:rems(2) solid rgba(255,134,149,1);
    line-height: rems(40);

  }
  .my_tou .usMsg .tuanz::before {
    margin-right: rems(6);
    /* font-size: rems(24); */
  }

  .my_tou .usn {
    color: #fff;
    font-size: rems(36);
    font-weight: 600;
    margin-right: rems(22);
    overflow: hidden;text-overflow:ellipsis;white-space: nowrap;
    max-width: rems(440);
  }

  .items {
    display: flex;
    align-items: center;
  }

  .my_ordertitle {
    background-color: #fff;
    justify-content: space-between;
    padding: rems(24) rems(30) rems(24) rems(30);
  }

  .my_ordertitle span {
    font-size: rems(36);
    font-weight: 700;
    color: #333;
  }

  .my_p1 {
    font-size: rems(28);
    margin-right: rems(14);
    color: #999;
  }

  .my_p1 i {
    margin-top: rems(2);
  }

  .jihuabox {
    background: #fff;
    padding: rems(30) rems(30);
  }

  .jihuabox .my-item img {
    width: rems(48);
    height: rems(48);
    margin: 0 auto;
    margin-bottom: rems(8);
  }

  .my-item.itemimg img {
    width: rems(56) !important;
    height: rems(56) !important;
  }

  .jihuabox .my-item {
    width: 25%;
    font-size: rems(24);
    text-align: center;
  }

  .order_box {
    margin: 0 rems(20);
    border-radius: rems(16);
    overflow: hidden;
    margin-top: rems(-40);
    box-shadow: 0px 2px 20px 0px rgba(153, 153, 153, 0.15);
    margin-bottom: rems(20);
    background-color: #fff;
  }
  .other_box,.act_oredr{
    margin: 0 rems(20);
      border-radius: 8px;
    overflow: hidden;
    box-shadow: 0px 2px 20px 0px rgba(153, 153, 153, 0.15);
    margin-bottom: rems(20);
  }
  .other_li{
    padding: rems(24) 0 rems(28) 0;
    text-align: center;
    width: 25%;
  }
  .other_li img{
    width: rems(48);
    height: rems(48);
    margin: 0 auto;
  }
  .other_li span{
    font-size: rems(24);
  }
  .act_li{
    width: 33.3%;
    text-align: center;
    padding: rems(40) 0;
  }
  .act_li img{
    width:rems(64);
    height: rems(64);
    margin: 0 auto;
  }
  .act_li span{
  font-size: rems(24);
  }
  .btnms{
    background: #fff;
    line-height:inherit;
    border-radius: 0;
    border: 1px solid #fff;
    color: #333
  }
  button::after {
    border: none
  }

  .order_box + .order_box {
    margin-top: rems(20);
  }

  .numm {
    font-size: rems(34);
    color: #333;
    font-weight:bold;
  }

  .line {
    width:rems(654);
    height:rems(2);
    background:rgba(246,246,250,1);
    margin: 0 auto;
  }

  .myping {
    display: flex;
    justify-content: space-between;
  }

  .mt_46 {
    margin-top: rems(46) !important;
  }
  .shouyibox{
    display: flex;
    justify-content: space-between; 
    padding: rems(26) rems(32);
  }
  .shouyi_left div:nth-child(1){
    font-size: rems(24);
    color: #333333;
    padding-bottom: rems(8);
  }
  .shouyi_left div:nth-child(2){
    font-size: rems(48);
    color: #333333;
    font-weight: 700;
    padding-bottom: rems(8);
  }
  .shouyi_left div:nth-child(3){
    font-size: rems(24);
    color: #333333;
    padding-bottom: rems(8);
  }
  .shouyi_right div:nth-child(1){
    color: #FE334B;
    font-size: rems(24);
    border: 1px solid #FE334B;
    padding: rems(12) rems(24);
    text-align: center;
    border-radius: 30px;
    margin-bottom: rems(16);
    margin-top: rems(20);
  }
  .shouyi_right div:nth-child(2){
    color: #fff;
    background:linear-gradient(270deg,rgba(254,51,75,1) 0%,rgba(255,114,130,1) 100%);
    font-size: rems(24);
    padding: rems(12) rems(24);
    text-align: center;
    border-radius: 30px
  }
  .translateX_icon {
    position: absolute;
    top: -20%;
    left: 50%;
    transform: translateX(rems(10));
    background-color: #FF422C;
    color: #fff;
    border-radius: rem(20);
    padding: 0 rem(5.5);
    height: rem(16);
    line-height: rem(16);
    font-size: rems(24);
  }
</style>