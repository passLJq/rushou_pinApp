<template>
  <div id="app1">
    <!-- //实名认证 -->
    <section v-cloak :class="status==0?'':'hide'">
      <div class="toubu">
        <p>第一次绑定银行卡前，请填写本人的相关真实有效信息，已经绑定成功后，该部分信息不能修改！</p>
      </div>
      <div class="setinput">
        <input type="text" value placeholder="请填写您的姓名" v-model="realname">
      </div>
      <div class="setinput">
        <input type="text" name value placeholder="请填写您的身份证号码" v-model="certno" maxlength="18">
      </div>
    </section>
    <!-- 银行卡列表-->
    <section v-cloak v-if="status==1">
      <div v-if="carelistdata.length>0">
      <div
        class="careinfobox"
        style="background-color:#f5ac9e"
        v-for="(item,index) in carelistdata"
        @click="deletcare(item.bankid)"
        :key="index"
      >
        <div class="careitem">
          <!-- <img src="../../image/addcar.png" alt=""> -->
          <div class="careinfo">
            <p>{{item.name}}&nbsp;&nbsp;({{item.number}})</p>
            <p>储蓄卡</p>
            <p v-if="item.signtype!=2">未认证成功,请解绑重新绑定</p>
          </div>
        </div>
        <div class="carenumber">
          <p>****&nbsp;&nbsp;&nbsp;****&nbsp;&nbsp;&nbsp;****&nbsp;&nbsp;&nbsp;{{item.number}}</p>
        </div>
      </div>
      </div>
      <div v-else>
        <div class="nobankcar">
        <img src="../../img/nobank.png">
        <p>暂时没有银行卡~</p>
        </div>
      </div>
    </section>
    <!-- 绑定银行卡-->
    <section v-cloak v-if="status==2">
      <div class="bakimg">
        <p>请填写您本人的银行卡信息</p>
      </div>
      <!-- <div class="itemboxs">
            <div class="item">
              <div class="itp1">姓名</div>
              <div class="itp2">
                <input type="text" name="" value="" placeholder="请填写姓名">
              </div>
            </div>
      </div>-->
      <div class="itemboxs">
        <div class="item">
          <div class="itp1">银行卡号</div>
          <div class="itp2" @click="onfouce">
            <p v-if="banknumber==''">请填写银行卡号</p>
            <span
              v-else
              class="spani"
              v-for="(item,index) in [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]"
              :key="item"
            >{{banknumber|towhert(index)}}</span>
          </div>
          <div class="inputhide">
            <input
              type="tel"
              name
              maxlength="19"
              value
              v-model="banknumber"
              ref="content"
            >
          </div>
        </div>
      </div>
      <div class="itemboxs">
        <div class="item">
          <div class="itp1">选择银行</div>
          <div class="itp2">
            <div class="chebank" @click="checkbank">
              <!-- <img src="../../image/addcar.png" alt=""> -->
              <p v-if="bankcareinfo.name">{{bankcareinfo.name}}</p>
              <p v-else>请选择银行卡</p>
              <i class="newright-arrow"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="itemboxs">
        <div class="item">
          <div class="itp1">开户地区</div>
          <div class="itp2">
            <p @click="showCity">{{city?city.text:'请选择开户地区'}}</p>
          </div>
        </div>
      </div>
       <div class="itemboxs">
            <div class="item">
              <div class="itp1">银行卡支行</div>
              <div class="itp2">
                <input type="text" name="" v-model="bankbranch" placeholder="请填写支行(非必填)" maxlength="11">
              </div>
            </div>
      </div>
      <div class="itemboxs">
            <div class="item">
              <div class="itp1">银行预留手机</div>
              <div class="itp2">
                <input type="tel" name="" v-model="telphone" placeholder="请填写电话号码" maxlength="11">
              </div>
            </div>
      </div>
    </section>
     <!-- //认证和解绑用弹窗 -->
      <div class="zhezhaos"  v-show="renzhen"></div>
      <div class="invietbox"  v-show="renzhen">
        <p>已发送验证码到银行卡预留手机号</p>
        <input type="tel" maxlength="6" v-model="codetel">
       <div class="querenbox">
          <p class="pp1" @click="getyaoqingma">确认</p>
          <p class="pp2" @click="quxiao">取消</p>
        </div>
      </div>
    <div class="appbtn yanbtn" @click="next()" v-if="status==0">下一步</div>
    <div class="appbtn yanbtn" @click="next()" v-if="status==1">添加一张新的银行卡</div>
    <div class="appbtn yanbtn" @click="next()" v-if="status==2">完成</div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      status: "", //0是实名认证，1是银行卡列表，2是添加银行卡
      realname: "",
      certno: "",
      banknumber: "",
      bankbranch:"",//支行
      focusState: false,
      bankcareinfo: { name: "", text: "" },
      city: "",
      telphone: "",
      carelistdata: "",
      yanzhentijiao: false ,//防止重复提交
      codetel:'',//认证和解绑用验证码
      renzhen:false,
      ticket:'',//认证和解绑验证码接口加密数据
      renbankid:''//认证用id
    };
  },
  watch: {
    banknumber(){
      console.log(55)
      this.jiancha()
    }
  },
  computed: {},
  methods: {
    next: function() {
      var that = this;
      if (this.status == 0) {
        if (this.realname == "") {
          promptMsg("姓名不能为空");
          return false;
        } else if (!this.certno) {
          promptMsg("身份证不能为空");
          return false;
        }
        https({
          url: siteUrl + "Main/MemberPay/VerifiedUser?devicetype=7&uid=" + getname(),
          data: {
            uid: getname(),
            realname: that.realname,
            certno: that.certno
          },
          method: "post",
          headers: 1,
          successBack: function(ret) {
            if (ret.success && ret.status == 1) {
              //从支付进来的实名认证，直接去设置密码
              if (api.pageParam.whoin == "pay") {
                that.cherkpassword();
              } else {
                if(window.api){
                api.execScript({
                  name:api.frameName,
                  script:`checktitle("绑定银行卡")`
                });
                }
                that.status = 1;
              }
            } else {
              promptMsg(ret.err);
            }
          }
        });
      } else if (this.status == 1) {
        openWin({
          name: "add_bankcard",
          url: "/page/addbank_card.html",
          pageParam: {
            title: "添加银行卡",
            status: 2
          }
        },1);
      } else if (this.status == 2) {
        var that = this;
        console.log(this.city.code);
        if (this.banknumber == "") {
          promptMsg("银行卡不能为空");
          return false;
        } else if (this.city.coder == "" || this.city.code == null) {
          promptMsg("银行地区不能为空");
          return false;
          }else if(this.telphone==''){
            promptMsg('电话号码不能为空')
            return false
        }else if(this.telphone.length<11){
            promptMsg('电话号码格式错误')
            return false      
        } else if (
          this.bankcareinfo.text == "" ||
          this.bankcareinfo.text == null
        ) {
          promptMsg("银行卡类型不能为空");
          return false;
        } else if (this.yanzhentijiao) {
          promptMsg("请勿重复点击");
          return false;
        }
        this.yanzhentijiao = true;
        https({
          url: siteUrl + "Main/MemberPay/BindUserBank?devicetype=7&uid=" + getname(),
          method: "post",
          data: {
            uid: getname(),
            bankcode: that.bankcareinfo.text,
            bankaccountno: that.banknumber,
            phoneno: that.telphone,
            areacode: that.city.code,
            bankbranch:that.bankbranch
          },
          headers: 1,
          successBack: function(ret) {
            if (ret.success && ret.status == 1) {
              that.ticket=ret.Data.ticket
              that.renbankid=ret.Data.bankid
              that.renzhen=true
               //刷新银行卡列表事件
                  api.sendEvent({
                    name: 'bank_cardlist'
                });
              // comfirmDialogBox('认证银行卡即可享受提现额度升级，是否去认证？',function(){
              //    that.getyaoqingma()
              //     that.renzhen=true
              // },'',function(){
              //     //刷新银行卡列表事件
              //     api.sendEvent({
              //       name: 'bank_cardlist'
              //   });
              //     promptMsg("绑定成功");
              //     api.closeWin({
              //       name: api.winName
              //     });
              // })
            } else {
              that.yanzhentijiao = false;
              promptMsg(ret.err);
            }
          }
        });
      }
    },
    //认证
    getyaoqingma(){
      var that=this
       if(that.codetel==''){
        promptMsg('请输入验证码')
        return
      }else if(that.codetel.length<6){
         promptMsg('请输入正确格式的验证码')
        return
      }
      //解绑银行卡
      if(that.status==1){
        https({
              url: siteUrl + "Main/MemberPay/UnBindUserBankAdvance?devicetype=7&uid=" + getname(),
              method: "post",
              data: {
                uid: getname(),
                bankid:that.renbankid,
                ticket :that.ticket,
                code :that.codetel
              },
              headers: 1,
              successBack: function(ret) {   
                if(ret.success&&ret.status==1){
                  that.renbankid=''
                  that.ticket=''
                  that.codetel=''
                  that.renzhen=false
                  //刷新银行卡列表事件
                  that.datalist();
                  promptMsg("解绑成功");
                }else{
                  promptMsg(ret.err);
                }
              }
          })
     //绑定银行卡
      }else{
    https({
          url: siteUrl + "Main/MemberPay/BindUserBankAdvance?devicetype=7&uid=" + getname(),
          method: "post",
          data: {
            uid: getname(),
            bankid:that.renbankid,
            ticket :that.ticket,
            code :that.codetel
          },
          headers: 1,
          successBack: function(ret) {   
            if(ret.success&&ret.status==1){
                //刷新银行卡列表事件
                 that.renbankid=''
                  that.ticket=''
                  that.codetel=''
                  that.renzhen=false
                  api.sendEvent({
                    name: 'bank_cardlist'
                });
                  promptMsg("绑定成功");
                  setTimeout(function(){
                  api.closeWin({
                    name: api.winName
                  });  
                  },1500)  
            }else{
              promptMsg(ret.err);
            }
          }
      })
      }  
    },
    //选择地区
    showCity: function() {
      var that = this;
      var UIActionSelector = api.require("UIActionSelector");
      UIActionSelector.open(
        {
          datas: "fs://cityes.json",
          layout: {
            row: 5,
            col: 3,
            height: 30,
            size: 12,
            sizeActive: 14,
            rowSpacing: 5,
            colSpacing: 10,
            maskBg: "rgba(0,0,0,0.2)",
            bg: "#fff",
            color: "#888",
            colorActive: "#f00",
            colorSelected: "#f00"
          },
          animation: true,
          cancel: {
            text: "取消",
            size: 12,
            w: 90,
            h: 35,
            bg: "#fff",
            bgActive: "#ccc",
            color: "#888",
            colorActive: "#fff"
          },
          ok: {
            text: "确定",
            size: 12,
            w: 90,
            h: 35,
            bg: "#fff",
            bgActive: "#ccc",
            color: "#888",
            colorActive: "#fff"
          },
          title: {
            text: "",
            size: 12,
            h: 44,
            bg: "#fff",
            color: "#888"
          },
          fixedOn: api.frameName
        },
        function(ret, err) {
          if (ret) {
            console.log($api.jsonToStr(ret));
            if (ret.eventType == "ok") {
              var code = "";
              ret.selectedInfo.forEach(function(item, index) {
                if (index == ret.selectedInfo.length - 1) {
                  code = item.code;
                }
              });
              that.city = {
                text: ret.level1 + ret.level2 + ret.level3,
                code: code
              };
            }
          } else {
            promptMsg(JSON.stringify(err));
          }
        }
      );
    },
    //选择银行
    checkbank: function() {
      var that = this;
      var UIActionSelector = api.require("UIActionSelector");
      UIActionSelector.open(
        {
          datas: api.wgtRootDir + "/common/json/bankcare.json",
          layout: {
            row: 5,
            col: 1,
            height: 30,
            size: 12,
            sizeActive: 14,
            rowSpacing: 5,
            colSpacing: 10,
            maskBg: "rgba(0,0,0,0.2)",
            bg: "#fff",
            color: "#888",
            colorActive: "#f00",
            colorSelected: "#f00"
          },
          animation: true,
          cancel: {
            text: "取消",
            size: 12,
            w: 90,
            h: 35,
            bg: "#fff",
            bgActive: "#ccc",
            color: "#888",
            colorActive: "#fff"
          },
          ok: {
            text: "确定",
            size: 12,
            w: 90,
            h: 35,
            bg: "#fff",
            bgActive: "#ccc",
            color: "#888",
            colorActive: "#fff"
          },
          title: {
            text: "",
            size: 12,
            h: 44,
            bg: "#fff",
            color: "#888"
          },
          fixedOn: api.frameName
        },
        function(ret, err) {
          if (ret) {
            if (ret.eventType == "ok") {
              that.bankcareinfo = {
                name: ret.selectedInfo[0].name,
                text: ret.selectedInfo[0].text
              };
              console.log(that.bankcareinfo);
            }
          } else {
            alert(JSON.stringify(err));
          }
        }
      );
    },
    //查询银行卡接口
    jiancha: function() {
      var that = this;
      if (that.banknumber.length > 15) {
        https({
          url: "https://ccdcapi.alipay.com/validateAndCacheCardInfo.json",
          data: {
            cardNo: this.banknumber,
            cardBinCheck: 'true'
          },
          successBack: function(ret) {
            if (ret.validated && ret.stat == "ok") {
              // ret.bank
              console.log()
              $api.strToJson(that.databank).forEach(function(item, index) {
                if (item.text == ret.bank) {
                  console.log(item.name);
                  that.bankcareinfo = {
                    name: item.name,
                    text: item.text
                  };
                }
              });
            } else {
              that.bankcareinfo = {
                name: "",
                text: ""
              };
              // promptMsg('银行卡校检失败')
            }
          }
        });
      }
    },
    deletcare: function(bankid) {
      var that = this;
      alerts("提示", "是否解除绑定", "解除", function() {
        https({
          url: siteUrl + "Main/MemberPay/UnBindUserBank?devicetype=7",
          method: "post",
          data: {
            uid: getname(),
            bankid: bankid
          },
          headers: 1,
          successBack: function(ret) {
            console.log($api.jsonToStr(ret))
            if (ret.success && ret.status == 1) {
              if(ret.Data){
               that.ticket=ret.Data.ticket
              that.renbankid=ret.Data.bankid
              that.renzhen=true
              }else{
              that.datalist();
              }
            } else {
              promptMsg(ret.err);
            }
          }
        });
      });
    },
    //获取焦点事件
    onfouce: function() {
      this.$refs.content.focus();
    },
    //获取列表信息
    datalist: function() {
      var that = this;
      https({
        url: siteUrl + "Main/MemberPay/GetUserBankListJson?devicetype=7",
        method: "get",
        data: {
          uid: getname()
        },
        headers: 1,
        successBack: function(ret) {
          if (ret.success && ret.status == 1 && ret.Data != null) {
            var datalist = [];
            var sdata = ret.Data;
            sdata.forEach(function(item, index) {
              $api.strToJson(that.databank).forEach(function(bank, xu) {
                if (bank.text == item.bankcode) {
                  datalist.push({
                    name: bank.name,
                    number: item.accountno.substr(item.accountno.length - 4),
                    bankid: item.bankid,
                    signtype:item.signtype
                  });
                }
              });
            });
            that.carelistdata = datalist;
            console.log($api.jsonToStr(datalist));
          } else if (ret.success && ret.status == 1) {
            that.carelistdata = "";
          } else {
            that.carelistdata = "";
            promptMsg(ret.err);
          }
        }
      });
    },
    cherkpassword() {
      //检测是否设置了密码
      https({
        url: siteUrl + "Main/MemberPay/CheckPayPwd",
        method: "get",
        data: {
          uid: getname(),
          devicetype: 7
        },
        headers: 1,
        successBack: function(ret) {
          if (ret.success && ret.status == 1) {
            if (ret.Data.issetpwd == "N") {
              OpenWebPage(ret.Data.url, "密码设置");
              setTimeout(function() {
                api.closeWin();
              }, 1000);
            } else if (ret.Data.issetpwd == "Y") {
              api.closeWin();
            }
          } else {
            promptMsg(ret.err);
          }
        }
      });
    },
    quxiao(){
       if(this.status==2){
       //刷新银行卡列表事件
         api.sendEvent({
           name: 'bank_cardlist'
       });
        // promptMsg("绑定成功");
         api.closeWin({
           name: api.winName
         }); 
       }else{
         this.renzhen=false
       } 
    }
  },
  filters: {
    towhert: function(value, index) {
      return value.substr(index, 1);
    }
  },
  created() {
    var that=this
    if(window.api){
     that.databank = api.readFile({
            sync: true,
            path: api.wgtRootDir+'/json/bankcare.json'
        });
                  api.addEventListener({
                    name:'bank_cardlist'
                }, function(ret, err){
                    that.datalist()          
              });       
    }
  },
  mounted() {
               var that=this
              that.status=pageParam('status')
              if(that.status==1){
                that.datalist()
              }   
  }
};
</script>
<style lang="scss">
#app1 {
  margin-bottom: rem(80);
}
input {
  outline: none;
}
.toubu {
  margin-top: rem(52);
  color: #333;
  text-align: center;
  p:nth-child(1) {
    font-size: rem(14);
    margin-bottom: rem(20);
        padding: 0 rem(26);
  }
  p:nth-child(2) {
    font-size: rem(14);
    margin-bottom: rem(50);
    padding: 0 rem(26);
  }
}

.setinput {
  margin: 0 rem(26);
  font-size: rem(16);
  margin-bottom: rem(30);
  border-bottom: 1px solid #eee;
  input {
    outline: none;
    padding: rem(10) 0;
    width: 100%;
  }
}
.appbtn {
  font-size: rem(14);
  width: 60%;
  position: fixed;
  bottom: rem(20);
  left: 20%;
}
.bakimg {
  font-size: rem(14);
  padding: rem(30) rem(26) rem(16) rem(26);
}
.itemboxs {
  padding: 0 rem(26);
}
.item {
  @include item;
  box-sizing: border-box;
  justify-content: space-between;
  font-size: rem(14);
  padding: rem(14) rem(20) rem(14) rem(10);
  border-bottom: 1px solid #f6f6fa;
}
.itp1 {
  color: #333;
}
.itp2 {
  font-size: rem(12);
  color: #999999;
  input {
    text-align: right;
    color: #999999;
  }
  span:nth-child(4n) {
    margin-right: rem(10);
  }
}
.spani {
  font-size: rem(16);
  color: #999;
}
.inputhide {
  position: fixed;
  z-index: -9999;
  left: 200%;
}
.chebank {
  @include item;
  img {
    width: rem(22);
    height: rem(22);
    display: block;
    margin-right: rem(5);
  }
  p {
    color: #999;
    font-size: rem(12);
  }
  i {
    margin-right: -15px;
  }
}
.careinfobox {
  width: 84%;
  margin: 0 auto;
  border-radius: 4px;
  padding: 0 rem(15);
  margin-top: rem(20);
}
.careitem {
  @include item;
  padding: rem(12) 0;
  margin-left: rem(40);
  img {
    width: rem(32);
    height: rem(32);
    margin-right: rem(10);
  }
  .careinfo {
    p:nth-child(1) {
      font-size: rem(17);
      color: #fff;
    }
    p:nth-child(2) {
      font-size: rem(12);
      color: rgba(255, 255, 255, 0.5);
    }
     p:nth-child(3) {
      font-size: rem(12);
      color: blue;
    }
  }
}
.carenumber {
  font-size: rem(20);
  padding-bottom: rem(12);
  p {
    padding-left: rem(40);
    color: #fff;
  }
}
input::-webkit-input-placeholder {
  color: #999;
}
.hide{
  display: none
}
.nobankcar{
  img{
    width: 50%;
  }
  text-align: center;
  font-size: rems(28);
  color: #999
}
.zhezhaos{
  position: fixed;
  width: 100%;
  top:0;
  bottom:0;
  background-color: rgba(0,0,0,0.6);
  z-index: 9999;
}
.invietbox{
  position: fixed;
  width: 60%;
  left: 18%;
  background: #fff;
  border-radius: 8px;
  padding:rems(60) rems(20) rems(40) rems(20);
  text-align: center;
  font-size: rems(28);
  color: #333;
  z-index:99999;
  top:18%;
  input{
    width: 100%;
    text-align: center;
    border-bottom: 1px solid #f5ac9e;
    padding: rems(30) 0 rems(10) 0;
  }
}
.querenbox{
  @include item;
  font-size: rems(28);
  text-align: center;
  margin-top: rems(30);
  p{
    width: 50%
  }
  .pp1{
    color: #f5ac9e;

  }
  .pp2{
    color: #999999
  }
}

</style>