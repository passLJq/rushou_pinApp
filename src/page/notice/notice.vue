<template>
  <div>
    <!-- 标题 -->
    <header id="head">发现</header>

    <!-- 今日热卖 -->
    <section class="hotsale" v-if="hotPot && hotPot.length > 0">
      <div class="title">今日热卖</div>
      <div class="content">
        <div class="item" v-for="(item, i) in hotPot" :key="item.classid" @click="goPot(i)">
          <img src="~@src/img/notice/fire.png">{{item.name}}
        </div>
      </div>
    </section>
    <!-- 分类 -->
    <section class="classJson">
      <van-tabs :line-width="20" animated sticky @change="changeClass">
        <van-tab v-for="(item, index) in classJson" :key="index" :title="item.name" class="active">
          <section class="container">
            <div class="item" v-for="(itm, idx) in classList" :key="itm.id" @click="goDetail(itm.type, idx)">
              <img v-lazy="itm.pic[0]" alt>
              <p>{{itm.title}}</p>
              <div class="bottom">
                <div>
                  <img :src="itm.logo || './img/man.jpg'" alt>
                  <p>手手</p>
                </div>
                <div class="zan" @click.stop="dianzan(itm.id, idx)" :style="itm.iszan != 0 ? 'color:#FE334B;' : ''">
                  <img v-show="itm.iszan != 0" src="~@img/notice/fire.png" alt>
                  <img v-show="itm.iszan == 0" src="~@img/notice/fires.png" alt>
                  {{itm.zanum}}
                </div>
              </div>
            </div>
          </section>
          <div class="nodata" v-show="!classList || classList.length <= 0 || !hasMore">
            <p>没有更多内容了~</p>
          </div>
        </van-tab>
      </van-tabs>
    </section>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      classJson: [{ classid: "", name: "全部" }],
      pageSize: 8,
      page: 1,
      hasMore: true,
      classList: "",
      classid: "",
      classCache: [], // 分类列表数据缓存
      hotPot: []
    };
  },
  watch: {},
  computed: {},
  methods: {
    // 跳转热门标签列表页
    goPot(index) {
      var data = this.hotPot[index]
      openWin({
        name: 'noticeTag',
        url: './noticeTag.html',
        pageParam: {
          title: data.name,
          classid: data.classid
        }
      }, 1)
    },
    goDetail(type, index) {
      var data = this.classList[index]
      data.classid = this.classid
      // if (type == 1 && type != 0) {
      //   OpenWebPagee(memberSiteUrl + 'Fx/MaterialContent.aspx?shopid=170718164338876176&marterialid=' + data.id, data.title, 'sucai')
      // }
      // if (type != 0 && type != 1) {
      //   OpenWebPageee(data.link, data.title, 'sucai');
      // }
      openWin({
        name: 'noticeDetail' + data.id,
        url: './noticeDetail.html',
        pageParam: {
          title: '发现',
          data: JSON.stringify(data)
        }
      }, 1)
    },
    // 点赞
    dianzan(id, index) {
      if (checkLoginStatus()) {
        https({
          url: siteUrl + 'Main/Main/UpdateZan?uid=' + getname(),
          method: 'post',
          data: {
            uid: getname(),
            pid: id,
            type: this.classList[index].iszan == 0 ? '1' : '-1'
          },
          headers: 1,
          successBack: ret => {
            if (ret.success && ret.status == 1) {
              this.classList[index].iszan = 1
              this.classList[index].zanum += 1
              // 缓存的数据也得改
              // var num = 0
              // if (this.classid != '') {
              //   this.classJson.forEach((item, i) => {
              //     if (item.classid == this.classid) return num = i
              //   })
              // }
              // this.classCache[num].cache[index].iszan = 1
              // this.classCache[num].cache[index].zanum += 1
            } else {
              promptMsg(ret.err)
            }
          }
        })
      }
    },
    bindData(classid) {
      showLoading();
      if (!classid) {
        https({
          url: siteUrl + "Main/Main/GetMaterialClassJson",
          successBack: ret => {
            if (ret.success && ret.status == 1) {
              this.classJson = [...this.classJson, ...ret.Data]
              if (ret && ret.hotspotData && ret.hotspotData.length > 0) {
                this.hotPot = [...this.hotPot, ...ret.hotspotData]
              }
              
            } else {
              promptMsg(ret.err);
            }
          }
        });
      }
      var num = 0
      if (classid) {
        this.classid = classid
        this.classJson.forEach((item, i) => {
          if (item.classid == classid) return num = i
        })
      }
      
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
            // 将数据与页数存起来
            this.classCache[num] = {
              cache: this.classList,
              page: this.page
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
    changeClass(index) {
      console.log(index)
      // 有缓存则直接拿缓存，没有就跑接口
      if (this.classCache[index] && this.classCache[index].cache.length > 0) {
        this.classList = this.classCache[index].cache
        this.page = this.classCache[index].page
      } else {
        this.classList = ''
        this.page = 1
        this.hasMore = true
        this.bindData(this.classJson[index].classid);
      }
    }
  },
  created() {
    this.bindData();
  },
  mounted() {
    var sp = getname("statustop") || 0;
    $api.byId("head").style.paddingTop = sp + "px";
    if (window.api) {
      api.addEventListener({
        name: "scrolltobottom"
        }, (ret, err) => {
          if (this.hasMore) {
            this.page += 1;
            this.bindData(this.classid);
          }
        }
      );
      //下拉刷新
      api.setCustomRefreshHeaderInfo({
        bgColor: '#fff',
        images: ['widget://image/suaxin1.png', 'widget://image/suaxin2.png', 'widget://image/suaxin3.png', 'widget://image/suaxin4.png', 'widget://image/suaxin5.png', 'widget://image/suaxin6.png', 'widget://image/suaxin7.png'],
        tips: {
          pull: '下拉刷新',
          threshold: '松开立即刷新',
          load: '正在刷新'
        }
      }, () => {
        setTimeout(() => {
          this.page = 1
          this.hasMore = true
          this.bindData(this.classid) 
        }, 1000)
      })
    }
  }
};
</script>
<style lang="scss">
@import "notice.scss";
</style>