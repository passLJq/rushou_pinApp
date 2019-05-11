<template>
  <div>
    <van-tabs animated swipeable @change="changeTab" id="vanTab">
      <van-tab v-for="(tabs, i) in tab" :title="tabs" :key="i">
         <div class="canget" :style="{minHeight: ch + 'px'}" v-show="currentTab==i&&list[i]&&list[i].length>0">
          <!-- 每条优惠券的模板item start -->
          <div class="item" v-for="(item, index) in list[i]" :key="item.usercouponid" :class="i==2?'pass':''">
            <div class="left">
              <div class="price">
                <span>￥</span>
                <span>{{item.israandom ? '??' : item.facevalue}}</span>
              </div>
              <span>满{{item.uselimit}}元可用</span>
            </div>
            <div class="right">
              <div class="cexplain">
                <div class="titlel">
                  <span><span class="tt">{{item.companyname}}</span>{{item.name}}</span>
                </div>
                <div class="content">{{item.israandom ? '随机券' : item.couponalias}}</div>
                <div class="date">{{item.time}}</div>
              </div>
              <!-- <div class="btn" @click.stop="getCoupon(index, item.couponid)">立即领取</div> -->
              <div class="closePass" v-if="item.state == 1">即将过期</div>
              <div class="alreadyPass" v-if="item.state == 2">已过期</div>
            </div>
            <!-- 每条优惠券的模板item end -->
          </div>
        </div>
        <div class="nodataa" :style="{minHeight: ch + 'px'}" v-show="!list[i] || list[i].length==0">
          <img src="../../img/nocoupon.png">
          <span>您还没有优惠券喔~</span>
          <div @click="goCouponCenter">去领券</div>
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
      tab: ['未使用', '已使用', '已过期'],
      currentTab: 0,
      list: [[],[],[]],
      ch: 100,
    }
  },
  watch:{
    
  },
  computed:{},
  methods: {
    goCouponCenter() {
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
    bindData(currentTab) {
      let isexpire = undefined
      let sta = 1
      if (currentTab == 0 || currentTab == 1) {
        sta = currentTab + 1
      } else if (currentTab == 2) {
        sta = 1
        isexpire = 2
      }
      https({
        url: siteUrl + 'Marketing/Coupon/GetUserCouponListJson',
        data: {
          uid: getname(),
          sta, //状态 0-未激活 1-未使用 2-已使用
          isexpire, //sta == "1" && isexpire == 1-未激活的卷，sta == "1" && isexpire == 2) 未使用过期的卷，sta == "1"未使用未过期的卷
          isgb: 1
        },
        headers: 1,
        successBack: ret => {
          hideLoading()
          refreshDone()
          if (ret.success && ret.status == 1 && ret.Data.length > 0) {
            if (ret.Data && ret.Data.length > 0) {
              ret.Data.map(item => {
                item.time = this.getTime(item.starttime, item.endtime)
                item.state = this.getState(item.endtime)
              })
              this.list[this.currentTab] = ret.Data
            }
          } else if (ret.success && ret.Data.length == 0) {
            this.list[this.currentTab] = []
          } else {
            promptMsg(ret.err)
          }
          this.$forceUpdate()
          console.log(this.currentTab)
          console.log(this.list[this.currentTab])
        }
      })
    },
    changeTab(index) {
      window.scrollTo(0,0)
      // this.list = []
      this.currentTab = index
      showLoading()
      this.bindData(index)
    },
    // 获取时间格式
    getTime(t1, t2) {
      var str1 = t1.split(' ')[0]
      var str2 = t2.split(' ')[0]
      var str3 = str1.split('.')
      var str4 = str2.split('.')
      var str5 = str3[0] + '年' + str3[1] + '月' + str3[2] + '日' + '-' + str4[0] + '年' + str4[1] + '月' + str4[2] + '日'
      return str5
    },
    getState(time) {
      var t1 = Date.now()
      var t2 = Date.parse(new Date(time))
      var t3 = t2 - t1
      if (t3 > 0 && t3 <= 432000000) {
        return 1
      } else if (t3 <= 0) {
        return 2
      }
      return 0
    },
    goCouponCenter() {
      openWin({
        name: 'coupon_center',
        url: './coupon_center.html',
        pageParam: {
          title: '领券中心'
        }
      }, 1)
    }
  },
  created(){
    var that = this
    this.bindData(0)
    if (window.api) {
      api.addEventListener({
        name: 'viewappear'
      }, function(ret, err){
        that.bindData(that.currentTab)
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
              that.bindData(that.currentTab)
            }else{
              refreshDone()
            }
          },1000)
      })
      
    }
  },
  mounted(){
    var that = this
    var slot = document.getElementsByClassName('van-hairline--top-bottom')[0]
    var th = slot.offsetHeight
    this.ch = client().height - th
    window.onscroll = function () {
      var st = document.documentElement.scrollTop || document.body.scrollTop
      if (st > th) {
        slot.classList.add('fixTop')
      } else {
        slot.classList.remove('fixTop')
      }
    }
  }
}
</script>
<style lang="scss">
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-size: rems(24);
  }
  .van-tab {
    font-size: rems(28);
    color: #333;
  }
  
  .van-tab--active {
    color: #FE334B;
  }
  .fixTop {
    position: fixed;
    top: 0;
    left: 0;
  }
/* 优惠券 */

.canget {
  width: 100%;
  padding: rems(15) rem(10);
}
.canget .cangetHead {
  padding: rem(10) rem(16);
  font-size: rem(12);
  color: #333;
}
.canget .cangetHead span {
  font-size: rem(12);
  color: #999;
  margin-left: rem(11);
}
.item {
  width: 100%;
  min-height: rems(160);
  background-color: #fff;
  box-shadow: 0 rem(1) rem(10) 0 rgba(216,216,216,1);
  border-radius: rem(8);
  overflow: hidden;
  display: flex;
  position: relative;
  line-height: rems(30);
}
.item .closePass, .item .alreadyPass {
  position: absolute;
  top: 0;
  right: 0;
  font-size: rem(10);
  color: #d8d8d8;
  padding: rem(1) rem(7);
  background-color: rgba(66,113,97,.6);
  border-radius: 0 rem(8) 0 rem(4);
}
.item .closePass {
  color: #ff5541;
  background-color:rgba(255,85,65,0.2);
}
.item + .item {
  margin-top: rem(10);
}
.item .left {
  width: 28%;
  // height: 100%;
  background: linear-gradient(270deg,rgba(255,76,95,1) 0%,rgba(255,112,87,1) 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
}
.item .left .price {
  display: flex;
  align-items: baseline;
  margin-bottom: rems(15);
}
.item .left .price span{
  font-size: rem(14);
  font-weight: 600;
}
.item .left .price span:nth-child(2){
  font-size: rem(24);
}
.item .left > span{
  // margin-top: rem(7);
  font-size: rem(12);
}

.item .right {
  width: 72%;
  height: 100%;
  padding: 0 rem(10);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item .right .cexplain {
  height: 100%;
  padding-left: 0;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
}
.item .right .cexplain .titlel {
  margin-top: rem(8);
  // text-align: left;
  display: flex;
  justify-content: flex-start;
}
.item .right .cexplain .titlel span {
  font-size: rem(12);
  font-weight: 600;
  color: #333;
}
.item .right .cexplain .titlel .tt {
  font-size: rem(10);
  color: #FC7A60;
  padding: rem(1) rem(7);
  background-color: #FEE3DD;
  margin-right: rem(10);
  border-radius: rem(8);
}
.item .right .cexplain .content {
  font-size: rem(12);
  color: #333;
  margin-top: rem(11);
}
.item .right .cexplain .date {
  font-size: rems(20);
  color: #999;
  margin-top: rem(5);
}
.item .right .btn {
  min-width: rem(70);
  color: #fff;
  font-size: rem(10);
  padding: rem(2) rem(10);
  border-radius: rem(8);
  text-align: center;
  background: rgba(255,76,95,1);
}
.item .right .btn.b {
  background-color: #d8d8d8;
}

.item.pass {
  .left {
    background: #999;
  }
  .tt {
    color: #999 !important;
    background-color: #ccc !important;
  }
}

/* 没有数据时 */
.nodataa {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: rem(30);
  // justify-content: center;
  div {
    font-size: rems(28);
    padding: rems(4) rems(16);
    color: #ff5541;
    border: 1px solid #ff5541;
    border-radius: rems(30);
    margin-top: rems(40);
  }
}
.nodataa img {
  width: rems(310);
  height: rems(310);
  margin-top: rem(100);
}
.nodataa span {
  font-size: rems(28);
  color: #999;
  transform: translateY(rems(-20));
}

</style>