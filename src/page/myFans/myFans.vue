<template>
  <div>
    <div class="myTeam" style="margin-bottom: 10px;" v-if="(settingcount - count)>=0 && !fxshopid">
      <span>邀请小伙伴，还差 <span style="color: #FE334B;">{{(settingcount - count) <=0 ? 1 : settingcount - count}}</span> 人就可成为会员团长</span>
    </div>
    <div class="teamitem" v-for="item in teamMsg" :key="item.code">
      <div class="itemmsg">
        <img :src="item.shoplogo || './img/man.jpg'">
        <!-- <img :src="'/img/man.jpg'"> -->
        <div>
          <span>{{item.username || item.name}}</span>
          <span>手机号码: {{item.phone}}</span>
        </div>
      </div>
      <div class="itemzz itemzzz">
        <span class="yqsj">邀请时间: {{item.createtime}}</span>
      </div>
    </div>

    <div class="nodata" v-if="!teamMsg||teamMsg.length<=0">
      <img src="../../img/nodata.png">
      <span>亲，目前没有相关团队喔~</span>
    </div>
  </div>
</template>

<script>
export default {
  components:{},
  props:{},
  data(){
    return {
      teamMsg: '',      // 我的邀请数据
      count: '',
      fxshopid: '',
      settingcount: 0,
    }
  },
  watch:{
    
  },
  computed:{

  },
  methods:{
    bindData() {
      if (!getname('SessionShopID')) {
        https({
          url: siteUrl + 'Main/Member/GetUserRegTeam?devicetype=7',
          data: {
            uid: getname()
          },
          headers: 1,
          successBack: ret => {
            if (ret.success) {
              if (!ret.Data) return
              this.teamMsg = ret.Data
              this.count = ret.count
              this.settingcount = ret.settingcount
            } else {
              promptMsg(ret.err)
            }
          }
        })
      } else {
        https({
          url: siteUrl + 'Main/Member/GetMyFans',
          data: {
            uid: getname(),
            currentPage: 1,
            pageSize: 999,
            search: '',
            devicetype: 7
          },
          headers: 1,
          successBack: ret => {
            if (ret.success && ret.status == 1) {
              if (ret.Data.length > 0) {
                ret.Data.map(item => {
                  item.createtime = item.createtime.split(' ')[0]
                })
              }
              this.teamMsg = ret.Data
            } else {
              promptMsg(ret.err)
            }
          }
        })
        
      }
    }
  },
  created(){
    var that = this
    this.fxshopid = getname('SessionShopID')
    this.bindData()
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

  swiper-item {
    overflow-y: scroll;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  .teamitem {
    width: rems(750);
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
    /* display: flex; */
    /* flex-direction: column; */
    align-items: center;
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