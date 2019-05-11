<template>
  <section>
    <van-swipe :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="item in headlist" :key="item.soure">
        <img :src="item.soure" alt class="touimg">
      </van-swipe-item>
    </van-swipe>
    <div class="rules" @click="showRule">活动细则</div>
<div style="background:#fff">
    <div class="hengbox">
      <span>1</span>
      <p>开团付款</p>
      <img src="../../img/right@3x.png" alt>
      <span>2</span>
      <p>分享活动给好友</p>
      <img src="../../img/right@3x.png" alt>
      <span>3</span>
      <p>中奖发货</p>
      <img src="../../img/right@3x.png" alt>
    </div>
</div>

<div>
    <van-tabs v-model="active" swipeable @change='bian' @click="bian">
  <van-tab v-for="(item,index) in title" :title="item" :key="index">
      <div v-if="listdata.length>0">
      <div style="background:#fff;margin-bottom:10px" v-for="(item) in listdata" :key='item.cloudid' @click="gocluid(item.cloudid)">
      <div class="probpox">
          <img :src="item.img" alt="">
          <div class="pro_right">
              <p class="pro_title">{{item.proname}}</p>
              <div class="pro_loading">
                  <van-progress
                :percentage="item.jindu"
                :show-pivot='false'
                pivot-color="#7232dd"
                color="linear-gradient(90deg,rgba(232,55,74,1) 0%,rgba(253,94,67,1) 100%)"
                />
              </div>
              <div class="pro_number">
                  <p>{{item.amout}}人参与</p>
                  <p>剩余{{item.remainingamout}}</p>
              </div>
              <div class="pro_buy">
                  <div class="buyleft">
                  <p class="pr1">&yen;{{item.cloudPrice}}</p>
                  <p class='pr2'>原价{{item.proprice}}</p>
                  </div>
                  <div class="pr4" v-if="active==2">活动结束</div>
                   <div class="pr4" v-else-if="active==1">即将开始</div>
                  <div class=pr3 v-else>立即夺宝</div>
              </div>
          </div>
      </div>    
      </div>
     </div>
     <div v-else class="nodata">
         <img src="../../img/naozhong.png" alt="">
         <p style="margin-top:-40px">暂时没有活动~</p>
     </div>
  </van-tab>
</van-tabs>
</div>
<showRule :showPop="showPop" :content="rule" @closePop="closePop"></showRule>
  </section>
</template>

<script>
import showRule from '../../components/showRule/showRule.vue'
export default {
  components: {
    showRule
  },
  props: {},
  data() {
    return {
      headlist: [],
      currentPage: 1,
      listdata: [],
      title:['本期活动','下期活动','已结束'],
      active:0,
      sqltype:[1,2,3],
      stops:false,
      // 以下是传入组件的数据
      showPop: [false, false],
      rule: ''
    };
  },
  watch: {},
  computed: {},
  methods: {
    showRule() {
      this.showPop = [true, false]
    },
    closePop() {
      this.showPop = [false, false]
    },
    headurl() {
      var that = this;
      https({
        url: siteUrl + "/Marketing/Cloudbuy/GetCloudShoppingSet",
        data: {
          uid: getname(),
          currentPage: 1,
          pageSize: 1,
          sqltype: 1,
          type: "2"
         },
        successBack: function(ret) {
          if (ret.success) {
            if (ret.cloudurlimg.length > 0) {
              that.headlist = ret.cloudurlimg;
            }
          } else {
            promptMsg(ret.err);
          }
        }
      });
    },
    list() {
      var that = this;
      https({
        url: siteUrl + "/Marketing/Cloudbuy/GetCloudShoppingSet",
        data: {
          uid: getname(),
          currentPage: that.currentPage,
          pageSize: 5,
          sqltype: that.sqltype[that.active],
          type: "2"
        },
        successBack: function(ret) {
          if (ret.success && ret.status == 1) {
        if (ret.Data.length > 0) {
              var data=ret.Data
              data.forEach((item,index) => {
                  data[index].jindu=Number(((item.amout/item.totalamout)*100).toFixed(0))
              });
              if( that.currentPage==1){
                  that.stops=false
              that.listdata = ret.Data;
              }else{
                   that.listdata=that.listdata.concat(ret.Data)
              }
            }
          }else if(ret.success && ret.status == 2){
             if( that.currentPage==1){
              that.listdata = ret.Data;
              }
                that.stops=true
          }else {
            promptMsg(ret.err);
          }
        }
      });
    },
    bian(index,title){
        this.currentPage=1
        this.list()
    },
    gocluid(id){
        openWin({
            name:'new_lndianaDetail',
            url:'./new_lndianaDetail.html',
            pageParam:{
                title:'商品详细',
                cloudid:id
            }
        },1)
    }
  },
  created() {
    if (window.api && api.systemType == "ios") {
      this.rule = `1：根据市场价将每个产品分成若干等份，每份X元。
              <br><br>2：每个用户可对1件商品支持1份或者多份，每支持一份获得1个幸运码.
              <br><br>3：当1件商品的所有份额都获得支持后，计算出1个“幸运码”，持有幸运码的支持者集拥有该商品。
              <br><br>4：活动没有达到开奖要求或者已开奖的活动未中奖者，会原路自动退款（注意：中奖者是不退款的）
              <br><br>5：天天抽奖的订单不产生个人销售提成奖和分享销售提成奖，利润也不参与分红。 计算方式 1：以该商品最后支持时间为截至点，取最后一元的购买者前100条全站记录（这个全站记录是指所有购买一元购的人的记录，并不是单独一个活动的记录）的时间转化成数字（例如21:45:32.123转化后就是214532123）的总和，用这个总和与设置的价钱取余数，这余数加上100000组成最终的幸运号码，（当全站记录没有100条时，则有几条取几条）。
              <br><br>6: 本活动与美国苹果公司（Apple.Lnc)无关。`
    } else {
      this.rule = `1：根据市场价将每个产品分成若干等份，每份X元。
        <br><br>2：每个用户可对1件商品支持1份或者多份，每支持一份获得1个幸运码.
        <br><br>3：当1件商品的所有份额都获得支持后，计算出1个“幸运码”，持有幸运码的支持者集拥有该商品。
        <br><br>4：活动没有达到开奖要求或者已开奖的活动未中奖者，会原路自动退款（注意：中奖者是不退款的）
        <br><br>5：天天抽奖的订单不产生个人销售提成奖和分享销售提成奖，利润也不参与分红。 计算方式 1：以该商品最后支持时间为截至点，取最后一元的购买者前100条全站记录（这个全站记录是指所有购买一元购的人的记录，并不是单独一个活动的记录）的时间转化成数字（例如21:45:32.123转化后就是214532123）的总和，用这个总和与设置的价钱取余数，这余数加上100000组成最终的幸运号码，（当全站记录没有100条时，则有几条取几条）。`
    }
  },
  mounted() {
    this.headurl();
    this.list()
            var that=this
    if(window.api){
            api.addEventListener({
              name: 'scrolltobottom'
          }, function (ret, err) {
              if (!that.stops) {
                  that.currentPage = that.currentPage + 1;
                   that.list()
              }
          });
      }
  }
};
</script>
<style lang="scss">
body{
    background:rgba(246,246,250,1);
}
.rules {
  position: absolute;
  right: 0;
  top: rems(40);
  color: #fff;
  background:linear-gradient(270deg,rgba(254,51,75,1) 0%,rgba(255,114,130,1) 100%);
  font-size: rems(24);
  padding: rems(4) rems(16);
  border-radius: rems(30) 0 0 rems(30);
  text-align: center;
}
img {
  display: block;
}
.touimg {
  width: 100%;
}
.hengbox {
  @include item;
  font-size: rems(24);
  justify-content: space-around;
  color: #ff5541;
  margin: 0 rems(30);
  padding: rems(25) 0;
  background: #fff;
  span {
    color: #fff;
    background: #ff5541;
    border-radius: 50%;
    width: rems(36);
    height: rems(36);
    @include item;
    justify-content: center;
    font-size: rems(24);
    flex-shrink: 0;
  }
  img {
    width: rems(44);
    height: rems(44);
  }
}
.van-tab--active{
color: #FF5541
}
.probpox{
    background: #fff;
    font-size: rems(30);
    margin: 0 rems(40);
    padding: rems(20) 0;
    @include item;
    img{
        width: rems(200);
        height: rems(200);
        flex-shrink: 0;
    }
}
.pro_title{
    @include font2;
}
.pro_loading{
    margin-top: 10px;
.van-progress{
    height: 10px;
}
}
.pro_right{
    width:100%;
    margin-left: rems(10);
}
.pro_number{
    @include item;
    justify-content: space-between;
    color: #999;
    font-size: rems(20);
    margin: rems(10) 0 rems(20) 0;
}
.pro_buy{
    @include item;
    justify-content: space-between;  
    .buyleft{
        @include item;
    }
    .pr1{
        color: #FF5541;
        font-size: rems(36);
        margin-right:rems(20);
    }
    .pr2{
        color: #999999;
        font-size: rems(24);
                @include font1;
    }
    .pr3{
        background: linear-gradient(270deg,rgba(232,55,74,1) 0%,rgba(253,94,67,1) 100%);
        padding: rems(12) rems(20);
        border-radius: 60px;
        color: #fff;
        font-size: rems(24);
        flex-shrink: 0;
    }
    .pr4{
        background: #fff;
        border:1px solid #D8D8D8;
        padding: rems(12) rems(20);
        border-radius: 60px;
        color: #D8D8D8;
        font-size: rems(24);
        flex-shrink: 0;  
    }
}
</style>