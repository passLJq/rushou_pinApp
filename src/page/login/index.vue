<template>
  <div>
    <header>
      <div class="title">
        <span>
          <img src="../../img/logoshou.png" alt="社交化美食分享平台" style="width:72px;height:72px">
        </span>
        <!-- <span>社交化美食分享平台</span> -->
      </div>
    </header>
    <div v-show="showInput" id="logo_page">
      <div class="content">
        <div class="form">
          <div class="input-wrap">
            <input type="tel" placeholder="请输入手机号" class="txt" id="telphone" maxlength="11" v-model="telphone">
          </div>
          <div class="input-wrap">
            <div class="input-wrap-list">
              <input
                type="tel"
                placeholder="请输入短信验证码"
                class="txt code-input"
                v-model="smscode"
                id="smscode"
                maxlength="4"
              >
            </div>
            <div class="nput-wrap-list-ft" style="display: flex;">
              <span class="code-btn" v-show="times==120" id="sendValidcode" @click="getSmsCode">获取验证码</span>
              <span class="code-btn" v-show="times!=120" style="color: rgb(219, 219, 219);">{{times}}S后重新获取</span>
            </div>
          </div>
        </div>
        <div class="button margin-top-25" tapmode @click="LoginIn" :style="smskey&&smscode.length==4?'background: -webkit-linear-gradient(left, #ff4200, #f72213);color:#fff;':''">登&nbsp;录</div>
        <!-- <p class="login-content white">无需注册，手机验证码直接登录</p> -->
      </div>
      <div class="clearfix"></div>
      <div class="footer-ft hide" id="divwechat">
        <div style="color:#DBDBDB; font-size: 12px; margin-bottom: 5%;">────── 第三方登录 ──────</div>
        <div @click="WeLoginIn" class="btn_weixin">
          <img
            src="../../img/weixin_logo.png"
          >微信快捷登录
        </div>
      </div>
    </div>

    <div id="main_page" v-if="showWx">
      <div @click="WeLoginIn" class="weixin_btn_index">
        <img
          src="../../img/weixin_logo_white.png"
        >微信快捷登录
      </div>
      <div class="line_center"></div>
      <div class="to_tel_logo" @click="changeLogoPage">使用手机号码登录</div>
    </div>

    <div class="inv" v-show="showInv">
    <!-- <div class="inv"> -->
      <div class="inv_box">
        <!-- <span>{{invMsg ? '确认邀请人' : '填写邀请码'}}</span> -->
        <!-- <span>确认邀请人</span> -->
        <span>填写邀请码</span>
        <!-- <div class="inv_man">
          <img src="../../img/man.jpg">
          <span>123</span>
        </div> -->
        <input style="outline:none;" class="inv_inp" maxlength="6" v-model="invcode" type="number">
        <div class="btn" @click="nextStep">下一步</div>
        <div class="boxirem">
        <!-- <div class="btns" data-click="comfirmqu">上一步</div>    
        <div class="btns" data-click="openShop">确定</div> -->
        </div>
      </div>
    </div>

    <div class="inv" v-show="showInv2">
      <div class="inv_box">
        <span>确认邀请人</span>
        <div class="inv_man">
          <img :src="invMsg.refereeimg">
          <span>{{invMsg.referee}}</span>
        </div>
        <div class="boxirem">
        <div class="btns" @click="quxiao">取消</div>    
        <div class="btns" @click="openShop">确定</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
var timer = null
export default {
  components: {},
  props: {},
  data() {
    return {
      showWx: false,
      showInput: false,       // 显示输入
      telphone: "",
      smscode: "",
      smskey: "",
      times: 120,
      showInv: false,
      showInv2: false,
      invcode: '',            // 输入邀请人号码
      invMsg: '',
      status: 0,
    };
  },
  watch: {
    telphone(val) {
      this.telphone = $api.trim(val)
    },
    smscode(val) {
      this.smscode = $api.trim(val)
    }
  },
  computed: {},
  methods: {
    WeLoginIn() {
      var wx = api.require('wx');
      wx.auth({
        apiKey: ''
      }, function(ret, err) {
        console.log(JSON.stringify(ret))
        if (ret.status) {
          //授权登录
          api.ajax({
            url: siteUrl +'Main/Login/LoginInWeChat?devicetype=7',
            method: 'get',
            dataType:'json',
            data: {
              values: {
                code: ret.code
              }
            }
          }, function(ret, err) {
            console.log(JSON.stringify(ret))
            if(ret){
              if(ret.success){
                if(ret.status==1){
                  //登录成功
                  //设置登录状态
                  api.setPrefs({ key:'SessionUserID',value:ret.data.userid});
                  api.setPrefs({ key:'SessionKey',value:ret.data.sessionkey});
                  api.setPrefs({ key:'SessionShopID',value:ret.data.fxshopid});
                  api.setPrefs({ key:'loginStatus',value:'loginSuccess'});
                  $api.rmStorage('sessionsmscode');
                  //推送开始
                  var push = api.require('push');
                  push.bind({
                      userName: 'pushname',
                      userId: ret.data.userid
                  }, function(ret, err){
                  });
                  //跳转视图
                  api.closeWin({
                      type:"none",
                      duration:100
                  });
                  if(api.pageParam.isIndexComming) {
                    api.execScript({
                        name: 'root',
                        frameName: 'new_showcoupon',
                        script: 'clos();'
                    });
                  }
                  api.execScript({
                      name: 'root',
                      frameName:'mycenter_body',
                      script: 'BindData()'
                  });
                  //api.sendEvent广播登录成功事件
                  api.sendEvent({
                     name: 'loginSuccess'
                  });
                  if(ret.data.fxshopid!=null&&ret.data.fxshopid!=""){
                    api.sendEvent({
                       name: 'hasshopid'
                    });
                  }
                } else if(ret.status==100){
                  // api.showProgress({
                  //     text: '系统正在处理，请耐心等待...',
                  //     modal: true
                  // });
                  if(ret.data.accesstoken!=null&&ret.data.openid!=null){
                    api.openWin({
                      name: 'login_bindmobile',
                      url: './login_bindmobile.html',
                      pageParam: {
                        accesstoken: ret.data.accesstoken,
                        openid: ret.data.openid,
                        refreshtoken: ret.data.refreshtoken,
                        expiresin: ret.data.expiresin,
                        headphoto : ret.data.headphoto,
                        userName: ret.data.username,
                        isIndexComming: api.pageParam.isIndexComming
                      }
                    });
                  } else {
                    promptMsg('返回参数错误');
                  }
                } else {
                  promptMsg(ret.err);
                }
              } else {
                promptMsg(ret.err);
              }
            }
            else{
              promptMsg(err.msg);
            }
          });
        } else {
          switch(err.code){
            case -1:
              promptMsg("当前设备未安装微信，请使用账号以及验证码登录");
              break;
            case 1:
              promptMsg("您已取消授权登录");
              break;
            case 2:
              promptMsg("您拒绝授权，登录失败");
              break;
            case 3:
              promptMsg("当前设备未安装微信，请使用账号以及验证码登录");
              break;
            default:
              promptMsg("当前设备未安装微信，请使用账号以及验证码登录");
              break;
          }
        }
      });
    },
    // 取消
    quxiao() {
      this.showInv = false
      this.showInv2 = false
      this.invcode = ''
      this.invMsg = ''
    },
    // 下一步
    nextStep() {
      https({
        url: siteUrl + 'Main/Member/GetCodeUser?uid=' + getname(),
        data: {
          code: this.invcode
        },
        successBack: ret => {
          let data = ret
          if (data.success && data.status == 1) {
            this.invMsg = { referee: data.reobj.referee, refereeimg: data.reobj.refereeimg}
            this.$nextTick(() => {
              this.showInv = false
              this.showInv2 = true
            })
          }else{
            promptMsg(data.err)
          }
        }
      })
    },
    changeLogoPage() {
      this.showInput = true
      this.showWx = false
    },
    getSmsCode() {
      if(this.telphone==null||this.telphone==''){
        promptMsg('请输入手机号码');
        return;
      }
      if(!/^[1]+[3,4,5,6,7,8,9]+\d{9}$/.test(this.telphone)){
        promptMsg('手机号码格式错误');
        return;
      }
      https({
        url: siteUrl +'Main/Login/SendSMSCode',
        data: {
              telphone: this.telphone
        },
        successBack: ret => {
          if (ret.success && ret.status == 1) {
            this.smskey = ret.Data
            promptMsg("发送成功");
            var datetime = new Date();
            var json = {
              code:ret.Data,
              time:datetime.getTime()
            };
            var smscodejson = $api.jsonToStr(json);
            $api.setStorage('sessionsmscode',smscodejson);
            this.countTime()
          } else {
            promptMsg(ret.err)
          }
        }
      })
    },
    countTime() {
      timer = setInterval(() => {
        --this.times
        if (this.times<=0) {
          clearInterval(timer)
          timer = null
          this.times = 120
        }
      }, 1000)
    },
    LoginIn(code) {
      this.status = ''
      if(this.telphone == '15989289012'){
        var datetime = new Date();
        var json = {
          code:'4b49fd74e877d70276951435d388a319',
          time:datetime.getTime()
        };
        var smscodejson = $api.jsonToStr(json);
        $api.setStorage('sessionsmscode',smscodejson);
      }
      if(this.telphone==null||this.telphone==''){
        promptMsg('请输入手机号码');
        return;
      }
      if(this.smscode==null||this.smscode==''){
        promptMsg('请输入验证码');
        return;
      }
      if(!/^[1]+[3,4,5,6,7,8,9]+\d{9}$/.test(this.telphone)){
        promptMsg('手机号码格式错误');
        return;
      }
      if(this.smscode.length!=4){
        promptMsg('验证码错误');
        return;
      }
      //测试环境暂时隐藏
      var sessionsmscode = $api.getStorage('sessionsmscode');
      if(sessionsmscode == null){
        promptMsg('验证码已过期');
        return;
      } else {
        var time = $api.strToJson(sessionsmscode).time;
        var nowtime = new Date();
        if((nowtime.getTime()-time)> 120*1000 ){
          promptMsg('验证码已过期');
          $api.rmStorage('sessionsmscode');
          return;
        }
      }

      https({
        url: siteUrl +'Main/Login/LoginIn',
        data: {
          telphone: this.telphone,
          smscode : this.smscode,
          smspassword : this.smskey,
          devicetype: 7,
          code: code ? this.invcode : ''
        },
        successBack: (ret) => {
          this.status = ret.status
          if(ret.success){
            if (ret.status == 99) {
              this.showInv = true
            } else if (ret.status == 100) {
              this.showInv = true
            } else if(ret.status==1){
              //登录成功
              //设置登录状态
              setname('SessionUserID',ret.data.userid)
              setname('SessionName',ret.data.telphone)
              setname('SessionKey',ret.data.sessionkey)
              setname('SessionShopID',ret.data.fxshopid)
              setname('loginStatus','loginSuccess')
              $api.rmStorage('sessionsmscode')
              //不为0表示首次注册
              if(ret.data.newcouponnum!=0){
                api.sendEvent({
                  name: 'newuser',
                  extra: {
                        key1:ret.data.newcouponnum ,
                  }
                });
                if(pageParam('isIndexComming')) {
                  api.execScript({
                      name: 'root',
                      frameName: 'new_showcoupon',
                      script: 'getMsg();'
                  });
                }
              }else {
                if(pageParam('isIndexComming')) {
                  api.execScript({
                      name: 'root',
                      frameName: 'new_showcoupon',
                      script: 'clos();'
                  });
                }
              }
              //推送开始
              var push = api.require('push');
              push.bind({
               userName: ret.data.telphone,
               //userId: '15989289012'
               userId: ret.data.userid
              }, function(ret, err){
               
              });
              //跳转视图
              api.closeWin();
              //api.sendEvent广播登录成功事件
              api.sendEvent({
                name: 'loginSuccess'
              });
              api.execScript({
                name: 'root',
                frameName:'mycenter_body',
                script: 'BindData()'
              });
              api.execScript({
                name: 'root',
                script: 'ShoppingCartCount();'
              });
              if(ret.data.fxshopid!=null&&ret.data.fxshopid!=""){
                api.sendEvent({
                   name: 'hasshopid'
                });
              }
            } else {
              promptMsg(ret.err);
            }
          }
          else{
              promptMsg(ret.err);
          }
        }
      })
    },
    // 开实习店主
    openShop() {
      // 已登录未填邀请码不给开店
      if (this.status == 100) {
        this.LoginIn(1)
        return
      }
      var that = this
      https({
        method: 'POST',
        url: siteUrl + '/Main/Member/OpenPracticeShop?uid=' + getname() + '&devicetype=7',
        data: {
          uid: getname(),
          code: that.invcode,
          devicetype: 7,
          shopname: this.telphone,
          txtwx: this.telphone,
          ruid: '',
          notice: '入手全球尖货，优选品质生活',
          formid: 'the formId is a mock one'
        },
        headers: 1,
        successBack: ret => {
          if (ret.status == 1 && ret.success) {
            this.LoginIn(1)
          } else {
            promptMsg(ret.err)
          }
        }
      })
    },
  },
  created() {},
  mounted() {
    var that = this;
    // var s = getname("statustop") || 0;
    // $api.byId("main").style.height = s + "px";
    if (window.api) {
      var wx = api.require("wx");
      wx.isInstalled(function(ret, err) {
        if (ret.installed) {
          that.showWx = true
        } else {
          that.showWx = false
          that.showInput = true
        }
      })
    } else {
      that.showWx = true
    }
  }
};
</script>
<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body,
html {
  height: 100%;
  overflow: hidden;
  background-color: #fff;
}

header {
  display: -webkit-box;
}
.title {
  width: 100%;
  height: auto;
  overflow: hidden;
  font-size: 1.25rem;
  text-align: center;
  margin-top: 20%;
  color: #fff;
}
.title span {
  display: block;
}
.input-wrap {
  padding: 10px 0;
  display: -webkit-box;
  display: -moz-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  border-bottom: 1px solid #d4d4d4;
}
.form {
  margin: 40px 35px 0 35px;
  border-radius: 8px;
  line-height: rems(32);
}
.input-wrap input {
  display: block;
  -webkit-box-flex: 1;
  outline: 0;
  height: 30px;
  font-size: 15px;
  color: #333;
  border: 0;
}
.input-wrap .input-wrap-list {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
}
.code-input {
  width: 100%;
  border: 0;
  outline: 0;
  -webkit-appearance: none;
  background-color: transparent;
  font-size: inherit;
}
.code-btn {
  display: inline-block;
  vertical-align: middle;
  color: #f72133;
  border: none;
  background-color: transparent;
  font-size: rems(28);
  // line-height: rems(24);
}
.button,
.btn_weixin,
.weixin_btn_index {
  display: block;
  color: #fff;
  font-weight: 400;
  margin: 40px 40px 10px;
  text-align: center;
  border-radius: 40px;
  height: 44px;
  line-height: 44px;
  background-color: rgba(219, 219, 219, 1);
  font-size: rems(28);
  img {
    //  width: rems(43);
     height:rems(35);
     vertical-align: middle;
    padding-right: rems(20);
  }
}
.login-content {
  width: 100%;
  text-align: center;
  margin: 10px auto;
  font-size: 0.875rem;
}
.footer-ft {
  padding-top: 10%;
  padding-bottom: 10px;
  text-align: center;
}
input::-ms-input-placeholder {
  color: #666;
  font-size: 13px;
  font-family: "微软雅黑";
}
input::-webkit-input-placeholder {
  color: #666;
  font-size: 13px;
  font-family: "微软雅黑";
}
.hide {
  display: none;
}

.btn_weixin {
  color: #62b900;
  border: 1px solid #62b900;
  background-color: #fff;
  margin-top: 0;
}
.weixin_btn_index {
  font-size: rems(28);
  color: #fff;
  background: linear-gradient(left, #ff4200, #f72213);
  background: -o-linear-gradient(left, #ff4200, #f72213);
  background: -ms-linear-gradient(left, #ff4200, #f72213);
  background: -moz-linear-gradient(left, #ff4200, #f72213);
  background: -webkit-linear-gradient(left, #ff4200, #f72213);
  box-shadow: 5px 5px 0 0 #fb848e;
  -moz-box-shadow: 0px 3px 7px #fb848e;
  -webkit-box-shadow: 0px 3px 7px #fb848e;
  box-shadow: 0px 3px 7px #fb848e;
}
.line_center {
  margin: 10% auto;
  border-bottom: 2px solid #ccc;
  width: 12%;
}
.to_tel_logo {
  text-decoration: underline;
  color: #f72133;
  font-size: 15px;
  text-align: center;
  padding: 10px 0;
}
@media screen and (max-width: 330px) {
  .title {
    margin: 8% 0 6% 0;
  }
  header {
    display: -webkit-box;
    margin-top: 5%;
  }
}

.inv {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(51,51,51,0.7);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 999;
}

.inv_box {
	width:rems(576);
	height:rems(380);
	background:rgba(255,255,255,1);
	border-radius:rems(16);
	transform: translateY(-rems(50));
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0 rems(45);
	box-sizing: border-box;
}

.inv_box > span:nth-child(1) {
	font-size:rems(36);
	font-weight:600;
	color:rgba(51,51,51,1);
	margin-top: rems(40);
}

.inv_box .inv_inp {
	width: 100%;
	border-bottom: rems(2) solid rgba(51,51,51,.2);
	font-size: rems(34);
	color: #999;
	margin-top: rems(80);
	text-align: center;
}

.inv_box .btn {
	font-size: rems(28);
	color: #fff;
	font-weight: 600;
	width:rems(480);
	padding: rems(16) 0;
	text-align: center;
	/* height:rems(72); */
	background:linear-gradient(270deg,rgba(254,51,75,1) 0%,rgba(255,114,130,1) 100%);
	border-radius:rems(96);
	position: absolute;
	left: rems(45);
	bottom: rems(20);
}

.inv_man {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: rems(30);
}
.inv_man img {
	width:rems(96);
	height:rems(96);
	border-radius: 50%;
}

.inv_man span {
	font-size: rems(24);
	color: #999;
	margin-top: rems(15);
}
.boxirem{
  display: flex;
  align-items: center;
  position:absolute;
  bottom:rems(20);
  justify-content: space-around;
  width: 100%;
	left: 0;
}
.btns{
  font-size:rems(28);
  color:#fff;
  font-weight:600;
  padding:rems(16) 0;
  text-align:center;
  background:linear-gradient(270deg,rgba(254,51,75,1) 0%,rgba(255,114,130,1) 100%);
  border-radius:rems(96);
  width: 40%
}

</style>