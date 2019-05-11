<template>
  <div>
    <div class="zhezhao" @click="closeAll" v-show="showMark"></div>
    <div class="member">
      <div class="member-item flex" v-for="(item, index) in groupBuyList.gblist">
        <img :src="item.imgphoto" @error="imgErr(index)">
        <div class="flex flex_v flex_pack_justify_between flex_1">
          <span class="line_over_1" v-cloak>{{item.realname}}的拼团</span>
          <span v-cloak>还差{{item.num}}人，还剩{{countDownTime[index]}}</span>
        </div>
        <div class="btn gradient" @click="openGroup(item.isingroup, index)" v-cloak>{{item.isingroup ? '已参团' : '快速参团'}}</div>
      </div>
    </div>
    <!-- 拼团弹窗 -->
    <div class="ptPop flex flex_v flex_align_center flex_pack_justify_between clear" v-if="showPt" :style="{top: showPt ? '50%' : '-999%'}">
      <span v-cloak>还差{{ptDetailData.count}}人，快来拼团吧</span>
      <div class="avatar flex" id="avatar" :class="{tomore: ptAvatar}">
        <div class="box">
          <img :src="ptData.imgphoto || './img/man.jpg'">
          <div class="gradient name">团长</div>
        </div>
        <div class="box boxx" v-for="(item, index) in resobj" v-if="resobj.length > 0">
          <img :src="item.userimg || './img/man.jpg'">
        </div>
        <div class="box boxx" v-for="item in ptCount" v-if="ptCount">
          <img src="../../img/hui.png" style="border: 1px solid #d8d8d8;">
        </div>
      </div>
      <div class="btn gradient flex flex_align_center flex_pack_center" @click="goGroupDetail(ptDetailData.orderid, ptData.isingroup)" v-cloak>
        {{ptData.isingroup ? '已参团' : '与他拼团'}}
      </div>
    </div>
    <specpop :pid="msg.productid" :orderid="orderid" :gbskuid_prop="groupBuyList.gbskuid" :gbPrice="groupBuyList.gbprice" :gbid="groupBuyList.gbid" :openGroupbuy="openGroupbuy" v-show="showSpec"></specpop>
  </div>
</template>

<script>
import specpop from '../../components/specpop/specpop.vue'
export default {
  components:{
    specpop
  },
  props:{},
  data(){
    return {
      msg: {},                 // 商品数据
      groupBuyList: {},        // 商品拼团信息
      ptData: '',
      ptDetailData: '',
      resobj: '',
      ptCount: null,
      timer: [],               // 拼团计时器
      countDownTime: [],       // 拼团倒计时
      showSpec: false,
      openGroupbuy: 0,
      orderid: '',
      showPt: false,
      showMark: false,
    }
  },
  watch:{
    
  },
  computed:{
    // 拼团弹窗头像是否过多
    ptAvatar() {
      return this.resobj.length + this.ptCount.length > 3 ? true : false
    },
  },
  methods: {
    closeAll() {
      this.showPt = false
      this.showSpec = false
      this.showMark = false
    },
    // 获取商品拼团信息
    getGroupBuyList () {
      https({
        url: siteUrl + 'Main/Main/GetGroupBuyProJson',
        data: {
          gbid: pageParam('gbid'),
          uid: getname(),
          ogid: '',
          fxshopid: getname('SessionShopID'),
        },
        successBack: (ret) => {
          // return console.log(JSON.stringify(ret))
          if (ret.success && ret.status == 1) {
            this.getProductMsg(ret.Data.gbproid)
            this.groupBuyList = ret.Data
            var that = this
            for (let i = 0; i < ret.Data.gblist.length; i++) {
              let time = ret.Data.gblist[i].ts - ret.Data.gblist[i].tpgap
              if (time < 0) continue
              ret.Data.gblist[i].countDownTime = null
              that.countLastTimes(time, i)
            }
          } else {
            promptMsg(ret.err)
          }
        }
      })
    },
    // 获取拼团商品信息
    getProductMsg (pid) {
      https({
        url: siteUrl + 'Main/Main/GetProductDetailJson',
        data: {
          productId: pid || pageParam('pid'),
          gbid: pageParam('gbid'),
          userid: getname(),
          fxshopid: getname('SessionShopID')
        },
        // header: 1,
        successBack: this.msgSuccessBack
      })
    },
    // 拼团商品信息成功回调函数
    msgSuccessBack (ret) {
      // console.log(getname())
      if (ret.success && ret.status ==1) {
        const data = ret.Data
        this.msg = data
        // if (data.openspec) {
        //   this.getSpec()
        // }
      } else {
        promptMsg(ret.err)
      }
    },
    // 读取规格 设置原价
    // getSpec () {
    //   https({
    //     url: siteUrl + 'Main/Main/GetProductSkuJson',
    //     data: {
    //       productId: this.groupBuyList.gbproid,
    //       gbid: pageParam('gbid'),
    //       fxshopid: getname('SessionShopID')
    //     },
    //     successBack: (ret) => {
    //       // console.log(this.groupBuyList.gbskuid)
    //       if (ret) {
    //         if (ret.success && ret.status == 1) {
    //           let data = ret.Data
    //           // this.oldPrice = data.sku[0].saleprice
    //           this.price = data.gbsku[0].gbskuPrice
    //           this.gbearn = data.gbsku[0].gbearn
    //           this.proearn = this.msg.skuobj[0].savemoney
    //           this.spec = data.spec
    //           this.gbsku = data.gbsku
    //         } else {
    //           promptMsg(ret.err)
    //         }
    //       } else {
    //         promptMsg(err.Msg)
    //       }
    //     }
    //   })
    // },
    // 计算剩余时间
    countLastTimes (time, index) {
      let t = time
      let idx = index
      var that = this
      this.timer[index] = setInterval(() => {
        t -= 1
        if (t < 0) {
          this.groupBuyList.gblist[idx] = null
          clearInterval(that.timer[idx])
        }
        let days = Math.floor(t / 60 / 60 / 24)
        let hours = Math.floor(t / 60 / 60 % 24)
        let minutes = Math.floor(t / 60 % 60)
        let seconds = Math.floor(t % 60)

        minutes = minutes < 10 ? '0' + minutes : minutes
        seconds = seconds < 10 ? '0' + seconds : seconds
        
        let str = ''
        if (days) {
          str += days + '天'
        }
        if (hours) {
          hours = hours < 10 ? '0' + hours : hours
          str += hours + ':'
        }
        if (minutes) {
          str += minutes + ':'
        }
        str += seconds
        that.countDownTime[idx] =  str
        that.$forceUpdate()
      }, 1000)
    },
    // 打开参团详情
    openGroup(isingroup, index) {
      var that = this
      if (isingroup) {
        // 跳转拼团详情页
          openWin({
            name:'groupbuyDetail',
              url:'./group_detail.html',
            useWKWebView:true,
            pageParam:{
              title:'拼团详情',
              orderid: that.groupBuyList.gblist[index].orderidlist[0].orderid,
            }
          }, 1)
      } else {
        this.ptDetailData = {}
        this.ptData = this.groupBuyList.gblist[index]
        https({
          url: siteUrl + 'Marketing/Groupbuy/GetMyGroupbuyDetails',
          data: {
            ogid: this.ptData.opengroupid,
            uid: getname()
          },
          successBack: (ret) => {
            // console.log(JSON.stringify(ret))
            if (ret.success && ret.status == 1) {
              let data = ret.Data[0]
              data.orderid = this.groupBuyList.gblist[index].opengroupid
              this.ptDetailData = data
              if (data.resobj.length > 1) {
                var that = this
                this.resobj = []
                var res = data.resobj
                // console.log(JSON.stringify(res))
                for(let i = 1; i < res.length; i++) {
                  that.resobj.push(res[i])
                }
              }
              this.showMark = true
              this.showPt = true
              this.ptCount = []
              console.log(this.showPt)
              var that = this
              for (let i=0; i<data.count; i++) {
                that.ptCount.push(i)
              }
            } else {
              promptMsg(ret.err)
            }
          }
        })
      }
    },
    // 拼团弹窗点击
    goGroupDetail(orderid, isingroup) {
      let bool = false
      // 已有拼团 不能继续参团
      if (!isingroup) {
        let gblist = this.groupBuyList.gblist
        gblist.forEach((item) => {
          if (item.isingroup) {
            bool = true
          }
        })
      }
      if (bool) {
        return promptMsg('您有尚未结束的拼团活动')
      }

      if (checkLoginStatus()) {
        // 跳转购买
        this.groupbuy(this.ptDetailData.orderid)
      }
      this.showPt = false
    },
    // 发起拼团购
    groupbuy (ogid) {
      if (checkLoginStatus()) {
        if (this.groupBuyList.gbproid = '') {
          return promptMsg("商品不存在")
        }
        if (this.groupBuyList.gbid == '') {
          return promptMsg('团购已不存在')
        }
        var that = this
        // 有opengroupid表示参团
        var opengroupid = ''
        if (ogid && ogid != '') {
          opengroupid = ogid
        }
        this.openGroupbuy = 1
        this.showSpec = true
        this.showMark = true
        this.orderid = opengroupid
      }
    },
  },
  created(){
    this.getGroupBuyList()
  },
  mounted(){
    window.aaa = this
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
    background: #f5f5f5;
  }
  /* 拼团成员 */
  .member {
    width: rem(375);
    max-height: rem(350);
    background-color: #fff;
    padding: 0 rem(20);
    margin-top: rem(10);
    overflow-y: scroll;
  }
  ::-webkit-scrollbar {
    display: none;
  }
  .member .member-item {
    width: 100%;
    height: rem(70);
    align-items: center;
  }
  .member .member-item + .member-item {
    border-top: 1px solid #f6f6f6;
  }
  .member .member-item img {
    width: rem(48);
    height: rem(48);
    border-radius:50%;
    -webkit-border-radius:50%;
    margin-right: rem(10);
  }
  .member .member-item div {
    height: rem(43);
  }
  .member .member-item div span {
    font-size: rem(14);
    max-width: rem(195);
  }
  .member .member-item div span:nth-child(2) {
    font-size: rem(12);
    color: #999
  }
  .member .member-item .btn {
    width: rem(80);
    height: rem(30);
    border-radius: rem(30);
    -webkit-border-radius: rem(30);
    font-size: rem(12);
    text-align: center;
    line-height: rem(30);
    color: #fff;
  }

  /* 拼团弹窗 */
  .ptPop {
    width: rem(285);
    border-radius: rem(8);
    background-color: #fff;
    position: fixed;
    left: rem(45);
    transform: translateY(-50%);
    z-index: 1001;
  }
  .ptPop > span {
    font-size: rem(18);
    font-weight: 600;
    color: #333;
    margin-top: rem(24);
  }
  .ptPop > .avatar {
    justify-content: space-around;
    width: 80%;
    margin: rem(15) 0;
    flex-wrap: nowrap;;
  }
  .ptPop > .avatar.tomore {
    flex-wrap: wrap;
  }
  .ptPop > .avatar img {
    width: rem(48);
    height: rem(48);
    border-radius: 50%;
    margin: rem(-45) 0 0 0;
  }
  .ptPop > .avatar .tuanzhang {
    width: rem(50);
    height: rem(16);
    font-size: rem(10);
    margin-bottom: rem(10);
    color: #fff;
    position: absolute;
    left: 50%;
    bottom: rem(-8);
    transform: translateX(-50%);
    border-radius: rem(8);
  }
  .ptPop > .btn {
    width: rem(240);
    height: rem(36);
    border-radius: rem(18);
    color: #fff;
    font-size: rem(14);
    font-weight: 600;
    margin-bottom: rem(10);
  }
  .tuanz {
    width: rem(48);
    height: rem(48);
    position: relative;
  }
  .tuaz {
    width: rem(48);
    height: rem(48);
  }
  .tuanz img {
    margin-top: rem(-45);
  }
  .avat {
    width: rem(48);
    height: rem(48);
    margin-left: rem(2.5);
    margin-top: rem(-45);
    // margin-bottom: rem(10);
  }
  .avat img {
    margin-top: rem(-45) !important;
  }
  .box {
    width: rem(48);
    height: rem(48);
    margin: rem(2) rem(4);
    position: relative;
  }
  .box img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, 40%, 0);
  }
  .boxx {
    // margin-left: rem(8);
  }
  .name {
    width: rem(35);
    text-align: center;
    height: rem(16);
    font-size: rem(10);
    position: absolute;
    bottom: 0;
    left: 50%;
    color: #fff;
    transform: translateX(-50%);
    border-radius: rem(8);;
  }

  .zhezhao {
    width: 100%;
    background-color: rgba(0,0,0,.4);
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
  }

  .flex {
    display: flex;
  }
  .flex_align_center {
    align-items: center;
  }
  .flex_pack_center {
    justify-content: center;
  }
  .flex_v {
    flex-direction: column;
  }
  .flex_1 {
    flex: 1;
  }
  .flex_pack_justify_between {
    justify-content: space-between
  }

  .transition_ease_in_out{-moz-transition:all 0.3s ease-in-out;-webkit-transition:all 0.3s ease-in-out;-o-transition:all 0.3s ease-in-out;transition:all 0.3s ease-in-out;}
  .transition_ease_in_out_fast{-moz-transition:all 0.1s ease-in-out;-webkit-transition:all 0.1s ease-in-out;-o-transition:all 0.1s ease-in-out;transition:all 0.1s ease-in-out;}
  /*一行溢出省略号  */
  .line_over_1{overflow: hidden;text-overflow:ellipsis;white-space: nowrap;}
  /* 两行溢出省略号  */
  .line_over_2{overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;}

  .gradient {
    background:linear-gradient(270deg,rgba(254,51,75,1) 0%,rgba(255,114,130,1) 100%) !important;
  }
</style>