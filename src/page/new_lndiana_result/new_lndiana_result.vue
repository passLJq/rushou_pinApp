<template>
  <div id="app">
    <!-- 商品及获奖者 -->
    <div class="upper flex flex_pack_center flex_align_center">
      <div class="back flex flex_v flex_align_center">
        <div class="proDetail flex" v-if="proMsg">
          <img :src="proMsg.proimg ? proMsg.proimg : './image/bkg_cover.jpg'">
          <div class="content flex flex_v flex_pack_justify_between">
            <div class="title line_over_2" v-html="proMsg.proname"></div>
            <div class="price flex">
              <span>￥</span>
              <span v-cloak>{{proMsg.cloudPrice}}</span>
              <span style="text-decoration: line-through;" v-cloak>{{'原价' + proMsg.proprice}}</span>
            </div>
          </div>
        </div>
        <div style="width: 90%;height: 1px;background: #f6f6fa;"></div>
        <!-- 获奖编号 -->
        <span class="bingo" v-if="!detail" v-cloak>{{pageParam.invalid == 0 ? '本期获奖编号' : '该抽奖已失效'}}</span>
        <span class="bingo code" v-if="!detail" v-cloak>{{pageParam.invalid == 0 ? pageParam.winningcode : '　'}}</span>
        <span class="bingo" v-if="detail&&proMsg.state==4">活动已开奖，请到活动揭晓页查看中奖人信息</span>
        <span class="bingo" v-else-if="detail&&proMsg.state==3">遗憾，活动没有达到开奖条件，已过期</span>
        <span class="bingo" v-else-if="detail&&userData.remaining!=0">我正在参与抽奖</span>
        <span class="bingo" v-else-if="detail">恭喜您，正在等待开奖</span>
        <!-- 获奖者 -->
          <div class="bingoer flex flex_v flex_align_center" v-if="!detail">
            <img v-if="pageParam.invalid == 0" :src="pageParam.img || './image/man.jpg'">
            <img v-else src="../../img/man.jpg">
            <div class="gradient">获奖者</div>
          </div>
          <!-- 名字 -->
          <span class="username" :style="detail ? 'marginBottom: 0' : ''" v-cloak v-if="!detail">{{pageParam.invalid == 0 ? pageParam.user : '　'}}</span>
          <!-- 如果是分享详情则显示头像 -->
            <div v-if="detail" class="avatar flex flex_pack_justify_around" style="flex-wrap: wrap;width: 70%;margin-top: 5%;">
              <!-- 分享者头像 -->
              <div class="item flex flex_v flex_align_center">
                <img v-lazy="userData.userimg" style="border:2px solid #fff;">
                <span class="color_999" style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{userData.username}}</span>
              </div>
              <!-- 助力者头像 -->
              <div class="item flex flex_v flex_align_center" v-for="item in userData.sharedes">
                <img v-lazy="item.userhead">
                <!-- <img wx:else src="../../image/man.jpg"> -->
                <span class="color_999" style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{item.username||'已助力'}}</span>
              </div>
              <!-- 待助力 -->
              <div class="item flex flex_v flex_align_center" v-for=" item in remaining">
                <img src="../../img/hui.png" style="border:2px solid #d8d8d8;">
                <span class="color_999" style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">待助力</span>
              </div>
            </div>
            <!-- done即分享次数为0 -->
            <div v-if="(proMsg.state==3||proMsg.state==4)&&pageParam.way=='detail'" class="btn" style="background-color: #999;">已结束</div>
            <div v-else-if="pageParam.way=='detail'&&!done" @click="goshare" class="btn gradient">助力，即可参加抽奖</div>
            <!-- <div v-else-if="!done&&pageParam.way=='detail'" @click="goshare" class="btn gradient">助力，即可参加抽奖</div> -->
            <!-- <div v-else-if="done&&status==1&&pageParam.way=='detail'" @click="goLndianaDetail" class="btn gradient">已成功，立即付款</div> -->
            <div v-else-if="done&&pageParam.way=='detail'" @click="goshare" class="btn gradient">立即炫耀</div>
            <!-- <div v-else-if="done&&status==20&&pageParam.way=='detail'" @click="goLndiana" class="btn" style="background-color: #999;">已成功</div> -->
      </div>
    </div>

    <!-- 参与人数与揭晓时间 -->
    <div class="detail flex flex_v flex_align_center" v-if="!detail">
      <div class="flex flex_pack_justify_between flex_align_center">
        <span class="color_999">参与人数</span>
        <span class="color_333" v-if="proMsg" v-cloak>{{proMsg.amout + '人次'}}</span>
      </div>
      <div style="width: 90%;height: 1px;background: #f6f6fa;"></div>
      <div class="flex flex_pack_justify_between flex_align_center">
        <span class="color_999" v-cloak>{{pageParam.invalid == 0 ? '揭晓' : '结束'}}时间</span>
        <span class="color_333" v-cloak>{{pageParam.endtime}}</span>
      </div>
    </div>
    <!-- 玩法说明 -->
    <div v-else class="explain">
      <div class="title text_center color_333">玩法说明</div>
      <div class="content flex flex_v flex_align_center">
        <img src="../../img/wanfashuoming@3x.png">
        <div class="flex flex_pack_justify_around">
          <div >
            <span class="color_999">选择商品 参加活动</span>
          </div>
          <div >
            <span class="color_999">邀请好友 为你助力</span>
          </div>
          <div >
            <span class="color_999">人满获得 夺宝资格</span>
          </div>
          <div >
            <span class="color_999">中奖发奖 失败退款</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部栏 -->
    <!-- <div style="width: 100%;height: 70rpx;"></div> -->
    <div v-if="detail" class="footer flex flex_pack_center flex_align_center" @click="goLndiana">
      <div class="other flex flex_pack_center flex_align_center">其他活动</div>
    </div>
  </div>
</template>

<script>
export default {
  components:{},
  props:{},
  data(){
    return {
      proMsg: '',               // 商品数据
      pageParam: '',            // 传递过来的页面数据
      detail: false,            // 是否
      userData: '',             // 用户数据
      status: 0,                // 用户数据状态码
      remaining: '',            // 待助力的数组
      done: false,              // 该用户的抽奖活动是否已助力完成
      isDone: false             // 是否加载完毕
    }
  },
  watch:{
    
  },
  computed:{},
  methods: {
    getProData() {
      showLoading()
      https({
        url: siteUrl + 'Marketing/Cloudbuy/GetOneCloudShoppingSet',
        data: {
          cloudid: pageParam('cloudid'),
          userid: getname()
        },
        successBack: (ret) => {
          // console.log(JSON.stringify(ret))
          hideLoading()
          if (ret.success && ret.status == 1) {
            this.proMsg = ret.Data[0]
          } else {
            promptMsg(ret.err)
          }
          this.isDone = true
        }
      })
    },
    getUserData() {
      // console.log(siteUrl + 'Marketing/Cloudbuy/IsPayCloud?uid=' + getname())
      // console.log(this.pageParam.cloudid)
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
          // console.log(JSON.stringify(ret))
          // 1-成功 2-活动已经被禁用 3-活动已经结束 4-活动未开始 5-活动神域参与名额不足 7-请登录再操作 8-本次最大购买次数为  20-客官，您已经参与该活动，不能重复参加
          if (ret.success) {
            var data = ret.Data
            if (ret.status != 1 && ret.status != 20) return promptMsg(ret.err)
            if (data.sharedes && data.sharedes.length > 0) {
              data.sharedes = JSON.parse(data.sharedes)
            }
            // 待助力凑数
            if (data.remaining) {
              this.remaining = []
              for(let i=0;i<data.remaining;i++) {
                this.remaining.push(i)
              }
            } else {
              // 分享数为0或不需分享 且status不为20 则显示付款
              this.done = true
              this.status = ret.status
            }
            this.userData = data
          } else {
            promptMsg(ret.err)
          }
          this.getProData()
        }
      })
    },
    // 分享
    goshare() {
      var that = this
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
              data: that.proMsg,
              userData: that.userData,
              way: 'lndiana',
              cloudid: pageParam('cloudid'),
              buycount: 0
          },
          bounces: false,
          bgColor: 'rgba(0,0,0,0)'
      })
    },
    // 跳转抽奖商品详情页
    goLndianaDetail() {
      openWin({
        name: 'lndianaDetail',
        url: './new_lndianaDetail.html',
        pageParam: {
          title: '商品详情',
          cloudid: pageParam('cloudid'),
          bgColor: '#f6f6fa',
          hScrollBarEnabled: false,
          vScrollBarEnabled: false
        }
      }, 1)
    },
    // 跳转抽奖活动页
    goLndiana() {
      openWin({
        name: 'lndiana',
        url: './new_lndiana.html',
        pageParam: {
          title: '天天抽奖',
          bounces: true
        },
        bgColor: '#f6f6fa',
      }, 1)
    }
  },
  created(){
    this.pageParam = pageParam()
    if (this.pageParam.user&&/^1[34578]\d{9}$/.test(this.pageParam.user)) {
      var p = this.pageParam.user
      var p1 = p.substr(0,3)
      var p2 = p.substr(7,4)
      this.pageParam.user = p1 + '****' + p2
    }
    if (pageParam('way') == 'detail') {
      this.detail = true
      this.getUserData()
      this.getProData()
    } else {
      this.getProData()
    }
  },
  mounted(){
    // var s = getname('statustop') || 0
    // $api.byId('main').style.height = s + 'px'
  }
}
</script>
<style lang="scss">
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  .color_333 {
    color: #333;
  }
  .color_666 {
    color: #666;
  }
  .color_999 {
    color: #999;
  }
  .flex {
    display: flex;
  }
  .flex_v {
    flex-direction: column;
  } 
  .flex_align_center {
    align-items: center;
  }
  .flex_pack_justify_between {
    justify-content: space-between;
  }
  .flex_pack_center {
    justify-content: center;
  }
  .flex_pack_justify_around {
    justify-content: space-around;
  }
  .flex_pack_right {
    justify-content: flex-end;
  }
  .text_center {
    text-align: center;
  }
  .line_over_2 {
    overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;
  }
  body {
    font-size: rem(14);
  }

  div {
    box-sizing: border-box;
  }

  .upper {
    width: 100%;
    background: linear-gradient(180deg,#ff6f90 0%,#ff2054 100%);
  }

  .upper > .back {
    width: rem(345);
    background-color: #fff;
    border-radius: rem(8);
    margin: rem(14);
  }

  .upper .proDetail {
    width: 100%;
    height: rem(135);
  }

  .upper .proDetail img {
    width: rem(118);
    height: rem(118);
    margin: rem(12) 0 0 rem(11);
  }

  .upper .proDetail .content {
      height: rem(109);
      width: rem(192);
      margin: rem(15) 0 0 rem(10);
  }

  .upper .proDetail .content .title {
      width: 100%;
      height: rem(48);
      font-size: rem(12);
      color: #333;
      line-height: rem(24);
  }

  .upper .proDetail .content .price {
      width: 100%;
      height: rem(25);
      line-height: rem(25);
  }

  .upper .proDetail .content .price span:nth-child(1) {
      font-size: rem(12);
      font-weight: 600;
      color: #ff5541;
  }

  .upper .proDetail .content .price span:nth-child(2) {
      font-size: rem(18);
      font-weight: 600;
      color: #ff5541;
      transform: translateY(rem(-1));
  }

  .upper .proDetail .content .price span:nth-child(3) {
      font-size: rem(10);
      color: #999;
      margin-left: rem(10);
  }

  .upper .bingo {
      font-size: rem(17);
      font-weight: 600;
      color: #333;
      margin-top: rem(15);
  }

  .upper .bingo.code {
      margin-top: rem(5);
  }

  .upper .bingoer {
      width: rem(50);
      margin-top: rem(20);
  }

  .upper .bingoer img {
    width: rem(48);
    height: rem(48);
    border-radius: 50%;
    // border: 1px solid #f6f6fa;
  }

  .upper .bingoer div {
      font-size: rem(10);
      color: #fff;
      width: rem(50);
      height: rem(16);
      text-align: center;
      line-height: rem(16);
      border-radius: rem(16);
      margin-top: rem(-8);
  }
  .upper .username {
    margin-bottom: rem(20);
    color: #999;
    margin-top: rem(5);
    font-size: rem(12);
  }
  /* 参与人数之类的信息 */
  .detail {
      width: 100%;
      background-color: #fff;
      padding: 0 rem(15);
  }

  .detail div {
      width: 100%;
      height: rem(48);
  }

  .detail div span {
      font-size: rem(14);
  }
  /* 玩法说明 */
  .explain {
      width: 100%;
      margin-bottom: rem(40);
      background-color: #fff;
  }

  .explain .title {
      font-size: rem(14);
      padding: rem(8) 0;
  }

  .explain .content {
      width: 100%;
      padding-top: rem(17);
  }

  .explain .content img {
      width: rem(300);
      height: rem(22);
  }

  .explain .content > div {
      width: 96%;
      margin-top: rem(9);
      margin-bottom: rem(18);
  }

  .explain .content > div > div {
      font-size: rem(12);
      width: rem(48);
  }
  /* 底部栏 */
  .footer {
      width: 100%;
      height: rem(55);
      position: fixed;
      background-color: #fff;
      left: 0;
      bottom: 0;
      box-sizing: content-box;
  }

  .footer .other {
      width: rem(345);
      height: rem(35);
      font-size: rem(14);
      font-weight: 600;
      color: #FF5541;
      border: rem(1) solid #FF5541;
      border-radius: rem(17.5);
  }
  /* 成员 */
  .avatar {
      width: 96%;
      /* margin-top: 40rpx; */
  }

  .avatar .item {
      width: rem(48);
      margin: 0 rem(2.5);
  }

  .avatar .item span {
    max-width: rem(48);
      font-size: rem(12);
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
  }

  .avatar .item img {
      width: rem(48);
      height: rem(48);
      border-radius: 50%;
  }

  .btn {
      font-size: rem(14);
      font-weight: 600;
      color: #fff;
      padding: rem(8) rem(75);
      margin: rem(20) 0;
      border-radius: rem(18);
      line-height: rem(20);
  }
  /* 如果头像只有一行 则给upper加上more类名 */
  .more {
      height: rem(390);
  }

  .more .back {
      height: rem(360);
      margin: 0;
  }

  .more .back .avatar {
      margin-top: rem(20);
  }

  .more .back .btn {
      margin-top: rem(20);
  }

</style>