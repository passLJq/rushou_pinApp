<template>
  <div>
    <!-- 收货地址 -->
    <section class="adderbox" v-if="addressjson.length!=0" @click="goaddresslist">
      <div class="adderbox_left">
        <div class="addername">
          <p>{{addressjson.name}}</p>
          <p>{{addressjson.phone}}</p>
        </div>
        <p class="adder_desc">{{addressjson.fullarea+addressjson.address}}</p>
      </div>
      <i class="newright-arrow"></i>
    </section>
    <section class="adderbox" v-else @click="goaddresslist">
      <div class="noadder">
        <img src="../../img/ordercomfirm/plus_add.png" alt>
        <p>点击添加一个地址</p>
      </div>
      <i class="newright-arrow"></i>
    </section>
    <!-- 全球购身份证号 -->
    <section class="idbox" v-if="cross">
      <p>身份证号</p>
      <input
        type="text"
        placeholder="因海关需要，请填写收货人身份证号"
        v-model="idcardtext"
        @blur="CheckOrSaveIDCard"
        maxlength="18"
      >
    </section>
    <section class="probox">
      <!-- //拼团和立即购买 -->
      <div class="pro" v-if="onway=='buynow'||onway=='groupbuynow'">
        <img :src="projson.pic" alt class="proimg">
        <div class="pro_right">
          <p class="pro1">
            <!-- <span>二人团</span> -->
            {{projson.name}}
          </p>
          <p class="prosku">{{onepro.skutext}}</p>
          <div class="proprice">
            <p>&yen;{{onepro.proprice|number2}}</p>
            <p>x{{onepro.qty}}</p>
          </div>
        </div>
      </div>
      <!-- 分享夺宝商品详情 -->
       <div class="pro" v-if="onway=='lndiana'">
        <img :src="lndianajson.proimg" alt class="proimg">
        <div class="pro_right">
          <p class="pro1">
            <!-- <span>二人团</span> -->
            {{lndianajson.proname}}
          </p>
          <p class="prosku">{{lndianajson.skutext}}</p>
          <div class="proprice">
            <p>&yen;{{lndianajson.price|number2}}</p>
            <p>x{{lndianajson.qty}}</p>
          </div>
        </div>
      </div>
            <!-- 分享夺宝商品详情 end-->
      <div class="liuyan">
        <p>买家留言</p>
        <input type="text" placeholder="请输入内容" v-model="remark">
      </div>
    </section>
    <section class="jiegebox">
      <div class="zongjia">
        <p>商品总价</p>
        <p>&yen;{{total|number2}}</p>
      </div>
      <div class="youhuijuan" @click="openyouhui" v-if="!headfree&&onway!='lndiana'">
        <div class="youhui_left">
          <img src="../../img/ordercomfirm/youhuijuan.png" alt>
          <p>优惠券</p>
        </div>
        <p class="youhui_right">
          <span v-if="coudata.tolal">-{{coudata.tolal|number2}}</span>
          <i class="newright-arrow"></i>
        </p>
      </div>
      <div class="shifu afu">
        <p>商品实付</p>
        <p>&yen;{{needpay|number2}}</p>
      </div>
      <div class="shifu">
        <p>商品运费</p>
        <p>包邮</p>
      </div>
    </section>
    <section class="needbox">
      <div class="needtou">
        <p>支付方式</p>
      </div>
      <div class="zhifubox" @click="selectpayway(0)">
        <div class="zhifu_left">
          <img src="../../img/ordercomfirm/weixin.png" alt>
          <p>微信支付</p>
        </div>
        <img src="../../img/ordercomfirm/sclectactive.png" alt class="zhifu_right" v-if="paywho[0]">
        <img src="../../img/ordercomfirm/select.png" alt class="zhifu_right" v-else>
      </div>
      <div class="zhifubox" @click="selectpayway(2)">
        <div class="zhifu_left">
          <img src="../../img/ordercomfirm/zhifubao.png" alt>
          <p>支付宝支付</p>
        </div>
        <img src="../../img/ordercomfirm/sclectactive.png" alt class="zhifu_right" v-if="paywho[2]">
        <img src="../../img/ordercomfirm/select.png" alt class="zhifu_right" v-else>
      </div>
      <div class="zhifubox" @click="selectpayway(1)" v-if="onway!='lndiana'">
        <div class="zhifu_left">
          <img src="../../img/ordercomfirm/qianbao.png" alt>
          <p>钱包余额支付
            <span style="margin-left:5px;color:#FE334B">(&yen;{{memberjson.blance}})</span>
          </p>
        </div>
        <img src="../../img/ordercomfirm/sclectactive.png" alt class="zhifu_right" v-if="paywho[1]">
        <img src="../../img/ordercomfirm/select.png" alt class="zhifu_right" v-else>
      </div>
    </section>

    <section class="paybox">
      <p>&yen;{{needpay|number2}}</p>
      <div class="paybtn" @click="paymoney">去支付</div>
    </section>

    <usecoupon
      :CouponsList="CouponsList"
      :openusecou="openusecou"
      @getcansu="getcoud"
      :fu_coudata="coudata"
      @closebox="openyouhui"
    ></usecoupon>
  </div>
</template>

<script>
import usecoupon from "../../components/use_coupon/use_coupon.vue";

export default {
  components: {
    usecoupon
  },
  props: {},
  data() {
    return {
      addressjson: [],
      projson: "",
      onepro: {
        proprice: "", //商品单价,
        qty: "", //选择的数量
        skutext: ""
      },
      remark: "", //留言
      total: "", //商品总合计
      needpay: "", //商品实际支付
      paywho: [true, false], //支付切换用
      payway: [
        {
          paycode: "wxpay",
          // payid: "20180929145311965542"
          payid: "20190404101726660360"
        },
        {
          // paycode: "sinacashpay",
          paycode: "cashpay",
          // payid: "20181120165196549862"
          payid: '20170824112865489534'
        },
        {
          paycode: "alipay",
          payid: '20091208120710069746'
        }
      ], //支付方式
      cross: false, //是否全球购,
      idcardtext: "", //id身份证
      idcardok: false, //是否通过校检
      memberjson: "",
      openusecou: false, //打开使用优惠券
      comfirmdata: [], //提交用参数
      CouponsList: [], //查询可用优惠券用参数
      coudata: {}, //提交优惠券参数
      onlyone: false, //防止重复提交
      headfree:pageParam('headfree'),//是否团长免单
      lndianajson:[],//分享夺宝商品
      onway:pageParam('way'),
      paypwdisnull: 0,      // 是否设置了支付密码
    };
  },
  filters: {
    number2(value) {
      var a = Number(value);
      return a.toFixed(2);
    },
    number0(value) {
      var a = Number(value);
      return a.toFixed(0);
    }
  },
  watch: {},
  computed: {},
  methods: {
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
            that.memberjson = ret.Data;
            that.paypwdisnull = ret.Data.paypwdisnull
          } else {
            promptMsg(ret.err);
          }
        }
      });
    },
    BindAdress(addressid) {
      var that = this;
      https({
        url: siteUrl + "Main/Shopping/GetAddressJson?devicetype=7",
        data: {
          uid: getname(),
          addressid: addressid
        },
        headers: 1,
        successBack: function(ret) {
          if (ret.status == 1 && ret.success) {
            if (ret.Data.length > 0) {
              that.addressjson = ret.Data[0];
            }
          } else {
            promptMsg(ret.err);
          }
        }
      });
    },
    binddata() {
      var that = this;
      var way = pageParam("way");
      //立即购买和拼团
      if (way == "buynow" || way == "groupbuynow") {
        https({
          url: siteUrl + "Main/Main/GetProductDetailJson",
          data: {
            productId: pageParam("pid")
          },
          headers: 1,
          successBack: function(ret) {
            if (ret.status == 1 && ret.success) {
              that.projson = ret.Data;
              //有规格id则拿规格价
              if (pageParam("skuid")) {
                that.onepro.proprice = pageParam("skuprice");
                //拼团价格
                if (pageParam("way") == "groupbuynow") {
                  that.onepro.proprice = pageParam("gbprice");
                }
                //单规格
              } else {
                //拼团价格
                if (pageParam("way") == "groupbuynow") {
                  that.onepro.proprice = pageParam("gbprice");
                } else {
                  that.onepro.proprice = ret.Data.saleprice;
                }
              }
              that.onepro.qty = pageParam("qty");
              that.onepro.skutext = pageParam("skutext");
              //团长免单
              if(pageParam("headfree") == 1 && !pageParam('opengroupid')){
                that.needpay = that.total = 0
              }else{
                that.needpay = that.total = that.onepro.proprice * that.onepro.qty;
              }
              //是否全球购
              if (ret.Data.iscross) {
                that.cross = true;
              }
              //提交用参数
              var comfirmdata = [];
              comfirmdata.push({
                companyId: ret.Data.companyid,
                companyName: ret.Data.shopname,
                remark: that.remark,
                delcode: "1",
                freeFreight: 0,
                cartItemsId: "",
                proid: ret.Data.productid,
                buynum: pageParam("qty"),
                skuId:
                  pageParam("skuid") == "undefined" ? "" : pageParam("skuid"),
                gbskuid: pageParam("gbskuid")
              });
              that.comfirmdata = comfirmdata;
              //查询优惠券用参数
              let CouponsList = [];
              CouponsList.push({
                shopid: ret.Data.companyid,
                productID: ret.Data.productid,
                proskuid: pageParam("skuid") == "undefined" ? "" : pageParam("skuid"),
                GBID: pageParam("gbid"),
                buycount: pageParam("qty"),
                RushBuyID: ""
              });
              that.CouponsList = CouponsList;
            } else {
              promptMsg(ret.err);
            }
            console.log(ret);
          }
        });
        //分享夺宝
      }else if(way=='lndiana'){
        https({
       url: siteUrl + 'Marketing/Cloudbuy/GetSubmitOrder',
        data: {
          uid: getname(),
          cloudid: pageParam('cid')
        },
        headers: 1,
        successBack: function(ret){
          that.getLndianaData(ret)
        }      
        })
      }
    },
    //夺宝商品详情
    getLndianaData(ret){
      var that=this
     if (ret.success && ret.status == 1) {
        let data = ret.Data[0]
        console.log(data)
        data.qty=pageParam('num')
        that.lndianajson=data
       that.total=that.needpay=data.price*pageParam('num')
      } else {
        promptMsg(ret.err);
      }
    },
    //选择支付
    selectpayway(index) {
      var ab = [];
      var that = this;
      for (let index = 0; index < that.paywho.length; index++) {
        ab.push(false);
      }
      that.paywho = ab;
      Vue.set(that.paywho, index, true);
    },
    //支付校检
    paymoney() {
      //全球购商品校检
      if (this.cross) {
        if (!this.idcardok) {
          promptMsg("请填写正确的身份证号");
          return;
        }
      }
      var that = this;
      //重复提交判断
      if (that.onlyone) {
        promptMsg("请勿重复提交");
        return;
      }
      if (that.comfirmdata.length < 1&&that.onway!='lndiana') {
        promptMsg("没有待支付商品");
        return;
      }
      //地址校检
      if (!that.addressjson.id) {
        promptMsg("请选择地址");
        return;
      }
      //支付方式
      var payid = "";
      var paycode = "";
      for (let index = 0; index < that.paywho.length; index++) {
        if (that.paywho[index]) {
          payid = that.payway[index].payid;
          paycode = that.payway[index].paycode;
        }
      }
      //检测用钱包是否实名认证
      if (paycode == "sinacashpay") {
        checkuser(function() {
          //检测是否设置了密码
          https({
            url: siteUrl + "Main/MemberPay/CheckPayPwd",
            method: "get",
            data: {
              uid: getname(),
              devicetype: 7
            },
            headers: 1,
            successBack: function(ret) {
              if (ret.success && ret.status == 1) {
                if (ret.Data.issetpwd == "N") {
                  OpenWebPage(ret.Data.url, "密码设置");
                } else if (ret.Data.issetpwd == "Y") {
                  that.payorderNow();
                }
              } else {
                promptMsg(ret.err);
              }
            }
          });
        }, "pay");
      } else if (paycode == 'cashpay') {
        hideLoading()
        if (pageParam('headfree') && !pageParam('opengroupid')) {
          that.payorderNow()
        } else {
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
              paySuccessBack: "payorderNow"
            },
            bounces: false,
            bgColor: 'rgba(0,0,0,0.3)'
          })
        }
      } else {
        that.payorderNow()
      }
    },
    //立即购买
    payorderNow() {
      //支付方式
      var that = this;
      var payid = "";
      var paycode = "";
      for (let index = 0; index < that.paywho.length; index++) {
        if (that.paywho[index]) {
          payid = that.payway[index].payid;
          paycode = that.payway[index].paycode;
        }
      }
      showLoading()
      //重复提交限制
      that.onlyone = true;
      if(that.onway=='lndiana'){
       https({
        url: siteUrl + '/Marketing/Cloudbuy/PayCloud?uid=' +getname(),
        method: 'post',
        data: {
          uid: getname(),
          buycount: pageParam('num'),
          cloudid: pageParam('cid'),
          paycode: paycode,
          addressid: that.addressjson.id,
          remark: that.remark
        },
        headers: 1,
        successBack: function(ret){
          that.lndianapay(ret)
        }
      })
      }else{
        console.log(1111111)
        console.log(paycode)
        https({
          // url: siteUrl + "Main/ShoppingSinaPay/PayComfirmOrdersNow?devicetype=7&uid=" + getname(),
          url: siteUrl + "Main/Shopping/PayComfirmOrdersNow?devicetype=7&uid=" + getname(),
          method: "post",
          data: {
            memberid: getname(),
            sourcetype: 0,
            addressid: that.addressjson.id,
            timeid: "",
            payid: payid,
            paycode: paycode,
            gbid: pageParam("gbid"),
            opengroupid: pageParam("opengroupid"),
            data: that.comfirmdata,
            gbskuid: pageParam("gbskuid"),
            usercoupons: that.coudata.id,
            rushbuyid: pageParam("rushbuyid"),
            devicetype: 7,
            devicemac: getname()
          },
          headers: 1,
          successBack: function(ret) {
            console.log(paycode == 'alipay' && ret.Data.alipayorderinfo != null && ret.Data.alipayorderinfo != "")
            if (ret.success) {
              // 0元开团
              if (ret.status == 999 && ret.Data != null) {
                ShoppingSuccess(
                  paycode,
                  "buynow",
                  "./groups_success.html",
                  ret.Data.orderids,
                  ret.Data.ogid,
                  "isgroupswechatpay"
                );
                return;
              }
              if (ret.status == 1 && ret.Data != null) {
                if (paycode == "sinacashpay") {
                  var paydata = {
                    orderids: ret.Data.orderids,
                    ogid: ret.Data.ogid,
                    paycode: paycode,
                    name: "payshow"
                  };
                  console.log('status 1')
                  OpenWebPage(ret.Data.payorderinfo, "支付", paydata);
                } else if (paycode == "wxpay" && ret.Data.wechatpayorderinfo != null && ret.Data.wechatpayorderinfo != "") {
                  if (ret.Data.ogid && ret.Data.ogid.length > 0) {
                    wechatpay(
                      ret.Data.wechatpayorderinfo,
                      "wxpay",
                      "buynow",
                      "./groups_success.html",
                      ret.Data.orderids,
                      ret.Data.ogid,
                      "isgroupswechatpay"
                    );
                  }else {
                    wechatpay(
                      ret.Data.wechatpayorderinfo,
                      "wxpay",
                      "buynow",
                      "./success.html",
                      ret.Data.orderids
                    );
                  }
                } else if (paycode == 'cashpay') {
                  console.log('paynow -- cashpay')
                  if (ret.Data.ogid && ret.Data.ogid.length > 0) {
                    ShoppingSuccess(paycode, "buynow", './groups_success.html', ret.Data.orderids, ret.Data.ogid, "isgroupswechatpay");
                  } else {
                    ShoppingSuccess(paycode, "buynow", './success.html', ret.Data.orderids);
                  }
                } else if (paycode == 'alipay' && ret.Data.alipayorderinfo != null && ret.Data.alipayorderinfo != "") {
                  console.log(111222)
                  var orderids = ret.Data.orderids
                  var payogid = ret.Data.ogid
                  var aliPayPlus = api.require('aliPayPlus');
                  aliPayPlus.payOrder({
                    orderInfo: decodeURIComponent(ret.Data.alipayorderinfo)
                  }, function (rets, err) {
                    if (rets.code == "9000") {
                      if (payogid && payogid.length > 0) {
                        ShoppingSuccess(paycode, "buynow", './groups_success.html', orderids, payogid,
                          "isgroupswechatpay");
                      } else {
                        ShoppingSuccess(paycode, "buynow", './success.html', orderids);
                      }
                    } else {
                      pushMsg("订单号: [" + orderids + "] 订单提交成功,等待付款", orderids)
                      api.alert({
                        title: '支付结果',
                        msg: alipayReturnCode(rets.code),
                        buttons: ['确定']
                      });
                      setTimeout(function () {
                        // closeWin('ordercomfirm')
                        api.closeWin()
                      }, 1000)
                    }
                  });
                } else {
                  pushMsg(
                    "订单号: [" + ret.Data.orderids + "] 订单提交成功,等待付款",
                    ret.Data.orderids
                  );
                  promptMsg("下单成功");
                }
              }  else {
                promptMsg(ret.err);
                that.onlyone = false;
              }
            } else {
              promptMsg(ret.err);
              that.onlyone = false;
            }
            hideLoading()
          }
        });
      }
    },
    //分享夺宝支付结果
    lndianapay(ret){
        if (ret.status == 1 && ret.Data != null) {
          if(ret.Data.wechatpayorderinfo!=null&&ret.Data.wechatpayorderinfo!=""){
            wechatpay(ret.Data.wechatpayorderinfo,'wxpay','buynow','./lndianaSuccess.html', ret.Data.orderid)
          }else{
            pushMsg("订单号: ["+ ret.Data.orderid +"] 订单提交成功,等待付款", ret.Data.orderid)
            promptMsg('下单成功');
          }
        }else{
          promptMsg(ret.err);
        }
    },
    CheckOrSaveIDCard() {
      var textidcard = this.idcardtext;
      var that = this;
      if (textidcard == null || textidcard == "") {
        promptMsg("请填写并保存身份证号码");
        return false;
      } else {
        //检验身份证
        var resmsg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (!resmsg.test(textidcard)) {
          promptMsg("请填写正确的身份证号码");
          that.idcardok = false;
          return false;
        } else {
          https({
            url: siteUrl + "Main/Member/UserEdit?uid=" + getname(),
            method: "post",
            data: {
              uid: getname(),
              idcard: textidcard
            },
            headers: 1,
            successBack: function(ret) {
              if (ret) {
                if (ret.success) {
                  if (ret.status == 1) {
                    that.idcardok = true;
                    promptMsg("修改身份证号成功");
                  } else if (ret.status != 1) {
                    that.idcardok = false;
                    promptMsg(ret.err);
                  }
                } else {
                  promptMsg(ret.err);
                }
              }
            }
          });
        }
      }
    },
    openyouhui() {
      this.openusecou = !this.openusecou;
    },
    //获取子组件数据
    getcoud(ret) {
      this.coudata = {
        id: ret.id,
        tolal: ret.tolal
      };
      this.openusecou = ret.openusecou;
      this.needpay = Number(this.total) - Number(ret.tolal);
      console.log(ret);
    },
    //选择地址
    goaddresslist() {
      var name = "";
      if (window.api) {
        name = api.frameName;
      }
      openWin(
        {
          name: "addressList",
          url: "./addressList.html",
          pageParam: {
            title: "地址管理",
            onshow: 1,
            way: "order",
            frame_name: name
          }
        },
        1
      );
    }
  },
  created() {},
  mounted() {
    this.BindAdress();
    this.binddata();
    this.BindMember();
    //暴露方法,用于选择地址
    var that = this;
    window.BindAdress = function(addressid) {
      that.BindAdress(addressid);
    };
    window.BindMember = that.BindMember
    window.payorderNow = that.payorderNow
  }
};
</script>
<style lang="scss">
img {
  display: block;
}
.adderbox {
  @include item;
  justify-content: space-between;
  margin: 0 rems(18);
  margin-top: rems(26);
  margin-bottom: rems(16);
  box-shadow: 0px 2px 20px 0px rgba(216, 216, 216, 0.5);
  border-radius: 8px;
  height: rems(160);
  padding-left: rems(10);
  i {
    margin-right: rems(30);
  }
  .noadder {
    @include item;
    img {
      width: rems(40);
      height: rems(40);
      margin-left: rems(28);
      margin-right: rems(12);
    }
    font-size: rems(28);
  }
  .adderbox_left {
    font-size: rems(34);
    color: #333;
  }
  .adder_desc {
    font-size: rems(24);
    color: #666;
    @include font1;
  }
  .addername {
    @include item;
    p:nth-child(1) {
      margin-right: rems(40);
    }
    margin-bottom: rems(16);
  }
}
.probox {
  margin: 0 rems(18);
  box-shadow: 0px 2px 20px 0px rgba(216, 216, 216, 0.5);
  border-radius: 8px;
  margin-bottom: rems(16);
  overflow: hidden;
  .pro {
    @include item;
    margin: 0 rems(24);
    padding: rems(20) 0;
    border-bottom: 1px solid rgba(246, 246, 250, 1);
    img {
      width: rems(170);
      height: rems(170);
      flex-shrink: 0;
      margin-right: rems(20);
    }
    .pro_right {
      .pro1 {
        @include font2;
        font-size: rems(24);
        color: #231916;
        span {
          background: rgba(254, 51, 75, 0.5);
          border-radius: 16px;
          font-size: rems(20);
          color: #fe334b;
          padding: rems(4) rems(10);
          margin-right: rems(8);
        }
        margin-bottom: rems(8);
      }
      .prosku {
        @include font1;
        color: #999;
        font-size: rems(24);
        margin-bottom: rems(8);
      }
      .proprice {
        @include item;
        font-size: rems(24);
        justify-content: space-between;
      }
    }
  }
  .liuyan {
    @include item;
    justify-content: space-between;
    font-size: rems(24);
    padding: rems(28) rem(24);
    p {
      color: rgba(51, 51, 51, 1);
    }
    input {
      color: #999;
      outline: none;
      text-align: right;
    }
  }
}
.jiegebox {
  padding: 0 rems(24);
  margin: 0 rems(18);
  box-shadow: 0px 2px 20px 0px rgba(216, 216, 216, 0.5);
  border-radius: 8px;
  font-size: rems(24);
  margin-bottom: rems(16);
  .zongjia {
    @include item;
    justify-content: space-between;
    font-size: rems(24);
    color: #333;
    padding: rems(26) 0;
    border-bottom: 1px solid #f6f6fa;
  }
  .youhuijuan {
    @include item;
    justify-content: space-between;
    color: #333;
    padding: rems(20) 0;
    border-bottom: 1px solid #f6f6fa;
    .youhui_left {
      @include item;
      img {
        width: rems(44);
        height: rems(44);
        margin-right: rems(10);
      }
    }
    .youhui_right {
      @include item;
      color: #fe334b;
    }
  }
  .afu {
    margin-top: rems(16);
  }
  .shifu {
    @include item;
    justify-content: space-between;
    padding-bottom: rems(16);
  }
  .heji {
    text-align: right;
    font-size: rems(28);
    span {
      color: #fe334b;
      margin-bottom: rems(10);
      font-weight: 700;
    }
  }
}
.needbox {
  padding: 0 rems(24);
  margin: 0 rems(18);
  box-shadow: 0px 2px 20px 0px rgba(216, 216, 216, 0.5);
  border-radius: 8px;
  font-size: rems(24);
  margin-bottom: rems(170);
  .needtou {
    @include item;
    justify-content: space-between;
    border-bottom: 1px solid #f6f6fa;
    font-size: rems(28);
    padding: rems(24) 0;
    p:nth-child(1) {
      color: #333333;
      font-weight: 700;
    }
    p:nth-child(2) {
      color: #333333;
    }
  }
}
.zhifubox {
  @include item;
  justify-content: space-between;
  font-size: rems(24);
  padding: rems(28) 0;
  .zhifu_left {
    @include item;
  }
  img {
    width: rems(44);
    height: rems(44);
    margin-right: rems(14);
  }
}
.paybox {
  @include item;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #fff;
  z-index: 999999;
  padding: rems(20) 0;
  box-shadow: 0px -2px 20px 0px rgba(216, 216, 216, 0.3);
  p {
    color: #fe334b;
    font-size: rems(34);
    margin-left: rems(20);
  }
  .paybtn {
    font-size: rems(34);
    background: linear-gradient(
      270deg,
      rgba(254, 51, 75, 1) 0%,
      rgba(255, 114, 130, 1) 100%
    );
    color: #fff;
    padding: rems(12) rems(90);
    text-align: center;
    border-radius: 30px;
    margin-right: rems(20);
  }
}
.idbox {
  box-shadow: 0px 2px 20px 0px rgba(216, 216, 216, 0.5);
  border-radius: 8px;
  font-size: rems(24);
  margin: 0 rems(18);
  padding: rems(22) rems(16);
  margin-bottom: rems(16);
  @include item;
  p {
    color: #333;
    margin-right: rems(16);
    flex-shrink: 0;
  }
  input {
    outline: none;
    width: 100%;
  }
}
</style>