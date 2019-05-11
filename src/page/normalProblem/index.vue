<template>
  <div>
    <van-tabs v-model="active" swipe-threshold="5" line-width="20" title-active-color="#FE334B" swipeable animated sticky @change="changeTab">
      <van-tab v-for="(tit, i) in title" :key="i" :title="tit">
        <!-- <van-list v-model="loading" :finished="finished" finished-text @load="onLoad">
          <van-cellss class="van-cellss" v-for="item in list" :key="item" :title="item"/>
        </van-list> -->
        <p class="van-cellss" v-show="tab == i" v-for="(item, index) in msg[i]" :key="index" @click="goDetail(i, index)">{{item[0]}}</p>
      </van-tab>
    </van-tabs>
    <div class="footer" id="footer">
      <div class="btn" @click="gokefu">
        <span>联系在线客服</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      list: [],
      title: ["常见问题", "订单类", "配送类", "退款类", "售后类"],
      msg: [[],[],[],[],[]],
      tab: 0
    };
  },
  watch: {},
  computed: {},
  methods: {
    onLoad() {
      
    },
    bindData(type) {
      if (this.msg[type-1].length > 0) return //有数据就不重复读取
      showLoading()
      https({
        url: siteUrl +'Main/main/CommonProblem',
        data: {
          type: type || 1
        },
        successBack: ret => {
          hideLoading()
          if (ret.success && ret.status == 1) {
            var data = ret.Data[0].content
            // this.msg[type-1] = JSON.parse(data)
            Vue.set(this.msg, type-1, JSON.parse(data))
            console.log(this.msg)
          }
        }
      })
    },
    changeTab(index) {
      this.tab = index
      this.bindData(index + 1)
    },
    goDetail(i, index) {
      var data = this.msg[i][index]
      openWin({
        name: 'problemSolution',
        url: './problemSolution.html',
        pageParam: {
          tit: data[0],
          content: data[1],
          title: '问题详情'
        }
      }, 1)
    },
    gokefu() {
      // api.openWin({
      //   name: 'callphone',
      //   url: './callphone.html',
      //   bgColor: "#fff"
      // });
      openWin({
        name: 'callphone',
        url: './callPhone.html'
      })
    }
  },
  created() {
    this.bindData(1)
  },
  mounted() {
    // var sb = getname('safeAreaBottom') || 0
    // $api.byId('footer').style.paddingBottom = sb + 'px'

  }
};
</script>
<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-size: rems(28);
}
.footer {
  width: 100%;
  padding: rems(10) 0;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  
}
.van-tab__pane {
  padding: 0 rems(32) rems(100) rems(32);
}
.van-ellipsis{//每一栏
  font-size: rems(26);
  font-weight: bold;
}

.van-cellss{//每一项
  padding-top: rems(28);
  padding-bottom: rems(28);
  padding-left: 0;
  border-bottom: 1px solid #f6f6fa;
  font-size: rems(28)
}
.van-cellss:not(:last-child)::after {
  display: none;
}
.btn {//按钮
  width: rems(440);
  height: rems(70);
  border-radius: rems(35);
  text-align: center;
  color: white;
  background: linear-gradient(270deg, #fe334b 0%, #ff7282 100%);
  box-shadow: rems(1) rems(1) rems(5) #cf3030;
}

.btn span {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  font-size: rems(28);
}
</style>