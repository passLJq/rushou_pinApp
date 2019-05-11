<template>
  <div id="app" v-cloak>
    <div class="box">
      <div class="shangbox">
        <div class="item tou" @click="hides()">
          <div class="lev">
            <p>提现到银行卡</p>
            <p>{{showcare.name}}</p>
          </div>
          <i class="newright-arrow"></i>
        </div>
        <!-- <p class="xp3">当天24点前到账</p> -->
      </div>
      <div class="xiabox">
        <p class="xp1">提现金额</p>
        <div class="item xiashuru">
          <p class="xp2">&yen;</p>
          <input type="tel" name value v-model="qian" :placeholder="todayIncome">
        </div>
        <!-- <div>
                    <p class="xp4" v-if="qian&&qian>=5">实际到账￥{{qian-5 |toFixed }}，手续费￥5.00</p>
        </div>-->
      </div>
    </div>
    <div class="awbox">
      <div @click="tijilv()" class="tixianjilu">提现记录</div>
      <div class="yanbtn aw" @click="tixian()">提现</div>
    </div>

    <!-- 选择银行卡 -->
    <div class="zhezao" v-show="qiehuan" @click="hides()"></div>
    <div class="pobox" :style="qiehuan?'bottom:0':''">
      <p class="xuanbox">选择银行卡</p>
      <div class="boxhe">
        <div
          class="kalistul"
          @click="qie(index,item,1)"
          v-for="(item,index) in carelistdata"
          :key="item"
        >
          <p>{{item.name}}</p>
          <i
            class="iconfont rushouvip-Rectangle-path"
            :class="xuanzhong[index]?'rushouvip-Rectangle-path':'rushouvip-no-xuan'"
          ></i>
        </div>
        <div class="kalistul" @click="goband">
          <div class="item">
            <img src="../../img/addcard_icon.png" alt class="aimg">
            <p>添加一张新的银行卡</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      carelistdata: "", //所有银行卡的信息,
      showcare: "", //选择中提现用的信号卡
      xuanzhong: [],
      qiehuan: false,
      qian: "",
      todayIncome: "",
      theone: false,
      minmoney: "" //最小提现
    };
  },
  filters: {
    toFixed: function(value) {
      value = Number(value);
      return value.toFixed(2);
    }
  },
  watch: {},
  computed: {},
  methods: {
    //获取钱包余额
    getMsg: function() {
      var that = this;
      showLoading();
      https({
        url: siteUrl + "Main/MemberPay/GetBalance?devicetype=7",
        data: {
          uid: getname()
        },
        headers: 1,
        successBack: function(ret) {
          if (ret.success && ret.status == 1) {
            // that.onlymoney = ret.Data.availableBlance;
            that.todayIncome = "可提现" + ret.Data.blance + "元";
            that.minmoney = Number(ret.Data.serivcefee);
          } else {
            promptMsg(ret.msg);
          }
          hideLoading();
        }
      });
    },
    getcardlist: function() {
      var that = this;
      https({
        url: siteUrl + "Main/MemberPay/GetUserBankListJson?devicetype=7",
        method: "get",
        headers: 1,
        data: {
          uid: getname()
        },
        successBack: function(ret) {
          console.log($api.jsonToStr(ret));

          if (ret.success && ret.status == 1) {
            if (ret.Data) {
              var datalist = [];
              var showcare = {};
              ret.Data.forEach(function(item, index) {
                $api.strToJson(that.databank).forEach(function(bank, xu) {
                  if (bank.text == item.bankcode) {
                    if (index == 0) {
                      showcare = {
                        name: bank.name,
                        number: item.accountno.substr(
                          item.accountno.length - 4
                        ),
                        bankid: item.bankid,
                        accountno: item.accountno
                      };
                    }
                    datalist.push({
                      name: bank.name,
                      number: item.accountno.substr(item.accountno.length - 4),
                      bankid: item.bankid,
                      accountno: item.accountno
                    });
                  }
                });
              });
              that.carelistdata = datalist;
              console.log($api.jsonToStr(datalist));
              that.qie(0, showcare);
            }
          } else {
            promptMsg(ret.err);
          }
        }
      });
    },
    gozhuang: function() {
      https({
        url: siteUrl + "Main/MemberPay/GetTranInSinaList?devicetype=7",
        method: "get",
        data: {
          uid: getname(),
          handlingstatus: -1
        },
        headers: 1,
        successBack: function(ret, err) {
          if (ret.success && ret.status == 1) {
            if (ret.Data.length > 0) {
              promptMsg("转账审核中,请等待审核结束");
            } else {
              openWin({
                name: "transfer",
                url: "./transfer.html",
                pageParam: { pageName: "转入账户" }
              });
            }
          } else {
            promptMsg(ret.err);
          }
        }
      });
    },
    hides: function() {
      this.qiehuan = !this.qiehuan;
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
    qie: function(index, item, clos) {
      var le = [];
      var showcare = item;
      for (var i = 0; i < this.carelistdata.length; i++) {
        le.push(false);
      }
      le[index] = true;
      this.xuanzhong = le;
      this.showcare = item;
      if (clos) {
        this.hides();
      }
    },
    tixian: function() {
      var that = this;
      if (that.qian == "") {
        promptMsg("提现金额不能为空");
        return;
      }
      if (that.qian <= that.minmoney && that.qian != "") {
        that.qian = "";
        promptMsg("金额需要大于" + that.minmoney + "元");
        return;
      }
      if (that.qian > 50000) {
        that.qian = "";
        promptMsg("单笔不能超过50000元");
        return;
      }
      if (that.showcare == "") {
        promptMsg("银行卡号不能为空");
        return;
      }
      if (that.theone) {
        promptMsg("请勿重复点击");
        return;
      }
      that.theone = true;
      console.log(that.showcare.bankid);
      console.log(that.qian);
      https({
        url:
          siteUrl +
          "Main/MemberPay/Withdrawal?uid=" +
          getname() +
          "&devicetype=7",
        method: "post",
        headers: 1,
        data: {
          uid: getname(),
          accountid: that.showcare.bankid, //绑定银行id
          amount: that.qian //提现金额
        },
        successBack: function(ret) {
          console.log($api.jsonToStr(ret));
          if (ret.success && ret.status == 1) {
            OpenWebPage(ret.resobj, "提现", {
              name: "xltixian"
            });
            // promptMsg('提现成功')
          } else {
            that.theone = false;
            promptMsg(ret.err);
          }
        }
      });
    },
    goband: function() {
      openWin(
        {
          name: "add_bank",
          url: "./addbank_card.html",
          pageParam: {
            title: "绑定银行卡",
            status: 2,
            whoin: "addcard" //whoin=pay是支付是来实名认证，下一步就去设置密码
          }
        },
        1
      );
    }
  },
  created() {
    var that = this;
    if (window.api) {
      that.databank = api.readFile({
        sync: true,
        path: api.wgtRootDir + "/common/json/bankcare.json"
      });
      api.addEventListener(
        {
          name: "bank_cardlist"
        },
        function(ret, err) {
          that.getcardlist();
        }
      );
    }
    window.onshow = function() {
      that.qian = "";
      that.theone = false;
      that.getMsg();
    };
  },
  mounted() {
    this.getMsg();
    this.getcardlist();
  }
};
</script>
<style lang="scss">
p {
  font-size: rem(15);
}
body {
  background-color: #f6f6fa;
}

#head {
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 99999;
}

.item {
  display: flex;
  align-items: center;
}

.tou {
  justify-content: space-between;
}

.lev p:nth-child(1) {
  font-size: rem(12);
}

.lev p:nth-child(2) {
  font-size: rem(17);
  margin-top: rem(5);
}

.box {
  width: 90%;
  margin: rem(20) auto 0;
  background-color: #fff;
  box-sizing: border-box;
}

.shangbox {
  background: rgba(246, 246, 250, 0.3);
  padding: rem(15) rem(30);
}

.xiabox {
  padding: rem(15) rem(30);
}

.xp1 {
  font-size: rem(12);
}

.xiashuru {
  border-bottom: 1px solid #f6f6fa;
  padding: rem(10) 0;
  font-size: rem(14);
}

.xiashuru input {
  margin-left: rem(15);
  width: 92%;
}

.xiashuru input:focus {
  outline: none;
}

.xp3 {
  color: #cda86e;
  font-size: rem(14);
  margin-top: rem(15);
}

.xp4 {
  margin-top: rem(15);
}

.aw {
  width: 60%;
  font-size: rem(14);
  margin: 0 auto;
}
.awbox {
  margin-top: rem(200);
  text-align: center;
}
.tixianjilu {
  color: #ff5541;
  font-size: rem(14);
  margin-bottom: rem(20);
}
.app-radio {
  position: relative;
}
i {
  font-size: rem(23) !important;
}
.rushouvip-Rectangle-path {
  color: rgb(205, 168, 110);
  font-size: rem(25);
}
.pobox {
  position: fixed;
  bottom: -500px;
  width: 100%;
  background-color: #fff;
  padding: 0 rem(12);
  box-sizing: border-box;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  z-index: 99999;
  transition: bottom 0.5s;
}
.boxhe {
  height: rem(210);
  overflow-y: auto;
}
.xuanbox {
  font-size: rem(14);
  padding: rem(14) 0;
  border-bottom: 1px solid #f6f6fa;
}
.kalistul {
  @include item;
  justify-content: space-between;
  padding: rem(14) 0;
  border-bottom: 1px solid #f6f6fa;
  p {
    font-size: rem(17);
  }
  .aimg {
    display: block;
    width: rem(28);
    height: rem(28);
    margin-right: rem(10);
  }
}
.rushouvip-no-xuan {
  color: #999;
}
.zhezao {
  position: fixed;
  width: 100%;
  bottom: 0;
  top: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.5);
}
.po3 {
  color: #ff5541;
  font-size: rem(14);
  margin-top: rem(20);
  span {
    color: blue;
  }
}
</style>