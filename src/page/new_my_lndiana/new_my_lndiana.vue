<template>
  <div>
    <div class="my" id="my">
      <!-- <block -->
        <div class="itm flex flex_v flex_align_center" v-for="(item, index) in msgReady"  @click="toDetail(index)"> <!-- data-cid="{{item.cloudid}}" data-pid="{{item.productid}}" data-jieshu="{{item.state == 5 ? 0 : 1}}" -->
          <!-- 头部 -->
          <div class="head flex flex_align_center flex_pack_justify_between">
            <span v-cloak>{{item.endtime || item.lotterytime}}</span>
            <span v-cloak>{{item.state == 4 ? '已开奖' : item.state == 3 ? '已失效' : '未开奖'}}</span>
          </div>
          <!-- 横线 -->
          <div class="line"></div>
          <!-- 商品数据 -->
          <div class="content flex">
            <div class="pic">
              <img v-lazy="item.img">
            </div>
            <div class="data">
              <div class="title line_over_2">{{item.proname}}</div>
              <!-- 进度条 -->
              <div class="progress">
                <div style="background:linear-gradient(90deg,rgba(232,55,74,1) 0%,rgba(253,94,67,1) 100%);" :style="{width: (item.amout / item.totalamout) * 100 + '%'}"></div>
              </div>
              <!-- 参与人数 -->
              <div class="join flex flex_pack_justify_between">
                <span v-cloak>{{item.amout}}人已参与</span>
                <span v-cloak>剩余{{item.remainingamout}}</span>
              </div>
              <!-- 价格 -->
              <div class="price">
                <span>￥</span>
                <span v-cloak>{{item.price}}</span>
                <span v-cloak>原价 {{item.proprice}}</span>
              </div>
            </div>
          </div>
          <div class="line"></div>
          <!-- 按钮 -->
            <div class="btnGroup flex flex_align_center flex_pack_right">
              <div class="btn flex flex_align_center flex_pack_center" v-show="item.state == 3 || item.state == 4" @click.stop="toResult(item.state, index)">揭晓结果</div>
              <div class="btn flex flex_align_center flex_pack_center" @click.stop="checkNumber(item.state, index, item.cloudid)">查看号码</div>
            </div>
        </div>

      <!-- <block wx:if="{{!msg.length}}"> -->
        <div class="flex flex_v flex_align_center" style="width: 100%;" v-if="!isDone">
          <div class="flex flex_align_center flex_pack_center noda">
            <img src="../../img/nostate.png">
          </div>
          <span class="color_999 fs_15">您还没有抽奖活动，快去参加吧</span>
          <div class="look" @click="tolndiana">去抽奖看看</div>
        </div>

    </div>
    <showRule :showPop="showPop" :winningcode="winningcode" :cloudid="cloudid" :done="done" @closePop="closePop"></showRule>
  </div>
</template>
<script>var aaa = 1</script>

<script>
import showRule from '../../components/showRule/showRule.vue'
export default {
  components:{
    showRule
  },
  props:{},
  data(){
    return {
      isDone: false,      // 数据是否加载完毕
      page: 1,            // 夺宝列表页数
      pageSize: 6,        // 夺宝页数量
      msg: '',            // 列表数据
      hasMore: true,      // 是否还有更多数据
      // done: false         // 判断夺宝是否已结束
      already: false,     // 页面是否可以加载

      // 以下是传入组件的数据
      showPop: [false, false],
      winningcode: '',    // 中奖号码
      cloudid: '',        // 查看号码的cloudid
      done: 0,            // 查看号码的活动是否已开奖 0或1
    }
  },
  watch:{
    msg() {
      if (this.msg && this.msg.length > 0) {
        this.isDone = true
      } else {
        this.isDone = false
      }
    }
  },
  computed:{
    msgReady() {
      if (this.isDone) {
        return this.msg
      } else {
        return false
      }
    }
  },
  methods: {
    // 获取我的夺宝列表信息
    getData() {
      showLoading()
      https({
        url: siteUrl + '/arketing/Cloudbuy/GetMyCloudShoppingSet',
        data: {
          currentPage: this.page,
          pageSize: this.pageSize,
          uid: getname(),
          type: 100 // 1: 未揭晓 2: 已揭晓 3: 已中奖 100: 未揭晓+已中奖
        },
        headers: 1,
        successBack: (ret) => {
          hideLoading()
          refreshDone()
          // console.log(JSON.stringify(ret))
          if (ret.success && ret.status == 1) {
            if (this.page == 1) {
              this.msg = ret.Data
            } else {
              this.msg = this.msg.concat(ret.Data)
            }
          // console.log(this.data.msg)
          } else if (ret.success && ret.status == 2) {
            this.hasMore = false
            // promptMsg('没有更多数据了')
          }
          this.already = true
        }
      })
    },
    // 重置
    reset() {
      this.isDone = false
      this.page = 1
      // this.msg = ''
      this.hasMore = true
      this.getData()
      // this.already = false
    },
    // 页面触底  加载更多数据
    onBottom () {
      if (window.api) {
        api.addEventListener({ name: 'scrolltobottom' }, (ret, err) => {
          if (!this.hasMore) return
          this.page += 1
          this.getData()
        })
      }
    },
    // 跳转商品详情
    toDetail(index) {
      let data = this.msg[index]
      // console.log(JSON.stringify(data))
      openWin({
        name: 'lndianaResult',
        url: './new_lndiana_result.html',
        pageParam: {
          title: '抽奖详情',
          cloudid: data.cloudid,
          way: 'detail', // 表示跳转抽奖详情
          bgColor: '#f6f6fa',
          hScrollBarEnabled: false,
          vScrollBarEnabled: false
        }
      }, 1)
    },
    // 跳转揭晓结果
    toResult(state, index) {
      var invalid = 0   // 是否为失效 0为否(已开奖) 1为是(已失效)
      if (state == 3) {
        invalid = 1
      }
      let data = this.msg[index]
      // return console.log(JSON.stringify(data))
      openWin({
        name: 'lndianaResult',
        url: './new_lndiana_result.html',
        pageParam: {
          title: '揭晓结果',
          cloudid: data.cloudid,
          endtime: data.lotterytime || data.endtime,
          img: data.headphoto || '',
          invalid,
          pid: data.productid,
          user: data.username || '',
          winningcode: data.winningcode || '',
          bgColor: '#f6f6fa',
        },
        hScrollBarEnabled: false,
        vScrollBarEnabled: false
      }, 1)
    },
    // 跳转
    tolndiana () {
      openWin({
        name: 'lndiana',
        url: './new_lndiana.html',
        pageParam: {
          title: '天天抽奖'
        },
        bgColor: '#f6f6fa'
      }, 1)
    },
    // 查看号码
    checkNumber(state, index, cloudid) {
      var done = 0
      if (state != 1) {
        done = 1
      }
      this.winningcode = this.msg[index].winningcode || ''
      this.cloudid = cloudid
      this.done = done
      this.showPop = [false, true]
      // api.openFrame({
      //     name: 'checkNumber',
      //     url: 'widget://html/lndiana/showRule.html',
      //     rect: {
      //         x: 0,
      //         y: 0,
      //         w: 'auto',
      //         h: 'auto'
      //     },
      //     pageParam: {
      //         cloudid,
      //         winningcode: this.winningcode,
      //         done,
      //     },
      //     bounces: false,
      //     bgColor: 'rgba(0,0,0,0)',
      //     vScrollBarEnabled: false,
      //     hScrollBarEnabled: false
      // });
    },
    closePop () {
      console.log(2)
      this.showPop = [false, false]
    }
  },
  created(){
    this.getData()
    this.onBottom()
  },
  mounted(){
    // var s = getname('statustop') || 0
    // $api.byId('main').style.height = s + 'px'
    let my = document.getElementById('my')
    var sb = getname('safeAreaBottom') || 0
    my.style.paddingBottom = sb + 'px'
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
    font-size: rem(14);
    background-color: #f5f5f5;
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
  .flex_pack_right {
    justify-content: flex-end;
  }
  .line_over_2 {
    overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;
  }
  .my {
    width: 100%;
    box-sizing: content-box;
  }
  .my .itm {
    width: 100%;
    background-color: #fff;
  }
  .my .itm + .itm {
    margin-top: rem(10);
  }
  .my .itm:nth-child(1) {
    padding-top: rem(27);
  }
  .my .head {
    width: 100%;
    height: rem(48);
    padding: 0 rem(20) 0 rem(15);
  }
  .my .head span:nth-child(1) {
    font-size: rem(12);
    color: #999;
  }
  .my .head span:nth-child(2) {
    font-size: rem(14);
    color: #ff5541;
  }

  /* 横线 */
  .line {
    width: rem(345);
    height: rem(1);
    background-color: #fbfbfc;
  }

  .my .itm .content {
    width: 100%;
    height: rem(140);
  }
  .my .itm .content .pic {
    width: rem(96);
    height: rem(96);
    margin-top: rem(10);
    margin-left: rem(15);
  }
  .my .itm .content .pic img {
    width: 100%;
    height: 100%;
  }
  .my .itm .data {
    width: rem(241);
    margin-top: rem(11);
    margin-left: rem(8);
  }
  .my .itm .data .title {
    font-size: rem(12);
    color: #333;
    // height: rem(48);
    width: 100%;
    line-height: rem(22);
  }
  .my .itm .data .progress {
    width: rem(220);
    height: rem(10);
    border-radius: rem(7);
    background-color: #f6f6fa;
    margin-top: rem(4);
    overflow: hidden;
    margin-left: rem(2);
  }
  .my .itm .data .progress div {
    height: 100%;
  }
  .my .itm .data .join {
    width: rem(220);
    margin-left: rem(2);
    margin-top: rem(5);
  }
  .my .itm .data .join span {
    font-size: rem(10);
    color: #999;
  }
  .my .itm .data .price {
    width: 100%;
    height: rem(25);
    color: #FF5541;
    margin-top: rem(10);
    display: flex;
    align-items: center;
  }
  .my .itm .data .price span:nth-child(1) {
    font-size: rem(12);
    font-weight: 600;
  }
  .my .itm .data .price span:nth-child(2) {
    font-size: rem(18);
    font-weight: 600;
  }
  .my .itm .data .price span:nth-child(3) {
    font-size: rem(10);
    color: #999;
    margin-left: rem(15);
  }
  .my .itm .btnGroup {
    width: 100%;
    height: rem(48);
    padding-right: rem(15);
  }
  .my .itm .btnGroup .btn {
    width: rem(80);
    height: rem(29);
    font-size: rem(12);
    color: #ff5541;
    border: rem(1) solid #ff5541;
    border-radius: rem(16);
  }
  .my .itm .btnGroup .btn + .btn {
    margin-left: rem(10);
  }
  .noda {
    width: rem(200);
    height: rem(200);
    overflow: hidden;
    margin-top: rem(79);
  }
  .look {
    font-size: rem(14);
    color: #ff5541;
    padding: rem(8) rem(22.5);
    margin-top: rem(24);
    border: rem(1) solid #ff5541;
    border-radius: rem(17.5);
  }

</style>