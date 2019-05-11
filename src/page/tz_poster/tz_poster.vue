<template>
  <div>
    <!-- <img class="poster" src="https://images.rushouvip.cn/IMG/rsphb.jpg">
    <img class="erwe" :src="erweima"> -->
    <van-swipe :autoplay="0" :show-indicators="false" @change="onChange">
      <van-swipe-item>
        <img class="poster" src="https://images.rushouvip.cn/IMG/rsphb.jpg">
        <img class="erwe" :src="erweima">
      </van-swipe-item>
      <van-swipe-item>
        <img class="poster" src="https://images.rushouvip.cn/IMG/rsphb3.jpg">
        <img class="erwe" :src="erweima">
      </van-swipe-item>
    </van-swipe>
    <div class="dot">
      <div v-for="item in [0,1]" :key="item" :class="{active: item == currentPic ? true : false}"></div>
    </div>
    <div class="foot">
      <div @click="show">分享好友</div>
    </div>
  </div>
</template>

<script>
export default {
  components:{},
  props:{},
  data(){
    return {
      erweima: '',
      currentPic: 0,      // 当前轮播索引值
    }
  },
  watch:{
    
  },
  computed:{

  },
  methods:{
    show() {
      var that = this
      if (window.api) {
        api.openFrame({
          name: 'marketing_shaerdiv',
          url: '/marketing_shaerdiv.html',
          rect: {
              x: 0,
              y: 0,
              w: 'auto',
              h: 'auto'
          },
          pageParam: {
              way: 'tz',
              currentPic: that.currentPic
          },
          bounces: false,
          bgColor: 'rgba(0,0,0,0)'
        })
      } else {
        openWin({
          name: 'marketing_shaerdiv',
          url: './marketing_shaerdiv.html',
          pageParam: {
            way: 'tz',
            currentPic: that.currentPic
          }
        })
      }
    },
    onChange(index) {
      this.currentPic = index
    }
  },
  created(){
    // this.erweima = siteUrl + '/Main/WechatApi/GetWxacodeun?scene=' + getname() + '&page=pages/index/index&width=430'
    this.erweima = 'https://w.rushouvip.cn/api/Main/WechatApi/GetWxacodeun?scene=' + getname() + '&page=pages/index/index&width=430'
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
  .poster {
    width: rems(580);
    display: block;
    margin: rems(15) auto 0;
  }
  .erwe {
    width: rems(160);
    height: rems(160);
    position: absolute;
    border-radius: 50%;
    left: 50%;
    transform: translateX(-50%);
    top: rems(830);
  }
  .foot {
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    height: rems(110);
    display: flex;
    justify-content: center;
    background: #fff;
    align-items: center;
  }
  .foot div {
    width: rems(690);
    height: rems(70);
    color: #fff;
    font-size: rems(28);
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
    background:linear-gradient(270deg,rgba(254,51,75,1) 0%,rgba(255,114,130,1) 100%);
    border-radius: rems(35);
  }
  .dot {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: rems(20);
    div {
      width: rems(12);
      height: rems(12);
      border-radius: 50%;
      background-color: rgba(153,153,153,.5);
      margin: 0 rems(6);
      transition: all .2s ease-in-out;
      &.active {
        width:rems(28);
        height:rems(12);
        background:rgba(255,85,65,0.5);
        border-radius:rems(8);
      }
    }
  }
</style>