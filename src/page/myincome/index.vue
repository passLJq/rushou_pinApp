<template>
  <section>
    <div class="toubox">
      <div class="tou">
        <p>钱包余额</p>
        <p>&yen;{{moneydata.availableBlance}}</p>
      </div>
      <div class="foot">
        <div class="footleft">
          <p>即将到账</p>
          <p>+{{sooncommision}}</p>
        </div>
        <div class="footright" @click="goapps">我要提现</div>
      </div>
    </div>

    <div class="xuanxian">
      <p @click="gocash">收支明细</p>
      <p @click="tocashPassword">修改密码</p>
      <!-- <p @click="tomybankcard">我的银行卡</p> -->
    </div>
  </section>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      moneydata: "",
      sooncommision: pageParam("sooncommision"),
      userMsg: "",
      paypwdisnull: 1
    };
  },
  watch: {},
  computed: {},
  methods: {
    gocash() {
      openWin(
        {
          name: "cash",
          url: "./cash.html",
          pageParam: {
            title: "钱包明细"
          }
        },
        1
      );
    },
    tocashPassword() {
      if (checkLoginStatus()) {
        if (this.paypwdisnull != 1) return;
        openWin({
          url: "./cashPassword.html",
          name: "cashPassword",
          pageParam: {
            pageName: 1
          }
        });
      }
      // checkuser(function(){
      //   https({
      //     url:siteUrl +'Main/MemberPay/CheckPayPwd',
      //     method:'get',
      //     data:{
      //       uid:getname(),
      //       devicetype:1
      //     },
      //     headers:1,
      //     successBack:function(ret){
      //         if(ret.success&&ret.status==1){
      //           if(ret.Data.issetpwd=='N'){
      //             OpenWebPage(ret.Data.url,'密码设置')
      //           }else if(ret.Data.issetpwd=='Y'){
      //               // OpenWebPage(ret.Data.url,'修改密码')
      //             // api.closeWin({
      //             //     name: api.winName
      //             // });
      //             openWin({
      //               name:'xinlangPassword',
      //               url:'./xinlangPassword.html',
      //               pageParam:{
      //                 title:'密码设置'
      //               }
      //             },1)
      //           }
      //         }else{
      //           promptMsg(ret.err)
      //         }
      //     }
      //   })
      // })
    },
    tomybankcard() {
      checkuser(function() {
        openWin(
          {
            name: "add_bank",
            url: "./addbank_card.html",
            pageParam: {
              title: "绑定银行卡",
              status: 1
            }
          },
          1
        );
      });
    },
    //获取钱包余额
    getMsg() {
      showLoading();
      var that = this;
      https({
        url: siteUrl + "Main/Member/GetMyIncome?devicetype=7",
        method: "get",
        data: {
          uid: getname()
        },
        headers: 1,
        successBack: function(ret) {
          if (ret) {
            if (ret.success && ret.status == 1) {
              that.moneydata = ret.Data;
            } else {
              promptMsg(ret.msg);
            }
          }
          hideLoading();
        }
      });
      //获取个人信息
      https({
        url: siteUrl + "Main/Member/GetMemberJson",
        data: {
          uid: getname()
        },
        headers: 1,
        successBack: ret => {
          if (ret && ret.status == 1) {
            //在其他客户端开店后这里可以刷新开店
            if (getname("SessionShopID") == "") {
              if (ret.Data.fxshopid != "") {
                setname("SessionShopID", ret.Data.fxshopid);
              }
            }
            that.userMsg = ret.Data;
            this.paypwdisnull = ret.Data.paypwdisnull;
          }
        }
      });
    },
    goapps() {
      if (this.userMsg.isintern == "1") {
        promptMsg("实习团长不能提现");
        return;
      } else {
        if (checkLoginStatus()) {
          openWin({
            name: 'putong_tixian',
            url: './putong_tixian.html',
            pageParam: {
              title: '我要提现'
            }
          }, 1)
        }
        // checkuser(function() {
        //   https({
        //     url: siteUrl + "Main/MemberPay/CheckPayPwd",
        //     method: "get",
        //     data: {
        //       uid: getname(),
        //       devicetype: 1
        //     },
        //     headers: 1,
        //     successBack: function(ret) {
        //       if (ret.success && ret.status == 1) {
        //         if (ret.Data.issetpwd == "N") {
        //           OpenWebPage(ret.Data.url, "密码设置");
        //         } else if (ret.Data.issetpwd == "Y") {
        //           openWin(
        //             {
        //               name: "xl_tixian",
        //               url: "./xl_tixian.html",
        //               pageParam: {
        //                 title: "提现"
        //               }
        //             },
        //             1
        //           );
        //         }
        //       } else {
        //         promptMsg(ret.err);
        //       }
        //     }
        //   });
        // });
      }
    }
  },
  created() {},
  mounted() {
    this.getMsg();
  }
};
</script>
<style lang="scss">
.toubox {
  border-radius: 16px;
  margin: 0 rems(20);
  box-shadow: 0px 4px 20px 0px rgba(216, 216, 216, 0.4);
  margin-top: rems(20);
  overflow: hidden;
  .tou {
    background: linear-gradient(
      270deg,
      rgba(254, 51, 75, 1) 0%,
      rgba(255, 114, 130, 1) 100%
    );
    color: #fff;
    padding: 0 rems(32);
    p:nth-child(1) {
      font-size: rems(24);
      padding: rems(32) 0 rems(16) 0;
    }
    p:nth-child(2) {
      font-size: rems(56);
      padding-bottom: rems(36);
    }
  }
  .foot {
    @include item;
    justify-content: space-between;
    padding: rems(32);
    .footleft {
      font-size: rems(24);
      p:nth-child(1) {
        color: #999;
      }
      p:nth-child(2) {
        color: #fe334b;
      }
    }
    .footright {
      font-size: rems(28);
      border-radius: 30px;
      color: #fff;
      background: linear-gradient(
        270deg,
        rgba(254, 51, 75, 1) 0%,
        rgba(255, 114, 130, 1) 100%
      );
      padding: rems(14) rems(30);
    }
  }
}
.xuanxian {
  font-size: rems(28);
  color: #333;
  margin: 0 rems(32);
  margin-top: rems(20);
  p {
    padding: rems(28) 0;
    border-bottom: 1px solid rgba(246, 246, 250, 1);
  }
}
</style>