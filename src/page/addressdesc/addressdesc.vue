<template>
  <section>
    <div class="boxli">
      <p class="p1">收货人</p>
      <input type="text" placeholder="请填写收货人的姓名" v-model="name" maxlength="20">
    </div>
    <div class="boxli">
      <p class="p1">手机号码</p>
      <input type="tel" placeholder="请填写收货人的手机号码" maxlength="11" v-model="phone">
    </div>
    <div class="boxlis" @click="showCity">
      <p class="p1">所在地区</p>
      <p style="width:100%;text-align:left">{{showareaname}}</p>
      <i class="newright-arrow"></i>
    </div>
    <div class="xiangxidizhi" @click="fousinput">
      <div>
        <p class="adderss" v-if="address">
          <span>详细地址</span>
          {{address}}
        </p>
        <p class="adderss" v-else>
          <span>详细地址</span>请填写详细地址
        </p>
      </div>
      <input type="text" v-model="address" class="addinput" ref="addinput" maxlength="50">
    </div>
    <div class="boxlis">
      <p>设置为默认地址</p>
      <van-switch v-model="checked" active-color="#FE334B" inactive-color="#d8d8d8"/>
    </div>
    <div class="btnbox" @click="save">
      <div class="btns">保存地址</div>
    </div>
  </section>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      checked: false,
      name: "", //名字
      showareaname: "", //展示用地区
      areacode: "", //地址编码
      address: "", //详细地址
      phone: "", //电话号码,
      onec: false
    };
  },
  watch: {},
  computed: {},
  methods: {
    bindata() {
      var that = this;
      https({
        url: siteUrl + "Main/Member/GetOneAddress?devicetype=7",
        data: {
          uid: getname(),
          addressid: pageParam("addressid")
        },
        headers: 1,
        successBack: function(ret) {
          if (ret.status == 1 && ret.success) {
            that.name = ret.Data.name;
            that.showareaname = ret.Data.listdis;
            that.areacode = ret.Data.areacode;
            that.address = ret.Data.address;
            that.phone = ret.Data.phone;
          } else {
            promptMsg(ret.err);
          }
        }
      });
    },
    fousinput() {
      this.$refs.addinput.focus();
    },
    save() {
      var that = this;
      if (that.name == null || that.name == "") {
        promptMsg("请填写收货人的姓名");
        return false;
      }
      if (that.areacode == null || that.areacode == "") {
        promptMsg("请选择区域");
        return false;
      }

      if (that.address == null || that.address == "") {
        promptMsg("请填写详细地址");
        return false;
      }
      if (that.phone == null || that.phone == "" || that.phone.length < 11) {
        promptMsg("请填写正确的联系方式");
        return false;
      }
      if (that.onec) {
        promptMsg("请勿重复提交");
        return;
      }
      that.onec = true;
      https({
        url: siteUrl + "Main/Member/InsertorUpdateAddress?devicetype=7&uid=" + getname(),
        method: "post",
        data: {
          addressID: pageParam("addressid"),
          uid: getname(),
          isdefult: that.checked ? 1 : 0, //0否1是
          name: that.name, //姓名
          areacode: that.areacode, //区域
          address: that.address, //详细地址
          phone: that.phone //电话
        },
        headers: 1,
        successBack: function(ret) {
          if (ret.success && ret.status == 1) {
            promptMsg("操作成功");
            setTimeout(function() {
              backUrl();
            }, 500);
          } else {
            that.onec = false;
            promptMsg("操作失败");
          }
        }
      });
    },
    showCity() {
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
            if (ret.eventType == "ok") {
              if (ret.selectedInfo.length > 0) {
                if (ret.selectedInfo.length == 1) {
                  that.showareaname = ret.selectedInfo[0].name;
                } else if (ret.selectedInfo.length == 2) {
                  that.showareaname =
                    ret.selectedInfo[0].name + " " + ret.selectedInfo[1].name;
                } else if (ret.selectedInfo.length == 3) {
                  that.showareaname =
                    ret.selectedInfo[0].name +
                    " " +
                    ret.selectedInfo[1].name +
                    " " +
                    ret.selectedInfo[2].name;
                }
                that.areacode =
                  ret.selectedInfo[ret.selectedInfo.length - 1].code;
              }
            }
          } else {
            promptMsg(JSON.stringify(err));
          }
        }
      );
    }
  },
  created() {},
  mounted() {
    if (pageParam("addressid")) {
      this.bindata();
    }
  }
};
</script>
<style lang="scss">
body {
  background: #fff;
}
.p1 {
  width: 20%;
  flex-shrink: 0;
}
.boxli {
  @include item;
  padding: rems(28) 0;
  margin: 0 rems(32);
  font-size: rems(28);
  border-bottom: 1px solid rgba(246, 246, 250, 1);
}
.boxlis {
  @include item;
  padding: rems(28) 0;
  margin: 0 rems(32);
  justify-content: space-between;
  font-size: rems(28);
  border-bottom: 1px solid rgba(246, 246, 250, 1);
}
input {
  outline: none;
  width: 100%;
}
.xiangxidizhi {
  display: flex;
  position: relative;
  font-size: rems(28);
  padding: rems(28) 0;
  margin: 0 rems(32);
  flex-wrap: wrap;
  min-height: rem(80);
  border-bottom: 1px solid rgba(246, 246, 250, 1);
}
.addinput {
  position: absolute;
  left: -600999px;
}
.adderss {
  color: #999;
  span {
    color: #000;
    margin-right: rems(10);
  }
}
.btnbox {
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #fff;
  box-shadow: 0px -2px 20px 0px rgba(216, 216, 216, 0.3);
  .btns {
    width: 60%;
    margin: rems(20) auto;
    text-align: center;
    font-size: rems(34);
    padding: rems(10) 0;
    border-radius: 30px;
    background-color: #fe334b;
    color: #fff;
  }
}
</style>