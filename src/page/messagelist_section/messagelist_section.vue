<template>
  <div>
    <div class="iitem" v-for="(item, index) in listdata" @click='goother(index)' :key="index">
      <div class="time">
        <span>{{item.createtime}}</span>
      </div>
      <div class="obox">
        <div class="p1">{{item.contentjson.title||item.title}}
          <span v-if="type==1" class="ap">{{item.contentjson.order_type}}</span>
          <span v-if="type==4||type==5" class="ap">{{item.contentjson.user_name}}</span>
          <div class="readstate" style="margin: 0;" v-if="!item.isread && (type === '2' || type === '3' || type === '6')"><span>未读</span></div>
        </div>
        <div class="p2 itemse" v-if="type==4||type==1||type==5">
          <img v-lazy="item.contentjson.pro_pic">
          <div class="mestime">
            <div class="line_over_2">{{item.contentjson.pro_name}}</div>
            <div class="clear s12">
              <div class="fl" style="margin: 0;">共{{item.contentjson.pro_count}}件</div>
              <div class="fr readstate" style="margin: 0;" v-if="!item.isread && (type === '1' || type === '4' || type === '5')"><span>未读</span></div>
            </div>
          </div>
        </div>
        <div class="p2 itemse" v-else>
          <div class="fs28">
            {{item.contentjson.content||item.content}}
            <div v-if="type==3" class='aps'>
              <div>昵称: {{item.contentjson.name}}</div>
              <div>微信: {{item.contentjson.wxnum}}</div>
              <div>手机号: {{item.contentjson.phone}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="nomores" v-if="stops">
      <div v-if="listdata.length>0">
        没有记录了
      </div>
      <div v-else>
        <div class="nodata">
          <img src="../../img/nodata.png">
          <div>抱歉，目前没有显示记录~</div>
        </div>
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
      currentPage:1,
      listdata:[],
      stops:false,
      type: pageParam('type')
    }
  },
  watch:{
    
  },
  computed:{},
  methods: {
    bindData () {
      var that = this
      https({
        url: siteUrl + 'Main/Member/GetMyMessageList?devicetype=7',
        data: {
          uid: getname(),
          currentPage: this.currentPage,
          pageSize: 8,
          type: 0,
          itemcode: pageParam('type')
        },
        headers: 1,
        successBack: (ret) => {
          console.log(ret)
          if (ret.status == 1 && ret.success) {
            if (this.currentPage==1){
              this.listdata = []
            }
            this.listdata = that.listdata.concat(ret.Data)
          } else if (ret.status == 2 && ret.success){
            this.stops = true
          } else {
            promptMsg(ret.err)
          }
        }
      })
    },
    goother:function(indes){
      var that=this
      
      https({
        url: siteUrl + 'Main/Member/UpdateMessage?devicetype=7&uid=' + getname(),
        method: "post",
        data: {
          uid: getname(),
          msgid: that.listdata[indes].msgid
        },
        headers: 1,
        successBack: (ret) => {
          console.log(ret)
          if (ret && ret.success && ret.status === 1) {
            this.listdata[indes].isread = true
          }
          if (pageParam('type') == '1') {
            openWin({
              name: 'orderdetail',
              url: './orderdetail.html',
              pageParam: {
                orderid: that.listdata[indes].contentjson.order_id,
              }
            })
          } else if (pageParam('type') == '4') {
            openWin({
              name: 'fxordersdetail',
              url: './fxordersdetail.html',
              pageParam: {
                orderid: that.listdata[indes].contentjson.order_id,
              }
            })
          }
        },
        errorBack: (err)=> {
          if (pageParam('type') == '1') {
            openWin({
              name: 'orderdetail',
              url: './orderdetail.html',
              pageParam: {
                orderid: that.listdata[indes].contentjson.order_id,
              }
            })
          } else if (pageParam('type') == '4') {
            openWin({
              name: 'fxordersdetail',
              url: './fxordersdetail.html',
              pageParam: {
                orderid: that.listdata[indes].contentjson.order_id,
              }
            })
          }
        }
      })

    },
  },
  created(){
    var that=this
    this.bindData()

    if (window.api) {
      api.addEventListener({
        name: 'scrollBottom'
      }, function(ret, err){
        if (!that.stops){
          that.currentPage++
          that.bindData()
        }
      })
    }

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
  body {
    background-color: #f5f5f5;
  }
  .fs28 {
    font-size: rems(28);
  }
  .s12 {
    width: 100%; height: rems(34); line-height: rems(34);
  }
  .iitem {
    display: flex;
    flex-direction: column;
  }
  .obox{width: 90%;margin: 0 auto;padding: 0 rems(16);background: #fff;border-radius: rem(8)}
  .p1{font-size:rems(28);
  font-family:PingFangSC-Semibold;
  font-weight:600;line-height:rem(20);border-bottom: rem(1) solid #F6F6FA;padding: rems(20) 0;
  display: flex;align-items: center;justify-content: space-between}
  .ap{overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical;font-size: rems(22);font-weight: 300;width: 24%;flex-shrink: 0;text-align: right}
  .itemse{display: flex;align-items: center}
  .p2{padding: rems(20) 0;}
  .p2 img{width: rems(144);height: rems(144);margin-right: rems(16);flex-shrink: 0}
  .mestime div:nth-child(1){font-size: rems(28);}
  .mestime div:nth-child(2){font-size: rems(24);color: #999;margin-top: rems(46)}
  .time{text-align: center;color: #fff;margin: rems(30) 0;display: flex;justify-content: center;}
  .time span{background:rgba(216,216,216,1);
  border-radius:rem(4);font-size: rems(24);padding: rems(16) rems(20);}
  .nomores{margin: rems(20) 0;font-size: rems(26);text-align: center;color: #999}
  .aps div{font-size: rems(24);color: #999}
  .readstate:before{content: ""; display: inline-block; width:rem(8); height:rem(8); background:rgba(255,66,44,1); border-radius: 50%; margin-right: rem(5);}
  .line_over_2{overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;}
  .clear:after{content: ""; display: block; clear: both;}
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
</style>