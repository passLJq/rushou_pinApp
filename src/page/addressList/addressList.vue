<template>
  <section>
    <div
      class="listbox"
      v-for="(item,index) in data"
      :key="item.addressid"
      @click="orderin(item.addressid)"
    >
      <div class="head">
        <p>{{item.name}}</p>
        <p>{{item.phone}}</p>
        <p v-if="index==0" class="moren">默认</p>
      </div>
      <p class="main">{{item.listdis}}{{item.address}}</p>
      <div class="foot">
        <p @click="bianji(item.addressid)">编辑</p>
        <p @click="DleRess(item.addressid)">删除</p>
      </div>
    </div>
    <div v-if="data.length<1" class="nodata">
      <img src="../../img/noaddress.png" alt>
      <p>您还没有收货地址~</p>
    </div>
    <div class="btnbox" @click="bianji()">
      <div class="btns">
        <img src="../../img/CombinedShape.png">新增一个地址
      </div>
    </div>
  </section>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      data: []
    };
  },
  watch: {},
  computed: {},
  methods: {
    listdata() {
      var that = this;
      https({
        url: siteUrl + "Main/Member/GetAddressList?devicetype=7",
        data: {
          uid: getname()
        },
        headers: 1,
        successBack: function(ret) {
          if (ret.success && ret.status == 1) {
            if (ret.Data) {
              that.data = ret.Data;
            }
          } else if (ret.success && ret.status == 2) {
            //没有收货地址
          } else {
            promptMsg(ret.err);
          }
        }
      });
    },
    getCitys() {
      var cityFile = api.readFile({
        sync: true,
        path: "fs://cityes.json"
      });
      if (!cityFile) {
        showLoading();
        var that = this;
        https({
          url: siteUrl + "Main/Main/GetDistrict",
          data: {
            uid: getname()
          },
          headers: 1,
          successBack: function(ret) {
            if (ret.success) {
              var data = that.refull(ret.Data);
              api.writeFile(
                {
                  path: "fs://cityes.json",
                  data: $api.jsonToStr(data)
                },
                function(ret, err) {
                  if (ret.status) {
                    //成功
                  }
                }
              );
            }
            hideLoading();
          }
        });
      }
    },
    refull(arr) {
      var n = [];
      var v = [];
      var new_list = [];
      var that = this;
      for (var m = 0; m < arr.length; m++) {
        v.push(arr[m].name);
      }
      for (var i = 0; i < v.length; i++) {
        if (n.indexOf(v[i]) == -1) {
          n.push(v[i]);
          if (arr[i].sub) {
            arr[i].sub = that.refull(arr[i].sub);
          }
          new_list.push(arr[i]);
        }
      }
      return new_list;
    },
    bianji(addressid) {
      openWin(
        {
          name: "addressdesc",
          url: "./addressdesc.html",
          pageParam: {
            title: "编辑地址",
            addressid: addressid ? addressid : ""
          }
        },
        1
      );
    },
    //删除地址
    DleRess(addressid) {
      comfirmDialogBox("您确定要删除吗?", this.addressCallBack, addressid);
    },
    addressCallBack(addressid) {
      var that = this;
      https({
        url: siteUrl + "Main/Member/DeleteAddress?uid=" + getname(),
        method: "post",
        data: {
          addressid: addressid
        },
        headers: 1,
        successBack: function(ret) {
          if (ret.success && ret.status == 1) {
            promptMsg("删除成功！");
            that.listdata();
          } else {
            promptMsg("删除失败！");
          }
        }
      });
    },
    //订单选择时进来的
    orderin(addressid) {
      if (pageParam("way")) {
        api.execScript({
          name: pageParam("frame_name"),
          frameName: pageParam("frame_name"),
          script: `BindAdress('${addressid}')`
        });
        setTimeout(function() {
          api.closeWin();
        }, 1000);
      }
    }
  },
  created() {},
  mounted() {
    this.listdata();
    if (window.api) {
      this.getCitys();
    }
    var that = this;
    window.onshow = function() {
      that.listdata();
    };
  }
};
</script>
<style lang="scss">
body {
  background: rgba(246, 246, 250, 1);
}
.listbox {
  background: #fff;
  padding: 0 rems(32);
  margin-bottom: rems(10);
}
.head {
  @include item;
  font-size: rems(34);
  color: #333;
  padding: rems(20) 0;
  p:nth-child(1) {
    width: 23%;
    margin-right: rems(8);
    flex-shrink: 0;
    overflow: hidden;text-overflow:ellipsis;white-space: nowrap;
  }
}
.main {
  color: #666666;
  font-size: rems(24);
  padding-bottom: rems(16);
  border-bottom: 1px solid rgba(246, 246, 250, 1);
}
.foot {
  font-size: rems(24);
  @include item;
  padding: rems(18) 0;
  justify-content: flex-end;
  p:nth-child(1) {
    margin-right: rems(70);
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
    @include item;
    justify-content: center;
    img {
      width: rems(40);
      height: rems(40);
      margin-right: rems(20);
    }
  }
}
.moren {
  background: linear-gradient(
    270deg,
    rgba(254, 51, 75, 1) 0%,
    rgba(255, 114, 130, 1) 100%
  );
  border-radius: 30px;
  padding: rems(4) rems(24);
  font-size: rems(24);
  margin-left: rems(20);
  color: #fff;
}
</style>