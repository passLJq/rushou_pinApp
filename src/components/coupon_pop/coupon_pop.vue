<template>
<section>
  <!-- 优惠券 -->
    <div class="zhezhao" @click="closeCoupon"></div>
    <div class="couponn">
      <!-- 头部 -->
      <div class="titlel">
        <div style="font-size: 14px;opacity: 0;">1</div>
        <div class="t">领取优惠券</div>
        <div class="guanbi" @click="closeCoupon"><img src="../../img/guanbi1.png" alt=""></div>
      </div>
      <!-- 横线 -->
      <div class="line"></div>
      <!-- 内容主体 -->
      <div class="main">
        <!-- 可领优惠券 -->
        <!-- <div class="canget" v-if="hasUnGet"> -->
        <div class="canget">
          <div class="cangetHead">可领取优惠券<span v-if="isshoppingcar">领取后可用于购物车商品</span></div>
          <!-- 每条优惠券的模板item start -->
          <div class="item" v-for="(item, index) in unGet" :key="index">
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
              <div class="btn" @click.stop="getCoupon(index, item.couponid)">立即领取</div>
              <div class="closePass" v-if="item.state == 1 || item.state == 2">{{item.state == 1 ? '即将过期' : item.state == 2 ? '已过期' : ''}}</div>
            </div>
            <!-- 每条优惠券的模板item end -->
          </div>
        </div>
        <!-- 没有数据时 -->
        <div class="nodataa" v-if="!unGet">
          <img src="../../img/couponNoData1.png">
          <span class="p">很遗憾</span>
          <span>您暂无可以领取的优惠券</span>
        </div>
        <!-- 已领取优惠券 -->
        <!-- <div class="canget" style="margin-top: 3%;" v-if="hasGet">
          <div class="cangetHead">已领取优惠券<span v-if="isshoppingcar">满足条件后即可用于当前商品</span></div>
          每条优惠券的模板item start
          <div class="item" v-for="(item, index) in hasGet"  :key="index">
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
              <div class="btn" style="background:#d8d8d8;">已领取</div>
              <div class="closePass"
               v-if="item.state == 1 || item.state == 2">{{item.state == 1 ? '即将过期' : item.state == 2 ? '已过期' : ''}}</div>
             </div>
            每条优惠券的模板item end
          </div>
        </div> -->
      <!-- main end -->
    </div>
  </div>
</section>
</template>

<script>
  export default {
    props:{
      gbid: {
        type: String,
        required: false
      },
      pid: {
        type: String,
        required: false
      },
      gbid: {
        type: String,
        required: false
      },
      cid: {
        type: String,
        required: false
      },
      rbid: {
        type: String,
        required: false
      },
      way: {
        type: String,
        required: false
      },
      bindData: {
        type: Boolean,
        required: false
      },
    },
    data() {
      return {
        isshoppingcar: 0,       // 是否来自购物车
        hasGet: '',             // 已领的优惠券
        unGet: '',              // 未领的优惠券
        isgroupbuy: false,      // 是否来自拼团详情
        isDone: false,          // 是否加载完毕
        hasUnGet:false,
        uid: '',
        loadTimer: null
      }
    },
    created() {
      this.uid = window.api ? api.getPrefs({sync: true,key: 'SessionUserID'}) : $api.getStorage('SessionUserID')
    },
    computed: {

    },
    watch: {
      bindData(val) {
        if (val) {
          this.getMsg()
        }
      }
    },
    methods: {
      // 领券的
      getCoupon(idx, cid) {
        var that = this
        https({
          url: siteUrl + 'Marketing/Coupon/ReceiveCoupon?devicetype=7',
          data: {
            uid: this.uid,
            couponid: cid
          },
          headers: 1,
          successBack: ret => {
            if (ret && ret.success && ret.status == 1) {
              promptMsg('领取成功')
              let data = that.unGet[idx]
              if (that.hasGet == '') that.hasGet = []
              data.getnum += 1
              if ((data.eachamount - data.getnum) <= 0) {
                that.unGet.splice(idx, 1)
                if (that.unGet.length == 0) that.unGet = ''
              } else {
                that.unGet[idx] = data
              }
              that.hasGet.push(data)
              that.$forceUpdate()
            } else if (ret.status == 5) {
              promptMsg('该优惠券已全部领完了')
              // 总数为零
              let data = that.unGet[idx]
              that.unGet.splice(idx, 1)
              // that.hasGet.push(data)
              that.$forceUpdate()
            }
             else {
              promptMsg(ret.err)
            }
          }
        })
      },

      // 获取优惠券数据
      getMsg() {
        if (this.unGet && this.unGet.length > 0 || this.hasGet && this.hasGet.length > 0) {
          // 有数据就不showloading了
        } else {
          this.loadTimer = setTimeout(function () {
            showLoading()
          }, 500)
        }
        if (this.$props.gbid) {
          this.isgroupbuy = true
        }
        console.log(this.$props.gbid)
        this.isshoppingcar = this.$props.way == 'shoppingcar' ? 1 : 0
        // 有pid表示来自商品详情页
        if (this.$props.gbid) {
          console.log(1)
          // 拼团优惠券
          this.getGbCou()
        } else if (this.$props.rbid) {
          console.log(2)
          // 限时抢购优惠券
          this.getRushCoupon()
        } else if (this.$props.pid) {
          console.log(3)
          // 读商品优惠券
          this.getProCoupon()
        } else {
          console.log(4)
          // 读商家与平台的优惠券
          this.getComMsg()
        }
      },
      // 获取限时抢购优惠券
      getRushCoupon(){
        var that = this
        console.log(that.uid)
        https({
          url: siteUrl + 'Marketing/Coupon/GetCouponListJson?devicetype=7',
          data: {
            uid: that.uid,
            ispaltform: 3,
            activityid: this.$props.rbid
          },
          header: 1,
          successBack: ret => {
            console.log(ret)
            console.log(1)
            if (ret.success && ret.status == 1) {
              let arr = ret.Data
              if (arr.length) {
                that.screenCoupon(arr)
              } else {
                that.isDone = true
              }
            } else {
              promptMsg(ret.err)
            }
          }
        })
      },
      // 获取拼团券
      getGbCou() {
        var that = this
        https({
          url: siteUrl + 'Marketing/Coupon/GetCouponListJson?devicetype=7',
          data: {
            uid: that.uid,
            ispaltform: 3,
            gbid: that.$props.gbid,
            comid: that.$props.cid,
            isgb: true
          },
          successBack: ret => {
            console.log(JSON.stringify(ret))
            var that = this
            if (ret.success && ret.status == 1) {
              let arr = []
              let data = ret.Data
              if (data.length) {
                this.screenCoupon(data)
              } else {
                this.isDone = true
              }
            } else {
              promptMsg(ret.err)
            }
          }
        })
      },
      // 读商品优惠券
      getProCoupon() {
        https({
          url: siteUrl + 'Marketing/Coupon/GetCompanyPlatformCoupon?devicetype=7',
          data: {
            CompanyID: this.$props.cid,
            uid: this.uid,
            proId: this.$props.pid
          },
          header: 1,
          successBack: ret => {
            this.proCouponBack(ret)
          }
        })
      },
      proCouponBack(ret) {
        console.log(ret)
        if (ret.success && ret.status == 1) {
          let arr = []
          let CompanyData = ret.CompanyData
          let Platform = ret.Platform
          if (CompanyData.length) {
            CompanyData.forEach(item => {
              if (item.prolimit == 1) {
                arr.push(item)
              }
            })
          }
          if (Platform.length) {
            Platform.forEach(item => {
              if (item.prolimit == 1) {
                arr.push(item)
              }
            })
          }
          if (arr.length) {
            this.screenCoupon(arr)
            // console.log(JSON.stringify(this.unGet))
          } else {
            this.isDone = true
          }
        } else {
          promptMsg(ret.err)
        }
      },
      // 读取店铺优惠券
      getComMsg() {
        https({
          url: siteUrl + 'Marketing/Coupon/GetCouponListJson?devicetype=7',
          data: {
            uid: this.uid,
            comid: this.$props.cid,
            ispaltform: 3
          },
          headers: 1,
          successBack: ret => {
            // let data = arr
            let data = []
            if (ret.success && ret.status == 1) {
              if (ret.Data.length) {
                ret.Data.forEach(item => {
                  data.push(item)
                })
              }
            } else {
              promptMsg(ret.err)
            }
            if (data.length) {
              this.screenCoupon(data)
            } else {
              this.isDone = true
            }
          }
        })
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
        // 兼容iphone 只能这样获取时间戳
        var tt = time.replace(/\./g,':').replace(' ',':')
        tt = tt.split(':')
        var time1 = new Date(tt[0],(tt[1]-1),tt[2],tt[3],tt[4],tt[5])
        var t2 = Date.parse(new Date(time1))
        var t3 = t2 - t1
        // console.log(t3)
        if (t3 > 0 && t3 <= 432000000) {
          return 1
        } else if (t3 <= 0) {
          return 2
        }
        return 0
      },
      // 筛选优惠券
      screenCoupon(arr) {
        if (this.loadTimer != null) {
          hideLoading()
          clearTimeout(this.loadTimer)
          this.loadTimer = null
        }
        var that = this
        var hasGet = []
        var unGet = []
        arr.forEach(item => {
        console.log(123)
          // isover 表示总数领取完了 或领取次数剩余0了 就加入已领取列表
          if (!item.isover && (item.eachamount - item.getnum) > 0 && item.couponType != 2 && item.couponType != 3) {
            item.time = this.getTime(item.starttime, item.endtime)
            item.state = this.getState(item.userendtime)
            unGet.push(item)
            if (item.getnum) {
              if (item.getnum > 1) {
                // 获取的数量大于1则遍历
                for (let i = 0; i < item.getnum; i++) {
                  hasGet.push(item)
                }
              } else {
                hasGet.push(item)
              }
            }
          } else {
            item.time = this.getTime(item.starttime, item.endtime)
            item.state = this.getState(item.userendtime)
            if (item.isget) {
              if (item.getnum > 1) {
                // 获取的数量大于1则遍历
                for (let i = 0; i < item.getnum; i++) {
                  hasGet.push(item)
                }
              } else {
                hasGet.push(item)
              }
            }
          }
          
        })
        if (!hasGet.length) hasGet = ''
        if (!unGet.length) unGet = ''
        this.hasGet = hasGet
        this.unGet = unGet
        that.$forceUpdate()
        console.log(this.unGet)
        console.log(this.hasGet)
        // setTimeout(function () {
        //   that.$forceUpdate()
        // },100)
      },
      closeCoupon() {
        this.$emit('closeCou')
      },
      
    }
  }
</script>
<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.zhezhao {
  width: 100%;
  height:100%;
  background-color: rgba(0,0,0,.6);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999999;
}
@import "coupon_pop.scss";
</style>