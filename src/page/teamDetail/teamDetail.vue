<template>
  <div>
    <div class="usr">
      <img :src="msg.shoplogo || '/img/man.jpg'" alt="">
      <div class="usmsg">
        <p>{{msg.username}} <span>{{msg && (msg.shoptype === 1 ? '正式店主' : msg.shoptype === 2 ? '实习店主' : msg.shoptype === 3 ? '冻结店主' : '')}}</span></p>
        <p>邀请码: {{msg.code}}</p>
        <p>手机号: {{msg.phone}}</p>
      </div>
    </div>
    <div class="msgItem">
      <div>
        <p>店铺名称</p>
        <p>{{msg.shopname}}</p>
      </div>
    </div>
    <div class="msgItem">
      <div>
        <p>店铺等级</p>
        <p>{{msg.shoplevel}}</p>
      </div>
    </div>
    <div class="msgItem">
      <div>
        <p>会员职称</p>
        <p>{{msg.shoptitlename}}</p>
      </div>
    </div>
    <div class="msgItem" v-if="msg.openshoptype == 0 || msg.openshoptype == 2 || msg.openshoptype == 4">
      <div>
        <p>开店方式</p>
        <p>{{msg.openshoptype == 0 ? '礼包开店' : msg.openshoptype == 2 ? '销售开店' :  msg.openshoptype == 4 ? '邀请开店' : ''}}</p>
      </div>
    </div>
    <div class="msgItem">
      <div>
        <p>销售额</p>
        <p>{{msg.saletotal}}</p>
      </div>
    </div>
    <div class="msgItem">
      <div>
        <p>他的分享</p>
        <p>{{msg.fannum}}</p>
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
      msg: ''
    }
  },
  watch:{
    
  },
  computed:{

  },
  methods: {

  },
  created(){
    this.msg = JSON.parse(pageParam('msg'))
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
  .usr {
    width: 100%;
    padding: rems(42) rems(30) rems(34);
    display: flex;

    img {
      width: rems(144);
      height: rems(144);
      border-radius: 50%;
      margin-right: rems(15);
    }
    .usmsg {
      display: flex;
      flex-direction: column;
      p {
        font-size: rems(34);
        color: #333;
        display: flex;
        align-items: center;
        span {
          font-size: rems(20);
          line-height: rems(32);
          background:linear-gradient(270deg, rgba(232, 55, 74, 1) 0%, rgba(253, 94, 67, 1) 100%);
          color: #fff;
          border-radius: rems(30);
          padding: 0 rems(8);
          margin-left: rems(15);
        }
      }
      p:nth-child(2), p:nth-child(3) {
        font-size: rems(28);
        color: #999;
        margin-top: rems(10);
      }
    }
  }
  .msgItem {
    width: 100%;
    padding: 0 rems(30);
    div {
      width: 100%;
      border-top: rems(2) solid #f6f6fa;
      height: rems(96);
      display: flex;
      justify-content: space-between;
      align-items: center;
      p {
        font-size: rems(28);
        color: #333;
      }
      p:nth-child(1) {
        color: #999;
      }
    }
  }
</style>