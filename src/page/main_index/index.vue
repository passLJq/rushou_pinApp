<template>
<section>
    <div class="probox" v-for="(item,index) in data" :key='index' @click="gogoundpro(item.gbid,item.pid)">
        <img v-lazy="item.propic" alt="" class="proimg">
        <div class="pro_right">
            <p class="pro_title">
            <span class="ping">{{item.gbuynum}}人拼团</span>
            {{item.title}}
            </p>
            <div class="pro_main">
                <div class="renshu" >
                    <!-- <div v-for="(list,idex) in item.userimglist" :key='idex' class="imgbox">
                        <img :src="list" alt="" v-if="idex<5" :style="idex>0?'margin-left:-10px':''">
                    </div> -->
                </div>
                <p class="proshou">已售{{item.count}}件</p>
            </div>
            <div class="pro_price">
                <p class="pro_pricetile"><span>&yen;{{item.gbprice}}</span>原价{{item.proprice}}</p>
                <p class="goping">去拼团</p>
            </div>
        </div>
    </div>

    <div class="nodata" v-if="data.length==0&&onshwodata">
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
        onshwodata:false
    }
  },
  watch:{},
  computed:{},
  methods:{
      bindata(){
        var that=this
        showLoading()
      https({
        url:siteUrl+'Main/Main/GetAppTempShopIndexJson',
        data:{
          userid:getname(),
          fxshopid:getname('SessionShopID'),
          code:'ping'
        },
        successBack:(ret)=>{
          if(ret.success&&ret.status==1){
              // that.urldata=ret.Data
              var data=ret.Data.template
              var index=pageParam('index')
              var listdata=JSON.parse(data.classallprodata)[index]
              listdata.forEach(function(item,index){
                  var a=JSON.parse(item.userimglist)
                  listdata[index].userimglist=a
                  listdata[index].count = item.count ? item.count : Math.floor(Math.random() * 50) + 50
              })
              that.data=listdata
          }else{
            promptMsg(ret.err)
          }
          that.onshwodata=true
          hideLoading()
        }
      })          
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
  created(){},
  mounted(){
      this.bindata()
  }
}
</script>
<style lang="scss">
body{
    padding-top:rems(30);
}
img{
    display: block;
}
.probox{
    margin: 0 rems(38);
    margin-bottom: rems(20);
    padding: rems(28) rem(10);
    border-radius: 8px;
    box-shadow:0 2px 10px 4px rgba(203,203,203,0.23);
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
            justify-content: space-between;
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
</style>