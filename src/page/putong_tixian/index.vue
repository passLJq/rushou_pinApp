<template>
  <div>
    <div class="head">
      <p class="p1">{{blance | toFixed}}</p>
      <div class="p2">可提现金额 (元)</div>
    </div>
    <div class="main">
      <div class="item1">
        <p>提现方式</p>
        <div class="d1"><img src="~@img/ordercomfirm/zhifubao.png"><p>支付宝</p></div>
      </div>
      <div class="item1">
        <p>提现账号</p>
        <input type="text" placeholder="请填写你的提现账号" v-model="account">
      </div>
      <div class="item1">
        <p>真实姓名</p>
        <input type="text" placeholder="请填写你的真实姓名" v-model="realName">
      </div>
      <div class="item2 item1">
        <p>￥</p><input type="tel" placeholder="请输入100的倍数" v-model="txPrice">
      </div>
      <div class="item1 s1" style="background-color: #f6f6fa;">
        <p style="color: #999;">实际到账￥{{arrivl | toFixed}}</p>
        <p style="color: #999;">手续费￥{{serverPrice | toFixed}}</p>
      </div>
    </div>
    <div class="btn">
      <div :class="isActive ? 'active' : ''" @click="tixian">确认提现</div>
      <p @click="tijilv">提现记录</p>
    </div>
  </div>
</template>

<script>
import { setTimeout } from 'timers';
export default {
  components: {},
  props: {},
  data() {
    return {
      // carelistdata: "", //所有银行卡的信息,
      // showcare: "", //选择中提现用的信号卡
      // xuanzhong: [],
      // qiehuan: false,
      // qian: "",
      blance: 0,          // 用户余额
      account: '',        // 提现账号
      realName: '',       // 真实姓名
      msg: '',
      txPrice: '',        // 提现金额
      serverPrice: 0,     // 用户提现手续费
      theone: false,
      arrivl: 0,          // 实际到账
      minmoney: ""        //最小提现
    };
  },
  filters: {
    toFixed: function(value) {
      value = Number(value);
      return value.toFixed(2);
    }
  },
  watch: {
    txPrice(val) {
      var p = this.txPrice - this.serverPrice
      this.arrivl = p > 0 ? p : 0
    }
  },
  computed: {
    isActive() {
      if (this.txPrice != '' && this.account != '' && this.realName != '') {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    //获取钱包余额
    getMsg: function() {
      var that = this;
      showLoading()
      https({
        url: siteUrl + 'Main/member/DepositDetailInformation?devicetype=7',
        data: {
          uid: getname(),
          shopid: '170718164338876176'
        },
        headers: 1,
        successBack: ret => {
          hideLoading()
          if (ret.success && ret.status == 1) {
            this.serverPrice = ret.Data.SerivceFee
            this.blance = ret.Data.MoneyOk
            this.minmoney = ret.Data.minmoney
          } else {
            promptMsg(ret.err)
          }
        }
      })
    },
    tijilv: function() {
      openWin ({
        name: "depositdetail",
        url: "./depositdetail.html",
        pageParam: {
          title: "提现记录"
        }
      }, 1);
    },
    tixian: function() {
      var that = this;
      if (that.txPrice == "") {
        promptMsg("提现金额不能为空");
        return;
      }
      if (that.account == "") {
        promptMsg("提现账号不能为空");
        return;
      }
      if (this.realName == '') {
        promptMsg("真实姓名不能为空");
        return;
      }
      if (Number(that.txPrice) < Number(that.minmoney)) {
        promptMsg("最小提现金额为" + that.minmoney + '元');
        return;
      }
      if (Number(that.txPrice) % 100 != 0) {
        promptMsg("提现金额必须为100的倍数");
        return;
      }
      if (that.blance < that.txPrice) {
        promptMsg("账户余额不足");
        return;
      }
      if (that.theone) {
        promptMsg("请勿重复点击");
        return;
      }
      that.theone = true;
      showLoading()
      https({
        url: siteUrl + "Main/Member/Withdrawal?uid=" + getname() + "&devicetype=7",
        method: "post",
        headers: 1,
        data: {
          shopid: '170718164338876176',            // 平台ID
          uid: getname(),                          // 用户ID
          Name: this.realName,                     // 提现人真实姓名
          wayid: '130307103845224911',             // 提现方式ID
          kahao: '',                               // 卡号
          tixJine: this.txPrice,                   // 提现金额
          BankBranch: '',                          // 银行支行名
        },
        successBack: function(ret) {
          hideLoading()
          if (ret.success && ret.status == 1) {
            promptMsg(ret.err)
            setTimeout(function () {
              api.closeWin()
            }, 1000)
          } else if (ret.status == 9) {
            that.theone = false
            promptMsg('未开店用户或实习店主无法提现')
          } else {
            that.theone = false
            promptMsg(ret.err)
          }
        }
      });
    },
  },
  created() {
    this.getMsg()
  },
  mounted() {
    
  }
};
</script>
<style lang="scss">
@import "index.scss";
</style>