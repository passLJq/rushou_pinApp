/************************
 * 描述：解析广告图片URL
 * 作者：DFM
 * 时间：2018-01-09
************************/
export var AnalysisAdsUrl = {
    clickAds : function(type,title,ref){
      switch (type) {
        case '0': //外部链接
        // var ref=ref+'&isapp=true'
          OpenWebPage(ref,"");
          break;
        case '1': //商品分类
          // OpenProductListPage("","",ref);
          break;
        case '2': //商品品牌
        // api.openWin({
        //     name: 'bidpingpao',
        //     url: 'widget://html/bidshop/bidpingpao.html',
        //     pageParam: {
        //         bid: ref
        //     },
        //     bgColor:"#fff",
        //     useWKWebView:true
        // });
          break;
        case '3': //商品详情
          // OpenProdctPage(ref);
          // openWin({
          //   name:'productDetail',
          //   url:'./productDetail.html',
          //   pageParam:{
          //     pid:ref
          //   }
          // })
          break;
        case '4': //栏目
          // openour(ref,title);
          break;
        case '9': //一些特殊链接
          AnalysisAdsUrl.OpenSpecialLink(ref,title);
          break;
        case '17': //产品品牌
          break;
        case '18': //产品详情
          break;
        case '19': //微官网栏目
          break;
          case '30': //商家页面
          // api.openWin({
          //     name: 'companyshop',
          //     url: '../html/company/companyshop.html',
          //     pageParam: {
          //       companyid:ref,
          //       pre:false
          //     },
          //     bgColor:"#fff",
          //     useWKWebView:true
          // });
            break;
        case '1005': //微拼购
        // api.openWin({
        //     name: 'groupbuy',
        //     url: 'widget://html/order/groupbuy.html',
        //     pageParam: {
        //         gbid: ref
        //     },
        //     useWKWebView:true
        // });

          break;
        default:break;
      }
    },
    OpenSpecialLink:function(ref,title){
        switch (ref) {
          case "user-index":  //用户中心
            ReturnToIndex(4)
            break;
          case "shop-aboutus":    //关于我们
            break;
          case "shop-service":    //在线客服
          // var qiyuSdk = api.require('qiyuSdk');
          // var params = {
          //     source:{
          //         sourceTitle:'首页客服',
          //         sourceUrl:'http://www.qiyukf.com',
          //         sourceCustomInfo:'我是来自自定义的信息'
          //     },
          //     commodityInfo:'',
          //     sessionTitle:'在线客服',
          //     groupId:0,
          //     staffId:0
          // }
          // qiyuSdk.openServiceWindow(params);
            break;
          case "fxuser-index":     //分销用户中心
            break;
          case "shop-index":  //商城首页
            ReturnToIndex(0)
            break;
          case "shop-prolist":  //商品列表
            // OpenProductListPage('','','','','','')
            break;
          case "shop-prolist-new":  //新品
            // OpenProductListPage('','','','new','','')
            break;
          case "shop-prolist-promo":  //特价

            break;
          case "shop-prolist-hot":  //热卖
            // OpenProductListPage('','','','promo','','')
            break;
          case "shop-subscribe":  //加关注链接
            break;
          case "coupon-index":  //用户中心
            break;
          case "shop-cart":    //用户购物车
            break;
          case "user-order":    //订单中心
            break;
          case "user-collection":    //用户收藏夹
            break;
          case "shop-share":    //店铺分享
            break;
          case "shop-map":    //店铺地图
            break;
          case "groupbuy-list":  //微拼购列表
            break;
          case "shop-membercard": //会员卡
            break;
          case "fx_shop-index": //分销微店首页
            break;
          case "fx_shop-prolist": //分销微店商品列表
            break;
          case "fx_shop-prolist-new":  //分销微店新品
            break;
          case "fx_shop-prolist-promo":  //分销微店特价
            break;
          case "fx_shop-prolist-hot":  //分销微店热卖
            break;
          case "fxshop-cart":    //用户购物车
            break;
          case "fxshop-mycommission":    //我的返利
            break;
          case "fxshop-makecommission":    //分销赚返利(我要开店)
            break;
          case "coupon-list":             //领取优惠券
            break;
          case "fxshop-index"://分销店首页2016-8-16新增
            break;
          case "duobao"://分享夺宝列表
            openWin({
              name: "lndianaList",
              url: './lndianaList.html',
              pageParam: {
                title: '天天抽奖'
              }
            },1)
            break;
          case "groupbuylist"://拼团列表
              // openWin({
              //   name:'webapps',
              //   url:'./grouplist.html',
              //   useWKWebView:true,
              //   pageParam:{
              //     title:'劲爆拼团'
              //   }
              // },1)
            break;
          case "coupon_center"://领劵中心
          openWin({
              name: 'coupon_center',
              url: './coupon_center.html',
              pageParam:{
                title:'领劵中心'
              }
          },1);
            break;
          case "packageselect"://高佣专区
          // openWin({
          //     name: 'packageselect',
          //     url: './packageselect.html',
          //     bgColor:'#fff',
          //     useWKWebView:true,
          //     pageParam:{
          //       title:'高佣专区'
          //     }
          // },1);
            break;
            case "our_buy"://官方自营
            // api.openWin({
            //     name: 'companyshop',
            //     url: '../html/company/companyshop.html',
            //     pageParam: {
            //       companyid:'170823105729085905',
            //       pre:false
            //     },
            //     bgColor:"#fff",
            //     useWKWebView:true
            // });
              break;
          case "openkaidian"://开店礼包
          // openWin({
          //         name:'open_yshopbuy',
          //         url:'./open_yshopbuy.html',
          //         bounces: false,
          //         bgColor: '#fff',
          //         pageParam:{
          //           title:'开店礼包'
          //         }
          // },1)
          break;
          case "singin"://开店礼包
        //   if(checkLoginStatus()){
        //   openWin({
        //           name:'signin',
        //           url:'./signin.html',
        //           bounces: false,
        //           bgColor: '#fff',
        //           pageParam:{
        //             title:'百万红包'
        //           }
        //   },1)
        // }
          break;         
          default:break;
        }
    }

}
