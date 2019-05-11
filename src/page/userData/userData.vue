<template>
  <div>
    <div class="user_info">
      <ul id='user_ul'>
        <li class="clear" @click="showMask(1)">
          <div class="list_container">
            <div class="fl list_left_title">头像</div>
            <div class="fr user_pic_right right_content">
              <img :src="msg.pic || './img/man.jpg'" id="user_img" class="user_pic_container" alt="">
            </div>
          </div>
        </li> 
        <li class="clear" @click="toChangeName">
          <div class="list_container">
            <div class="fl list_left_title">昵称</div>
            <div class="fr right_content">
              <span id="user_name">{{msg.name}}</span>
            </div>
          </div>
        </li> 
        <li class="clear" @click="showMask(2)">
          <div class="list_container">
            <div class="fl list_left_title">性别</div>
            <div class="fr right_content">
              <span id="user_sex">{{msg.sex == 1 ? '男' : msg.sex == 2 ? '女' : '其他'}}</span>
            </div>
          </div>
        </li> 
        <li class="clear" @click="toBindWx(msg.iswx)">
          <div class="list_container">
            <div class="fl list_left_title">微信</div>
            <div class="fr right_content">
              <span>{{msg.iswx == 0 ? '未绑定' : '已绑定'}}</span>
            </div>
          </div>
        </li>
        <li class="clear" @click="loginOut">
          <div class="list_container">
            <div class="fl list_left_title">退出账号</div>
            <div class="fr right_content">
              <!-- <span id="user_name">{{msg.name}}</span> -->
            </div>
          </div>
        </li> 
      </ul>
    </div>

    <div class="mask_container" @click="closeMask" v-show="showPop">
      <div :style="{bottom: showPop ? '0px' : '-100%'}">
        <div class="mask_list">
          <ul>
            <li class="mask_title"></li>
            <li class="mask_camera" @click="checkMsg(1, 1)"></li>
            <li class="mask_album" @click="checkMsg(2, 2)"></li>
          </ul>
        </div>
        <div class="mask_cancel" @click="closeMask">
          <div>取消</div>
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
      msg: '',
      phon: '',
      showPop: false,
      changeSex: false
    }
  },
  watch:{
    showPop(val) {
      if (!val) {
        this.changeSex = false
      }
    }
  },
  computed:{},
  methods: {
    showMask(type) {
      if(type == 1) {
        $api.html($api.dom(".mask_title"), "更改头像")
        $api.html($api.dom(".mask_camera"), "拍照")
        $api.html($api.dom(".mask_album"), "从图库选择")
      }else {
        $api.html($api.dom(".mask_title"), "更改性别")
        $api.html($api.dom(".mask_camera"), "男")
        $api.html($api.dom(".mask_album"), "女")
        this.changeSex = true
      }
      this.showPop = true
    },
    checkMsg(e, type) {
      if(this.changeSex) {
        document.getElementById("user_sex").innerHTML = e == 1 ? '男' : '女'
        this.msg.sex = e
        this.postMsg(2)
      }else {
        if(type == 1) {
          this.openSystemPic('camera')
        }else {
          this.openSystemPic('album')
        }
      }
      this.showPop = false
    },
    closeMask(e) {
      this.showPop = false
    },
    openSystemPic(type){
      var that = this
      this.showPop = false
      api.getPicture({
        sourceType: type,
        mediaValue: 'pic',
        destinationType: 'base64',
        allowEdit: true,
        targetWidth: 300,
        targetHeight: 300,
        saveToPhotoAlbum: false
      }, function(ret, err) {
        if (ret.data) {
          $api.attr($api.byId('user_img'), 'src',ret.data);
          api.ajax({
            url: memberSiteUrl+'/Ajax/FileUpload.ashx',
            method: 'post',
            data: {
              files: {
                  file: ret.data
              }
            }
          }, function(ret, err) {
            if(api.systemType=="android"){
              if (ret) {
                if(ret.success){
                  that.phon=ret.fullurl
                  that.postMsg(4)
                }
              } else {
                promptMsg(err.msg)
              }
            }
            else if(api.systemType=="ios"){
              //解决奇怪的ios端问题
              var iosdata = JSON.parse(err.body.replace(/'/g,'"'));
              if(iosdata.success){
                that.phon=iosdata.fullurl
                that.postMsg(4)
              }else{
                promptMsg(err.msg)
              }
            }
          })
        }
        else {
          promptMsg('上传取消')
        }
      })
    },
    // subb(phon){
    //   var that = this
    //   var name=document.getElementById("user_name");
    //   var phone=$api.val($api.byId('user_phone'));
    //   var zoneNames=document.getElementsByName("inlineRadioOptions");
    //   var reg = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;  //验证固定电话，手机号码
    //   var myvalue="";
    //   for(var i=0;i<zoneNames.length;i++){
    //     var zoneName=zoneNames[i];
    //     if(zoneName.checked){
    //       myvalue=zoneName.value;
    //     }
    //   }
    //   if(name.value==''|| name.value.length < 3 || name.value.length>11 || !nameReplace(name)){
    //     promptMsg('昵称为3-11位数字,字母,中文或_');
    //     name.value = ""
    //     name.focus()
    //     return false;
    //   }
    //   if (!reg.test(phone)) {
    //     promptMsg('电话格式有误，请参照格式：075533560166 或 13570820930');
    //     var num = document.getElementById("user_phone")
    //     num.value = ""
    //     num.focus()
    //     return false;
    //   }
    //   if(myvalue!=1&&myvalue!=2){
    //     promptMsg('请选择性别')
    //     return false;
    //   }
    //   https({
    //       url: siteUrl+'Main/Member/UserEdit?uid='+getname(),
    //       method: 'post',
    //       data: {
    //         body: {
    //           uid:getname(),
    //           name:name.value,
    //           sex:myvalue,
    //           telephone:phone,
    //           headpic: that.phon
    //         }
    //       },
    //       headers: 1,
    //       successBack: (ret, err) => {
    //         if (ret) {
    //           promptMsg('修改成功');
    //           var timer = setTimeout(function () {
    //             clearTimeout(timer)
    //             api.closeWin();
    //           }, 1000)
    //         } else {
    //           api.alert({ msg: JSON.stringify(err) });
    //         }
    //       }
    //   });
    // },
    // nameReplace(self) {
    //   if(/[^\u4E00-\u9FA5A-Za-z0-9_]/ig.test(self.value)) {
    //     return false
    //   }
    //   return true
    // },
    // testTel(self) {
    //   self.value=self.value.replace(/[^0-9]/ig,'')
    //   if(/[0-9]{13,}/.test(self.value)) {
    //     self.value = self.value.substr(0, 12)
    //   }
    // },
    toBindWx(isBind) {
      openWin({
        name: 'change_user_msg',
        url: './change_user_msg.html',
        pageParam: {
          uname: this.msg.name,
          isBind: isBind == 0 ? '' : isBind
        }
      })
    },
    postMsg(type, msg) {
      var that = this
      var newName = ""
      if(type == 1) {
        if(msg) {
          newName = msg
        }
      }
      https({
        url: siteUrl+'Main/Member/UserEdit?devicetype=7&uid='+getname(),
        method: 'post',
        data: {
          uid: getname(),
          name:newName,
          sex:that.msg.sex,
          telephone:"",
          headpic:type==4? that.phon:""
        },
        headers: 1,
        successBack: (ret, err) => {
          if (ret) {
            if(type == 1) {
              // if (window.api) {
              //   api.execScript({
              //     name: 'change_user_msg',
              //     script: 'closeThisWin();'
              //   })
              // }
              document.getElementById("user_name").innerHTML = msg
            }
            promptMsg('修改成功');
          } else {
            api.alert({ msg: JSON.stringify(err) });
          }
        }
      });
    },
    toChangeName() {
      openWin({
        name: 'change_user_msg',
        url: './change_user_msg.html',
        pageParam: {
            isChangeName: true
        }
      });
    },
    loginOut() {
      var that = this
      if (openapp) {
        comfirmDialogBox("您确定要退出账号吗?", that.loginOutBack)
      } else {
        that.loginOutBack()
      }
    },
    loginOutBack() {
      removeName('SessionUserID')
      removeName('SessionName')
      removeName('SessionKey')
      removeName('SessionShopID')
      setname('loginStatus', 'loginFail')
      if (window.api) {
        api.alert({msg:"成功退出登录"},function(){
          api.closeWin()
          api.sendEvent({
            name : 'loginout'
          })
        })
      } else {
        alert('成功退出登录')
        closeWin()
      }
    }
  },
  created(){
    var that = this
    https({
      url: siteUrl + 'Main/Member/GetMemberJson?devicetype=7',
      data:{
        uid: getname()
      },
      headers: 1,
      successBack: ret => {
        if (ret.success && ret.status == 1 && ret.Data != null) {
          this.msg = ret.Data
        } else {
          promptMsg(ret.err)
        }
      }
    })
    if (window.api) {
      api.addEventListener({
        name: 'changeUserName'
      }, function(ret, err){
        console.log(ret)
        that.postMsg(1, ret.value.name)
      });
    }
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
  body {
    background-color: #ffffff;
  }
  /*新样式*/
  .fl {
      float: left;
  }

  .fr {
      float: right;
  }

  .clear {
      content: "";
      display: block;
      clear: both;
      &:nth-child(1) {
        margin-top: rem(20);
      }
  }

  .hide {
      display: none;
  }

  .right_content:after {
      content: " ";
      display: inline-block;
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
      height: rem(6);
      width: rem(6);
      border-width: rem(2) rem(2) 0 0;
      border-color: #c8c8cd;
      border-style: solid;
      position: relative;
      margin: 0 0.3em 0 rem(12);
  }

  #headr {
      -moz-box-shadow: 0 0 rem(14) #f5f4f4;
      -webkit-box-shadow: 0 0 rem(14) #f5f4f4;
      box-shadow: 0 0 rem(14) #f5f4f4;
  }

  #headr > div {
      border: 0;
  }

  #user_ul > li {
      padding: 0 rem(12) 0 rem(16);
  }

  .user_pic_right {
      padding: rem(11) 0;
      display: flex;
      align-items: center;
  }

  .list_container {
      height: rem(48);
      width: 100%;
      overflow: hidden;
      box-sizing: border-box;
      width: 100%;
      line-height: rem(48);
      border-bottom: 1px solid #F6F6FA;
  }

  #user_ul > li:nth-child(1) > .list_container {
      height: rem(70);
      line-height: rem(70);
  }

  .list_left_title {
      color: #333;
      font-size: rem(14);
  }

  .user_pic_container {
      width: rem(48);
      height: rem(48);
      border-radius: 50%;
      background-color: #F6F6FA;
      margin-right: rem(9);
  }

  .right_content {
      font-size: rem(14);
      color: #333;
  }
  /*选择头像遮罩层*/
  .mask_container {
      position: fixed;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background-color: rgba(4,4,15,0.4);
  }

  .mask_container > div {
      position: absolute;
      // bottom: rem(11);
      left: 5%;
      width: 90%;
      text-align: center;
      color: #007AFF;
      font-size: rem(20);
      // transition: all .5s ease-out;
  }

  .mask_list {
      background-color: rgba(248,248,248,0.82);
      border-radius: rem(14);
      overflow: hidden;
      box-sizing: border-box;
  }

  .mask_cancel {
      margin: rem(7) 0 rem(11);
      background-color: rgba(255,255,255,1);
      border-radius: rem(14);
      height: rem(56);
      line-height: rem(56);
  }

  .mask_title {
      height: rem(48);
      line-height: rem(48);
      font-size: rem(14);
      color: #999;
  }

  .mask_album,
  .mask_camera {
      height: rem(57);
      line-height: rem(57);
      border-top: 1px solid rgba(4,4,15,0.3);
  }

  .mask_album:hover,
  .mask_camera:hover,
  .mask_cancel:hover {
      background-color: #eee;
  }

</style>