<template>
  <!--pages/other/logisticsdetail/logisticsdetail.wxml-->
  <div>
    <div class="logistics_top_container tops padding24">
      <p>
        <span class="logistics_left_container color_999">订单编号</span>
        <span>{{orderid}}</span>
      </p>
      <p>
        <span class="logistics_left_container color_999">国内承运人</span>
        <span>{{deliverydata.companyname}}</span>
      </p>
    </div>

    <div class="logistics_top_container padding24">
      <div style="border-bottom: 1px solid #F8F8FB;" class="overflow_boxsizing">
        <span class="logistics_left_container color_999">物流跟踪</span>
        <span>{{deliverydata.trackno}}</span>
      </div>
    </div>

    <div class=" overflow_boxsizing pd" v-if="expressjson && expressjson.result && expressjson.result.list.length > 0" v-for="(item, index) in expressjson.result.list" :key="index">
      <div class="flex flex_pack_justify_between list_container">
        <div class="flex flex_v">
          <div class="arc_container flex flex_align_center flex_pack_center" :class="{isNOFirst: index != 0 ? true : false}">
            <span class="arc_icon"></span>
          </div>
          <div class="flex flex_pack_center flex_1 ff">
            <span style="height: 100%; width: 1px; background-color: #F7F7FA;"></span>
          </div>
        </div>
        <div class="flex_1 flex flex_v flex_pack_justify_between">
          <span :style="{color: index != 0 ? '#999' : '#333'}">{{item.status}}</span>
          <span class="color_999 font_12 mt10">{{item.time}}</span>
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
      orderid: '',
      deliverydata: "",   //物流总信息
      expressjson: "",    //物流详细
    }
  },
  watch:{
    
  },
  computed:{},
  methods: {
    
  },
  created(){
    this.orderid = pageParam('orderid')
    https({
      url: siteUrl + 'Main/Member/GetOrderListJson',
      data: {
        currpage: 1,
        pagesize: 1,
        uid: getname(),
        orderid: pageParam('orderid')
      },
      headers: 1,
      successBack: (ret) => {
        if (ret && ret.success && ret.status == 1) {
          this.deliverydata = ret.Data[0].deliverydata,
          this.expressjson = (ret.Data[0].deliverydata && ret.Data[0].deliverydata.expressjson) ? JSON.parse(ret.Data[0].deliverydata.expressjson) : ""
        }
      }
    })
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
  body{background-color: #F6F6FA; font-size: rems(28); color: #333;}
  body>div>div{background-color: #fff;}
  .overflow_boxsizing{overflow: hidden; box-sizing: border-box;}
  .mt10 {
    margin-top: rems(10);
  }
  .pd {
    padding: rems(40) rems(48);
  }
  .ff {
    height: 100%;width:rems(44);margin-right: rems(42);
  }
  .color_999 {
    color: #999 !important;
  }
  .padding24{padding: 0 rems(48);}
  .logistics_top_container{line-height: rems(94); margin-top: rems(22);}
  .tops {
    line-height: rems(60);
  }
  .logistics_left_container{padding-right: rems(28);}
  .arc_container{box-sizing: border-box;border-radius: 50%;width:rems(44);height:rems(44);border: rems(4) solid rgba(255,85,65,0.5);margin-right: rems(42);}
  .arc_icon{display: block;width: rems(28); height: rems(28);border-radius: 50%; background-color: rgba(255,85,65,0.5);box-sizing: border-box;}
  .isNOFirst{border-color: transparent;}
  .isNOFirst>span{background-color: #D8D8D8;}
  .list_container{width: 100%; box-sizing: border-box;}
  .flex {display: flex;}
  .flex_v {flex-direction: column; }
  .flex_1 {flex: 1;}
  .flex_align_center {align-items: center;}
  .flex_pack_center {justify-content: center;}
  .flex_pack_right {justify-content: flex-end;}
  .flex_pack_justify_between {justify-content: space-between;} 
  .flex_pack_justify_around {justify-content: space-around;}
</style>