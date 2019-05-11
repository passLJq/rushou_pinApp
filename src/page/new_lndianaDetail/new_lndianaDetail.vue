<template>
  <div id="app">
      <!-- 分享按钮 -->
      <!-- <div class="share iconfont icon-fenxiang" @click="onshare"></div> -->
      <!-- 轮播区域 -->
      <div class="swiper">
        <van-swipe :autoplay="3000" id="swiper">
          <van-swipe-item v-for="(item, imgIdx) in imgUrls" :key="imgIdx">
            <img v-lazy="item" style="width: 100%;"/>
          </van-swipe-item>
        </van-swipe>
        <!-- 价格区域 -->
        <div class="priceGroup gradient">
            <div class="pr">
              <div>
                <div>
                  <span>￥</span><span class="prr">{{price}}</span>
                </div>
                <span class="gbn" v-if="!isduobao">{{gbnum}}人拼团价</span>
                <span class="gbn" v-else>抽奖价</span>
              </div>
              <p v-if="!isduobao">￥{{oldPrice|toFixed}}/抢购价</p>
            </div>
            <div class="cout" v-if="!isduobao&&groupCount.show">
              <p>{{groupCount.isDone ? '活动已结束' : groupCount.text}}</p>
              <div v-show="!groupCount.isDone">
                <p>{{groupCount.hour}}</p>
                <span>:</span>
                <p>{{groupCount.minute}}</p>
                <span>:</span>
                <p>{{groupCount.second}}</p>
              </div>
            </div>
        </div>
      </div>
      <!-- 商品信息 -->
      <div class="proDetails flex">
        <div class="p1 mt_5">
            <span class="allhave" v-if="msg.iscross"><span class="tua" style="background-color: #9F01F1;">全球购</span><span class="buy" style="color: #9f01f1;margin: 0 5px;">包邮包税</span></span>
            <span class="gradient tua" style="margin-right: 3px;">拼团包邮</span><span class="gradient tua" v-if="msg.buyonegetone" style="margin-right: 3px;">{{msg.buyonegetone ? '拼一送一' : ''}}</span></span>{{msg.proname || msg.name}}
          </div>
          <div class="p2">{{msg.secondname}}</div>
          <!-- <p class="p3">已售{{msg.chenjiaonum}}</p> -->
          <div class="redshare" @click="onshare">
            <div>
              <img src="../../img/redpackage.png">
              <span>分享开团可赚</span>
              <span>￥{{gbearn | toFixed}}</span>
            </div>
            <span>去分享>></span>
          </div>
      </div>
       <!-- 保障 -->
      <div class="ensure flex" @click="openEnsure">
        <div class="flex flex flex_align_center flex_pack_center" v-for="(item, index) in msg.commitmentlist" :key="index">
          <!-- <img :src="item.logoimg" /> -->
          <i></i>
          <span style="margin-left: 6px;" v-cloak>{{item.name}}</span>
        </div>
      </div>
      
      <!-- 优惠券 -->
      <div class="coupon hide" id="coupon" @click="openCoupon"  style="margin-top: 3%;" v-if="showCoupon==1">
        <div>
          <span>{{unGet ? '领券' : '已领券'}}</span>
          <span class="t1">{{unGet[0] ? unGet[0].companyname : hasGet[0] ? hasGet[0].companyname : ''}}</span>
          <span class="t2" v-if="unGet && index<2" v-for="(item, index) in unGet">{{'满' + item.uselimit + '减' + item.facevalue + '元' }}</span>
          <span class="t2" v-if="!unGet && hasGet && index<2" v-for="(item, index) in hasGet">{{'满' + item.uselimit + '减' + item.facevalue + '元' }}</span>
        </div>
        <div class="r icon-right iconfont"></div>
      </div>
      
      <!-- 没登录优惠券 -->
      <!-- <div class="coupon" style="margin-top: 3%;" @click="openCoupon" v-if="showCoupon==0">
        <div>
          <img class="mon" src="../../img/money.png">
          <span style="color: #333">注册就送100元购物礼包</span>
        </div>
        <div class="log" style="">立即注册</div>
        <div class="r icon-right iconfont"></div>
      </div> -->

      <!-- 横条 -->
       <div class="flex flex_pack_center hengtiao" v-if="isduobao">
         <div style="width: 90%;height: 1px;background-color: #f6f6fa"></div>
       </div>
       <!-- 参团进度条 -->
       <div class="progress flex flex_v flex_align_center" v-if="isduobao">
         <div class="line">
           <div :style="{width: (msg.amout / msg.totalamout) * 100 + '%'}"></div>
         </div>
         <div class="attend flex flex_pack_justify_between">
           <span v-cloak>{{msg.amout+'人已参加'}}</span>
           <span v-cloak>{{'剩余'+msg.remainingamout}}</span>
         </div>
       </div>
       <!-- 玩法说明 -->
        <!-- <div class="explain" v-if="!isduobao">
          <div class="title">玩法说明</div>
          <div class="content">
            <div class="progress flex flex_v flex_pack_center">
              <img src="../../img/wanfashuoming@3x.png" />
            </div>
            <div style="width: 100%;margin-top: -12%;">
              <div class="c-item">选择商品参加活动</div>
              <div class="c-item">支付开团或拼团</div>
              <div class="c-item">邀请好友参团支付</div>
              <div class="c-item">人满成功失败退款</div>
            </div>
          </div>
        </div> -->

      <!-- 拼团成员 -->
      <div class="member" v-if="!isduobao&&groupBuyList&&groupBuyList.gblist&&groupBuyList.gblist.length>0">
        <div class="member-item flex" v-for="(item, index) in groupBuyList.gblist">
          <img :src="item.imgphoto" @error="imgErr(index)">
          <div class="flex flex_v flex_pack_justify_between flex_1">
            <span class="line_over_1" v-cloak>{{item.realname}}的拼团</span>
            <span v-cloak>还差{{item.num}}人，还剩{{countDownTime[index]}}</span>
          </div>
          <div class="btn gradient" @click="openGroup(item.isingroup, index)" v-cloak>{{item.isingroup ? '已参团' : '与他拼团'}}</div>
        </div>
      </div>

       <!-- 商品详情 -->
       <div class="productMsg" id="productMsg">
         <div class="title">商品详情</div>
         <div class="content" id="pd">
           <!-- 没有商品详情内容 -->
             <div v-if="!productDetail" class="flex flex_v flex_align_center flex_pack_center" style="width: 100%;height: 300rpx;background-color: #f6f6fa">
               <img class="nodata" src="../../img/nodata.png">
               <span class="color_999" style="font-size: 13px;margin-top: -5%;">暂无商品介绍</span>
             </div>
         </div>
         <!-- 工商资历 -->
         <div>
           <div class='gongshang' @click="gogongshang()" id="gs">
             <p>工商资质</p>
             <img src="../../img/gongshang.png" alt="">
           </div>
         </div>
       </div>
       <!-- 底部栏 -->
       <div class="footerBar" id="footer">
          <!-- 立即夺宝按钮 -->
          <div style="background: #999;" class="dbBuy flex flex_align_center flex_pack_center" v-if="isduobao&&outTime">
            <span>{{hasJoin ? '已参加' : '已结束'}}</span>
          </div>
          <div class="dbBuy flex flex_align_center flex_pack_center gradient" @click="showLndiana(0)" v-if="isduobao&&!outTime">
            <span v-cloak>立即抽奖 ￥{{price}}</span>
          </div>
          <!-- 直接买 -->
          <!-- <div class="buyNow flex flex_align_center flex_pack_center" @click='buyNow' v-if="!isduobao">
            <span>直接买￥{{oldPrice}}{{proearn&&fxshopid?'/赚￥'+proearn.toFixed(2):''}}</span>
          </div> -->
          <!-- 拼团购 -->
          <div class="newButton ptBuy flex flex_align_center flex_pack_center gradient" @click='checkGB' v-if="!isduobao">
            <span>拼团购 ￥{{price|toFixed}}{{gbearn&&fxshopid?'/赚￥'+gbearn.toFixed(2):''}}</span>
          </div>
       </div>
       <!-- 数量弹窗 -->
       <div class="count flex flex_v flex_align_center flex_pack_justify_between transition_ease_in_out"  id="count" :style="{bottom: showNum ? '0px' : '-100%'}">
          <div class="numBox flex flex_align_center flex_pack_justify_between">
            <div tapmode class="icon flex flex_align_center flex_pack_center iconfont icon-minus" :class="lndianaNum > 1 ? '' : 'color_999'" @touchstart="lndianaCount(0)"></div>
            <span v-if="!msg.patern">{{lndianaNum}}</span>
            <input v-else type="number" :value="lndianaNum" ref="input" @input="inputHandle">
            <div tapmode class="icon flex flex_align_center flex_pack_center  iconfont icon-add"
            :class="lndianaNum == msg.remainingamout ? 'color_999' : lndianaNum == msg.max ? 'color_999' : ''" @touchstart="lndianaCount('add')"></div>
          </div>
          <div class="btn gradient flex flex_align_center flex_pack_center" @click="confirmLogin">确定数量</div>
        </div>
       <!-- 遮罩 -->
       <div class="mark" style="z-index: 100" v-show="showMark" @click="showLndiana(1)"></div>
       <!-- 保障弹窗 -->
        <div class="popup-content" :style="showEnsure? 'bottom: 0%':''">
          <div class="popup-title" style="text-align: center;">服务承诺</div>
            <div class="popup-item" v-if="msg.commitmentlist" v-for="item in msg.commitmentlist">
              <div class="flex flex_align_center">
                <img :src="item.logoimg">
                <span v-cloak>{{item.name}}</span>
              </div>
              <div class="color_999 popup-text" v-cloak>{{item.content}}</div>
            </div>
        </div>
        <!-- 拼团弹窗 -->
        <div class="ptPop flex flex_v flex_align_center flex_pack_justify_between clear" v-if="showPt" :style="{top: showPt ? '50%' : '-999%'}">
          <span v-cloak>还差{{ptDetailData.count}}人，快来拼团吧</span>
          <div class="avatar flex" id="avatar" :class="{tomore: ptAvatar}">
            <div class="box">
              <img v-lazy="ptData.imgphoto">
              <!-- <img src="/image/hui.png" alt=""> -->
              <div class="gradient name">团长</div>
            </div>
            <div class="box boxx" v-for="(item, index) in resobj" v-if="resobj.length > 0">
              <img :src="item.userimg">
            </div>
            <div class="box boxx" v-for="item in ptCount" v-if="ptCount">
              <img src="../../img/hui.png" style="border: 1px solid #d8d8d8;">
            </div>
          </div>
          <div class="btn gradient flex flex_align_center flex_pack_center" @click="goGroupDetail(ptDetailData.orderid, ptData.isingroup)" v-cloak>
            {{ptData.isingroup ? '已参团' : '与他拼团'}}
          </div>
        </div>

        <div class="tips" v-show="showTips" style="z-index: 101">
          <p>友情提示</p>
          <p>亲，有人正在拼这款商品，可以前往点击成团列表快速成团哦~</p>
          <div class="tipBtn">
            <div @click="goGblist">与他人拼团</div>
            <div @click="groupbuy()">直接开团</div>
          </div>
        </div>

        <specpop @changeData="changMsg" :pid="msg.productid" :orderid="orderid" :gbskuid_prop="groupBuyList.gbskuid" :gbPrice="groupBuyList.gbprice" :gbid="groupBuyList.gbid" :openGroupbuy="openGroupbuy" v-show="showSpec"></specpop>
        <coupon v-show="showCou" @closeCou="showLndiana(1)" :bindData="showCou" :pid="msg.productid" :gbid="groupBuyList.gbid"></coupon>
    </div>
</template>

<script>
import specpop from '../../components/specpop/specpop.vue'
import coupon from '../../components/coupon_pop/coupon_pop.vue'
import {httpp} from '../../assets/js/httpp'
export default {
  components:{
    specpop,
    coupon,
  },
  props:{},
  data(){
    return {
      imgUrls: [],
      gbnum: 0,                // x人团
      price: 0,             // 现价
      oldPrice: 0.00,          // 原价
      msg: {},                 // 商品数据
      groupBuyList: {},        // 商品拼团信息
      timer: [],               // 拼团计时器
      countDownTime: [],       // 拼团倒计时
      productDetail: '',       // 商品详情图片
      showNum: false,          // 显示夺宝数量选择
      showMark: false,         // 显示遮罩
      showEnsure: false,       // 显示保障信息
      showPt: false,           // 显示拼团弹窗
      ptData: {},              // 拼团数据
      ptDetailData: {},        // 拼团详细信息
      resobj: '',              // 拼团成员头像数组
      ptCount: null,           // 为参团填充数组
      shareNum: 1,             // 需要分享的次数
      lndianaNum: 1,           // 夺宝购买数量
      isduobao: false,         // 是否分享抽奖
      hasJoin: false,          // 分享抽奖并且已参加了活动
      isDone: false,           // 是否加载完毕
      uid: '',                 // 用户uid
      fxshopid: '',
      hasGet: '',              // 已领取优惠券
      unGet: '',               // 未领取优惠券
      spec: '',                // 规格数据
      gbsku: '',
      showSpec: false,
      showTips: false,
      showCou: false,
      orderid: '',
      openGroupbuy: 0,         // 是否显示拼团规格数据
      groupCount: {						 // 拼团商品活动的倒计时
        hour: '00',						 // 时
        minute: '00',					 // 分
        second: '00',					 // 秒
        isDone: false,				 // 活动是否结束
        show: false,					 // 控制显示倒计时和文案 （一开始进来时暂不显示倒计时，计时器跑完一次再显示）
        text: ''							 // 文案
      },
      proearn: 0,              // 直接买赚
      gbearn: 0,               // 拼团赚
    }
  },
  watch:{
    
  },
  filters: {
    toFixed: function(value) {
      value = Number(value)
      return value.toFixed(2)
    }
  },
  computed:{
    // 抽奖商品状态 state  1 正常  2 禁用  3 已过期  4 已完成  5 未开始
    outTime: function () {
      if (!this.isduobao) return false
      var bool = false
      if (this.msg.state == 3 || this.msg.state == 4) {
        bool = true
      }
      if (this.hasJoin) {
        bool = true
      }
      return bool
    },
    // 拼团弹窗头像是否过多
    ptAvatar() {
      return this.resobj.length + this.ptCount.length > 3 ? true : false
    },
    // 是否显示优惠券入口
    showCoupon() {
      if (!getname()) return '0'
      if (getname() && (this.hasGet || this.unGet)) {
        return '1'
      } else {
        return '2'
      }
    }
  },
  methods:{
    // 获取商品详情
    getlndianaProMsg() {
      showLoading()
       https({
         url: siteUrl + 'Marketing/Cloudbuy/GetOneCloudShoppingSet',
         method: 'get',
         data: {
           cloudid: pageParam('cloudid'),
           userid: getname()
         },
         successBack: this.lndianaSuccessBack
       })
    },
    // 夺宝商品信息成功回调函数
    lndianaSuccessBack(ret) {
      hideLoading()
      //  console.log(JSON.stringify(ret))
      if (ret.success && ret.status == 1) {
        const data = ret.Data[0]
        let imgUrls = []
        if (data.imglist.length) {
          data.imglist.forEach(item => imgUrls.push(item.imgvalue))
        } else {
          imgUrls.push(data.proimg)
        }
        this.productDetail = data.details
         document.getElementById('pd').innerHTML = data.details
         this.msg = data
         // console.log(JSON.stringify(this.msg))
         this.price =  data.cloudPrice
         this.oldPrice =  data.proprice
        } else {
        promptMsg(ret.err)
      }
      this.isDone = true
    },
    //  请求判断是否已参加活动
    isJoin() {
      
      if (getname() && getname('loginStatus') == "loginSuccess") {
        https({
          url: siteUrl + 'Marketing/Cloudbuy/IsPayCloud?uid=' + getname(),
          method: 'post',
          data: {
            uid: getname(),
            cloudid: pageParam('cloudid'),
            buycount: 0
          },
          headers: 1,
          successBack: ret => {
           //  console.log(JSON.stringify(ret))
           if (ret.success && ret.status == 20) {
             this.hasJoin = true
           }
          }
        })
      }
    },
    //  确定数量窗口
    showLndiana (num) {
      if (num == 1) {
        this.showNum = false
        this.showMark = false
        this.showEnsure = false
        this.showSpec = false 
        this.showCou = false
        this.showPt = false
        this.ptDetailData = {}
        this.showTips = false
        this.lndianaNum = this.lndianaNum == '' ? 1 : this.lndianaNum == 0 ? 1 : this.lndianaNum
      } else {
        this.showNum = !this.showNum
        this.showMark = !this.showMark
      }
    },
    //  数量输入事件
    inputHandle(e) {
      var val = e.target.value
      var exp = /^[1-9]\d*|0$/
      if (exp.exec(val) != null) {
        if (val > this.msg.max) {
          promptMsg('购买数量不能大于' + this.msg.max)
          this.lndianaNum = this.msg.max
          return
        }
        if (val > this.msg.remainingamout) {
          promptMsg('购买数量不能大于' + this.msg.remainingamout)
          this.lndianaNum = this.msg.remainingamout
          return
        }
        this.lndianaNum = val
      }
    },
    //  点击加减按钮
    lndianaCount(str) {
      if (!this.msg.patern) return
      if (str == 'add') {
        this.lndianaNum = parseInt(this.lndianaNum) + 1
        this.lndianaNum = this.lndianaNum > this.msg.remainingamout ? this.msg.remainingamout : this.lndianaNum
        this.lndianaNum = this.lndianaNum > this.msg.max ? this.msg.max : this.lndianaNum
      } else {
        this.lndianaNum  = parseInt(this.lndianaNum) - 1
        this.lndianaNum = this.lndianaNum < 1 ? 1 : this.lndianaNum
      }
    },
    //  确定数量
    confirmLogin() {
      this.showNum = false
      this.showMark = false
      // patern为false表示一次只能购买一件
      if (!checkLoginStatus()) return
      if (this.lndianaNum <= 0) return promptMsg('购买数量不能小于1')
      if (!this.msg.patern) {
        if (this.lndianaNum > 1) {
          return promptMsg('购买数量不能大于1')
        }
      }
      // console.log(this.lndianaNum)
      https({
        url: siteUrl +'Marketing/Cloudbuy/IsPayCloud?uid='+getname(),
        method: 'post',
        data: {
          uid: getname(),
          cloudid: pageParam('cloudid'),
          buycount: this.lndianaNum
        },
        headers: 1,
        successBack: (ret) => {
          // console.log(JSON.stringify(ret))
           this.showNum = false
          if (ret.success && ret.status == 1) {
            if (this.lndianaNum > ret.Data.max) return promptMsg('购买数量不能大于' + ret.Data.max)
            if (this.lndianaNum > ret.Data.remainingamout) return promptMsg('购买数量不能大于' + ret.Data.remainingamout)
            this.toShare()
          } else {
            promptMsg(ret.err)
          }
        }
      })
    },
    //  分享
    toShare() {
      // 暂时改为先付款后分享
      var that = this
      openWin({
        name: 'ordercomfirm',
        url: './ordercomfirm.html',
        pageParam: {
          cid: pageParam('cloudid'),
          num: that.lndianaNum,
          pName: that.msg.proname,
          title:'订单确认',
          way:'lndiana'
        }
      },1)
      // 以下是先分享后付款 (暂时保留)

      // 不需要分享或剩余分享次数为0 直接跳转支付
      // if (!this.msg.isshare || this.shareNum <= 0) {
      //   var that = this
      //   //lndianaRouter.push('/lndianaPay/'+counts+'/'+that.$route.params.cid)
      //   api.openWin({
      //       name: 'lndianaPay',
      //       url: './lndianaPay.html',
      //       pageParam: {
      //           cid: pageParam('cloudid'),
      //           num: that.lndianaNum,
      //           pName: that.msg.proname
      //       }
      //   })
      // }
      // // 需要分享
      // if (this.msg.isshare && this.shareNum > 0) {
      //   tollhead({
      //     name: 'lndianaShare',
      //     // useWKWebView: true,
      //     pageParam: {
      //       title: '分享抽奖',
      //       url: '/html/lndiana/new_lndianaShare.html',
      //       cloudid: this.msg.cloudid,
      //       buycount: this.lndianaNum,
      //       bgColor: '#fff',
      //       hScrollBarEnabled: false,
      //       vScrollBarEnabled: false
      //     }
      //   })
      // }
    },

    //  =========================  以下是拼团函数 =========================

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
        this.oldPrice = data.saleprice
        this.productDetail = data.description
        this.proearn = data.commPrice
        document.getElementById('pd').innerHTML = data.description
        this.imgUrls = JSON.parse(data.album).piclist || [data.pic]
        // this.getGroupBuyList() // 获取商品拼团信息+倒计时
        if (data.openspec) {
          this.getSpec()
        }
      } else {
        promptMsg(ret.err)
      }
      this.isDone = true
    },
    // 保障信息弹窗
    openEnsure() {
      this.showMark = true
      this.showEnsure = true
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
            this.price = ret.Data.gbprice
            this.gbnum = ret.Data.gbnum
            this.groupBuyList = ret.Data
            this.gbearn = ret.Data.gbearn
            var that = this
            for (let i = 0; i < ret.Data.gblist.length; i++) {
              let time = ret.Data.gblist[i].ts - ret.Data.gblist[i].tpgap
              if (time < 0) continue
              ret.Data.gblist[i].countDownTime = null
              that.countLastTimes(time, i)
            }
            this.getCouMsg()  // 读取优惠券
            // 读取规格
            // console.log(this.msg.openspec)
            this.getGroupTime()
          } else {
            promptMsg(ret.err)
          }
        }
      })
    },
    getGroupTime() {
      var start = this.groupBuyList.starttime
      var end = this.groupBuyList.endtime
      var nowtime = Date.now()
      var starttime = Number(Number(start) - Number(nowtime)) / 1000
      var endtime = Number(Number(end) - Number(nowtime)) / 1000
      if (starttime > 0) {
        this.count(starttime, 1)
      } else {
        this.count(endtime, 2)
      }
    },
    count(times, index) {
      var show = true
      var timetick = times
      var that = this
      var idx = index
      window.timer = null
      window.timer = setInterval(function () {
        var day = 0
        var hour = 0
        var minute = 0
        var second = 0
        var isDone = false  // 活动是否已结束
        var text = ''
        if (idx == 1) {
          text = '距离活动开始'
        } else {
          text = '距离活动结束'
        }
        if (timetick > 0) {
          day = Math.floor(timetick / (60 * 60 * 24))
          hour = Math.floor(timetick / (60 * 60)) - (day * 24)
          minute = Math.floor(timetick / 60) - (day * 24 * 60) - (hour * 60)
          second = Math.floor(timetick) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
        }

        // if (day <= 9) day = '0' + day
        hour = (Number(day) * 24) + Number(hour)
        if (hour <= 9) hour = '0' + hour
        if (minute <= 9) minute = '0' + minute
        if (second <= 9) second = '0' + second

        if (timetick <= 0) {
          if (idx == 1) {
            clearInterval(window.timer)
            window.timer = null
            that.getGroupTime()
          } else {
            clearInterval(window.timer)
            window.timer = null
            isDone = true
          }
        }
        that.groupCount = {
            day,
            hour,
            minute,
            second,
            isDone,
            show,
            text
          }
        timetick--
        that.$forceUpdate()
      }, 1000)
      console.log(that.groupCount)
    },
    // 读取规格 设置原价
    getSpec () {
      https({
        url: siteUrl + 'Main/Main/GetProductSkuJson',
        data: {
          productId: this.groupBuyList.gbproid,
          gbid: pageParam('gbid'),
          fxshopid: getname('SessionShopID')
        },
        successBack: (ret) => {
          // console.log(this.groupBuyList.gbskuid)
          if (ret) {
            if (ret.success && ret.status == 1) {
              let data = ret.Data
              // this.oldPrice = data.sku[0].saleprice
              this.price = data.gbsku[0].gbskuPrice
              this.gbearn = data.gbsku[0].gbearn
              this.proearn = this.msg.skuobj[0].savemoney
              this.spec = data.spec
              this.gbsku = data.gbsku
            } else {
              promptMsg(ret.err)
            }
          } else {
            promptMsg(err.Msg)
          }
        }
      })
    },
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
        // 将计算得出的剩余时间塞入countDownTime数组 在wx-for中通过index获取对应的剩余时间
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
        that.$forceUpdate()  // v-for循环渲染不及时 需强制渲染
        // console.log(str)
      }, 1000)
    },
    // 打开参团详情
    openGroup(isingroup, index) {
      if (isingroup) {
        // 跳转拼团详情页
          var that = this
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
    // 直接买
    buyNow() {
      var that = this
      if (this.groupBuyList.gbproid = '') {
        return promptMsg("商品不存在")
      }
      this.openGroupbuy = 0
      this.showSpec = true
      this.showMark = true
      
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
      
        // 有opengroupid表示参团
        var opengroupid = ''
        if (ogid && ogid != '') {
          opengroupid = ogid
        }
        this.showTips = false
        this.openGroupbuy = 1
        this.showSpec = true
        this.showMark = true
        this.orderid = opengroupid
        
      }
    },
    goGblist() {
      openWin({
        name: 'gblist' + pageParam('gbid'),
        url: './gblist.html',
        pageParam: {
          title: '拼团列表',
          gbid: pageParam('gbid')
        },
        bgColor: '#f5f5f5'
      }, 1)
    },
    // 检查该活动是否有等待成团
    async checkGB() {
      var that = this
      try {
        let ret = await httpp({
          url: siteUrl + 'Main/Shopping/CheckGroupBuyStatus?devicetype=7',
          data: {
            uid: getname(),
            gbid: pageParam('gbid')
          },
          headers: 1
        })

        if (!ret.success || ret.status != 1) throw ret

        let rett = await httpp({
          url: siteUrl + 'Marketing/Groupbuy/IsHasGroupbuy',
          data: {
            gbid: pageParam('gbid')
          },
        })
        if (rett.success && rett.status == 1) {
          if (rett.IsHas) {
            this.showMark = true
            this.showTips = true
          } else {
            this.groupbuy()
          }
        }
      } catch (ret) {
        
      }
      
    },
    changMsg(value) {
      var sku = this.msg.skuobj
      var gbsku = this.gbsku
      sku.forEach((item, i) => {
        if (item.skuid == value.skuid) {
          this.price = gbsku[i].gbskuPrice
          this.oldPrice = item.saleprice
          this.proearn = this.msg.skuobj[i].savemoney
          this.gbearn = gbsku[i].gbearn
        }
      })
    },
    // 图片加载错误时 显示默认头像
    imgErr(index) {
      this.groupBuyList.gblist[index].imgphoto = '/img/man.jpg'
    },
    // 分享
    onshare() {
      var that = this
      if (checkLoginStatus()) {
        if (this.isduobao) {
          if (openapp) {
            api.openFrame({
              name: 'marketing_shaerdiv',
              url: './marketing_shaerdiv.html',
              rect: {
                  x: 0,
                  y: 0,
                  w: 'auto',
                  h: 'auto'
              },
              pageParam: {
                  data: that.msg,
                  userData: that.userData,
                  way: 'lndiana',
                  cloudid: pageParam('cloudid'),
                  buycount: pageParam('buycount'),
                  detail: 1
              },
              bounces: false,
              bgColor: 'rgba(0,0,0,0)'
            })
          } else {
            openWin({
              name: 'marketing_shaerdiv',
              url: './marketing_shaerdiv.html',
              pageParam: {
                data: that.msg,
                userData: that.userData,
                way: 'lndiana',
                cloudid: pageParam('cloudid'),
                buycount: pageParam('buycount'),
                detail: 1
              }
            })
          }
        } else {
          this.msg.gbprice = this.groupBuyList.gbprice
          this.msg.productprice = this.groupBuyList.proprice
          if (openapp) {
            api.openFrame({
              name: 'marketing_shaerdiv',
              url: './marketing_shaerdiv.html',
              rect: {
                  x: 0,
                  y: 0,
                  w: 'auto',
                  h: 'auto'
              },
              pageParam: {
                data: that.msg,
                gbid: pageParam('gbid'),
                detail: 1
              },
              bounces: false,
              bgColor: 'rgba(0,0,0,0)'
            })
          } else {
            openWin({
              name: 'marketing_shaerdiv',
              url: './marketing_shaerdiv.html',
              pageParam: {
                data: that.msg,
                gbid: pageParam('gbid'),
                detail: 1
              }
            })
          }
        }
        
      }
    },
    /*================== 优惠券函数 ===================*/
    // 打开优惠券列表
    openCoupon() {
      var that = this
      if(checkLoginStatus()) {
        this.showCou = true
      }
    },
    // 获取拼团优惠券
    getCouMsg() {
      https({
      url: siteUrl + 'Marketing/Coupon/GetCouponListJson',
      data: {
        uid: getname(),
        ispaltform: 3,
        gbid: pageParam('gbid'),
        comid: this.msg.companyid,
        // gbid: '181114111402677383'
        isgb:'true'
      },
      successBack: ret => {
        if (ret.success && ret.status == 1) {
          let arr = []
          let data = ret.Data
          if (data.length) {
            var hasGet = []
            var unGet = []
            data.forEach(item => {
              // isover 表示总数领取完了 或领取次数剩余0了 就加入已领取列表
              if (!item.isover && (item.eachamount - item.getnum) > 0) {
                unGet.push(item)
              } else {
                hasGet.push(item)
              }
            })
            if (!hasGet.length) hasGet = ''
            if (!unGet.length) unGet = ''
            this.hasGet = hasGet
            this.unGet = unGet
          }
        }
        }
      })
    },
    //查看资历图片
    gogongshang(){
      var that=this
      openWin({
        name:'commerce',
        url:'./commerce.html',
        pageParam:{
          img:that.msg.blurl,
          title:'工商资质'
        }
      })
    }
  },
  created(){
    if (pageParam('cloudid')) {
      this.isduobao = true
    }
    this.uid = getname()
    this.fxshopid = getname('SessionShopID')
    // this.showNum = true
  },
  mounted(){
    var safebottom = getname('safeAreaBottom') || 0
    document.getElementById('footer').style.paddingBottom = safebottom + 'px'
    document.getElementById('count').style.paddingBottom = safebottom + 'px'
    let gs = document.getElementById('gs')
    document.getElementById('app').style.paddingBottom = safebottom + 'px'
    var that = this
    // 分享抽奖
    if (that.isduobao) {
      console.log(565)
      that.getlndianaProMsg()
      that.isJoin()
    }
    // 劲爆拼团
    if (!that.isduobao) {
      that.getGroupBuyList()
    }
  }
}
</script>
<style lang="scss">
  @import 'new_lndianaDetail.scss';
</style>