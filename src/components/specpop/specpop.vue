<template>
<div>
    <!-- <div class="specpop">
      <div class="head">
        <div class="pic">
          <img :src="msg.pic" alt="">
        </div>
        <div class="r">
          <span class="priceee">￥{{price*buyCount|toFixed}}</span>
          <span>已选:{{skutext ? skutext : ''}} X {{buyCount}}</span>
        </div>
      </div>
      <div class="con">
        <div class="item" v-for="(item, index) in spec" :key="index">
          <div class="tit">{{item.specname}}</div>
          <div class="con">
            <div :class="bindClass(index,idx)" v-for="(i, idx) in item.spectext" @click="changSku(i.valueid,index,idx)" :key="idx">{{i.ctmtext}}</div>
          </div>
        </div>
        <div class="nn">
          <div class="tit">购买数量</div>
          <div class="numbox">
            <div class="countt" @click="changCount(-1)"><img src="../../img/jian.png" alt=""></div>
            <div class="num">{{buyCount}}</div>
            <div class="countp" @click="changCount(1)"><img src="../../img/jia.png" alt=""></div>
          </div>
        </div>
      </div>
      <div class="foot" ref="foot">
        <div @click="addCar" v-show="!isopenshop && !groupbuyid">加入购物车</div>
        <div @click="buyNow" v-show="!groupbuyid" :class="isopenshop?'buy':''">立即购买</div>
        <div class="gbb" @click="gogroupbuy" v-show="groupbuyid && isgroupbuy">拼团购</div>
        <div class="zjm" @click="groupbuynow" v-show="groupbuyid && !isgroupbuy">直接买</div>
      </div>
    </div>
  </div> -->
  <!-- <div> -->
      <!-- 拼团规格弹窗 -->
      <div class="sku_prompt_content">
        <div>
          <div class="flex sku_prompt_top overflow_boxsizing">
            <div class="box_proimg_container">
              <img :src="msg.pic">
            </div>
            <div class="flex_1 flex flex_v flex_pack_justify_between sku_top_right">
              <div class="color_333 fs_14 line_over_2 l">
                <span>{{msg.name}}</span>
              </div>
              <div class="flex flex_align_center">
                <div class="new_price_container">￥
                  <span class="new_price">{{price*buyCount|toFixed}}</span> <span class="fs_14 color_999"> ￥{{(oldPrice*buyCount)|toFixed}}</span>
                  <!-- <span class="fs_14">{{gbearn|toFixed}}</span> -->
                </div>
              </div>
            </div>
          </div>
          <div class="conBox">
            <div class="con" v-for="(item, index) in spec" :key="index">
              <p>{{item.specname}}</p>
              <div>
                <span v-for="(i, idx) in item.spectext" @click="changSku(i.valueid,index,idx)" :key="idx" class="btn_sku" :class="bindClass(index,idx)">{{i.ctmtext}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="btnBox flex flex_pack_center flex_align_center fs_14 overflow_boxsizing b" ref="foot">
          <div class="btn_addCart" @click="groupbuynow"  v-show="!isgroupbuy">
            <span>直接买</span>
          </div>
          <div class="btn_buy gradient" @click="gogroupbuy" v-show="isgroupbuy">
            <span>拼团购</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  components:{},
  props:{
    pid: {
      type: String,
      required: false
    },
    gbid: {
      type: String,
      required: false
    },
    orderid: {
      type: String,
      required: false
    },
    gbPrice: {
      type: Number,
      required: false
    },
    gbskuid_prop: {
      type: String,
      required: false
    },
    openGroupbuy: {
      type: Number,
      required: false
    },
    isopenshop: {
      type: Boolean,
      required: false
    },
    packageid: {
      type: String,
      required: false
    },
  },
  data(){
    return {
      isgroupbuy: false,
      groupbuyid: '',
      stocks: 0,
      msg:'',
      productid: this.$props.pid,
      price: 0.00,
      oldPrice: 0,
      spec: '',
      sku: '',
      gbsku: '',             // 拼团规格数据
      rushsku: '',           // 限时抢购规格数据
      specval: '',
      skuid: '',
      gbskuid: '',
      skutext: '',
      buyCount: 1,          // 数量
      minBuyCount: 0,
      maxBuyCount: 0,
      uid: getname(),
      fxshopid: getname('SessionShopID'),
    }
  },
  watch:{
    pid(val) {
      this.getProMsg()
    },
    gbid(val) {
      this.groupbuyid = val
    },
    
    openGroupbuy(val) {
      this.isgroupbuy = val
      console.log(val)
      // 表示直接购买
      if (val == 0) {
        if (this.msg.openspec) {
          this.sku.forEach((item, i) => {
            if (item.skuid == this.skuid) {
              this.price = this.sku[i].saleprice
              this.oldPrice = this.sku[i].marketprice
            }
          })
        } else {
          this.price = this.msg.saleprice
          this.oldPrice = Number(this.msg.marketingprice)
          console.log(this.msg.marketingprice)
        }
      } else {
        if (val && this.gbsku && this.gbsku != '') {
          // this.price = this.gbsku[0].gbskuPrice
          this.sku.forEach((item, i) => {
            if (item.skuid == this.skuid) {
              this.price = this.gbsku[i].gbskuPrice
              this.oldPrice = this.sku[i].saleprice
            }
          })
        } else if (val) {
          this.price = this.$props.gbPrice
          this.oldPrice = this.msg.saleprice
        } else {
          if (this.sku) {
            this.sku.forEach((item, i) => {
              if (item.skuid == this.skuid) {
                this.price = item.saleprice
              }
            })
          } else {
            this.price = this.msg.saleprice
          }
        }
      }
    }
  },
  filters: {
    toFixed(val) {
      if (!val) return '0.00'
      return Number(val).toFixed(2)
    }
  },
  computed:{
    
  },
  created(){
    
    
  },
  mounted(){
    var foot = this.$refs.foot
    var sb = getname('safeAreaBottom') || 0
    foot.style.paddingBottom = Number(sb) + 'px'
  },
  methods:{
    getProMsg() {
      this.groupbuyid = this.$props.gbid
      https({
        url: siteUrl + 'Main/Main/GetProductDetailJson',
        method: 'get',
        data: {
          productId: this.$props.pid,
          gbid: this.$props.gbid,
          userid: this.uid,
          fxshopid: this.fxshopid
        },
        successBack: ret => {
          console.log(ret)
          if (ret) {
            if (ret.success && ret.status == 1) {
              var data = ret.Data
              this.msg = data
              if (data.propackageprice>0){
                this.price = data.propackageprice 
              } else if (data.isrushbuy) {
                this.rushsku = JSON.parse(data.rushbuy.specjson)
                this.price = JSON.parse(data.rushbuy.specjson)[0].Price
              } else {
                this.price = data.saleprice
              }
              this.minBuyCount = data.minbuycount
              this.maxBuyCount = data.maxbuycount
              this.stocks = data.stock
              if (data.openspec) {
                this.getMsg()
              }
            } else {
              prompt(ret.err)
            }
          } else {
            promptMsg(err.Msg)
          }
        }
      })
    },
    getMsg() {
      https({
        url:siteUrl + 'Main/Main/GetProductSkuJson',
        data: {
          productId: this.$props.pid,
          gbid: this.$props.gbid || '',
          fxshopid: getname('SessionShopID')
        },
        successBack: ret => {
          console.log(ret)
          if (ret.success && ret.status == 1) {
            var data = ret.Data
            this.sku = data.sku
            this.gbsku = data.gbsku
            data.spec.map(item => {
              item.spectext = JSON.parse(item.spectext)
            })
            // 开店礼包
            if (this.$props.isopenshop) {
              this.price = data.sku[0].packageprice
            } else if (!this.msg.isrushbuy) {
              this.price = data.sku[0].saleprice
            }
            this.spec = data.spec
            this.skutext = data.sku[0].skutext
            this.specval = data.sku[0].specval
            this.skuid = data.sku[0].skuid
            this.stocks = data.sku[0].stock
            // 拼团多规格
            this.gbskuid = data.gbsku ? data.gbsku[0].gbroductskuid : ''
            // console.log(this.gbskuid)
            console.log(this.gbsku)
          }
        }
      })
    },
    changSku(valueid, index, idx) {
      var that = this
      var oldspecval = this.specval.split(",")
      oldspecval[index] = valueid
      this.specval = oldspecval.toString()
      
      this.sku.forEach((item, idx) => {
        let bus = ''
        //创业礼包读另一个规格
        if (that.$props.isopenshop) {
          bus = Number(this.sku[idx].packageprice).toFixed(2)
        } else if (this.isgroupbuy) {
          bus = Number(this.gbsku[idx].gbskuPrice).toFixed(2)
        } /*else if (this.msg.isrushbuy) {
          bus = Number(this.rushsku[idx].Price).toFixed(2)
        } */else {
          bus = Number(this.sku[idx].saleprice).toFixed(2)
        }
        if(item.specval == this.specval) {
          this.skuid = this.sku[idx].skuid
          this.gbskuid = this.isgroupbuy ? this.gbsku[idx].gbroductskuid : ''
          this.specval = this.sku[idx].specval
          this.skutext = this.sku[idx].skutext
          this.price = bus
          this.stocks = this.sku[idx].stock
        }
      })
      var arr = document.getElementsByClassName('sku'+index)
      for(let i=0;i<arr.length;i++) {
        arr[i].classList.remove('select')
        if (i==idx) {
          arr[i].classList.add('select')
        }
      }
      this.$emit('changeData', {
        skutext: this.skutext,
        buyCount: this.buyCount,
        skuid: this.skuid
      })
    },
    changCount(index) {
      // 拼团购买不能选择数量
      if (this.$props.gbid) return
      var type = index
      let maxCounts = this.maxBuyCount
      let minCounts = this.minBuyCount
      let nowStock = this.stocks
      let buyCounts = this.buyCount
      if (type == -1) {
        if ((minCounts === 0 || buyCounts > minCounts) && buyCounts > 1) {

        }else {
          return
        }
      }
      if(type == 1) {
        if ((maxCounts === 0 && buyCounts < nowStock) || (buyCounts < maxCounts && buyCounts < nowStock)) {

        }else {
          return
        }
      }
      this.buyCount = this.buyCount + type
      // 有规格才改详情页信息
      if (this.msg.openspec) {
        this.$emit('changeData', {
          skutext: this.skutext,
          buyCount: this.buyCount,
          skuid: this.skuid
        })
      }
      
    },
    addCar() {
      var that = this
      if(checkLoginStatus()) {
        if (!that.$props.pid) return promptMsg('商品不存在')
        if(that.buyCount == null || that.buyCount == ''|| that.buyCount < 1){
          promptMsg("请输入正确的数量");
          return;
        }
        if(that.msg.openspec){
          if(that.skutext==""||that.skuid==""||that.price==""||that.specval==""){
            promptMsg("请选择正确的规格")
            return
          }
        }
        if (that.$props.isopenshop) {
          addopencar()
          return
        }
        console.log(getname())
        https({
          url: siteUrl +'Main/Shopping/AddCart?uid='+ getname(),
          method: 'post',
          data: {
            pId: that.$props.pid,
            qty: that.buyCount,
            uid: getname(),
            valids : that.msg.openspec ? that.specval : '',
            rushbuyid: that.msg.isrushbuy ? that.msg.rushbuy.rushbuyid : ''
          },
          headers:1,
          successBack: ret => {
            console.log(JSON.stringify(ret))
            if(ret.success){
              if(ret.status==1){
                promptMsg('添加成功,请到购物车查看');
                // api.execScript({
                //   name: 'root',
                //   frameName: 'shoppingcart_body',
                //   script: 'BindData()',
                // });
                that.$emit('shopcarNum')
              } else{
                promptMsg(ret.err);
              }
            }else{
              if(checkLoginStatus()){
                promptMsg(err.msg);
              }
            }
          }
        })
      }
    },
    // 开店礼包购物车入口
    addopencar() {
      var that = this
      https({
        method:'post',
        url:siteUrl +'Main/PackageShopping/AddCart?uid='+ that.uid,
        data:{
          qty:that.buyCount,
          packageid :api.pageParam.packageid,
          uid: window.api ? api.getPrefs({sync: true,key: 'SessionUserID'}) : $api.getStorage('SessionUserID'),
          valids : that.specval,
        },
        headers:1,
        successBack: ret => {
          if(ret.success&&ret.status==1){
            var text = that.$props.packageid ? "购物袋" : "购物车"
            promptMsg('添加成功,请到'+ text +'查看')
            that.$emit('shopcarNum')
          }else{
            promptMsg(ret.err)
          }
        }
      })
    },
    buyNow() {
      var that = this
      if (checkLoginStatus()) {
        if (!that.$props.pid) return promptMsg('商品不存在')
        if(that.buyCount == null || that.buyCount == ''|| that.buyCount < 1){
          promptMsg("请输入正确的数量");
          return;
        }
        if(that.msg.openspec){
          if(that.skutext==""||that.skuid==""||that.price==""||that.specval==""){
            promptMsg("请选择正确的规格")
            return
          }
        }
        if (that.msg.isrushbuy) {
          if(that.msg.rushbuy.begintimeticks>this.msg.nowtimetick) {
          promptMsg("抢购活动尚未开始，请先加入购物车")
          return
        }
        }
        // 开店礼包购买
        // if (that.$props.isopenshop) {
        //   that.buyopennow(that.buyCount)
        //   return
        // }
        // console.log(that.)
        https({
          url: siteUrl +'Main/Shopping/CheckProductBuyStatus?devicetype=7',
          method: 'get',
          data:{
            uid: window.api ? api.getPrefs({sync: true,key: 'SessionUserID'}) : $api.getStorage('SessionUserID'),
            pid:that.$props.pid,
            buycount:that.buyCount,
            skuid:that.skuid,
            // rushbuyid:that.msg.isrushbuy ? that.msg.rushbuy.rushbuyid : ''
            rushbuyid: ''
          },
          headers: 1,
          successBack: ret => {
            if (ret.success && ret.status == 1) {
              openWin({
                name: 'ordercomfirm',
                url: './ordercomfirm.html',
                pageParam: {
                  way : 'buynow',
                  qty : that.buyCount,
                  skutext: that.skutext,
                  skuid: that.skuid,
                  gbskuid: that.gbskuid,
                  skuprice:that.price,
                  pid : that.$props.pid,
                  rushbuyid:that.msg.isrushbuy ? that.msg.rushbuy.rushbuyid : '',
                    title:'订单确认'
                }
              },1);        
            } else {
              promptMsg(ret.err)
            }
          }
        })
      }
    },
    // 立即购买开店礼包
    buyopennow(num) {
      var that = this
      console.log(that.$props.packageid)
      https({
        url:siteUrl +'Main/PackageShopping/CheckPackageBuyStatus',
        data:{
          uid: window.api ? api.getPrefs({sync: true,key: 'SessionUserID'}) : $api.getStorage('SessionUserID'),
          packageid:that.$props.packageid || '',
          buycount:num,
          skuid: that.skuid
        },
        headers:1,
        successBack: ret => {
          if(ret.success&&ret.status==1){
            var packageselectdata = [];
            packageselectdata.push({
              PackageID:that.$props.packageid,
              BuyCount:num,
              SkuID:this.skuid,
              CompanyID:that.msg.companyid
            });
            console.log(packageselectdata)
            // return
            openWin({
                name: 'packageordercomfirm',
                url: './packageordercomfirm.html',
                pageParam: {
                    packageselectdata: packageselectdata,
                    type:1,
                    skuprice: that.price
                }
            });
          }else{
            promptMsg(ret.err)
          }
        }
      })
    },
    // 绑定类名
    bindClass(index, idx) {
      if (idx == 0) return 'sku' + index + ' ' + 'select'
      return 'sku' + index
    },
    // 拼团购
    gogroupbuy() {
      var that = this
      var opengroupid = that.$props.orderid ? that.$props.orderid : ''
      if (checkLoginStatus()) {
        var that = this
        https({
          url: siteUrl +'Main/Shopping/CheckGroupBuyStatus?devicetype=7',
          method: 'get',
          data: {
            uid: getname(),
            gbid: that.$props.gbid
          },
          headers: 1,
          successBack: (ret) => {
            // console.log(JSON.stringify(ret))
            if (ret.status == 1 && ret.success) {
              if (that.gbsku) {
                openWin({
                  name: 'ordercomfirm',
                  url: './ordercomfirm.html',
                  pageParam: {
                    way : 'groupbuynow',
                    qty : 1,
                    skutext: that.skutext,
                    skuid: that.skuid,
                    gbskuid: that.gbskuid,
                    gbprice: that.price,
                    pid : that.msg.productid,
                    gbid: that.$props.gbid,
                    opengroupid : opengroupid,
                    title:'订单确认',
                    headfree:that.msg.headfree ? 1 : 0 //团长免单
                  }
                },1)
              } else {
                openWin({
                  name: 'ordercomfirm',
                  url: './ordercomfirm.html',
                  pageParam: {
                    way : 'groupbuynow',
                    qty : 1,
                    skutext: '',
                    skuid: that.$props.gbskuid_prop, // 没有规格就传原来规格数据里的gbskuid
                    gbprice: that.price,
                    pid : that.msg.productid,
                    gbid: that.$props.gbid,
                    opengroupid : opengroupid,
                    title:'订单确认',
                    headfree:that.msg.headfree ? 1 : 0 //团长免单
                  }
                },1)
              }
            } else {
              promptMsg(ret.err)
            }
          }
        })
      }
    },
    // 拼团直接买普通商品
    groupbuynow() {
      if (checkLoginStatus()) {
        var that = this
        https({
          url: siteUrl +'Main/Shopping/CheckProductBuyStatus?devicetype=7',
          method: 'get',
          data: {
            uid: getname(),
            pid: that.msg.productid,
            buycount: that.buyCount
          },
          headers: 1,
          successBack: (ret) => {
            // console.log(JSON.stringify(ret))
            if (ret.success && ret.status == 1) {  // 0 处理中 1为成功
              let skuid = ''
              let skuprice = ''
              if (that.gbsku) {
                skuid = that.skuid
              } else {
                skuid = that.$props.gbskuid
              }
              openWin({
                name: 'ordercomfirm',
                url: './ordercomfirm.html',
                pageParam: {
                  way : 'buynow',
                  qty : 1,
                  pid : that.msg.productid,
                  skuid,
                  skutext: that.skutext,
                  skuprice: that.price,
                  title:'订单确认'
                }
              },1)
            } else {
              promptMsg(ret.err)
            }
          }
        })
      }
    }
  },
}
</script>
<style lang="scss" scoped>
 @import "specpop.scss";
</style>