<template>
  <div>
    <div v-if="unGet.length>0" style="margin-top:20px;">
      <section class="couponbox" v-for="(item,index) in unGet" :key="item.couponid">
        <div class="coupon_left">
          <p class="left_p1"><span>&yen;</span>{{item.facevalue}}</p>
          <p class="left_p2">满{{item.uselimit}}可用</p>
        </div>
        <div class="coupon_main">
          <p class="mp1"><span>{{item.companyname}}</span>{{item.name}}</p>
          <p class="mp2">{{item.couponalias}}</p>
          <p class="mp3">{{item.time}}</p>
        </div>
        <div class="coupon_right" @click="lin(item.couponid,index)">
          立即领取
        </div>
      </section>  
    </div>
    <div v-else>
      <div class="nodata" style="margin-top:50px">
          <img src="../../img/couponNoData1.png" alt="" style="width:30%">   
          <p>暂时没有可领取优惠券~</p>     
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
      hasGet:[],
      unGet:[]
    }
  },
  watch:{
    
  },
  computed:{},
  methods: {
    bindata(){
      var that=this
      this.hasGet=[]
      this.unGet=[]
      https({
        url: siteUrl + 'Marketing/Coupon/GetGBCouponListJson',
        data: {
          uid: getname(),
          ispaltform: '0',
          comid: ''
        },
        successBack: that.couponBack
      })
      https({
        url: siteUrl + 'Marketing/Coupon/GetGBCouponListJson',
        data: {
          uid: getname(),
          ispaltform: '1',
          comid: ''
        },
        successBack: that.couponBack
      })
    },
    couponBack(ret){
      		let data = []
		if (ret.success && ret.status == 1) {
			if (ret.Data.length) {
				data = ret.Data
			}
		} else {
       promptMsg(ret.err);
		}
		if (data.length) {
			var hasGet = this.hasGet || []
			var unGet = this.unGet || []
			data.forEach(item => {
				item.time = this.getTime(item.starttime, item.endtime)
				item.state = this.getState(item.endtime)  // 1 即将过期 2 已过期  0 正常
				// isover 表示总数领取完了 或领取次数剩余0了 就加入已领取列表
				if (!item.isover && (item.eachamount - item.getnum) > 0 && item.couponType != 2 && item.couponType != 3) {
					if (item.getnum > 0) {
						for (let k = 0; k < item.getnum; k++) {
							hasGet.push(item)
						}
					}
					unGet.push(item)
				} else {
					if (item.getnum > 1) {
						// 获取的数量大于1则遍历
						for (let i = 0; i < item.getnum; i++) {
							hasGet.push(item)
						}
					} else {
						hasGet.push(item)
					}
				}
			})
			if (!hasGet.length) hasGet = ''
      if (!unGet.length) unGet = ''
      this.hasGet=hasGet
      this.unGet=unGet
		}
    },
    lin(couponid,index){
      var that=this
      if (checkLoginStatus()) {
        showLoading()
        https({
          url: siteUrl + 'Marketing/Coupon/ReceiveCoupon?devicetype=7',
          data: {
            uid: getname(),
            couponid: couponid
          },
          headers: 1,
          successBack: (ret) => {
            if(ret.status==1&&ret.success){
              let unGet = this.unGet || []
              let hasGet = this.hasGet || []
              let data = unGet[index]
              data.getnum += 1
              if ((data.eachamount - data.getnum) <= 0) {
                unGet.splice(index, 1)
              } else {
                unGet[index] = data
              }
              hasGet.push(data)
              that.hasGet=hasGet
              that.unGet=that.unGet
              alert("领取成功")
            }else{
              promptMsg(ret.err)
              that.bindata()
            }
            hideLoading()
          }
        })
      }
    },
    // 获取时间格式
    getTime(t1, t2) {
      var str1 = t1.split(' ')[0]
      var str2 = t2.split(' ')[0]
      var str3 = str1.split('.')
      var str4 = str2.split('.')
      var str5 = str3[0] + '年' + str3[1] + '月' + str3[2] + '日' + '-' + str4[0] + '年' + str4[1] + '月' + str4[2] + '日'
      return str5
    },
    getState(time) {
      var t1 = Date.now()
      var t2 = Date.parse(new Date(time))
      // console.log(time)
      var t3 = t2 - t1
      if (t3 > 0 && t3 <= 432000000) {
        return 1
      } else if (t3 <= 0) {
        return 2
      }
      return 0
    },
  },
  created(){
    
  },
  mounted(){
    this.bindata()
  }
}
</script>
<style lang="scss">
body{
  background: #f8f8f8;
}
.couponbox{
  @include item;
  margin: 0 rems(20);
  margin-bottom: rems(20);
  box-shadow:0px 2px 20px 0px rgba(216,216,216,0.3);
  border-radius:8px;
  overflow: hidden;
  background: #fff;
  .coupon_left{
    flex-shrink: 0;
    color: #fff;
    background:linear-gradient(270deg,rgba(254,51,75,1) 0%,rgba(255,114,130,1) 100%);
    text-align: center;
    padding: rems(34) rems(32);
    min-width: rems(90);
    .left_p1{
      span{
        font-size: rems(28);
      }
      font-size: rems(48)
    }
    .left_p2{
        font-size: rems(24);
    }
  }

  .coupon_main{
    font-size: rems(24);
    margin-left: rems(20);
    width: 100%;
    .mp1{
      @include font1;
      span{
        background:rgba(255,85,65,0.2);
        color: #FF5541;
        padding: rems(4) rems(10);
        border-radius: 30px;
        font-weight: 500;
        margin-right: rems(16)
      }
      color: #333;
      font-weight: 700;
      margin-bottom: rems(22);
    }
    .mp2{
            @include font1;
      font-size: rems(24);
      color: #333;
      margin-bottom: rems(10);
    }
    .mp3{
            @include font1;
      font-size: rems(20);
      color: #999;
    }
  }
  .coupon_right{
    flex-shrink: 0;
    background:linear-gradient(270deg,rgba(254,51,75,1) 0%,rgba(255,114,130,1) 100%);
    border-radius:16px;
    color: #fff;
    font-size: rems(20);
    padding: rems(0) rems(20);
    margin-right: rems(20);
  }
}
  
</style>