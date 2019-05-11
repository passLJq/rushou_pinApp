<template>
<div>
    <div id="header_container"></div>
    <div id="app" v-if="okone">
        <div>
            <div class="gpbox">
                <div v-if="msgdata.count > 0">
                    <div class="gp1" style="color:#9B9B9B;">还差
                        <span class="numone">{{msgdata.count}}人</span>成团</div>
                    <div class="gp2">
                        <span style="color:#9B9B9B;">距离结束还剩下 {{days<=0?'':day+'天'}}{{hours}}:{{minutes}}:{{seconds}}</span>
                    </div>
                </div>
                <div v-else>
                    <div class="gp1">拼团成功</div>
                </div>
                <div class="items xiabox" :style="allping.length>=4?'width:80%;flex-wrap:wrap':''">
                    <div class="canyu" v-if="msgdata.resobj">
                        <img v-if="msgdata.resobj[0].userimg" :src="msgdata.resobj[0].userimg">
                        <img v-else src="../../img/man.jpg" alt="">
                        <div class="or_name">{{msgdata.resobj[0].username|isnumber}}</div>
                        <div class="tuanzhang">
                            <div>团长</div>
                        </div>
                    </div>
                    <div class="canyu" v-for="(item,index) in allping" :key="index">
                        <img v-if="msgdata.resobj[index+1]" :src="msgdata.resobj[index+1].userimg?msgdata.resobj[index+1].userimg:(msgdata.resobj[index+1].userimg==''?'./img/man.jpg':'./img/man.jpg')">
                        <img v-else src="../../img/hui.png" alt="">
                        <div v-if="msgdata.resobj[index+1]"  class="or_name">{{msgdata.resobj[index+1].username|isnumber}}</div>
                        <div v-else  class="or_name">待邀请</div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="msgdata.count">
            <div class="appbtn" @click="goshree">邀请好友参团</div>
            <div class='xiatext' style="color:#9B9B9B;">分享3个群后，成功率高达90%哦</div>
        </div>
        <div v-else>
            <div class="appbtn" @click="goorder">查看订单</div>
        </div>

        <!-- //拼团弹窗 -->
        <div class="zhezhao" v-if="showtan"></div>
        <div class="sharpmore" v-if="showtan">
            <div class="sharptext">多分享几次，成团更轻松哦</div>
            <div class="sharpbtn" >再分享给好友</div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            okone:false,
            msgdata: '',
            allping: '', //拼团一共需要多少人
            days: '',
            tiomeout: null,
            hours: '00',
            minutes: '00',
            seconds: '00',
            showshare: [false, true], //分享控制
            showtan: false //分享后的第二个弹窗
        }
    },
    created() {
      // console.log(JSON.stringify(api.pageParam))
        if (window.api) {
             setTimeout(function() {
                api.closeWin({
                  name: 'ordercomfirm'
                });
                var js = 'location.reload();';
                api.execScript({
                    name: 'groupbuy',
                    script: js
                });
            }, 1000)
            // 阻止首页弹动
            api.setWinAttr({
                bounces: false
            });
        }
    },
    mounted() {
        headTitle($api.byId('header_container'), '拼团成功')
        this.getMsg()
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
    methods: {
        getMsg() {
          console.log(pageParam('ogid'))
              var that = this
                https({
                    url: siteUrl + '/Marketing/Groupbuy/GetMyGroupbuyDetails',
                    data: {
                        // uid: '181029114526689315',
                        // ogid:'20181030134820886662'
                        uid:getname(),
                        ogid:pageParam('ogid')
                    },
                    headers: 1,
                    successBack: function(ret){
                        console.log($api.jsonToStr(ret))
                        if (ret.status == 1 && ret.success) {
                            clearInterval(that.tiomeout);
                            //有几个人需要参团
                            let allping = []
                            var num = ret.Data[0].gbcount
                            if (ret.Data[0].resobj.length > ret.Data[0].gbcount) {
                              num = ret.Data[0].resobj.length
                            }
                            for (var i = 0; i < (num - 1); i++) {
                                allping.push(1)
                            }
                            let remaintime = ''
                            let groudtimes = ''
                            remaintime = ret.Data[0].ts - ret.Data[0].resobj[0].tpgap;
                            console.log(remaintime)
                                //倒计时
                            if (remaintime > 0) {
                                groudtimes = function() {
                                    if (remaintime <= 0) {
                                        clearInterval(that.tiomeout);
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
                                that.tiomeout = setInterval(groudtimes, 1000)
                            } else {
                                clearInterval(that.tiomeout);
                            }
                                that.msgdata=ret.Data[0],
                                that.allping=allping
                                that.okone=true
                        } else {
                            promptMsg(ret.err)
                        }
                    }
                })
            },
            checkTime: function (i) { //将0-9的数字前面加上0，例1变为01
                if (i < 10) {
                  i = "0" + i;
                }
                return i;
              },
          goshree(){
            var that=this
            console.log(JSON.stringify(that.msgdata))
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
                    types:'paysuceess',
                    orderid: that.msgdata.orderid
                },
                bounces: false,
                bgColor: 'rgba(0,0,0,0)'
            });
          },
          goorder(){
            var that=this
            openWin({
                name: 'orderdetail',
                url: './orderdetail.html',
                pageParam: {
                    title: '订单详情',
                    orderid: that.msgdata.orderid
                },
                bgColor:'#fff'
            }, 1);

          }
    }
}
</script>
<style lang="scss">
#header {
    text-align: center;
    background-color: #fff;
    color: #fff;
    width: 100%;
    height: 48px;
    position: relative;
}
.commoneheaderleft img, .commoneheaderright img {
    height: 20px;
    width: 20px;
    display: block;
}
.commoneheaditem {
    display: flex;
    align-items: center;
    justify-content: center;
}
.commoneheaderleft {
    height: 45px;
    position: absolute;
    left: 3%;
}
.commoneheadermain {
    height: 45px;
    font-size: 17px;
}
#title {
    line-height: 30px;
    text-align: center;
    color:#427161; 
}
.items{
  display: flex;
  align-items: center;
}
.canyu{
  font-size: rems(24);
  text-align: center;
  color: #999;
  position: relative;
}
.or_name{
  overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical;
  width:  rems(150);
  height:  rems(36);
  line-height:  rems(36);
}
.tuanzhang{
  position: absolute;
  bottom: rems(44);
  left: 0;
  right: 0;
}
.tuanzhang div{
   color: #fff;
  background:linear-gradient(270deg,rgba(232,55,74,1) 0%,rgba(253,94,67,1) 100%);
  font-size: rems(20);
  border-radius: 30px;
  width: 75%;
  margin: 0 auto;
}
.xiabox{
  justify-content: space-around;
  width: 50%;
  margin:rems(100) auto;
}
.canyu img{
  width: rems(96);
  height: rems(96);
  border-radius: 50%;
  margin: 0 auto;
  margin-bottom:rems(20);
}
.gp1{
  font-size: rems(36);
//   font-weight: 700;
  color: #333;
  padding: 0 0 rems(20) 0;
  text-align: center;
  margin-top:  rems(104);
}
.gp2{
//    font-weight: 700;
  color: #333;
  font-size:  rems(36);
  text-align: center;
  margin-bottom:  rems(44);
  margin-top:  rems(36);
}
.gpbox{
  padding: rems(60) 0;
}
.numone{
  color: #EB6100;
  font-weight:600;
  padding: 0  rems(10);
  font-size:  rems(48)
}
.wxbtn{
  width: 90%;
}
.xiatext{
  color: #333;
  font-size:  rems(24);
  margin-top:  rems(30);
  text-align: center;
}

.sharpmore{
  position: fixed;
  top:30%;
  width: 80%;
  border-radius: 16px;
  left: 10%;
  z-index: 999999;
  background: #fff;
text-align: center;
font-size:  rems(36);
font-weight: 700;
}
.sharpbtn{
  background:linear-gradient(270deg,rgba(232,55,74,1) 0%,rgba(253,94,67,1) 100%);
  color:#fff;
  width: 80%;
  border-radius: 38px;
  margin: 0 auto;
  font-size: rems(28);
  padding: rems(20) 0;
  margin-bottom:  rems(40)
}
.sharptext{
  margin: rems(118) 0  rems(100) 0;
}
.apings{
  text-align: center;
  font-size:  rems(34);
  font-weight: 700;
  margin-top:  rems(200);
}
.appbtn{
  width: 80%;
  margin: 0 auto;
  font-size: rems(32);
  color:#fff;
  background-color: #ff5541;
  text-align: center;
  padding: rems(19) 0;
  border-radius: rems(80);
}

</style>