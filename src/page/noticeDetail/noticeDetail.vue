<template>
  <div style="width: 100%; overflow: hidden;">
    <!-- 轮播 -->
    <van-swipe :autoplay="3000" :show-indicators="false">
      <van-swipe-item v-for="(image, i) in data.pic" :key="i" v-if="i < 9">
        <img v-lazy="image" />
      </van-swipe-item>
    </van-swipe>
    <!-- 发布者 -->
    <section class="who">
      <div class="left"><img :src="data.logo" alt="">手手</div>
      <div class="right" @click="dianzan()">
        <img v-if="data.iszan != 0" src="../../img/notice/fire.png" alt="">
        <img v-else src="../../img/notice/fires.png" alt="">
        {{data.zanum}}
      </div>
    </section>
    <!-- 商品？ -->
    <!-- <van-swipe :autoplay="0" :show-indicators="true" v-if="data.prolist">
      <van-swipe-item v-for="item in data.prolist" :key="item.pid" @click="goGroupBuy(item.pid, item.gbid)">
        <section class="product">
          <div class="cc">
            <img :src="item.img" alt="">
            <div>
              <p><span>4人团</span>{{item.productName}}</p>
              <p>￥{{item.price}}</p>
            </div>
            <img class='red' src="../../img/notice/redright.png" alt="">
          </div>
        </section>
      </van-swipe-item>
    </van-swipe> -->
    <!-- 文字内容 -->
    <section class="cont">
      <h3>{{data.title}}</h3>
      <p>{{data.content}}</p>
      <div class="b">
        <div v-if="data.hotspotName">
          <img src="../../img/notice/ht.png" alt="">#{{data.hotspotName}}
        </div>
        <p>{{data.createtime | getDate}}</p>
      </div>
    </section>
    <!-- 相关发现 -->
    <section class="finding">
      <h3>相关发现</h3>
      <section class="container">
        <div class="item" v-show="itm.id != data.id" v-for="(itm, idx) in classList" :key="itm.id" @click="goDetail(itm.type, idx)">
          <img :src="itm.pic[0]" alt>
          <p>{{itm.title}}</p>
          <div class="bottom">
            <div>
              <img :src="itm.logo || './img/man.jpg'" alt>
              <p>手手</p>
            </div>
            <div class="zan" @click.stop="dianzan(idx)" :style="itm.iszan != 0 ? 'color:#FE334B;' : ''">
              <img v-show="itm.iszan != 0" src="../../img/notice/fire.png" alt>
              <img v-show="itm.iszan == 0" src="../../img/notice/fires.png" alt>
              {{itm.zanum}}
            </div>
          </div>
        </div>
      </section>
      <div class="nodata" v-show="!classList || classList.length <= 0 || !hasMore">
        <p>没有更多内容了~</p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      data: '',
      pageSize: 8,
      page: 1,
      hasMore: true,
      classList: "",
    };
  },
  filters: {
    getDate(val) {
      if (!val) return
      return val.split(' ')[0]
    }
  },
  watch: {},
  computed: {},
  methods: {
    goDetail(type, index) {
      var data = this.classList[index]
      data.classid = this.classid
      openWin({
        name: 'noticeDetail' + data.id,
        url: './noticeDetail.html',
        pageParam: {
          title: '发现',
          data: JSON.stringify(data)
        }
      }, 1)
    },
    goGroupBuy(pid, gbid) {
      openWin({
        name: 'new_lndianaDetail' + pid,
        url: './new_lndianaDetail.html',
        pageParam: {
          title: '拼团详情',
          pid,
          gbid
        }
      }, 1)
    },
    // 点赞    没有传index表示是点击当前详情页的点赞，而不是下面列表的赞
    dianzan(index) {
      var pid = this.data.id
      var type = this.data.iszan == 0 ? '1' : '-1'
      if (index) {
        pid = this.classList[index].id
        type = this.classList[index].iszan == 0 ? '1' : '-1'
      }
      if (checkLoginStatus()) {
        https({
          url: siteUrl + 'Main/Main/UpdateZan?devicetype=7&uid=' + getname(),
          method: 'post',
          data: {
            uid: getname(),
            pid,
            type
          },
          headers: 1,
          successBack: ret => {
            if (ret.success && ret.status == 1) {
              if (index) {
                if (this.classList[index].iszan == 0) {
                  this.classList[index].iszan = 1
                  this.classList[index].zanum += 1
                } else {
                  this.classList[index].iszan = 0
                  this.classList[index].zanum -= 1
                }
              } else {
                if (this.data.iszan == 0) {
                  this.data.iszan = 1
                  this.data.zanum += 1
                } else {
                  this.data.iszan = 0
                  this.data.zanum -= 1
                }
              }
              
            } else {
              promptMsg(ret.err)
            }
          }
        })
      }
    },
    
    bindData(classid) {
      showLoading()
      https({
        url: siteUrl + "Main/Main/GetMaterialListJson",
        method: "get",
        data: {
          classid: classid || "",
          currentPage: this.page,
          pageSize: this.pageSize,
          uid: getname()
        },
        successBack: ret => {
          hideLoading()
          refreshDone()
          if (ret.success) {
            ret.Data.forEach(item => (item.pic = item.pic.split("|")));
            if (this.page == 1) {
              this.classList = ret.Data;
            } else {
              this.classList = [...this.classList, ...ret.Data];
            }
            if (!ret.Data || ret.Data.length < this.pageSize) {
              this.hasMore = false;
            }
              
          } else {
            promptMsg(ret.err);
          }
        }
      });
    },
  },
  created() {
    var data = JSON.parse(pageParam('data'))
    this.data = data
    this.bindData(data.classid)
  },
  mounted() {
    if (window.api) {
      api.addEventListener({
        name: "scrolltobottom"
        }, (ret, err) => {
          
      })
      //下拉刷新
      // api.setCustomRefreshHeaderInfo({
      //   bgColor: '#fff',
      //   images: ['widget://image/suaxin1.png', 'widget://image/suaxin2.png', 'widget://image/suaxin3.png', 'widget://image/suaxin4.png', 'widget://image/suaxin5.png', 'widget://image/suaxin6.png', 'widget://image/suaxin7.png'],
      //   tips: {
      //     pull: '下拉刷新',
      //     threshold: '松开立即刷新',
      //     load: '正在刷新'
      //   }
      // }, function () {
      //   this.page = 1
      //   this.hasMore = true
      //   this.bindData(this.classid)
      // })
    }
  }
};
</script>
<style lang="scss">
@import "noticeDetail.scss";
</style>