<template>
  <div>
    <div class="g_box">
      <div class="g_main">
        <div class="g_xinqbox">
          <div class="box_main items">
            <img :src="msgdata.proimage">
            <div class="pro_right">
              <div class="pro_xian">
                <div class="p1">
                  <span style="margin-right: 8px;" :style="msgdata.buyonegetone || msgdata.headfree ? '' : 'padding: 0'" class="allhave"><span :style="msgdata.buyonegetone || msgdata.headfree ? 'margin-right: 5px;' : 'margin: 0;'" class="allhaveping">{{msgdata.count > msgdata.gbnum ? msgdata.count : msgdata.gbnum}}人团</span>{{msgdata.headfree
                  ? '团长免单 ' : ''}}{{msgdata.buyonegetone ? '拼一送一' : ''}}</span>{{msgdata.proname}}</div>
                </div>
              <div>
                <div class="p3">
                  <span class="p4">¥</span>{{msgdata.gbprice}}
                  <span class="p5">原价{{msgdata.productprice}}</span>
                </div>
                <div class="pintishi">如未拼团成功，将全额返还原账户</div>
              </div>
            </div>
          </div>
        </div>
        <div class="gpbox">
          <div class="gp1">{{commit}}</div>
          <div class="gp2" v-if="msgdata.gbstate==1&&!overtime">
            <span>还差<span style="color:#FF5541">{{msgdata.num}}</span>人 距离结束</span>
            <span style="color:#FF5541;margin-left:8px;">{{days<=0?'':day+'天'}}{{hours}}:{{minutes}}:{{seconds}}</span>
          </div>
          <div class="gp2" v-if="msgdata.gbstate>=3">
            <span>本次未成团，退款已原路退回</span>
          </div>
          <div class="items xiabox" :style="allping.length>=4?'width:80%;flex-wrap:wrap':''">
            <div class="canyu">
              <img v-if="msgdata.imgphoto" :src='msgdata.imgphoto'>
              <img v-else src='../../img/man.jpg'>
              <div class="or_name">{{msgdata.realname|isnumber}}</div>
              <div class="tuanzhang">
                  <div>团长</div>
              </div>
            </div>
            <div class="canyu" v-for="(item,index) in allping">
              <img  v-if="msgdata.groupbuylist[index]" :src="msgdata.groupbuylist[index].head?msgdata.groupbuylist[index].head:(msgdata.groupbuylist[index].head===''?'./img/man.jpg':'./img/man.png')">
              <img  v-else src="../../img/hui.png">
              <div class="or_name" v-if="msgdata.groupbuylist[index]" >{{msgdata.groupbuylist[index].name|isnumber}}</div>
              <div class="or_name" v-else >{{msgdata.gbstate>=3?'':'待邀请'}}</div>
            </div>
          </div>
        </div>
        <div style="width: 90%;height: 1px;margin:0 auto;background:#f6f6fa;"></div>
        <div class='rule'>
          <div class="rule1">玩法说明</div>
          <img  class="rule2" src="../../img/wanfashuoming@3x.png">
          <div style="position:relative">
            <!-- <div class="rule2"> -->
            <!-- </div> -->
            <div class="rule3 rule4">
              <div>选择商品</div>
              <div>参加活动</div>
            </div>
            <div class="rule3 rule5">
              <div>支付开团</div>
              <div>或拼团</div>
            </div>
            <div class="rule3 rule6">
              <div>邀请好友</div>
              <div>参团支付</div>
            </div>
            <div class="rule3 rule7">
              <div>人满成功</div>
              <div>失败退款</div>
            </div>
          </div>
        </div>

      </div>
    </div>

    

    <div class="btnzu">
      <div class="othbtn" @click="goother">其他拼团</div>
      <div class='btnorder' v-if="msgdata.gbstate==2" @click="godingdan">{{btnmessg}}</div>
      <div class='wxbtn appbtn' v-else @click="gobuy">{{btnmessg}}</div>
    </div>
  </div>
</template>

<script>
var tiomeout_ores=''
export default {
  components:{},
  props:{},
  data(){
    return {
      onec: false, //第一次进来不运行onshwo生命函数
      msgdata: {
        heda:[]
      },
      commit: '', //提示语
      allping: '', //拼团一共需要多少人
      days: '',
      hours: '00',
      minutes: '00',
      seconds: '00',
      btnmessg: '',
      showshare: [false, true], //分享控制
      overtime: false, //倒计时结束了，手动变失败
    }
  },
  filters: {
    isnumber: function(value) {
      var value = value
      if (!isNaN(value)&&value.length==11){
        var tel = value.replace(value.slice(-7, -3), '****');
        return tel
      }else{
        return value
      }
    }
  },
  watch:{
    
  },
  computed:{},
  methods:{
    bindata: function() {
      var that = this
      that.onec = true
      https({
          url: siteUrl + '/Marketing/Groupbuy/GetGBOrder?devicetype=7',
          data: {
              orderID: pageParam('orderid'),
              uid: getname()
          },
          successBack: (ret) => {
              console.log($api.jsonToStr(ret))
              if (ret.status == 1 && ret.success) {
                clearInterval(tiomeout_ores);
                let remaintime = ''
                let commit = ''
                var agroudtimes = ''
                var btnmessg = ''
                var overtime = false
                if (ret.Data.gbstate == 1 && ret.Data.count >= ret.Data.gbnum) {
                  ret.Data.gbstate = 2
                }
                if (ret.Data.gbstate == 1) {
                  //有这个参数代表和没参加这个拼团
                  if (!ret.Data.hasjoin) {
                    btnmessg = '和TA一起拼'
                  } else {
                    btnmessg = '分享给好友'
                  }
                  commit = "拼团中，赶紧来和我拼团抢好物吧"
                  remaintime = ret.Data.ts - ret.Data.tpgap;
                  //倒计时
                  if (remaintime > 0) {
                    agroudtimes = function() {
                      if (remaintime <= 0) {
                        clearInterval(tiomeout_ores);
                        //有这个参数代表和没参加这个拼团
                        if (!ret.Data.hasjoin) {
                          btnmessg = '我也发起拼团'
                          commit = "此单已失效，快去看看别的拼单吧"
                        } else {
                          btnmessg = '重新开团'
                          commit = "拼团失败，您可以重新发起拼团"
                        }
                        overtime = true
                        that.commit=commit,
                        that.btnmessg=btnmessg,
                        that.overtime=overtime
                        return;
                      }
                      var showhtml = "";
                      remaintime = remaintime - 1;
                      var days = parseInt(remaintime / 60 / 60 / 24); //计算剩余的天数
                      var hours = parseInt(remaintime / 60 / 60 % 24); //计算剩余的小时
                      var minutes = parseInt(remaintime / 60 % 60); //计算剩余的分钟
                      var seconds = parseInt(remaintime % 60); //计算剩余的秒数
                      if (days != 0) {
                        showhtml += days + "天";
                      }
                      if (hours != 0) {
                        showhtml += hours + "：";
                      }
                      minutes = that.checkTime(minutes);
                      seconds = that.checkTime(seconds);
                      that.days=days,
                      that.hours=hours,
                      that.minutes=minutes,
                      that.seconds=seconds
                    }
                    tiomeout_ores = setInterval(agroudtimes, 1000)
                  //后台有延迟 直接前端
                  } else {
                    clearInterval(tiomeout_ores);
                    //有这个参数代表和没参加这个拼团
                    if (!ret.Data.hasjoin) {
                      btnmessg = '我也发起拼团'
                      commit = "此单已失效，快去看看别的拼单吧"
                    } else {
                      btnmessg = '重新开团'
                      commit = "拼团失败，您可以重新发起拼团"
                    }
                  }
                } else if (ret.Data.gbstate == 2) {
                  //有这个参数代表和他完成拼团了
                  if (!ret.Data.hasjoin) {
                    btnmessg = '我也发起拼团'
                    commit = '此单已成团，快去看看别的拼单吧'
                  } else {
                    btnmessg = '查看订单详情'
                    commit = '拼团成功，商品很快就来到你身边'
                  }
                } else {
                  //有这个参数代表和他完成拼团了
                  if (!ret.Data.hasjoin) {
                    btnmessg = '我也发起拼团'
                    commit = "此单已失效，快去看看别的拼单吧"
                  } else {
                    btnmessg = '重新开团'
                    commit = "拼团失败，您可以重新发起拼团"
                  }
                }
                //有几个人需要参团
                let allping = []
                let allpingNum = 2
					      allpingNum = ret.Data.count > ret.Data.gbnum ? ret.Data.count : ret.Data.gbnum
                for (var i = 0; i < (allpingNum - 1); i++) {
                  allping.push(1)
                }
                that.msgdata=ret.Data,
                that.commit=commit,
                that.allping=allping,
                that.btnmessg=btnmessg,
                that.overtime=overtime
              } else {
                promptMsg(ret.err)
              }
          }
      })
      },
      checkTime: function(i){ //将0-9的数字前面加上0，例1变为01
        if(i<10) {
          i = "0" + i;
        }
        return i;
      },
      goother(){
        if (openapp) {
          api.closeToWin({
            name: 'root',
            animation: {
              type: 'push',
              subType: 'from_right',
              duration: 300
            }
          })
        } else {
          openWin({
            name: 'root',
            url: './main.html',
            pageParam: {}
          })
        }
      },
      godingdan(){
        openWin({
          name: 'orderdetail',
          url: './orderdetail.html',
          pageParam: {
            orderid: pageParam('orderid'),
            title: '订单详情'
          }
        }, 1);
      },
      gobuy:function(){
        var that=this
        //后台有延迟 倒计时结束走这里
        if (that.overtime||that.msgdata.gbstate>=3){
          openWin({
            name:'groupbuy',
            url:'./new_lndianaDetail.html',
            useWKWebView:true,
            pageParam:{
              title:'拼团详情',
              pid:that.msgdata.proid,
              gbid:that.msgdata.gbid
            }
          }, 1)
          return
        }
        //分享
        if(that.msgdata.gbstate==1){
          api.openFrame({
            name: 'marketing_shaerdiv',
            url: './marketing_shaerdiv.html',
            rect: {
              x: 0,
              y: 0,
              w: 'auto',
              h: 'auto'
            },
            pageParam: {
              data: that.msgdata,
              orderid:pageParam('orderid')
            },
            bounces: false,
            bgColor: 'rgba(0,0,0,0)'
          });

        }
      }
  },
  created(){},
  mounted(){
    this.bindata()
  }
}
</script>
<style lang="scss">
// * {
//   margin: 0;
//   padding: 0;
//   box-sizing: border-box;
// }
  body{background-color: #F6F6FA}
  img{display: block;};
  .appbtn{
    background:rgba(255,85,65,1);
    border-radius:18px;padding: 8px 0;text-align: center;color: #fff;margin: 0 auto;box-shadow:0px 2px 8px #CFCFCF;
  }
  .g_box{
    background:linear-gradient(360deg,rgba(254,51,75,1) 0%,rgba(255,114,130,1) 100%);
    padding:rem(15) rem(15);
    margin-bottom:rem(10);
  }
  .items{display: flex;align-items: center;}
  .g_main{
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
  }
  .box_main{
    padding: rem(12) 0;
    border-bottom: 1px solid #F6F6FA;
  }
  .box_main img{
    width:  rem(118);
    height:  rem(118);
    margin-right:  rem(8);
    flex-shrink: 0;
  }
  .p2{
    border: 1px solid #FF5541;
    border-radius: 30px;
    color: #FF5541;
    padding: 0 rem(6);
    font-size: rem(10);
    margin-right:  rem(3);
  }
  .p1{
    font-size: rem(12);
    overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;
    margin-bottom: rem(22);
    line-height: 2;
  }
  .p3{
    font-size: rem(18);
    color: #FF5541;
  }
  .p4{
    color: #FF5541;
    font-size:rem(12);
  }
  .p5{
    color: #999;
    font-size: rem(10);
    text-decoration: line-through;
  }
  .g_xinqbox{
    padding: 0 rem(12);
  }
  .pintishi{
    font-size: rem(10);
    color: #999;
    margin-top: rem(3);
  }
  .canyu{
    font-size: rem(12);
    text-align: center;
    color: #999;
    position: relative;
  }
  .tuanzhang{
    position: absolute;
    bottom: rem(22);
    left: 0;
    right: 0;
  }
  .tuanzhang div{
    color: #fff;
    background:linear-gradient(270deg,rgba(254,51,75,1) 0%,rgba(255,114,130,1) 100%);
    font-size: rem(10);
    border-radius: 30px;
    width: 75%;
    margin: 0 auto;
  }
  .xiabox{
    justify-content: space-around;
    width: 50%;
    margin: 0 auto;
  }
  .canyu img{
    width: rem(48);
    height: rem(48);
    border-radius: 50%;
    margin: 0 auto;
    margin-bottom: rem(10);
  }
  .gp1{
    font-size:rem(17);
    color: #333;
    padding: 0 0 rem(10) 0;
    text-align: center
  }
  .gp2{
    color: #999;
    font-size:  rem(12);
    text-align: center;
    margin-bottom:rem(22);
  }
  .gpbox{
    padding:rem(30) 0;
  }
  .or_name{
    overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical;
    width:  rem(73);
    height:  rem(18);
    line-height: rem(18);
  }
  .rule{
    background-color: #fff;
    text-align: center;
    height:rem(130);
    // margin-bottom: rem(60);
  }
  .rule1{
    padding: rem(7) 0;
    margin-bottom: rem(15);
    font-size: rem(14);
  }
  .rule2{
    width: 80%;
    margin: 0 auto;
    position: relative;
  }
  .rule2{
    margin: 0 auto;
    width: 80%;
  }
  .rule3{
    color: #999;
    font-size: rem(12);
    bottom: unquote('-'+rem(50));
  }
  .rule4{
    position: absolute;
    left: 7%;
  }
  .rule5{
    position: absolute;
    left: 32%;
  }
  .rule6{
    position: absolute;
    left: 56%;
  }
  .rule7{
    position: absolute;
    left: 80%;
  }
  .btnzu{
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    padding: rem(10) rem(15);
    display: flex;
    align-items: center;
  }
  .othbtn{
    width: 30%;
    flex-shrink: 0;
    color: #FF5541;
    border: 1px solid #FF5541;
    border-radius: 30px;
    text-align: center;
    font-size: rem(14);
    padding:rem(8) 0;
    height: rem(20);
  }
  .wxbtn{
    width: 56%;
    flex-shrink: 0;
    font-size: rem(14);
    padding: rem(8) 0;
    margin-left: rem(12);
    height: rem(21);
  }
  .btnorder{
    width: 56%;
    flex-shrink: 0;
    font-size: rem(14);
    color:#fff;
    background:linear-gradient(270deg,rgba(254,51,75,1) 0%,rgba(255,114,130,1) 100%);
    border-radius: 30px;
    height: rem(37);
    line-height:  rem(37);
    margin: 0 auto;
    margin-left: rem(12);
    text-align: center;
  }
  /* 拼团标识 */
  .pingone{
    border: 1px solid #FF5541;
    border-radius: 30px;
    color: #FF5541;
    padding: 0 rem(6);
    font-size: rem(10);
    margin-right:rem(3);
  }
  .tuanfree{
    border: 1px solid rgba(232,55,74,1);
    border-radius: 30px;
    color: #fff;
    padding: 0 rem(6);
    font-size: rem(10);
    margin-right: rem(3);
    background:linear-gradient(270deg,rgba(254,51,75,1) 0%,rgba(255,114,130,1) 100%);
  }
  .allhave{
    border-radius:16px;
    border:1px solid rgba(255,85,65,1);
    color: #FF5541;
    background: #fff;
    font-size: rem(10);
    padding-right:rem(5);
  }
  .allhaveping{
    background:linear-gradient(270deg,rgba(254,51,75,1) 0%,rgba(255,114,130,1) 100%);
    color: #fff;
    border-radius:16px;
    font-size: rem(10);
    padding:0 rem(8);
    margin-right: rem(5);
  }

</style>