<template>
    <div class="boximd" ref="app">
        <div class="bingbox" v-for="(item,index) in listdata" :key="index" @click="godetail(item.orderid)">
            <div class="tuitou">
                <p>{{item.shopname}}</p>
                <p>{{item.status|status}}</p>
            </div>
            <div class="foot">
                <img :src="item.pic" alt="">
                <p class="p1">{{item.name}}</p>
                <div class="fontleft">
                <p class="p2">&yen;{{item.price}}</p>
                <p class="p3">x{{item.count}}</p>
                </div>
            </div>
        </div>
        <div class='nodedata' v-if="listdata.length==0">
        <img src="../../img/orderno.png">
            <div class='wenzi'>
              <p>您还没有相关的订单～</p>
            </div>  
        </div>
    </div>          
</template>

<script>
export default {
  components:{},
  props:{},
  data(){
    return {
        listdata:'',
        currentPage:1,
        stops:false
    }
  },
  watch:{},
  computed:{},
  filters:{
    status:function(value){
    return value==1?'待处理':value==2?'未通过':value==3?'已通过':value==5?'处理中':'--'
    }
  },
  methods:{
      binddata(){
           var that=this
          https({
             url: siteUrl +'Main/Member/GerRefuncOrderList?devicetype=7',
            data:{
                  currpage:that.currentPage,
                  pagesize:8,
                  uid :getname(),
                //   yshopid:getname('SessionShopID')//传的话就是销售订单的退款订单
            },
            headers:1,
            successBack:function(ret){
                console.log(JSON.stringify(ret))
                if(ret.success&&ret.status==1&&ret.Data.length>0){
                    if(that.currentPage==1){
                        that.listdata=[]
                        that.stops=false
                    }
                    that.listdata=ret.Data
                }else if(ret.success&&ret.status==1){
                   if(that.currentPage==1){
                        that.listdata=[]
                    }
                    that.stops=true
                }else{
                    promptMsg(ret.err)
                }
                          refreshDone()
            }            
          })
      },
      exchangbinddata(){
          var that=this
           https({
             url: siteUrl +'Main/Member/GerExchangeOrderList?devicetype=7',
            data:{
                  currpage:that.currentPage,
                  pagesize:8,
                  uid :getname(),
                //   yshopid:getname('SessionShopID')//传的话就是销售订单的换货订单
            },
            headers:1,
            successBack:function(ret){
                if(ret.success&&ret.status==1&&ret.Data.length>0){
                    if(that.currentPage==1){
                        that.listdata=[]
                        that.stops=false
                    }
                    that.listdata=ret.Data
                }else if(ret.success&&ret.status==1){
                   if(that.currentPage==1){
                        that.listdata=[]
                    }
                    that.stops=true
                }else{
                    promptMsg(ret.err)
                }
                          refreshDone()
            }            
          })         
      },
      onScroll() {
          var that=this
                //可滚动容器的高度
                let innerHeight = that.$refs.app.clientHeight;
                //屏幕尺寸高度
                let outerHeight = document.documentElement.clientHeight;
                //可滚动容器超出当前窗口显示范围的高度
                let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                //scrollTop在页面为滚动时为0，开始滚动后，慢慢增加，滚动到页面底部时，出现innerHeight < (outerHeight + scrollTop)的情况，严格来讲，是接近底部。
                if (innerHeight <= (outerHeight + scrollTop)) {
                    //加载更多操作
                    if(!that.stops){
                        that.currentPage=that.currentPage++
                            if(pageParam('type')==1){
                            that.binddata();
                            }else{
                            that.exchangbinddata()
                            }
                    }
                }
      },
      godetail(orderid){
          openWin({
              name:'orderdetail',
              url:'./orderdetail.html',
              pageParam:{
                  orderid:orderid,
                  title:'订单详情'
              }
          },1)
      }
  },
  created(){
        if(window.api){
            var that=this
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
                that.listdata=[]
                that.stops=false
                if(pageParam('type')==1){
                    that.binddata();
                }else{
                    that.exchangbinddata()
                }
            },1000)
            });
      }
  },
  mounted(){
      if(pageParam('type')==1){
      this.binddata();
      }else{
      this.exchangbinddata()
      }
      window.addEventListener('scroll', this.onScroll);
  }
}
</script>
<style lang="scss">
.boximd{
    padding-top: rems(20);
}
img{
    display: block;
}
body{
    background: #f5f5f5
}
.bingbox{
    background: #fff;
    margin: 0 rems(30);
    border-radius: 8px;
    padding: 0 rems(30);
    margin-bottom: rems(20);
}
.tuitou{
    @include item;
    padding: rems(20) 0;
    justify-content: space-between;
    p:nth-child(1){
        color: #2C5B33;
        font-size: rems(28);
    }
    p:nth-child(2){
        color: #E69888;
        font-size: rems(28);
    }
}
.fontleft{
    text-align: right;
}
.foot{
      @include item;
      color: #666464;
      font-size: rems(26);
      padding-bottom: rems(26);
    img{
        width:rems(160);
        height: rems(160);
        flex-shrink: 0;
        margin-right: rems(20)
    }
    .p1{
      @include font2;   
      margin-bottom: rems(70);  
      width: 70%;
      padding: 0 rems(50) 0 0;  
    }
    .p2{
        font-size: rems(28);
    }
    .p3{
        margin-top: rems(40);
    }
}
           .nodedata{
            margin: 0 auto;
            margin-top: 15%;
            text-align: center;
            font-size: rems(24);
            padding-top: rems(80);
            img{
                width: 50%;
                margin: 0 auto;
            }
            .wenzi{
                margin-top: -20px;
                color: #999;
                }         
           }
</style>