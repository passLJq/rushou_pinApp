<template>
  <div>
    <div class="mitem one" id="tou">
      <span>{{years}}年{{month}}月</span>
      <div class="mitem two" :style="showsai?'color:#F72133':''" @click="showsais">
        <span>筛选</span>
        <i class="iconfont icon-triangle-bottom" :class="showsai?'xuanzuan':''"></i>
      </div>
    </div>

    <!-- 筛选框 -->
    <div>
      <div class="zhezhao" v-if="showsai" :style="{top:touheight+'px'}" @click="showsais"></div>
      <div class="mitem shaixuan" :style="{top:xiahuag+'px'}">
        <div class="xuanul" @click="xuanze(0)">
          <div class="xuanli" :class="commisiontype==0?'xuactive':''">全部</div>
        </div>
        <div class="xuanul" v-for="item in typeData" @click="xuanze(item.commisiontype)" :key="item.commisiontype">
          <div
            class="xuanli"
            :class="commisiontype==item.commisiontype?'xuactive':''"
          >{{item.commisiontypename}}</div>
        </div>
      </div>
    </div>

    <div class="waibox" v-for="item in msgdata" v-if="msgdata&&msgdata.length>0" :key="item.commisionid">
      <div class="mitem xiangqing">
        <span>奖励金额</span>
        <span>¥{{item.commision}}</span>
      </div>
      <div class="mitem xiangqing">
        <span>奖励类型</span>
        <span>{{item.commisiontypename}}</span>
      </div>
      <div class="mitem xiangqing">
        <span>奖励状态</span>
        <span v-if="item.status==1">即将到账</span>
        <span v-if="item.status==2">已到账</span>
        <span v-if="item.status==3">已失效</span>
      </div>
      <!-- //活动奖励区分 -->
      <div v-if="item.commisiontype!=5&&item.commisiontype!=7&&item.commisiontype!=8&&item.commisiontype!=10&&item.commisiontype!=14&&item.commisiontype!=13" >
        <div class="mitem xiangqing" v-if="item.orderid!=null">
          <span>订单编号</span>
          <span>{{item.orderid}}</span>
        </div>
        <div class="mitem xiangqing">
          <span>订单金额</span>
          <span>¥{{item.orderamount}}</span>
        </div>
        <div class="mitem xiangqing">
          <span>订单时间</span>
          <span>{{item.ordertime}}</span>
        </div>
      </div>
      <div v-else>
        <div class="mitem xiangqing" v-if="item.commisionactivitytype!=''">
          <span>奖励来源</span>
          <span>{{item.commisionactivitytype}}</span>
        </div>
      </div>
      <div class="mitem xiangqing" v-if="item.status==2">
        <span>到账时间</span>
        <span>{{item.successtime}}</span>
      </div>
    </div>

    <div class="nodata" v-if="msgdata.length==0">
      <img src="http://source.weigouyi.cn/WShopping/Image/noactivitys.png">
      <div>亲,目前没有数据</div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      typeData:'',
      commisiontype:0,
      msgdata:[],
      years:'',
      month:'',
      showsai:false,
      touheight:0,
      xiahuag:-600,
      currentPage: 1,
      stops: false
    };
  },
  watch: {},
  computed: {},
  methods: {
    bindData() {
      var that=this
      https({
        url: siteUrl + 'Main/Member/CommissionDetail',
        data: {
          uid: getname(),
          currentPage: this.currentPage,
          pageSize: 8,
          type: 0,
          commisiontype: that.commisiontype,
          year: that.years,
          month: that.month,
          devicetype: 7
        },
        headers: 1,
        successBack: ret => {
          var that=this
          if(ret.success){
            this.typeData = ret.typeData
            if (this.currentPage==1){
              this.msgdata = ret.Data
            }else if(ret.status==1){
              this.msgdata = that.msgdata.concat(ret.Data)
            } else if (ret.status == 2){
              this.stops=true
            }
            // console.log(that.data)
          }else{
            promptMsg(ret.err)
          }
        }
      })
    },
    xuanze(index) {
      this.currentPage=1
      this.commisiontype = index
      this.bindData()
      this.showsais()
    },
    showsais() {
      var me=''
      var that=this
      if (that.showsai){
        me = -600
      }else{
        me = that.touheight
      }
      this.showsai = !this.showsai,
      this.xiahuag = me
    }
  },
  created() {
    var that = this
    this.years = pageParam('years')
    this.month = pageParam('month')
    if (window.api) {
      api.addEventListener({
        name: 'scrolltobottom'
      }, function(ret, err){
        if (!that.stops) {
          that.currentPage += 1
          that.bindData()
        }
      });
    }
  },
  mounted() {
    // var s = getname('statustop') || 0
    // $api.byId('main').style.height = s + 'px'
    this.touheight = $api.byId('tou').offsetHeight
    this.bindData()
  }
};
</script>
<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body{
  background-color: #f5f5f5;
}
.mitem {
  display: flex;
  align-items: center;
  color: #333;
}
.one {
  justify-content: space-between;
  padding: rems(20) rems(32);
  background-color: rgb(246, 245, 250);
  font-size: rems(26);
  position: relative;
  z-index: 99999;
}
.mitem i {
  font-size: rems(20);
}
.two {
  color: #333;
}
.shaixuan {
  flex-wrap: wrap;
  background-color: #fff;
  padding-bottom: rems(20);
  position: fixed;
  z-index: 999;
  width: 100%;
  transition: top 0.5s;
}
.xuanul {
  width: 33.3%;
  padding-top: rems(20);
}
.xuanli {
  width: 90%;
  margin: 0 auto;
  color: #333;
  border-radius: 8px;
  border: 1px solid #999;
  font-size: rems(24);
  text-align: center;
  padding: rems(20) 0;
}
.xuactive {
  // background: rgba(246, 245, 250, 1);
  border: 1px solid #ff5541;
  color: #ff5541
}
.xuanzuan {
  transform: rotate(180deg);
  color: #f72133;
}
.zhezhao {
  background-color: rgba(0, 0, 0, 0.6);
  position: fixed;
  top: 0;
  width: 100%;
  bottom: 0;
}
.xiangqing {
  font-size: rems(26);
  background: #fff;
  padding-top: rems(20);
  padding-left: rems(30);
}
.xiangqing span:nth-child(1) {
  color: #999;
}
.xiangqing span:nth-child(2) {
  color: #333;
  margin-left: rems(20);
}
.waibox {
  padding-bottom: rems(20);
  margin-bottom: rems(10);
  background: #fff;
}
</style>