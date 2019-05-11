<template>
  <div v-show="openusecou">
    <div class="zhizao"></div>
    <section class="usebox">
      <div class="box">
        <div class="toutitle">
          <p>可用优惠券</p>
          <div class="imgbox" @click="closebox">
            <img src="../../img/ordercomfirm/close_icon.png" alt>
          </div>
        </div>
        <div class="nouse">
          <img src="../../img/ordercomfirm/select.png" alt @click="okuser('nouse')">
          <p>不使用优惠券</p>
        </div>
        <div class="selectuse_box">
          <div class="boli" @click="qie(0)" :class="select[0]?'active':''">
            <p>可用优惠券
              <span v-if="useable.length>0">({{useable.length}})</span>
            </p>
          </div>
          <div class="boli" @click="qie(1)" :class="select[1]?'active':''">
            <p>不可用优惠券
              <span v-if="unuseable.length>0">({{unuseable.length}})</span>
            </p>
          </div>
          <div class="redlink" :style="{left:redleft}">
            <span></span>
          </div>
        </div>
      </div>
      <!-- 分割线 -->
      <div class="bigboxs" v-show="select[0]">
        <section v-if="useable.length>0">
          <div class="usecoupon" v-for="(item,index) in useable" :key="item.usercouponid">
            <div class="usecoupon_left">
              <p class="left_p1">
                <span>&yen;</span>
                {{item.facevalue}}
              </p>
              <p class="left_p2">满{{item.uselimit}}元可用</p>
            </div>
            <div class="usecoupon_main">
              <p class="mainp1">
                <span>{{item.companyname}}</span>
                {{item.name}}
              </p>
              <p class="mainp2">{{item.couponalias}}</p>
              <p class="mainp3">{{item.starttime|time}}-{{item.endtime|time}}</p>
            </div>
            <img
              src="../../img/ordercomfirm/select.png"
              alt
              class="selects"
              v-if="!item.select"
              @click="slectin(index,item.isplatform)"
            >
            <img src="../../img/ordercomfirm/sclectactive.png" alt class="selects" v-else>
          </div>
        </section>
        <section v-else>
          <div class="nodata">
            <img src="../../img/ordercomfirm/couponNoData1.png" alt style="width:40%">
            <p>暂时没有可用的优惠券~</p>
          </div>
        </section>
      </div>
      <!-- //不可用优惠券 -->
      <div class="bigboxs" v-show="select[1]">
        <section v-if="unuseable.length>0">
          <div class="usecoupon" v-for="(item,index) in unuseable" :key="item.usercouponid">
            <div class="usecoupon_left">
              <p class="left_p1">
                <span>&yen;</span>
                {{item.facevalue}}
              </p>
              <p class="left_p2">满{{item.uselimit}}元可用</p>
            </div>
            <div class="usecoupon_main">
              <p class="mainp1">
                <span>{{item.companyname}}</span>
                {{item.name}}
              </p>
              <p class="mainp2">{{item.couponalias}}</p>
              <p class="mainp3">{{item.starttime|time}}-{{item.endtime|time}}</p>
            </div>
          </div>
        </section>
        <section v-else>
          <div class="nodata">
            <img src="../../img/ordercomfirm/couponNoData1.png" alt style="width:40%">
            <p>暂时没有不可用的优惠券~</p>
          </div>
        </section>
      </div>
      <!-- 确认按钮 -->
      <div class="btnbox" @click="okuser">确认</div>
    </section>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    CouponsList: {
      type: Array,
      required: true
    },
    openusecou: {
      type: Boolean,
      required: true
    },
    fu_coudata: {
      type: Object,
      required: false //父组件穿进来的已选参数
    }
  },
  data() {
    return {
      select: [true, false],
      redleft: 0,
      unuseable: [], //不能使用的券
      useable: []
    };
  },
  watch: {
    openusecou(val, oldval) {
      if (val) {
        this.listdata();
      }
    }
  },
  filters: {
    time: function(value) {
      return value.substring(0, 10);
    }
  },
  computed: {},
  methods: {
    qie(index) {
      var a = [];
      for (let index = 0; index < this.select.length; index++) {
        a.push(false);
      }
      a[index] = true;
      this.redleft = 50 * index + "%";
      this.select = a;
    },
    slectin(index, way) {
      //商家券和平台券只能分别选一张
      var data = this.useable;
      data.forEach(function(item, index) {
        if (item.isplatform == way) {
          item.select = false;
        }
      });
      data[index].select = true;
      this.useable = data;
    },
    listdata() {
      var that = this;
      showLoading()
      https({
        url:
          siteUrl +
          "Marketing/Coupon/GetUseableCouponListJson?devicetype=7&uid=" +
          getname(),
        method: "post",
        data: {
          uid: getname(),
          queryinput: that.$props.CouponsList,
          isgb: that.$props.CouponsList[0].GBID ? "true" : ""
        },
        headers: 1,
        successBack: function(ret) {
          if (ret.status == 1 && ret.success) {
            var data = ret.Data;
            that.unuseable = data.unuseable;
            var fu_id = that.$props.fu_coudata.id; //父组件传进来的已选参数,已选过才有
            data.useable.forEach(function(item, index) {
              item.select = false;
              //有选择过就点亮
              if (fu_id) {
                fu_id.forEach(function(list, idx) {
                  if (list == item.usercouponid) {
                    item.select = true;
                  }
                });
              }
            });
            that.useable = data.useable;
          } else {
            promptMsg(ret.err);
          }
          hideLoading()
        }
      });
    },
    //确认
    okuser(type) {
      var that = this;
      var id = [];
      var tolal = 0;
      //选择了优惠劵
      if (type != "nouse") {
        that.useable.forEach(function(item, index) {
          if (item.select) {
            id.push(item.usercouponid);
            tolal = Number(tolal) + Number(item.facevalue);
          }
        });
      }
      var coudata = {
        id,
        tolal,
        openusecou: false
      };
      this.$emit("getcansu", coudata);
    },
    //关闭优惠券
    closebox() {
      console.log(1);
      this.$emit("closebox", "");
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
img {
  display: block;
}
.zhizao {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999999;
}
.usebox {
  position: fixed;
  bottom: 0;
  height: rems(960);
  width: 100%;
  z-index: 9999999;
  background: #fff;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
}
.box {
  margin: 0 rems(20);
}
.toutitle {
  text-align: center;
  position: relative;
  padding: rems(28) 0;
  font-size: rems(28);
  border-bottom: 1px solid rgba(246, 246, 250, 1);
  .imgbox {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    img {
      width: rems(44);
      height: rems(44);
    }
    @include item;
  }
}
.nouse {
  @include item;
  border-bottom: 1px solid rgba(246, 246, 250, 1);
  padding: rems(28) 0;
  font-size: rems(28);
  img {
    width: rems(44);
    height: rems(44);
    margin-right: rems(20);
  }
}
.active {
  color: #fe334b;
}
.selectuse_box {
  @include item;
  font-size: rems(26);
  text-align: center;
  padding: rems(28) 0;
  position: relative;
  .boli {
    width: 50%;
  }
  .redlink {
    position: absolute;
    bottom: 0;
    width: 50%;
    left: 0;
    span {
      height: 2px;
      width: 15%;
      border-radius: 30px;
      background: linear-gradient(
        270deg,
        rgba(254, 51, 75, 1) 0%,
        rgba(255, 114, 130, 1) 100%
      );
    }
  }
}
.bigboxs {
  overflow-y: scroll;
  height: rems(520);
  padding: rems(16) 0;
}
.usecoupon {
  @include item;
  border-radius: 8px;
  overflow: hidden;
  margin: 0 rems(20);
  margin-bottom: rems(20);
  font-size: rems(24);
  box-shadow: 0px 2px 20px 0px rgba(216, 216, 216, 0.3);
  .usecoupon_left {
    padding: rems(40) 0;
    width: 30%;
    flex-shrink: 0;
    background: linear-gradient(
      270deg,
      rgba(254, 51, 75, 1) 0%,
      rgba(255, 114, 130, 1) 100%
    );
    color: #fff;
    text-align: center;
    .left_p1 {
      font-size: rems(48);
      margin-bottom: rems(14);
      span {
        font-size: rems(28);
        margin-right: rems(10);
      }
    }
    .left_p2 {
      font-size: rems(24);
    }
  }
  .usecoupon_main {
    width: 100%;
    padding-left: rems(20);
    .mainp1 {
      font-size: rems(20);
      @include font1;
      color: #333;
      font-weight: 700;
      span {
        background: rgba(255, 85, 65, 0.2);
        color: #ff5541;
        padding: 0 rems(10);
        border-radius: 30px;
      }
    }
    .mainp2 {
      padding: rems(22) 0 rems(10) 0;
      @include font1;
    }
    .mainp3 {
      color: #999;
      font-size: rems(20);
      @include font1;
    }
  }
  .selects {
    width: rems(44);
    height: rems(44);
    flex-shrink: 0;
    margin-right: rems(30);
  }
}
.btnbox {
  background: linear-gradient(
    270deg,
    rgba(254, 51, 75, 1) 0%,
    rgba(255, 114, 130, 1) 100%
  );
  border-radius: 48px;
  width: 60%;
  margin: 0 auto;
  margin-top: rems(20);
  font-size: rems(28);
  text-align: center;
  color: #fff;
  padding: rems(18) 0;
}
</style>