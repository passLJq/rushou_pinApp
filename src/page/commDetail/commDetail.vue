<template>
  <div id="main">
    <div class="head">
      <div class="top">
        <div>
          <p>总收益(元)</p>
          <p>{{userMsg.totalCommision || '0.00'}}</p>
          <p>昨日收益<span>+{{userMsg.yesterdaycommision || '0.00'}}</span></p>
        </div>
        <span class="btn" @click="goapps">我要提现</span>
      </div>
      <div class="bot">
        <div>
          <p>今日收益</p>
          <p>{{userMsg.todaycommision || '0.00'}}</p>
        </div>
        <div>
          <p>本周收益</p>
          <p>{{userMsg.weekCommision || '0.00'}}</p>
        </div>
        <div>
          <p>本月收益</p>
          <p>{{userMsg.monthCommision || '0.00'}}</p>
        </div>
      </div>
    </div>
    
    <div id="container"></div>
    <div class="shouyi">
      <div class="title">每月收益明细</div>
      <div v-for="(itm, i) in yearMsg">
        <div class="item" v-for="(item, index) in itm.monthdata" @click="goSection(i, index)">
          <p>{{item.month}}</p>
          <p>￥{{item.commision}}<span class="iconfont icon-right"></span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Highcharts from 'highcharts';
export default {
  components:{},
  props:{},
  data(){
    return {
      userMsg: '',
      yearMsg: '',      // 每月收益明细
      seven: '',        // 七天收益明细
    }
  },
  watch:{
    
  },
  filters: {
    toFixed(val) {
      return Number(val).toFixed(2)
    }
  },
  computed:{},
  methods: {
    goapps(){
      if(this.userMsg.isintern=='1'){
        promptMsg('实习团长不能提现')
        return
      }else{
        checkuser(function(){
          https({
            url:siteUrl +'Main/MemberPay/CheckPayPwd',
            method:'get',
            data:{
              uid:getname(),
              devicetype:7
            },
            headers:1,
            successBack:function(ret){
              if(ret.success&&ret.status==1){
                if(ret.Data.issetpwd=='N'){
                  OpenWebPage(ret.Data.url,'密码设置')
                }else if(ret.Data.issetpwd=='Y'){
                  openWin({
                    name:'xl_tixian',
                    url:'./xl_tixian.html',
                    pageParam:{
                      title:'提现'
                    }
                  },1)
                }
              }else{
                promptMsg(ret.err)
              }
            }
          })
        })  
      }
    },
    bindData() {
      console.log(JSON.stringify(this.seven))
      var x = []
      var y = []
      var myDate = new Date(); //获取今天日期
      myDate.setDate(myDate.getDate() - 6)
      var dateTemp
      for (var i = 0; i < 7; i++) {
        var month=myDate.getMonth()+1
        var dat=myDate.getDate()
        dateTemp = (month <10?'0'+month:''+month)+"-"+(dat<10?'0'+dat:''+dat)
        x.push(dateTemp)
        myDate.setDate(myDate.getDate() + 1)
      }
      x.forEach((item,index) => {
        y.push(parseFloat(this.seven[item].toFixed(2)))
      })

      var yAxis = [{
            "title": {
              "text": ""
            },
            "index": 0,
            "visible": true,
            // "tickInterval": 50,
            "softMax": 50, //  柔和最大值    
            "min": 0, // 定义最小值 
            "labels": {
              "style": {
                "color": '#999'
              }
            }
          }]
      // 防止收益全部为0时表格只显示一条直线，美观
      let yIndex = 0
      for(let i=0;i<y.length;i++) {
        if (y[i] > yIndex) yIndex = y[i]
      }
      // 最大值为0就给个y轴最大显示值50
      if (yIndex == 0) yAxis[0].max = 50
      
      var options = {
        "xAxis": [
          {
            "type": "category",
            "categories": x,
            "index": 0,
            "isX": true,
            "gridLineColor": "#d8d8d8",
            "lineColor": "#d8d8d8",
            "minorGridLineColor": "#fff",
            "minorTickColor": "#fff",
            "tickColor": "#ff"
          }
        ],
        "series": [
          {
            "name": "收益",
            "data": y,
            "_colorIndex": 0,
            "_symbolIndex": 0,
            "yAxis": 0,
            "allowPointSelect": false,
            "animation": true,
            "enableMouseTracking": true,
            "stickyTracking": true,
            "visible": true,
            "crisp": true
          }
        ],
        "yAxis": yAxis,
        "chart": {
          "style": {
            "fontFamily": "\"微软雅黑\", Arial, Helvetica, sans-serif",
            "color": "#333",
            "fontSize": "10px",
            "fontWeight": "normal",
            "fontStyle": "normal"
          }
        },
        "title": {
          "text": "七日收益图",
          "x": 0,
          "style": {
            "fontFamily": "\"微软雅黑\", Arial, Helvetica, sans-serif",
            "color": "#333333",
            "fontSize": "18px",
            "fontWeight": "bold",
            "fontStyle": "normal",
            "fill": "#333333",
            "width": "874px"
          },
          "align": "left",
          "floating": false
        },
        "subtitle": {
          "text": "",
          "x": -20
        },
        "tooltip": {
          "valuePrefix": "￥"
        },
        "legend": {
          "layout": "vertical",
          "align": "right",
          "verticalAlign": "middle",
          "enabled": false
        },
        "plotOptions": {
          "series": {
            "animation": false
          }
        },
        "colors": [
          "#FE334B"
        ],
        "exporting": {
          "enabled": false
        },
        "navigation": {
          "buttonOptions": {
            "enabled": true
          }
        },
        "credits": {
          "enabled": false  //不显示LOGO
        }
      }
      var charts = Highcharts.chart('container', options)
    },
    goSection(i, index) {
      let years = this.yearMsg[i].year.substr(0, 4)
      let month = this.yearMsg[i].monthdata[index].month.substr(5, 1)
      openWin({
        name: 'myincomesection' + years + month,
        url: './myincomesection.html',
        pageParam: {
          title: years + '年' + month + '月收益',
          years,
          month
        },
        bgColor: '#f5f5f5'
      }, 1)
    }
  },
  created(){
    https({
      url: siteUrl + 'Main/Member/GetMemberJson',
      data: {
        uid: getname(),
        devicetype: 7
      },
      headers: 1,
      successBack: ret => {
        if (ret.status == 1 && ret.success) {
          this.userMsg = ret.Data
        } else {
          promptMsg(ret.err)
        }
      }
    })
    https({
      url: siteUrl + 'Main/Member/GetUserCommissionDetail',
      data: {
        uid: getname(),
        devicetype: 7
      },
      headers: 1,
      successBack: ret => {
        if (ret.status == 1 && ret.success) {
          this.yearMsg = ret.Data
        } else {
          promptMsg(ret.err)
        }
      }
    })
    https({
      url: siteUrl + 'Main/Member/GetUserSevenDaysCommission',
      data: {
        uid: getname(),
        yshopid: getname('SessionShopID'),
        devicetype: 7
      },
      headers: 1,
      successBack: ret => {
        if (ret.status == 1 && ret.success) {
          this.seven = ret.Data
          this.bindData()
        } else {
          promptMsg(ret.err)
        }
      }
    })
  },
  mounted(){
    // var s = getname('statustop') || 0
    // $api.byId('main').style.height = s + 'px'
    
  }
}
</script>
<style lang="scss">
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  @import "commDetail.scss";
</style>