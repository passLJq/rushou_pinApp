<template>
  <div>
    <div id="headtop">
      <div class="search">
        <span class="iconfont icon-magnifier"></span>
        <input type="number" placeholder="请输入邀请码/手机号码" placeholder-class="seahold" v-model="searchWord">
        <div @click="goSearch">搜索</div>
      </div>

      <div class="myTeam" @click="toMyFans" style="margin-bottom: 10rpx;">
        <span>我的分享</span>
        <span>{{msg.totalpoint}}人<span class="iconfont icon-gengduo" style="font-size:;"></span></span>
      </div>

      <div class="myTeam" bindtap="">
        <span>我的团队</span>
        <span>{{msg.total || 0}}人</span>
      </div>
    </div>

    <van-tabs animated swipeable  @click="changeTab">
      <van-tab :title="'一级团队(' + msg.first + ')'"  class="tabItem">
        <div class="teamitem"  @click='toTeamDetail(1, i)' v-for="(item, i) in first" :key="item.phone">
          <div class="itemmsg">
            <img :src="item.shoplogo||'./img/man.jpg'">
            <div>
              <span>{{item.username}}</span>
              <span>邀请码: {{item.code}}</span>
            </div>
          </div>

          <div class="itemzz">
            <span>会员职称: {{item.shoptype === 1? '正式店主': item.shoptype === 2? '实习店主': item.shoptype === 3? '冻结店主': ''}}</span>
            <span>手机号码: {{item.phone}}</span>
          </div>
        </div>
        <div class="nodata" v-if="!first || first.length <= 0">
          <img src="../../img/nodata.png">
          <span>亲，目前没有相关团队喔~</span>
        </div>	
      </van-tab>

      <van-tab :title="'二级团队(' + msg.second + ')'"  class="tabItem">
        <div class="teamitem"  @click='toTeamDetail(2, i)' v-for="(item, i) in second" :key="item.phone">
          <div class="itemmsg">
            <img :src="item.shoplogo||'/img/man.jpg'">
            <div>
              <span>{{item.username}}</span>
              <span>邀请码: {{item.code}}</span>
            </div>
          </div>

          <div class="itemzz">
            <span>会员职称: {{item.shoptype === 1? '正式店主': item.shoptype === 2? '实习店主': item.shoptype === 3? '冻结店主': ''}}</span>
            <span>手机号码: {{item.phone}}</span>
          </div>
        </div>
        <div class="nodata" v-if="!second || second.length <= 0">
          <img src="../../img/nodata.png">
          <span>亲，目前没有相关团队喔~</span>
        </div>	
      </van-tab>
    </van-tabs>

  </div>
</template>

<script>
export default {
  components:{},
  props:{},
  data(){
    return {
      searchWord: '',
      msg: {first: 0, second: 0},
      currentPage: 1,
      pageSize: 10,
      first: '',
      second: '',
      hasMore: [true, true],
      allowSearch: false,     // 开发搜索，防止 v-model 实时获取的搜索数据被传入接口
    }
  },
  watch:{
    searchWord(val) {
      this.searchWord = String(val).replace(/\s+/g, '')
    }
  },
  computed:{

  },
  methods: {
    changeTab(index, title) {
      console.log(11)
      window.scrollTo(0,0)
    },
    goSearch() {
      var reg = new RegExp(/^\d+$/)
      this.currentPage = 1
      this.hasMore = [true, true]
      if (!this.searchWord) {
        this.allowSearch = false
        this.bindData(1)
        this.bindData(2)
      } else if (reg.test(this.searchWord)) {
        this.allowSearch = true
        this.bindData(1)
        this.bindData(2)
      } else {
        promptMsg('只能搜索邀请码和手机号！')
      }
      
    },
    // 团队等级，页数，查询内容
    bindData(type) {
      https({
        url: siteUrl + 'Main/Member/GetMyTeam',
        data: {
          uid: getname(),
          pageSize: this.pageSize,
          type: type || 1,
          currentPage: this.currentPage,
          search: this.allowSearch ? this.searchWord : ''
        },
        headers: 1,
        successBack: ret => {
          if (ret.success) {
            if (ret.status == 1) {
              if (type && type == 1) {
                // 首次加载
                if (this.currentPage == 1 || search) {
                  this.first = ret.Data
                } else {
                  this.first = [...this.first, ...ret.Data]
                }
                
              } else {
                // 首次加载
                if (this.currentPage == 1 || search) {
                  this.second = ret.Data
                } else {
                  this.second = [...this.second, ...ret.Data]
                }
              }

              if (ret.Data < this.pageSize) {
                if (type && type == 1) {
                  this.hasMore[0] = false
                } else {
                  this.hasMore[1] = false
                }
              }
            } else {
              let hasMore = this.hasMore
              if (type && type == 1) {
                this.hasMore[0] = false
                this.first = ''
              } else {
                this.hasMore[1] = false
                this.second = ''
              }
            }
            this.msg = {
              first: ret.first,
              second: ret.second,
              total: ret.total,
              totalpoint: ret.totalpoint,
            }
          }
        }
      })
    },
    toTeamDetail(type, index) {
      if (type == 1) {
        var data = this.first[index]
      } else {
        var data = this.second[index]
      }
      openWin({
        name: 'teamDetail',
        url: './teamDetail.html',
        pageParam: {
          msg: JSON.stringify(data),
          title: '详情'
        }
      }, 1)
    },
    toMyFans() {
      openWin({
        name: 'myFans',
        url: './myFans.html',
        pageParam: {
          title: '我的分享'
        }
      }, 1)
    }
  },
  created(){
    this.bindData(1)
    this.bindData(2)
    if (window.api) {
      api.addEventListener({
        name: 'scrollBottom'
      }, function(ret, err){
        this.currentPage += 1
        if (hasMore[0]) {
          this.bindData(1)
        }
        if (hasMore[1]) {
          this.bindData(2)
        }
      })
      //下拉刷新
      api.setCustomRefreshHeaderInfo({
        bgColor: '#fff',
        images: [
          'widget://image/suaxin1.png',
          'widget://image/suaxin2.png',
          'widget://image/suaxin3.png',
          'widget://image/suaxin4.png',
          'widget://image/suaxin5.png',
          'widget://image/suaxin6.png',
          'widget://image/suaxin7.png'
        ],
        tips: {
          pull: '下拉刷新',
          threshold: '松开立即刷新',
          load: '正在刷新'
        }
        }, function() {
          setTimeout(function(){
            if(checkLoginStatus()){
              this.allowSearch = false
              this.currentPage = 1
              this.hasMore = [true, true]
              this.searchWord = ''
              this.bindData(1)
              this.bindData(2)
            }else{
              refreshDone()
            }
          },1000)
      })
    }
  },
  mounted(){
    var ht = $api.byId('headtop').offsetHeight + document.getElementsByClassName('van-tabs__wrap')[0].offsetHeight
    var tabs = document.getElementsByClassName('tabItem')
    for(let i=0;i<tabs.length;i++) {
      tabs[i].style.minHeight = Number(client().height - ht) + 'px'
    }
    window.onscroll = function () {
      var st = document.body.scrollTop || document.documentElement.scrollTop
      if (st > $api.byId('headtop').offsetHeight) {
        $api.addCls(document.getElementsByClassName('van-tabs__wrap')[0], 'fixx')
      } else {
        $api.removeCls(document.getElementsByClassName('van-tabs__wrap')[0], 'fixx')
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
  .fixx {
    position: fixed;
    top: 0;
    left: 0;
  }
  .search {
    width: 100%;
    padding: rems(16) 0 rems(16) rems(30);
    background-color: #fff;
    display: flex;
    align-items: center;
    position: relative;
  }

  .seahold {
    font-size: rems(24);
    color: #999;
  }

  .search input {
    width: rems(600);
    height: rems(58);
    padding-left: rems(58);
    background-color: #f6f8fa;
    border-radius: rems(8);
    font-size: rems(24);
    color: #333;
    display: flex;
    align-items: center;
  }

  .search span {
    font-size: rems(28);
    color: #999;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: rems(50);
  }

  .search div {
    height: rems(58);
    /* display: flex;
    justify-content: center;
    align-items: center; */
    line-height: rems(58);
    padding: 0 rems(30);
    font-size: rems(24);
    color: #333;
  }

  .myTeam {
    width: 100%;
    height: rems(88);
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 rems(32);
  }

  .myTeam span {
    font-size: rems(28);
    color: #333;
  }

  .myTeam span:nth-child(2), .myTeam span:nth-child(2) span {
    font-size: rems(24);
    color: #999;
  }

  .tab {
    width: 100%;
    display: flex;
    position: relative;
    background-color: #fff;
    margin: rems(20) 0 rems(10) 0;
  }

  .tabs {
    width: 50%;
    height: rems(88);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: rems(28);
    color: #333;
  }

  .tabs.select {
    color: #FE334B;
  }

  .tab .bottomBar {
    width:rems(80);
    height:rems(8);
    background:rgba(254,51,75,1);
    border-radius:rems(4);
    position: absolute;
    bottom: rems(0);
    transform: translateX(-50%);
    transition: all .3s ease-out;
  }

  // .tabItem {
  //   overflow-y: scroll;
  // }

  ::-webkit-scrollbar {
    display: none;
  }

  .teamitem {
    width: rems(750);
    height: rems(160);
    padding: rems(32) rems(30);
    background-color: #fff;
    margin-bottom: rems(2);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .teamitem img {
    width: rems(96);
    height: rems(96);
    border-radius: 50%;
  }

  .teamitem .itemmsg {
    display: flex;
    align-items: center;
    /* height: rems(90); */
  }

  .teamitem .itemmsg div {
    display: flex;
    flex-direction: column;
    margin-left: rems(30);
  }

  .teamitem .itemmsg div span:nth-child(1) {
    font-size: rems(28);
    color: #333;
    margin-bottom: rems(20);
  }

  .teamitem .itemmsg div span:nth-child(2) {
    font-size: rems(24);
    color: #999;
  }

  .teamitem .itemzz {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    /* margin: 0; */
  }
  .itemzzz {
    display: flex;
    /* flex-direction: column; */
    align-items: flex-end;
    margin: 0;
  }
  .yqsj {
    transform: translateY(rems(40));
  }
  .teamitem .itemzz span {
    font-size: rems(24);
    color: #999;

  }
  .teamitem .itemzz span:nth-child(1) {
    margin-bottom: rems(20);
  }

  .nodata {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .nodata img {
    width: rems(400);
  }

  .nodata span {
    font-size: rems(24);
    color: #999;
    margin-top: rems(30);
  }
</style>