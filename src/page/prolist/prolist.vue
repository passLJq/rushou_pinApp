<template>
  <div>
    <div class="searchbox" id="searchbox">
      <div class="searchbar">
        <span class="iconfont icon-magnifier"></span>
        <input type="text" placeholder="搜索商品" v-model="searchWord" @keyup.enter="goSearch">
      </div>
      <div class="btn" @click="changeShow">
        <img v-show="showRow" src="../../img/heng.png" alt="">
        <img v-show="!showRow" src="../../img/shu.png" alt="">
      </div>
    </div>
    <div class="heng" v-show="showRow">
      <div class="item" v-for="item in msg" :key="item.gbid" @click="goGroupBuy(item.gbid)">
        <img v-lazy="item.propic" alt="">
        <div class="right">
          <p class="p1"><span>{{item.gbuynum}}人团</span>{{item.title}}</p>
          <p class="p2"><span>￥</span>{{item.gbprice}}</p>
        </div>
      </div>
    </div>

    <div class="shu" v-show="!showRow">
      <div>
        <div class="item" v-for="item in msg" :key="item.gbid" @click="goGroupBuy(item.gbid)">
          <img v-lazy="item.propic" alt="">
          <p class="p1"><span>{{item.gbuynum}}人团</span>{{item.title}}</p>
          <p class="p2"><span>￥</span>{{item.gbprice}}</p>
        </div>
      </div>
    </div>
    <div class="nodata" v-show="nodata">
      <img src="../../img/nodata.png" alt="">
      <p>抱歉，目前没有显示记录~</p>
    </div>
  </div>
</template>

<script>
export default {
  components:{},
  props:{},
  data(){
    return {
      searchWord: '',
      currentPage: 1,
      pageSize: 8,
      showRow: true,
      nodata: false,
      hasMore: true,
      msg: ''
    }
  },
  watch:{
    
  },
  computed:{},
  methods: {
    goSearch() {
      var that = this
      this.setHis()
      if (!this.searchWord) return false
      https({
        url: siteUrl + 'Main/Main/GetProductListJson',
        data: {
          currpage: that.currentPage,
          pageSize: that.pageSize,
          clsid: '',
          sort: 'price_asc',
          act: 'search',
          skey: that.searchWord,
          userid: getname(),
          fxshopid: getname('SessionShopID'),
          companyid: '',
          bid: ''
        },
        successBack: ret => {
          if (ret.status == 1 && ret.success && ret.gbobj.length > 0) {
            if (this.currentPage == 1) {
              this.msg = ret.gbobj
            } else {
              this.msg = [...this.msg, ...ret.gbobj]
            }
            if (ret.gbobj && ret.gbobj.length < this.pageSize) {
              this.hasMore = false
            }
          } else if (ret.success && ret.gbobj.length == 0) {
            this.hasMore = false
            this.nodata = true
          } else {
            promptMsg(ret.err)
          }
        }
      })
      return false
    },
    setHis() {
      var that = this
      if(!this.searchWord) return
      var his = getname('searchHistory')
      his = his ? JSON.parse(his) : []
      if (his.length == 0) {
        his[0] = this.searchWord
      } else {
        let bool = true
        for(let i=0; i<his.length;i++) {
          if (his[i] == that.searchWord) {
            bool = false
            break;
          }
        }
        if (bool) {
          his.push(this.searchWord)
        }
      }
      setname('searchHistory', JSON.stringify(his))
    },
    // 切换显示
    changeShow() {
      this.showRow = !this.showRow
    },
    goGroupBuy(gbid) {
      openWin({
        name: 'groupbuy' + gbid,
        url: './new_lndianaDetail.html',
        pageParam: {
          gbid,
          title: '拼团详情'
        }
      }, 1)
    }
  },
  created(){
    this.searchWord = pageParam('skey') || ''
    console.log(this.searchWord)
    this.goSearch()
  },
  mounted(){
    
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
  input {
    outline: none;
    border: none;
  }
  ::placeholder {
    color: #999;
  }
  .searchbox {
    width: 100%;
    // height: rems(96);
    padding: rems(8) 0 rems(8) rems(20);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    z-index: 99;
    border-bottom: 1px solid #f6f6fa;
    .searchbar {
      position: relative;
      width: rems(600);
      height: rems(80);
      span {
        font-size: rems(32);
        position: absolute;
        top: 50%;
        left: rems(20);
        transform: translateY(-50%);
        color: #999;
      }
      input {
        display:flex;
        align-items:center;
        background-color:#F6F6FA;
        border-radius: rems(8);
        padding-left: rems(56);
        width: 100%;
        height: 100%;
        font-size: rems(28);
        color: #333;
      }
    }
    .btn {
      font-size: rems(28);
      display: flex;
      align-items: center;
      padding: 0 rems(35);
      height: rems(80);
      img {
        width: rems(60);
      }
    }
  }
  .heng {
    width: 100%;
    background-color: #fff;
    padding: 0 rems(15);
    .item {
      padding: rems(30) rems(15);
      display: flex;
      img {
        width:rems(192) !important;
        height:rems(192);
        border-radius:rems(8);
        margin-right:rems(20);
      }
      .right {
        width: rems(460);
        margin-top: rems(10);
        height: rems(168);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        
      }
    }
    .item + .item {
      border-top: 1px solid #f6f6fa;
    }
  }
  .p1 {
    color:#333;
    font-size:rems(28);
    overflow:hidden;
    text-overflow:ellipsis;
    display:-webkit-box;
    -webkit-line-clamp:2;
    -webkit-box-orient:vertical;
    white-space:normal;
    word-break:break-all;
    // line-height: rems(40);
    span {
      font-size:rems(20);
      transform: translateY(rems(6));
      border-radius:rems(30);
      padding:0 rems(10);
      overflow:hidden;
      color:#fff;
      background:linear-gradient(270deg,rgba(254,51,75,1) 0%,rgba(255,114,130,1) 100%);
      margin-right:rems(10);
    }
   }
   .p2 {
     font-size:rems(40);
     color:#FE334B;
     font-weight: 600;
     span {
       font-size: rems(28)
     }
   }
  .shu {
    width: 100%;
    background-color: #f5f5f5;
    padding: 0 rems(15) rems(15) rems(15);
    & > div {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      justify-content: space-between;
      .item {
        width: rems(350);
        margin-top: rems(15);
        border-radius: rems(10);
        padding: rems(10);
        background-color: #fff;
        display: flex;
        flex-direction: column;
        img {
          width: 100%;
        }
        .p2 {
          font-size: rems(32);
          span {
            font-size: rems(24)
          }
        }
      }
    }
  }
  .nodata {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
      width: rems(400);
    }
    p {
      font-size: rems(24);
      color: #999;
    }
  }
</style>