<template>
      <header class="headeclass" id="header" :style="statustop?'padding-top:'+statustop+'px':''">
        <div class="headerleft headitem" onclick="closeWin()">
          <img src="../../img/icon-back.png">
        </div>
        <div class="headerright headitem" id="share" onclick="share()" v-show="sharehide">
            <img src="../../img/share_black.png">
        </div>
        <div class="headermain headitem">
          <p id="title">{{title}}</p>
        </div>
      </header>
</template>

<script>
export default {
  components:{},
  props:{},
  data(){
    return {
        sharehide:false,
        title:'',
        statustop:''
    }
  },
  watch:{},
  computed:{},
  methods:{
      checktitle(value){
          this.title=value
      }
  },
  created(){
      var that=this
      window.checktitle=function(title){
          that.checktitle(title)
      }
  },
  mounted(){
      var that=this
           this.statustop=$api.getStorage('statustop');
            var data =api.pageParam
            var url = data.url;
            var title = data.title;
            this.title=title
            var pageload = 0;
            // if (data.share) {
            //     this.sharehide=true
            // }
                 api.addEventListener({
                    name:'closepublic_head'
                }, function(ret, err){
                    setTimeout(function () {
                        api.closeWin()
                    }, 1000)
                   
              });
            if (api.systemType == "ios") {
                if(data.onshow){
             // window显示时触发
                    api.addEventListener({
                            name:'viewappear'
                        }, function(ret, err){
                        api.execScript({
                            frameName: api.winName,
                            script: 'onshow()'
                        });
                    });
                }
                api.openFrame({
                    name: api.winName,
                    url: url,    //api.wgtRootDir+'/html/main/webframepage.html'示例
                    rect: {
                        x: 0,
                        y: 45+Number(that.statustop),
                        w: 'auto',
                        h: 'auto'
                    },
                    pageParam: data,
                    bgColor:api.pageParam.bgColor||'#fff',
                    bounces: api.pageParam.bounces||false,
                    vScrollBarEnabled: true,
                    hScrollBarEnabled: true,
                    useWKWebView:true,
                    progress:{
                    type:'page',
                    color:'#F5AC9E'
                    }                     
                });
            } else {
                //viewappear事件在ios中首次打开不会调用，在安卓使用以避免切换时加载frame造成卡顿。
                api.addEventListener({
                    name: 'viewappear'
                }, function(ret, err) {
                 if(data.onshow){
                  api.execScript({
                      frameName: api.winName,
                      script: 'onshow()'
                  });
                 }
                    if (pageload < 1) {
                        api.openFrame({
                            name: api.winName,
                            url:url,
                            rect: {
                                x: 0,
                                y: 45+Number(that.statustop),
                                w: 'auto',
                                h: 'auto'
                            },
                            pageParam: data,
                            bgColor:api.pageParam.bgColor||'#fff',
                            bounces: api.pageParam.bounces||false,
                            vScrollBarEnabled: true,
                            hScrollBarEnabled: true,
                            useWKWebView:true,
                            progress:{
                            type:'page',
                            color:'#F5AC9E'
                            }                           
                        });
                    }
                    pageload++;
                });
            }
  }
}
</script>
<style lang="scss">
          .headeclass{position: relative;background: #fff}
          .headerleft{height: 45px;position: absolute;left: 3%}
          .headerleft img,.headerright img{height: 20px;width: 20px;display: block;}
          .headermain{height: 45px;font-size: 17px}
          .headerright{height: 45px;position: absolute;right: 3%}
          .headitem{display: flex;align-items: center;justify-content: center;}
          .hide{display: none}
</style>