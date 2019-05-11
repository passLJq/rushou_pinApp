<template>
  <div>
    <div class="head">
      <div>
        <p class="iconfont icon-dui"></p>
        <p class="state">{{list.orderstate|orderstate}}</p>
      </div>
    </div>
    <div class="box">
      <div class="wuliu" v-if="list.deliverydata && list.deliverydata.expressjson" @click="toExpressDetail">
        <div class="left">
          <div class="yuan"><div></div></div>
          <div class="shu"></div>
        </div>
        <div class="right">
          <p>{{wuliumsg.result.list[0].status}}</p>
          <p>{{wuliumsg.result.list[0].time}}</p>
        </div>
        <p class="iconfont icon-right"></p>
      </div>

      <div class="shouhuo">
        <p class="title">收货地址</p>
        <div>
          <div>
            <p>{{list.linkman || ''}}</p>
            <p>{{list.phone|hidePhone}}</p>
          </div>
          <p>{{list.fullarea+list.address || ''}}</p>
        </div>
      </div>
    </div>

    <div class="box">
      <div class="promsg">
        <div class="shouhuo mb" v-if="list.gbdata">
          <p class="title" v-if="list.gbstate==2">拼团成功<span class="t">{{list.gbdata.count > list.gbdata.gbnum ? list.gbdata.count : list.gbdata.gbnum}}人团</span></p>
          <p class="title" v-if="list.gbstate==1">拼单中 <span class="p">还差{{list.gbdata.num <= 0 ? 0 : list.gbdata.num}}人，剩余{{hours}}:{{min}}:{{miao}}结束</span><span class="t">{{list.gbdata.gbnum}}人团</span></p>
          <p class="title" v-if="list.gbstate>=3">拼团失败<span class="t">{{list.gbdata.count > list.gbdata.gbnum ? list.gbdata.count : list.gbdata.gbnum}}人团</span></p>
          <div class="member">
            <div >
              <img v-if="list.gbdata.imgphoto!=''"  :src="list.gbdata.imgphoto" @error="onerr($event)">
              <img v-else src="../../img/man.jpg" alt="">
              <p>{{list.gbdata.realname}}</p>
              <span>团长</span>
            </div>
            <div v-for="(item,index) in list.gbdata.groupbuylist" :key="index">
              <img :src="item.head?item.head:'./img/man.jpg'">
              <p>{{item.name|| '　' | hidePhone}}</p>
            </div>
          </div>
        </div>
        
        <div class="title" v-if="!list.gbdata"><p class="iconfont icon-shangdian">{{list.shopname}}</p></div>
        <div style="" v-for="item in list.orderitems" :key="item.proid">
          <div class="prm">
            <img v-lazy="item.pic" alt="">
            <div>
              <div class="proname">
                <p>{{item.proname}}</p>
                <p>&yen;{{Number(list.total / item.buycount).toFixed(2)}}</p>
              </div>
              <div class="skutext">
                <p>{{item.skutext}}</p>
                <p>X{{item.buycount}}</p>
              </div>
            </div>
          </div>
          <div class="btn" v-if="(list.orderstate==20||(list.orderstate==40&&!list.isoversevenday))&&list.ordetype!=4&&list.ordetype!=12">
            <div v-if="item.ordertype!=110&&!item.isrefundorder">
              <div v-if="list.gbdata">
                <div v-if="list.gbstate ==  2 && list.gbdata && !list.gbdata.headfree">
                    <div class="boxitem" @click="tuikuan(list.orderid,item.itemid,item.proid,item.buycount,item.refundprice,item.proname)">申请退款</div>
                </div>
              </div>
              <div v-else>
                  <div class="boxitem" @click="tuikuan(list.orderid,item.itemid,item.proid,item.buycount,item.refundprice,item.proname)">申请退款</div>
              </div>
            </div>
            <div v-if="(list.orderstate==62||list.orderstate==40)&&(list.ordetype==4||list.ordetype==12)&&!item.isexchangeorder&&!list.isoversevenday">
              <div class="boxitem" @click="ExchangeOrder(list.orderid,item.itemid,item.proid,item.packageid,item.buycount,item.proname)">换货</div>
            </div>
          </div>
        </div>

        <!-- <div class="btn">
          <div>申请售后</div>
        </div> -->
        <div class="pms">
          <div>
            <p>运费：</p>
            <p>卖家包邮</p>
            </div>
          <div>
            <p>优惠：</p>
            <p style="font-weight:400;">&yen;{{list.couponoffset|toFixed}}</p>
          </div>
          <div>
            <p>共{{list.totalbuycount}}件商品 实付：</p>
            <p style="font-weight:600;">&yen;{{list.total|toFixed}}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="box">
      <div class="ordermsg">
        <div class="orderone">
          <p>订单编号：{{list.orderid}}</p>
          <p @click="fuzhi(list.orderid)">复制</p>
        </div>
        <p>支付方式：{{list.orderstate==10?"未支付":list.paymenttype}}</p>
        <p>下单时间：{{list.createtime}}</p>
        <p v-if="list.deliverydata&&list.deliverydata.time">发货时间：{{list.deliverydata.time}}</p>
        <p v-if="list.deliverydata">快递方式：{{list.deliverydata.companyname}}</p>
        <p v-if="list.deliverydata&&list.deliverydata.trackno">快递单号：{{list.deliverydata.trackno}}</p>
      </div>
    </div>

    <div class="footer">
      <!-- <div @click="gokefu">申请售后</div> -->
      <div class="c" v-if="list.orderstate==30" @click="ReceiptOrder(list.orderid)">确认收货</div>
    </div>
  </div>
</template>

<script>
export default {
  components:{},
  props:{},
  data(){
    return {
      list:'',
      wuliumsg: '',
      hours:'00',
      min:'00',
      miao:'00',
      timesover:null,
      isDone: false,
      loadTimer: null
    }
  },
  watch:{
    
  },
  computed:{},
  filters: {
    orderstate:function(value){
      return value == 10? '待付款':value == 11? '待处理': value == 20? '待发货': value == 30? '已发货': value == 40? '交易完成': value == 50? '已退货': value == 60? '已退款': value == 62? '申请换货': value == 70? '交易关闭': '--'
    },
    toFixed: function (value) {
      if (value != '' && value != null) {
        return Number(value).toFixed(2)
      }
    },
    hidePhone(val) {
      if (/^1[34578]\d{9}$/.test(val)) {
        var p = String(val)
        var p1 = p.substr(0,3)
        var p2 = p.substr(7, 4)
        return p1 + '****' + p2
      } else {
        return val
      }
    } 
  },
  methods: {
    binddata(){
      var that=this
      that.loadTimer = setTimeout(function () {
          showLoading()
      }, 1000)
      https({
        url:siteUrl + 'Main/Member/GetOrderListJson?devicetype=7',
        data:{
          currpage:1,
          pagesize:1,
          uid: window.api?api.getPrefs({sync: true,key: 'SessionUserID'}):$api.getStorage('SessionUserID'),
          orderid :pageParam('orderid')
        },
        headers:1,
        successBack:function(ret){
          if (that.loadTimer != null) {
              hideLoading()
              clearTimeout(that.loadTimer)
              that.loadTimer = null
          }
          if(ret.status==1&&ret.success&& ret.Data!=null){
              //物流信息读取
              if(ret.Data[0].deliverydata!=null&&ret.Data[0].deliverydata.expressjson!=""){
                var wuliumesng=$api.strToJson(ret.Data[0].deliverydata.expressjson)
                that.wuliumsg =wuliumesng
              }
              if(ret.Data[0].gbdata){
                  that.remaintime =  ret.Data[0].gbdata.ts - ret.Data[0].gbdata.tpgap;
                  if(that.remaintime >0&&ret.Data[0].gbstate==1){
                      that.timesover= window.setInterval(function(){
                          that.leftTimer()
                      },1000);
                  }
              }
              let data = ret.Data[0]
              if (data.gbdata && data.gbstate == 1) {
                if (Number(data.gbdata.count) >= Number(data.gbdata.gbnum)) {
                  data.gbstate = 2
                }
              }
              console.log(data.gbstate)
              that.list=data
              // if(that.list.deliverydata){
              //     that.wuliu()
              // }
              that.isDone = true
          }else{
              promptMsg(ret.err)
          }
        }
      })
    },
    // wuliu(){
    //   var that=this
    //   https({
    //     url: siteUrl +'Main/member/GetSFExpress',
    //     method: 'get',
    //     data:{
    //        trackstr: that.list.deliverydata.trackno,
    //        uid: getname()         
    //     },
    //     headers:1,
    //     successBack:function(ret){
    //       if(ret.success&&ret.status==1){
    //         var wuliu=ret.Data
    //         if(wuliu.length>0){
    //           that.wuliuimag=wuliu[0].remark
    //           that.wuliutime=wuliu[0].accept_time
    //         }
    //       }else{
    //           promptMsg(ret.err)
    //       }
    //     }
    //   })
    //   },
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
                that.binddata();
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
    tuikuan(orderid,itemid,proid,buycount,price,proname){
      openWin({
        name: 'refunddatail',
        url: './refunddatail.html',
        pageParam:{
          orderid:orderid,
          itemid:itemid,
          proid:proid,
          buycount:buycount,
          price:price,
          proname:proname,
          title:'申请退款'
        },
        bounces: false,
        bgColor: '#fff'
      })
    },
    gogroupdetali(orderids){
      var orderid = orderids
      openWin({
        name:'group_detail'+orderid,
        url:'./group_detail.html',
        useWKWebView:true,
        pageParam:{
          title:'拼单详情',
          orderid:orderid
        }
      },1)
    },
    ExchangeOrder(orderid,itemid,proid,packageid,buycount,proname){
      openWin({
        name: 'exchangedatail',
        url: './exchangedatail.html',
        pageParam:{
          orderid:orderid,
          itemid:itemid,
          proid:proid,
          packageid:packageid,
          proname:proname,
          buycount:buycount,
          title:'申请换货'
        },
        bounces: false,
        bgColor: '#fff'
      },1);
    },
    onerr(e) {
        e.target.src = './img/man.jpg'
    },
    gokefu() {
      var qiyuSdk = api.require('qiyuSdk');
      var params = {
          source:{
            sourceTitle:'个人中心客服',
            sourceUrl:'http://www.qiyukf.com',
            sourceCustomInfo:'我是来自自定义的信息'
          },
          commodityInfo:{
            commodityInfoTitle:'APICloud网易七鱼商品',
            commodityInfoDesc:'这是来自七鱼APICloud的商品描述',
            pictureUrl:'http://qiyukf.com/res/img/companyLogo/blmn.png',
            commodityInfoUrl:'http://www.qiyukf.com',
            note:'￥1000',
            show:false
          },
          sessionTitle:'在线客服',
          groupId:0,
          staffId:0
      }
      qiyuSdk.openServiceWindow(params);
    },
    toExpressDetail() {
      openWin({
        name: 'logisticsdetail',
        url: './logisticsdetail.html',
        pageParam: {
          title: '物流详情',
          orderid: this.list.orderid
        }
      }, 1)
    },
    leftTimer(){
      var that=this
      if(that.remaintime <=1){
        window.clearInterval(that.timesover);
        that.timesover=null
        console.log('1')
        that.binddata()
        return;
      }
      var showhtml = "";
      that.remaintime  = that.remaintime -1;
      var days = parseInt(that.remaintime  / 60 / 60 / 24); //计算剩余的天数
      var hours = parseInt(that.remaintime  / 60 / 60 % 24); //计算剩余的小时
      var minutes = parseInt(that.remaintime  / 60 % 60);//计算剩余的分钟
      var seconds = parseInt(that.remaintime  % 60);//计算剩余的秒数
      if(days!=0){
        showhtml+=days+"天";
      }
      if(hours!=0){
        showhtml+=hours+"：";
      }
      that.hours=hours
      that.min = that.checkTime(minutes);
      that.miao = that.checkTime(seconds);
    },
    checkTime(i){ //将0-9的数字前面加上0，例1变为01
      if(i<10) {
        i = "0" + i;
      }
      return i;
    },
    fuzhi(value){
      var clipBoard = api.require('clipBoard');
      clipBoard.set({
          value: value
      }, function(ret, err) {
        if (ret) {
          if(ret.status){
              promptMsg('复制成功')
          }
        } else {
          alert(JSON.stringify(err));
        }
      });
    }
  },
  created(){
    
  },
  mounted(){
    var that=this
    console.log(pageParam('orderid'))
    if(window.api){
      api.addEventListener({
        name: 'tuikuan'
      }, function(ret, err) {
        that.binddata()
      });
      api.addEventListener({
        name: 'orderdetail_bindData'
      }, function (ret, err) {
        that.binddata()
      })
    }
    this.binddata()
  }
}
</script>
<style lang="scss">
  @import "orderdetail.scss";
</style>