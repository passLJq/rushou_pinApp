<template>
<div>
  <van-swipe :autoplay="5000"  @change="onChange" :duration="300">
      <van-swipe-item v-for="image in urldata" :key="image.soure">
        <img :src="image.soure" @click='gogoundpro(image.gbid,image.pid)'>
      </van-swipe-item>
      <div class="custom-indicator" slot="indicator">
        <div class="dianitem">
          <div
            class="writedian"
            v-for="(image,index) in urldata"
            :key="image.soure"
            :style="current==index?'background-color:rgba(255,85,65,0.5); border-radius: 4px;width:16px':''"
          ></div>
        </div>
      </div>
    </van-swipe>

    <div class="ensure">
      <div><img src="../../img/ensure1.png"><p>全场包邮</p></div>
      <div><img src="../../img/ensure2.png"><p>正品保证</p></div>
      <div><img src="../../img/ensure3.png"><p>售后无忧</p></div>
      <div><img src="../../img/ensure4.png"><p>好货价低</p></div>
    </div>

    <div class="navbox">
      <div class="navli" v-for="(item,index) in navimgdata" :key="item.imgUrl" @click="golink(index)">
        <img :src="item.imgUrl" alt="">
        <p>{{navtitle[index]}}</p>
      </div>
    </div>

    <div>
      <img @click="goRecruit" src="https://images.rushouvip.cn/IMG/20190109_banner.gif" alt="" style="width:100%">
    </div>

    <div class="title">
      <p>今日热卖</p>
    </div>

    <section>
      <div class="probox" v-for="(item,index) in groupdata" :key="item.backgrounds" @click="gogoundpro(item.id,item.pid)">
      <img v-lazy="item.backgrounds" alt="">
      <p class="protitle">{{item.title}}</p>
      <p class="prosecname">{{item.name}}</p>
      <div class="profoot">
        <div class="profoot_left">
        <span class="pingnum">{{item.gbnum}}人拼团</span>
        <p class="proprice"><span>&yen;</span>{{item.gbprice|tonumber}}</p>
        </div>
        <div class="profoot_right">
          去拼团
        </div>
      </div>
      <!-- <p class="yishou">已售11件</p> -->
      </div>

    </section>
</div>
</template>

<script>
import {AnalysisAdsUrl} from '../../assets/js/analysisAdsUrl'

export default {
  components:{},
  props:{},
  data(){
    return {
      urldata:[],
      classallprodata:[],
      groupdata:[],
      navimgdata:'',
      navtitle:'',
      current:0
    }
  },
  watch:{},
  computed:{},
  filters:{
    tonumber(value){
      return Number(value).toFixed(2)
    }
  },
  methods:{
    AnalysisAdsUrl(type,title,ref){
      AnalysisAdsUrl.clickAds(type,title,ref)
    },
    goRecruit() {
      openWin({
        name: 'tz_recruit',
        url: './tz_recruit.html',
        pageParam: {}
      })
    },
    Ana(link){
      var data=JSON.parse(link)
      AnalysisAdsUrl.clickAds(data.type,data.title,data.ref)
    },
     onChange(index) {
      this.current = index;
    },
    urlist(){
      var that=this
      https({
        url:siteUrl+'Marketing/Groupbuy/GetGroupbuyBoot',
        successBack:(ret)=>{
          console.log(ret)
          if(ret.success&&ret.status==1){
            if (ret.Data.length > 0) {
              that.urldata=ret.Data
            } else {
              that.urldata = [{
                soure: "https://images.rushouvip.cn/IMG/tuan_banner.png",
                gbid: '',
                pid: ''
              }]
            }
              
          }else{
            promptMsg(ret.err)
          }
        }
      })
    },
    databind(){
       var that=this
      https({
        url:siteUrl+'Main/Main/GetAppTempShopIndexJson',
        data:{
          userid:getname(),
          fxshopid:getname('SessionShopID'),
          code:'ping'
        },
        successBack:(ret)=>{
          console.log(ret)
          if(ret.success&&ret.status==1){
              // that.urldata=ret.Data
              var data=ret.Data.template
              that.classallprodata=JSON.parse(data.classallprodata)
              that.groupdata=JSON.parse(data.groupdata)
              that.navimgdata=data.navimgdata
              that.navtitle=data.navtitle
          }else{
            promptMsg(ret.err)
          }
          refreshDone()
        }
      }) 
    },
    golink(index){
      var that=this
      if(this.classallprodata[index][0].type){
        this.AnalysisAdsUrl(that.classallprodata[index][0].type,that.classallprodata[index][0].title,that.classallprodata[index][0].ref)
      }else{
        openWin({
          name:'main_index',
          url:'./main_index.html',
          pageParam:{
            index,
            title:that.navtitle[index]
          }
        },1)
      }
    },
    gogoundpro(gbid,pid){
      if (!gbid) return
      openWin({
        name:'new_lndianaDetail'+gbid,
        url:'./new_lndianaDetail.html',
        pageParam:{
          gbid:gbid,
          pid:pid,
          title:'拼团详情'
        }
      },1)
    }
  },
  created(){},
  mounted(){
    this.urlist()
    this.databind()
    var that=this
    if(window.api){
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
           that.databind()
          },1000)
      })
    }
  }
}
</script>
<style lang="scss">
img{
  display: block
}
.van-swipe {
  img {
    width: 100%;
  }
}
.custom-indicator {
  position: absolute;
  bottom: 8%;
  width: 100%;
  // text-align: center;
  display: flex;
  justify-content: center;
}
.dianitem {
  @include item;
  justify-content: center;
  .writedian {
    background: rgba(153,153,153,.5);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin: 0 3px;
    transition: all .2s ease-out;
  }
}
.navbox{
  @include item;
  .navli{
    width: 20%;
    padding: rems(30) 0;
    padding-top: 0;
    text-align: center;
    img{
      width:rems(96);
      height: rems(96);
      margin: 0 auto;
      margin-bottom: rems(10);
    }
    p{
      font-size: rems(24);
      color: #333
    }
  }
}
.title{
  font-size: rems(34);
  padding: rems(24) 0;
  margin:  0 rems(30);
  font-weight: 700;
}
.probox{
  margin: 0 rems(30);
  border-top:1px solid rgba(246,246,250,1);
  padding: rems(20) 0;
  img{
    width: 100%;
    margin-bottom: rems(20);

  }
  .protitle{
    font-size: rems(32);
    color: #333;
    margin-bottom: rems(10);
  }
  .prosecname{
    font-size: rems(24);
    color: #999;
    margin-bottom: rems(10)
  }
  .profoot{
    @include item;
    justify-content: space-between;
  }
  .profoot_left{
    @include item;
    .pingnum{
      background:linear-gradient(270deg,rgba(254,51,75,1) 0%,rgba(255,114,130,1) 100%);
      font-size: rems(20);
      color: #fff;
      border-radius: 30px;
      padding: 0 rems(10);
    }
    .proprice{
      margin-left: rems(10);
      font-size: rems(44);
      color: #FE334B;
      span{
        font-size: rems(20);
        margin-right: rems(6);
      }
    }
  }
  .profoot_right{
  background:linear-gradient(270deg,rgba(254,51,75,1) 0%,rgba(255,114,130,1) 100%);
  color: #fff;
  font-size: rems(28);
  padding: rems(10) rems(56);
  border-radius: 30px
  }
  .yishou{
    font-size: rems(20);
    color:#999;
  }
}

.ensure {
	width: 100%;
  padding: rems(30);
	display: flex;
  justify-content: space-between;
  box-sizing: border-box;
}

.ensure > div {
	display: flex;
	align-items: center;
}
.ensure > div img {
	width: rems(32);
	height: rems(32);
}
.ensure > div p {
	font-size: rems(24);
	color: #999;
	margin-left: rems(8);
}

</style>