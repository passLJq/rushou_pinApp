<template>
  <div>
    <div id="main" style="width: 100%;background: #FE334B;"></div>
    <div class="back" onclick="closeWin()">
      <img src="../../img/icon-back.png" alt="">
    </div>
    <img style="width: 100%;" src="https://images.rushouvip.cn/IMG/zm_head.png" alt="">
    <div class="priv">
      <div class="tit">
        <div class="d1"></div>
        <div class="d2"></div>
        <div class="d3"></div>
        <span>团长特权</span>
        <div class="d3"></div>
        <div class="d2"></div>
        <div class="d1"></div>
      </div>
    </div>
    <img class="img" src="https://images.rushouvip.cn/IMG/tztq.png">
    <div class="priv">
      <div class="tit">
        <div class="d1"></div>
        <div class="d2"></div>
        <div class="d3"></div>
        <span>关于入手拼</span>
        <div class="d3"></div>
        <div class="d2"></div>
        <div class="d1"></div>
      </div>
    </div>
    <img class="img" src="https://images.rushouvip.cn/IMG/gyrsp.png">

    <img style="width: 100%;" src="https://images.rushouvip.cn/IMG/ftlc.png">

    <div class="priv">
      <div class="tit">
        <div class="d1"></div>
        <div class="d2"></div>
        <div class="d3"></div>
        <span>团长报名流程</span>
        <div class="d3"></div>
        <div class="d2"></div>
        <div class="d1"></div>
      </div>
    </div>

    <div class="baom">
      <img src="https://images.rushouvip.cn/IMG/rspewm.jpg">
      <span>扫码加金牌团长咨询参团</span>
    </div>
  </div>
</template>

<script>
export default {
  components:{},
  props:{},
  data(){
    return {
      
    }
  },
  watch:{
    
  },
  computed:{},
  methods: {
    
  },
  created(){
    
  },
  mounted(){
    var s = getname('statustop') || 0
    $api.byId('main').style.height = s + 'px'
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
    background: #FF495A;
  }
  .back {
    position: fixed;
    top: rems(40);
    left: rems(30);
    color: #333;
    font-size: rems(32);
    width: rems(50);
    height: rems(50);
    background-color: rgba(255, 255, 255, .6);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    img {
      width: 70%;
      display: block;
    }
  }
  .priv {
    width: 100%;
    padding: rems(22) rems(30);
  }

  .priv .tit {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .priv .tit div {
    background:#fff;
    border-radius: 50%;
    margin-left: rems(14);
  }

  .priv .tit .d1 {
    width: rems(4);
    height: rems(4);
  }
  .priv .tit .d2 {
    width: rems(8);
    height: rems(8);
  }
  .priv .tit .d3 {
    width: rems(12);
    height: rems(12);
  }

  .priv .tit span {
    margin-left: rems(14);
    color: #fff;
    font-weight: 600;
    font-size: rems(34);
  }

  .img {
    width: rems(690);
    margin: 0 auto; 
    border-radius: rems(16);
    box-shadow:rems(0) rems(2) rems(20) rems(0) rgba(153,153,153,0.15);
    display: block;
  }

  .baom {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: rems(20) 0 rems(65) 0;
  }

  .baom img{
    width:rems(360);
    height:rems(360);
  }

  .baom span {
    font-size:rems(28);
    color:rgba(255,255,255,1);
    margin: rems(20) 0;
  }
</style>