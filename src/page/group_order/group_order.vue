<template>
  <div>
    <van-tabs animated swipeable v-model="currentTab" id="vanTab" @change="changeTab">
      <van-tab v-for="(tab, i) in tabs" :title="tab" :key="i" :style="{minHeight: ch + 'px'}">
        <div v-show="(i==0&&currentTab==100 || currentTab == i)&&list[i]&&list[i].length>0">
          <div class="box" v-for="(item, index) in list[i]" :key="item.orderid+''+i" @click='goGroupDetail(item.orderid)'>
            <div class="box_tou">
              <div class="items oreder_tou">
                <!-- <div class="o_tou_left items">
                  <div>{{item.mytype}}</div>
                  <span>{{item.groupcount}}人团</span>
                </div> -->
                <div style="color: #333;" class="order_time">{{item.paytime}}</div>
                <div class="oreder_tishi">{{item.grouptype}}</div>
              </div>
              <!-- <div class="order_time">{{item.paytime}}</div> -->
            </div>
            <div class="box_main items">
              <div class="imgBox">
                <img v-lazy="item.groupimg">
                <span v-if="item.penPeople==1">我是团长</span>
              </div>
              <div class="pro_right">
                <div class="pro_xian">
                  <div class="p1">
                    <span class="allhave" v-if="item.isbuyonegetone&&item.headfree"><span class="allhaveping">团长免单</span>拼一送一</span>
                    <span class="pingone" v-else-if="item.isbuyonegetone">拼一送一</span>
                    <span class="tuanfree" v-else-if="item.headfree">团长免单</span> {{item.groupname}}
                  </div>
                </div>
                <div>
                  <div class="p3" style="font-weight: 600;">
                    <span class="gbn">{{item.groupcount}}人团</span>
                    <span class="p4">¥&nbsp;</span>{{item.groupprice|toFixed}}
                    <span class="p5" style="font-weight: 400;">原价￥{{item.proprice|toFixed}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="box_foot items">
              <div class="oreder_imge items">
                <!-- <img v-lazy="imgitem" v-for="(imgitem, idx) in item.userimg" :key="imgitem"> -->
                <!-- <p class="timecount">5时22分28秒后失效</p> -->
              </div>
              <div class="order_btn">
                <p class="timecount" v-if="item.gbuystate==1&&timeText[item.gbid]!=''">{{timeText[item.gbid]}}</p>
                <!-- <div class="abse" @click.stop='goGroupDetail(item.orderid)'>拼单详情</div> -->
                <div class="abse" @click.stop="goOrderDetail(item.orderid)">查看订单</div>
                <div class="abse" v-if="item.gbuystate==1" @click.stop="goshare(i, index)">邀请拼团</div>
              </div>
            </div>
          </div>

        </div>
        <div class="nodata" v-show="!list[i] || list[i].length==0">
          <img style="width: 50%;" src="https://images.rushouvip.cn/_NoImg/nopingorder.png">
          <div>您还没有拼团订单，快去拼一个吧</div>
        </div>
        <div v-show="!list[i] || list[i].length==0" class="bordes" @click='goindex'>去拼团看看</div>
      </van-tab>
    </van-tabs>

  </div>
</template>

<script>
var timer = {}
export default {
  components:{},
  props:{},
  data(){
    return {
      tabs: ['全部', '拼团中', '已成团', '未成团'],
      currentTab: 100,
      currentPage: 1,
      pageSize: 8,
      hasMore: [true, true, true, true],
      list: [[],[],[],[]],
      ch: 100,
      timeText: {}
    }
  },
  watch:{
    
  },
  computed:{},
  filters: {
    toFixed(val) {
      return Number(val).toFixed(2)
    }
  },
  methods: {
    goshare(i, index) {
      let data = this.list[i]
      let orderid = data[index].orderid
      showLoading()
      https({
        url: siteUrl + '/Marketing/Groupbuy/GetGBOrder?devicetype=7',  // ?devicetype=1
        data: {
          orderID: orderid,
          uid: getname()
        },
        successBack: ret => {
          hideLoading()
          if (ret.status == 1 && ret.success) {
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
                data: ret.Data,
                orderid: orderid
              },
              bounces: false,
              bgColor: 'rgba(0,0,0,0)'
            })
          } else {
            promptMsg(ret.err)
          }
        }
      })
      
    },
    goindex() {
      if (openapp) {
        api.closeToWin({
          name: 'root',
          animation: {
            type: 'push',
            subType: 'from_right',
            duration: 300
          }
        })
      } else {
        openWin({
          name: 'root',
          url: './main.html',
          pageParam: {}
        })
      }
    },
    changeTab(index) {
      window.scrollTo(0,0)
      this.currentTab = index == 0 ? 100 : index
      this.currentPage = 1
      // this.list = []
      showLoading()
      // setTimeout(() => {
      //   this.bindData()
      // }, 500)
      this.bindData(index)
    },
    goOrderDetail(orderid) {
      openWin({
        name: 'orderdetail' + orderid,
        url: './orderdetail.html',
        pageParam: {
          title: '订单详情',
          orderid
        }
      }, 1)
    },
    goGroupDetail(orderid) {
      openWin({
        name: 'group_detail' + orderid,
        url: './group_detail.html',
        pageParam: {
          title: '拼单详情',
          orderid
        }
      }, 1)
    },
    bindData(index) {
      https({
        url: siteUrl + 'Marketing/Groupbuy/GetMyGroupbuy?devicetype=7',
        data: {
          uid: getname(),
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          gbuystate: this.currentTab
        },
        headers: 1,
        successBack: ret => {
          hideLoading()
          // console.log(JSON.stringify(ret))
          if (ret.success && ret.status == 1 && ret.Data.length > 0) {
            if (ret.Data.length > 0) {
              if (ret.Data.length < this.pageSize) {
                this.hasMore[index] = false
              }
              ret.Data.map(item => {
                if (item.gbuystate == 1) {
                  this.countTime(item)
                }
              })
              if (this.currentPage == 1) {
                this.list[index] = ret.Data
              } else {
                this.list[index] = [...this.list[index], ...ret.Data]
              }
            }
          } else if (ret.success && ret.Data.length == 0) {
            this.hasMore[index] = false
            this.list[index] = []
          } else {
            promptMsg(ret.err)
          }
          this.$forceUpdate()
        }
      })
    },
    countTime(data) {
      let timetick = data.ts - data.tpgap
      let gbid = data.gbid
      if (timetick <= 0) return
      if (timer[gbid] != null) return
      timer[gbid] = setInterval(() => {
        var day = 0
        var hour = 0
        var minute = 0
        var second = 0
        var text = ''
        if (timetick > 0) {
          day = Math.floor(timetick / (60 * 60 * 24))
          hour = Math.floor(timetick / (60 * 60)) - (day * 24)
          minute = Math.floor(timetick / 60) - (day * 24 * 60) - (hour * 60)
          second = Math.floor(timetick) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
        }

        hour = (Number(day) * 24) + Number(hour)
        if (hour <= 9) hour = '0' + hour
        if (minute <= 9) minute = '0' + minute
        if (second <= 9) second = '0' + second

        if (timetick <= 0) {
          text = ''
          clearInterval(timer[gbid])
          timer[gbid] = null
        } else {
          // text = hour + '时' + minute + '分' + second + '秒'
          text += hour!='00' ? hour + '时' : ''
          text += minute!='00' ? minute + '分' : hour!='00' ? minute + '分' : ''
          text += second + '秒'
        }

        this.timeText[gbid] = text
        timetick--
        this.$forceUpdate()
        // console.log(gbid)
      }, 1000)
    }
  },
  created(){
    var that = this
    this.currentTab = pageParam('index') || 100
    var idx = pageParam('index') == 100 ? 0 : pageParam('index')
    this.bindData(idx)

    if (window.api) {
      api.addEventListener({
        name: 'scrolltobottom'
      }, function(ret, err){
        if (this.hasMore[this.currentTab]) {
          var index = this.currentTab == 100 ? 0 : this.currentTab
          this.currentPage += 1
          this.bindData(index)
        }
      });
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
    background-color: #f5f5f5;
  }
  .van-tab {
    color: #333;
  }
  .fixTop {
    position: fixed;
    top: 0;
    left: 0;
  }
  .van-tab--active {
    color: #FE334B;
  }
  .van-tab__pane {
    padding: rems(16) rems(22);
  }
  .gbn {
    color: #FE334B;
    background:rgba(255,114,130,.2);
    border-radius: rems(30);
    font-size: rems(20);
    font-weight: 400;
    padding: rems(2) rems(16);
  }
  .box{
    background-color: #fff;
    padding: 0 rems(28);
    box-shadow:0 rems(2) rems(20) 0 rgba(216,216,216,0.5);
    border-radius:rems(8);
  }
  .box + .box {
    margin-top: rems(20);
  }
  .nodata,.bigbox{
      margin-top: rems(72);
  }
  .items{display: flex;align-items: center;}
  .oreder_tou{
    justify-content: space-between;

  }
  .o_tou_left{
    font-size: rems(28);
    color: #333;
  }
  .o_tou_left span{
    font-size: rems(20);
    color: #fff;
    padding: rems(4) rems(22);
    background:linear-gradient(270deg,rgba(254,51,75,1) 0%,rgba(255,114,130,1) 100%);
    margin-left: rems(20);
    border-radius: rems(30);
  }
  .oreder_tishi{
    font-size: rems(28);
    color: #FF5541;
    // font-weight: 700;
  }
  .order_time{
    font-size: rems(24);
    color: #999
  }
  .box_tou{
    padding: rems(26) 0;
    border-bottom: 1px solid #F6F6FA;
  }
  .box_main{
    padding: rems(24) 0;
    border-bottom: 1px solid #F6F6FA;
  }
  .imgBox {
    width: rems(192);
    height: rems(192);
    margin-right: rems(16);
    flex-shrink: 0;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    span {
      position: absolute;
      left: 0;
      top: 0;
      color: #fff;
      background:linear-gradient(270deg,rgba(254,51,75,1) 0%,rgba(255,114,130,1) 100%);
      border-radius:0px rems(30) rems(30) 0px;
      font-size: rems(20);
      padding: rems(2) rems(6);
    }
  }
  .p1{
    font-size: rems(24);
    overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;
    margin-bottom: rems(24);
    line-height: 2;
  }
  .p3{
    font-size: rems(36);
    color: #FF5541;
  }
  .p4{
    color: #FF5541;
    font-size: rems(24);
  }
  .p5{
    color: #999;
    font-size: rems(20);
    text-decoration: line-through;
  }
  .box_foot{
    justify-content: space-between;
    padding: rems(16) 0
  }
  .oreder_imge img{
  width:rems(64);
  height: rems(64);
  margin-right: rems(10);
  border-radius: 50%;
  }
  .order_btn{
    display: flex;
    align-items: center;
  }
  .order_btn span:nth-child(1){
    color: #fff;
    // border: 1px solid #999;
    padding: rems(12) rems(30);
    font-size: rems(24);
    border-radius: rems(30);
    background:linear-gradient(270deg,rgba(254,51,75,1) 0%,rgba(255,114,130,1) 100%);
  }
  .abse{
    color: #fff;
    background:linear-gradient(270deg,rgba(254,51,75,1) 0%,rgba(255,114,130,1) 100%);
    padding: rems(12) rems(30);
    font-size: rems(24);
    border-radius: rems(30);
    margin-left: rems(20);
  }
  .tablie{
    font-size: rems(28);
    color: rems(28);
    padding: rems(16) 0;
    width: 25%;
    background: #fff;
    text-align: center;
    position: relative;
  }
  .renlie{
    position: absolute;
    bottom:0;
    width: 100%;
  }
  .redline{
    width: 25%;
    background-color: rgb(255,85,65);
    height: rems(6);
    border-radius: rems(30);
    margin: 0 auto;
  }
  .bordes{
    color: #FF5541;
    border-radius: rems(30);
    padding: rems(12) rems(30);
    border:1px solid #FF5541;
    margin: rems(60) auto;
    text-align: center;
    width: 30%;
    font-weight: 700;
    font-size: rems(28);
  }
  .ordetou{
    position: fixed;
    top:0;
    width: 100%;
  }
  .timecount {
    color: #999;
    font-size: rems(24);
  }
</style>