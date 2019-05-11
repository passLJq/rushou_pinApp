<template>
  <div>
    <div class="box">
      <div class="msitem out" @click='gosection(1, "我的订单")'>
        <div class="msitem">
          <div class="img_box">
            <img src='../../img/mes1.png'>
            <div class="icon_corner" v-if="data[0]&&data[0].myorderurcount > 0">{{data[0]&&data[0].myorderurcount < 100 ? data[0].myorderurcount : 99 }}</div>
            </div>
            <div class="titles">
              <div>我的订单</div>
              <div>{{data[0].myorder}}</div>
            </div>
        </div>
        <i class="right-arrow"></i>
      </div>
      <div class="msitem out" @click='gosection(4, "销售订单")'>
        <div class="msitem">
          <div class="img_box">
            <img src='../../img/mes4.png'>
            <div class="icon_corner" v-if="data[0]&&data[0].mysaleorderurcount > 0">{{data[0]&&data[0].mysaleorderurcount < 100 ? data[0].mysaleorderurcount : 99 }}</div>
            </div>
            <div class="titles">
              <div>销售订单</div>
              <div>{{data[0].mysaleorder}}</div>
            </div>
        </div>
        <i class="right-arrow"></i>
      </div>
      <div class="msitem out" @click='gosection(5, "分销订单")'>
        <div class="msitem">
          <div class="img_box">
            <img src='../../img/mes5.png'>
            <div class="icon_corner" v-if="data[0]&&data[0].myfxorderurcount > 0">{{data[0]&&data[0].myfxorderurcount < 100 ? data[0].myfxorderurcount : 99 }}</div>
            </div>
            <div class="titles">
              <div>分销订单</div>
              <div>{{data[0].myfxorder}}</div>
            </div>
        </div>
        <i class="right-arrow"></i>
      </div>
      <div class="msitem out" @click='gosection(2, "我的资产")'>
        <div class="msitem">
          <div class="img_box">
            <img src='../../img/mes2.png'>
            <div class="icon_corner" v-if="data[0]&&data[0].myassetsurcount > 0">{{data[0]&&data[0].myassetsurcount < 100 ? data[0].myassetsurcount : 99 }}</div>
            </div>
            <div class="titles">
              <div>我的资产</div>
              <div>{{data[0].myassets}}</div>
            </div>
        </div>
        <i class="right-arrow"></i>
      </div>
      <div class="msitem out" @click='gosection(3, "我的团队")'>
        <div class="msitem">
          <div class="img_box">
            <img src='../../img/mes3.png'>
            <div class="icon_corner" v-if="data[0]&&data[0].myteamurcount > 0">{{data[0]&&data[0].myteamurcount < 100 ? data[0].myteamurcount : 99 }}</div>
            </div>
            <div class="titles">
              <div>我的团队</div>
              <div>{{data[0].myteam}}</div>
            </div>
        </div>
        <i class="right-arrow"></i>
      </div>

      <div class="msitem out" @click='gosection(6, "系统消息")'>
        <div class="msitem">
          <div class="img_box">
            <img src='../../img/mes6.png'>
            <div class="icon_corner" v-if="data[0]&&data[0].mynoticeurcount > 0">{{data[0]&&data[0].mynoticeurcount < 100 ? data[0].mynoticeurcount : 99 }}</div>
            </div>
            <div class="titles">
              <div>系统消息</div>
              <div>{{data[0].mynotice}}</div>
            </div>
        </div>
        <i class="right-arrow"></i>
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
      data: ''
    }
  },
  watch:{
    
  },
  computed:{},
  methods: {
    bindData() {
      var that=this
      if (checkLoginStatus()) {
        https({
          url: siteUrl + 'Main/Member/GetMyFirstMessageList?devicetype=7',
          data: {
            uid: getname()
          },
          headers: 1,
          successBack: (ret) => {
            console.log(ret)
            if (ret.status == 1 && ret.success) {
              this.data = ret.Data
            }else {
              promptMsg(ret.err)
            }
          }
        })
      }
    },
    gosection (index, title) {
      openWin({
        name: 'messagelist_section',
        url: './messagelist_section.html',
        pageParam: {
          type: index,
          title
        },
        bgColor: '#f5f5f5'
      }, 1)
    },
  },
  created(){
    var that = this
    this.bindData()
    if (window.api) {
      api.addEventListener({
        name: 'viewappear'
      }, function(ret, err){
        that.bindData()
      });
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
  .msitem{display: flex;align-items: center}
  .msitem img{width: rems(96);height: rems(96);margin-right: rems(30);flex-shrink: 0}
  .box{background-color: #fff;}
  .out{justify-content: space-between;background: #fff;padding: rems(20) 0;margin: 0 rems(30);border-bottom: 1px solid #F6F6FA}
  .titles div:nth-child(1){font-size: rems(34);color: #333}
  .titles div:nth-child(2){font-size: rems(28);color: #999;margin-top: rems(10);overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical}

  .img_box{position: relative;width: rems(96);height: rems(96);display: flex;margin-right: rems(15);}
  .icon_corner{position: absolute; top: 0; right: rems(-10); width:22px;height:14px;background:rgba(255,85,65,1);border-radius:7px; font-size: 12px; text-align: center; line-height: 14px; color: #fff; box-sizing: border-box;}
  .right-arrow {
    display :inline-block;
    position: relative;
    width: rems(28);
    height: rems(36);
    color: #999999
  }

  .right-arrow::after {
    display: inline-block;
    content: " ";
    height: rems(18);
    width: rems(18);
    border-width: rems(3) rems(3) 0 0;
    border-color: #999999;
    border-style: solid;
    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    position: absolute;
    top: 50%;
    right: rems(6);
    margin-top: rems(-9);
  }
</style>