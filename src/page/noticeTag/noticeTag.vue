<template>
  <div>
    <section class="container">
      <div class="item" v-show="itm.id != data.id" v-for="(itm, idx) in classList" :key="itm.id" @click="goDetail(itm.type, idx)">
        <img :src="itm.pic[0]" alt>
        <p>{{itm.title}}</p>
        <div class="bottom">
          <div>
            <img :src="itm.logo || './img/man.jpg'" alt>
            <p>手手</p>
          </div>
          <div class="zan" @click.stop="dianzan(idx, itm.id)" :style="itm.iszan != 0 ? 'color:#FE334B;' : ''">
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
      classid: ''
    };
  },
  filters: {
    
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
    // 点赞
    dianzan(index, id) {
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
              this.classList.iszan = 1
              this.classList.zanum += 1
            } else {
              promptMsg(ret.err)
            }
          }
        })
      }
    },
    
    bindData() {
      showLoading()
      https({
        url: siteUrl + "Main/Main/GetHotspot",
        method: "get",
        data: {
          id: this.classid,
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
    this.classid = pageParam('classid') || ''
    this.bindData()
  },
  mounted() {
    if (window.api) {
      api.addEventListener({
        name: "scrolltobottom"
        }, (ret, err) => {
          if (this.hasMore) {
            this.page += 1
            this.bindData()
          }
      })
      refresh(() => {
        this.page = 1
        this.hasMore = true
        this.bindData(this.classid)
      })
    }
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

body {
  background-color: #f6f6fa;
}
.container {
  -moz-column-count: 2;
  /* Firefox */
  -webkit-column-count: 2;
  /* Safari 和 Chrome */
  column-count: 2;
  -moz-column-gap: 10px;
  -webkit-column-gap: 10px;
  column-gap: 10px;
  width: 100%;
  padding: rems(16);
  background-color: #f6f6fa;
  .item {
    -moz-page-break-inside: avoid;
    -webkit-column-break-inside: avoid;
    break-inside: avoid;
    background: #fff;
    margin-bottom: rems(16);
    border-radius: rems(8);
    overflow: hidden;

    &>img {
      width: 100%;
    }

    &>p {
      font-size: rems(24);
      color: #333;
      padding: 0 rems(16);
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .bottom {
      margin-top: rems(20);
      width: 100%;
      padding: 0 rems(16);
      display: flex;
      align-items: center;
      justify-content: space-between;

      &>div {
        display: flex;
        align-items: center;
        max-width: 60%;
        & > p {
          font-size: rems(24);
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        img {
          width: rems(44);
          height: rems(44);
          border-radius: 50%;
          margin-right: rems(6);
        }
      }

      .zan {
        display: flex;
        align-items: center;

        img {
          width: rems(32);
          height: rems(32);
        }

        color: #999;
      }
    }
  }

}

.nodata {
  width: 100%;
  background-color: #f6f6fa;
  padding: rems(40) 0;
  p {
    text-align: center;
    color: #999;
    font-size: rems(24);
  }
}
</style>