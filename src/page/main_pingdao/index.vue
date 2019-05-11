<template>
<section>
    <van-swipe :autoplay="5000"  @change="onChange">
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

    <div class="bigtitle">
        <p>{{titles}}</p>
        <p>呼朋唤友一起拼</p>
    </div>

    <div class="probox" v-for="(item,index) in data" :key='index' @click='gogoundpro(item.gbid,item.pid)'>
        <img v-lazy="item.propic" alt="" class="proimg">
        <div class="pro_right">
            <p class="pro_title">
            <span class="ping">{{item.gbuynum}}人拼团</span>
            {{item.title}}
            </p>
            <div class="pro_main">
                <!-- <div class="renshu" >
                     <div v-for="(list,idex) in item.userimglist" :key='idex' class="imgbox">
                    <img :src="list" alt="" v-if="idex<5" :style="idex>0?'margin-left:-10px':''">
                    </div>
                </div> -->
                <p class="proshou">已售{{item.count}}件</p>
            </div>
            <div class="pro_price">
                <p class="pro_pricetile"><span>&yen;{{item.gbprice}}</span>原价{{item.proprice}}</p>
                <p class="goping">去拼团</p>
            </div>
        </div>
    </div>

    <div class="nodata" v-if="data.length==0">
        <img src="../../img/nodata.png" alt="">
        <p>暂时没有数据</p>
    </div>
</section>

</template>

<script>
export default {
  components:{},
  props:{},
  data(){
    return {
        data:[],
        urldata:[],
        currpage:1,
        current:0,
        stopload:false,
        titles:''
    }
  },
  watch:{},
  computed:{},
  methods:{
      binddata(){
       var that=this
     https({
        url:siteUrl+'Main/Main/GetAllGBListJson',
        data:{
            currpage:that.currpage,
            pagesize:5,
            gbclassid:pageParam('classid')
        },
        successBack:(ret)=>{
            if(ret.success&&ret.status==1){
                if(that.currpage==1){
                  that.stopload=false
                    that.data=ret.Data
                }else{
                    that.data=that.data.concat(ret.Data)
                }
            }else if(ret.success&&ret.status==0){
                 that.stopload=true
                if(that.currpage==1){
                    that.data=ret.Data
                }
            }else{
                promptMsg(ret.err)
            }
                    refreshDone()
        }
      }) 
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
    onChange(index) {
      this.current = index;
    },
    gogoundpro(gbid,pid){
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
  created(){
    this.titles=pageParam('name')
  },
  mounted(){
      this.urlist()
      this.binddata()
      if(window.api){
        var that=this
            api.addEventListener({
              name: 'scrolltobottom'
          }, function (ret, err) {
              if (!that.stopload) {
                  that.currpage = that.currpage + 1;
                  that.binddata();
              }
          });
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
            that.currpage=1
           that.binddata()
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
  text-align: center;
}
.dianitem {
  @include item;
  justify-content: center;
  .writedian {
    background: #fff;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 5px;
  }
}
img{
    display: block;
}
.probox{
    margin: 0 rems(38);
    padding: rems(28) rem(10);
    border-radius: 8px;
    border-bottom: 1px solid #f6f6fa;
    @include item;
    .proimg{
        width: rems(200);
        height: rems(200);  
        flex-shrink: 0;
        margin-right: rems(20);
    }
    .pro_right{
        width: 100%;
        .pro_title{
        @include font2;
        font-size: rems(30);
        margin-bottom: rems(20);
        }
        .ping{
            background:linear-gradient(270deg,rgba(254,51,75,1) 0%,rgba(255,114,130,1) 100%);
            color: #fff;
            border-radius: 30px;
            padding: 0 rems(10);
            margin-right: rems(16);
            font-size: rems(20)
        }
        .pro_main{
            @include item;
            justify-content: flex-end;
            margin-bottom: rems(20);
            .renshu{
               @include item;
                height: rems(64);
               img{
                   width: rems(64);
                   height: rems(64);
                   border-radius: 50%;
               } 
            }
            .proshou{
                color: #999999;
                font-size: rems(24);
            }
        }
        .pro_price{
            @include item;
            justify-content: space-between;
            .pro_pricetile{
                @include font1;
                font-size: rems(24);
                color: #999999;
                span{
                    color: #FE334B;
                    font-size: rems(36);
                    margin-right: rems(10);
                }
            }
            .goping{
                flex-shrink: 0;
               color: #fff;
               font-size: rems(28);
               padding: rems(10) rems(40);
                background:linear-gradient(270deg,rgba(254,51,75,1) 0%,rgba(255,114,130,1) 100%);
                border-radius: 30px;
            }
        }
    }
}
.bigtitle{
  @include item;
  border-bottom: 1px solid #f6f6fa;
  margin: 0 rems(38);
  p:nth-child(1){
  padding: rems(24) 0;
  font-size: rems(34);
  font-weight: 700;
  margin-right: rems(60);
  }
  p:nth-child(2){
    font-size: rems(24);
    color: #999999;
  }
}
</style>