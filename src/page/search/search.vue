<template>
  <div>
    <div class="searchbox" id="searchbox">
      <div class="searchbar">
        <span class="iconfont icon-magnifier"></span>
        <input type="text" placeholder="搜索商品" v-model="searchWord" @keyup.enter="goSearch" @input="oninput">
      </div>
      <div class="btn" @click="goSearch">搜索</div>
    </div>
    <div class="hotsearch" id="hotsearch" v-show="hotlist&&hotlist.length>0">
      <div v-for="(item, i) in hotlist" :key="i" @click="sethot(i)">{{item}}</div>
    </div>
    
    <div class="his">
      <div class="top">
        <div>历史搜索</div>
        <div v-if="searchHistory" @click="setHis(1)">清除记录</div>
      </div>
      <p v-if="!searchHistory">暂无搜索记录</p>
      <div class="hisbox" v-if="searchHistory">
        <div style="font-size:12px;" class="items" v-for="(item, idx) in searchHistory" :key="item" @click="sethot(idx, 1)">{{item}}</div>
      </div>
    </div>

    <div id="mark" v-show="hotlist&&hotlist.length>0" @click="clearHot"></div>
  </div>
</template>

<script>
var timer = null
export default {
  components:{},
  props:{},
  data(){
    return {
      searchWord: '',
      hotlist: '',       //
      searchHistory: '',
    }
  },
  watch:{
    // searchWord(val) {
    //   if (val) {
    //     this.goHotSearch()
    //   }
    // }
  },
  computed:{},
  methods: {
    oninput() {
      var that = this
      clearTimeout(timer)
      timer = setTimeout(function () {
        that.goHotSearch()
        clearTimeout(timer)
      }, 200)
    },
    goHotSearch() {
      if (!this.searchWord) return
      https({
        url: siteUrl + 'Main/Main/GetHotSearch',
        data: {
          currentPage: 1,
          pageSize: 8,
          content: this.searchWord
        },
        successBack: ret => {
          if (ret.success && ret.status == 1) {
            this.hotlist = ret.Data.prolist
          }
        }
      })
    },
    clearHot() {
      this.hotlist = ''
    },
    sethot(index, getHistory) {
      if (getHistory) {
        this.searchWord = this.searchHistory[index]
      } else {
        this.searchWord = this.hotlist[index]
        this.hotlist = ''
      }
    },
    goSearch() {
      this.setHis()
      openWin({
        name: 'prolist',
        url: './prolist.html',
        pageParam: {
          title: '商品列表',
          skey: this.searchWord
        }
      }, 1)
      if(!window.api) return false    // 阻止浏览器刷新
    },
    setHis(type) {
      // 清空历史记录
      if (type) {
        setname('searchHistory', '')
        this.searchHistory = ''
        return
      }
      if(!this.searchWord) return
      var that = this
      if (!this.searchHistory) {
        this.searchHistory = []
        this.searchHistory.push(this.searchWord)
      } else {
        let bool = true
        for(let i=0; i<this.searchHistory.length;i++) {
          if (that.searchHistory[i] == that.searchWord) {
            bool = false
            break;
          }
        }
        if (bool) {
          this.searchHistory.push(this.searchWord)
        }
      }
      setname('searchHistory', JSON.stringify(this.searchHistory))
    },
    gotHistory() {
      var his = getname('searchHistory')
      this.searchHistory = his ? JSON.parse(his) : ''
    }
  },
  created(){
    this.gotHistory()
  },
  mounted(){
    var c = client()
    $api.byId('mark').style.height = c.height + 'px'
    var sh = $api.byId('searchbox').offsetHeight
    $api.byId('hotsearch').style.top = sh + 'px'
    console.log(sh)
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
    font-size: rems(24);
  }
  #mark {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    background: rgba(0,0,0,.2);
    z-index: -1;
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
    }
  }

  .hotsearch {
    width: 100%;
    background-color: #fff;
    position: absolute;
    left: 0;
    div {
      padding:rem(10) rem(5);
      border-bottom:rem(1) solid #eee;
      display:flex;
      font-size:rem(14);
    }
  }

  .his {
    width: 100%;
    padding: 0 rems(20);
    p {
      font-size: rems(28);
      color: #999;
      margin-left: rems(20);
    }
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      div:nth-child(1) {
        padding: rems(20);
        font-size:rems(28);
        color:#333;
      }
      div:nth-child(2) {
        padding: rems(20);
        font-size:rems(24);
        color:#FE334B;
      }
    }
    .hisbox {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .items {
        border-radius:rems(30);
        background:#fff;
        color:#999999;
        padding:rems(3) rems(15);
        margin:rems(5) rems(10);
        font-size:rems(28) !important;
        box-sizing:border-box;
        border:1px solid #D8D8D8;
      }
    }
  }
</style>