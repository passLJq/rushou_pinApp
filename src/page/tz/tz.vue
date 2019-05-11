<template>
  <div>
    <div id="main" style="width:100%;"></div>
    <div class="my_tou">
      <img v-lazy="userMsg.pic">
      <div class="usMsg">
        <div style="display:flex;flex-wrap:wrap;">
          <span class="usn" v-show="usn">{{usn}}</span>
          <!-- <span class="usn" v-show="usn">群哥@社交新零售.战略军师</span> -->
          <span class="iconfont icon-wujiaoxing-shi tuanz " v-show="usn&&fxshopid">团长</span>
        </div>
        <span v-if="userMsg.code && fxshopid">邀请码: {{userMsg.code}}</span>
      </div>
    </div>

    <!-- <div class="s1">
      <div></div>
    </div> -->

    <div class="myTeam">
      <div class="team">
        <div class="teamTit">我的团队
        <span v-if="fxshopid">邀请小伙伴，躺着就能赚！</span>
        <span v-else-if="teamMsg && teamMsg.settingcount">邀请小伙伴，还差<span style="color: #FE334B;margin:0;"> {{teamMsg.settingcount <= 0 ? 1 : teamMsg.settingcount}} </span>人就可成为会员团长</span></div>
        <div class="content">
          <div class="contit"><div></div>{{fxshopid ? '团队数量' : '邀请数量'}}</div>
          <div class="teamNum">{{fxshopid ? teamNum : teamMsg.count}}</div>
          <div class="bottom" :class="{flexEnd: fxshopid ? true : false}">
            <span v-if="!fxshopid">昨日新增 <span>+{{teamMsg.ztcount}}</span></span>
            <div class="btn" @click="gomyteam">查看全部</div>
          </div>
        </div>

      </div>
    </div>

    <div class="pic" @click="gorecruit">
      <div>
        <!-- <img src="https://images.rushouvip.cn/IMG/20190109_banner.gif">	  -->
        <img src="https://images.rushouvip.cn/IMG/rukou.gif">
      </div>
    </div>

    <div class="priv">
      <div class="tit">
        <div class="d1"></div>
        <div class="d2"></div>
        <div class="d3"></div>
        <span>团长特权</span>
        <div class="d3"></div>
        <div class="d2"></div>
        <div class="d1"></div>
      </div>
    </div>
    <img class="img" src="https://images.rushouvip.cn/IMG/tztq.png">
    <div class="priv">
      <div class="tit">
        <div class="d1"></div>
        <div class="d2"></div>
        <div class="d3"></div>
        <span>关于入手拼</span>
        <div class="d3"></div>
        <div class="d2"></div>
        <div class="d1"></div>
      </div>
    </div>
    <img class="img" src="https://images.rushouvip.cn/IMG/gyrsp.png">
  </div>
</template>

<script>
export default {
  components:{},
  props:{},
  data(){
    return {
      uid: '',
      userMsg: '',        //个人信息
      fxshopid: '',
      teamMsg: '',
      usn: '',
      settingcount: 0,		// 后台设置的开店人数
		  teamNum: 0
    }
  },
  watch:{
    
  },
  computed:{},
  methods:{
    bindData() {
      if (this.uid) {
        https({
          url: siteUrl + 'Main/Member/GetMemberJson',
          data: {
            uid: this.uid
          },
          headers: 1,
          successBack: ret => {
            if (ret.success && ret.status == 1) {
              refreshDone()
              this.userMsg = ret.Data
              this.usn = ret.Data.name
              if (!getname('SessionShopID')) {
                if(window.api){
                  api.setPrefs({ key:'SessionShopID',value:ret.Data.fxshopid});
                }else{
                  $api.setStorage('SessionShopID',ret.Data.fxshopid);
                }     
              }
            } else {
              promptMsg(ret.err)
            }
          }
        })
        https({
          url: siteUrl + 'Main/Member/GetUserRegTeam?devicetype=7',
          data: {
            // uid: '181128173509710852',
            uid: getname(),
          },
          headers: 1,
          successBack: ret => {
            console.log(ret)
            let data = ret
            if (data.success) {
              this.teamMsg = {
                count: data.count,
                ztcount: data.ztcount,
                settingcount: data.settingcount
              }
            }
          }
        })
        https({
          url: siteUrl + 'Main/Member/GetMyTeam',
          data: {
            uid: getname(),
            pageSize: 1,
            type: 1,
            currentPage: 1,
            search: ''
          },
          header: 1,
          successBack: ret => {
            if (ret.success && ret.status == 1) {
              this.teamNum = ret.total
            } else {
              // app.promsg(ret.err)
            }
          }
        })
      } else {
        this.usn = '请登录'
      }
    },
    gomyteam() {
      if (checkLoginStatus()) {
        if (getname('SessionShopID')) {
          openWin({
            name: 'myallies',
            url: './myallies.html',
            pageParam: {
              tz: 1,
              title: '客户管理'
            },
            bgColor: '#f5f5f5'
          }, 1)
        } else {
          openWin({
            name: 'myFans',
            url: './myFans.html',
            pageParam: {
              title: '我的分享'
            }
          }, 1)
        }
      }
    },
    gorecruit() {
      openWin({
        url: './tz_poster.html',
        bgColor: '#fff',
        name: 'tz_poster',
        pageParam: {
          title: '邀请好友'
        }
      }, 1)
    }
  },
  created(){
    var that = this
    this.uid = getname()
    this.fxshopid = getname('SessionShopID')
    if (window.api) {
      api.addEventListener({
        name: 'loginSuccess'
      }, function(ret, err){
        that.uid = getname()
        that.fxshopid = getname('SessionShopID')
      })
      api.addEventListener({
        name: 'loginout'
      }, function(ret, err){
        that.uid = ''
        that.fxshopid = ''
      })
      api.addEventListener({
        name: 'viewappear'
      }, function (ret, err) {
        that.uid = getname()
        that.fxshopid = getname('SessionShopID')
        that.bindData()
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
              that.uid = getname()
              that.fxshopid = getname('SessionShopID')
              that.bindData()
            }else{
              refreshDone()
            }
          },1000)
      })
    }
  },
  mounted(){
    this.bindData()
    var s = getname('statustop') || 0
    $api.byId('main').style.height = s + 'px'
    checkLoginStatus()
  }
}
</script>
<style lang="scss">
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  .flexEnd{
    justify-content: flex-end !important;
  }
  #main {
    background-color: rgba(254,51,75,1);
  }
  .my_tou {
    height: rems(280);
    display: flex;
    align-items: center;
    padding: rems(38) rems(52);
    background:linear-gradient(180deg,rgba(254,51,75,1) 0%,rgba(255,114,130,1) 100%);
  }

  .my_tou img {
    width: rems(144);
    height: rems(144);
    border-radius: 50%;
    margin-right: rems(21);
  }

  .my_tou .usMsg {
    display: flex;
    flex-direction: column;
    min-height: rems(120);
  }
  .my_tou .usMsg > div {
    display: flex;
    align-items: center;
    // line-height: rems(0);
  }
  .my_tou .usMsg > span {
    font-size: rems(28);
    font-weight: 400;
    color: #fff;
    margin-top: rems(15);
  }

  .my_tou .usMsg .tuanz {
    font-size: rems(20);
    color: #fff;
    background:rgba(195,26,46,1);
    border-radius:rems(16);
    padding: rems(4) rems(28);
    border:rems(2) solid rgba(255,134,149,1);
    // margin-left: rems(22);
    line-height: rems(36);
  }
  .my_tou .usMsg .tuanz::before {
    margin-right: rems(6);
    /* font-size: rems(24); */
  }

  .my_tou .usn {
    color: #fff;
    font-size: rems(36);
    font-weight: 600;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    max-width:rems(440);
    margin-right: rems(15);
  }

  .s1 {
    width: 100%;
    padding: 0 rems(30);
  }
  .s1 > div {
    width: 100%;
    height:rems(340);
    border-radius:rems(10);
    background-color: #ccc;
    margin-top: -rems(40);
  }

  .myTeam {
    width: 100%;
    padding: 0 rems(30);
    /* margin-top: rems(20); */
  }

  .myTeam .team {
    width: 100%;
    padding: 0 rems(30);
    box-shadow:rems(0) rems(2) rems(20) rems(0) rgba(153,153,153,0.15);
    border-radius:rems(16);
    margin-top: rems(-40);
    background-color: #fff;
  }

  .myTeam .team .teamTit {
    width: 100%;
    padding: rems(26) 0 rems(26);
    font-size: rems(34);
    color: #333;
    display: flex;
    align-items: center;
    font-weight: 600;
  }
  .myTeam .team .teamTit span {
    font-size: rems(24);
    margin-left: rems(36);
    color: #999;
    font-weight: 400;
  }

  .myTeam .content {
    width: 100%;
    border-top: rems(2) solid #f6f6fa;
    padding: rems(20) 0;
  }
  .myTeam .content .contit {
    width: 100%;
    font-size: rems(28);
    color: #333;
    display: flex;
    align-items: center;
  }
  .myTeam .content .contit > div {
    width:rems(8);
    height:rems(24);
    background:linear-gradient(270deg,rgba(254,51,75,1) 0%,rgba(255,114,130,1) 100%);
    border-radius:rems(6);
    margin-right: rems(6);
  }

  .teamNum {
    font-size: rems(36);font-weight: 600;
    margin: rems(20) 0 0;
  }
  .myTeam .bottom {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .myTeam .bottom > span {
    font-size: rems(24);
    color: #999;
  }

  .myTeam .bottom > span > span {
    font-size: rems(24);
    color: #FF5541;
  }

  .myTeam .bottom > .btn {
    font-size:rems(28);
    font-weight:600;
    color:#DE9A6B;
    line-height: rems(60);
    padding: 0 rems(40);
    border-radius:rems(35);
    border:rems(2) solid #DE9A6B;
  }

  .pic {
    width: 100%;
    margin: rems(30) 0 rems(10);
    padding: 0 rems(30);
  }
  .pic > div {
    width: 100%;
  }
  .pic > div > img {
    width: 100%;
    height: rems(156);
  }

  .priv {
    width: 100%;
    padding: rems(22) rems(30);
  }

  .priv .tit {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .priv .tit div {
    background:linear-gradient(270deg,rgba(254,51,75,1) 0%,rgba(255,114,130,1) 100%);
    border-radius: 50%;
    margin-left: rems(14);
  }

  .priv .tit .d1 {
    width: rems(4);
    height: rems(4);
  }
  .priv .tit .d2 {
    width: rems(8);
    height: rems(8);
  }
  .priv .tit .d3 {
    width: rems(12);
    height: rems(12);
  }

  .priv .tit span {
    margin-left: rems(14);
    color: #FE334B;
    font-weight: 600;
    font-size: rems(34);
  }

  .img {
    width: rems(690);
    margin: 0 auto; 
    border-radius: rems(16);
    box-shadow:rems(0) rems(2) rems(20) rems(0) rgba(153,153,153,0.15);
    display: block;
  }
</style>