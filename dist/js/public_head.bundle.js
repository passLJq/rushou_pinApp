!function(n){var a={};function r(e){if(a[e])return a[e].exports;var t=a[e]={i:e,l:!1,exports:{}};return n[e].call(t.exports,t,t.exports,r),t.l=!0,t.exports}r.m=n,r.c=a,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)r.d(n,a,function(e){return t[e]}.bind(null,a));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=248)}({0:function(e,t){e.exports=Vue},195:function(e,t,n){e.exports=n.p+"img/share_black.png"},196:function(e,t,n){"use strict";var a=n(81);n.n(a).a},2:function(e,t,n){"use strict";function a(e,t,n,a,r,i,o,s){var c,p="function"==typeof e?e.options:e;if(t&&(p.render=t,p.staticRenderFns=n,p._compiled=!0),a&&(p.functional=!0),i&&(p._scopeId="data-v-"+i),o?(c=function(e){(e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),r&&r.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(o)},p._ssrRegister=c):r&&(c=s?function(){r.call(this,this.$root.$options.shadowRoot)}:r),c)if(p.functional){p._injectStyles=c;var u=p.render;p.render=function(e,t){return c.call(t),u(e,t)}}else{var l=p.beforeCreate;p.beforeCreate=l?[].concat(l,c):[c]}return{exports:e,options:p}}n.d(t,"a",function(){return a})},248:function(e,t,a){"use strict";a.r(t);function n(){var e=this,t=e.$createElement,n=e._self._c||t;return n("header",{staticClass:"headeclass",style:e.statustop?"padding-top:"+e.statustop+"px":"",attrs:{id:"header"}},[e._m(0),e._v(" "),n("div",{directives:[{name:"show",rawName:"v-show",value:e.sharehide,expression:"sharehide"}],staticClass:"headerright headitem",attrs:{id:"share",onclick:"share()"}},[n("img",{attrs:{src:a(195)}})]),e._v(" "),n("div",{staticClass:"headermain headitem"},[n("p",{attrs:{id:"title"}},[e._v(e._s(e.title))])])])}var r=a(0),i=a.n(r),o=[function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"headerleft headitem",attrs:{onclick:"closeWin()"}},[t("img",{attrs:{src:a(99)}})])}];n._withStripped=!0;var s={components:{},props:{},data:function(){return{sharehide:!1,title:"",statustop:""}},watch:{},computed:{},methods:{checktitle:function(e){this.title=e}},created:function(){var t=this;window.checktitle=function(e){t.checktitle(e)}},mounted:function(){var n=this;this.statustop=$api.getStorage("statustop");var a=api.pageParam,r=a.url,e=a.title;this.title=e;var i=0;api.addEventListener({name:"closepublic_head"},function(e,t){setTimeout(function(){api.closeWin()},1e3)}),"ios"==api.systemType?(a.onshow&&api.addEventListener({name:"viewappear"},function(e,t){api.execScript({frameName:api.winName,script:"onshow()"})}),api.openFrame({name:api.winName,url:r,rect:{x:0,y:45+Number(n.statustop),w:"auto",h:"auto"},pageParam:a,bgColor:api.pageParam.bgColor||"#fff",bounces:api.pageParam.bounces||!1,vScrollBarEnabled:!0,hScrollBarEnabled:!0,useWKWebView:!0,progress:{type:"page",color:"#F5AC9E"}})):api.addEventListener({name:"viewappear"},function(e,t){a.onshow&&api.execScript({frameName:api.winName,script:"onshow()"}),i<1&&api.openFrame({name:api.winName,url:r,rect:{x:0,y:45+Number(n.statustop),w:"auto",h:"auto"},pageParam:a,bgColor:api.pageParam.bgColor||"#fff",bounces:api.pageParam.bounces||!1,vScrollBarEnabled:!0,hScrollBarEnabled:!0,useWKWebView:!0,progress:{type:"page",color:"#F5AC9E"}}),i++})}},c=(a(196),a(2)),p=Object(c.a)(s,n,o,!1,null,null,null);p.options.__file="src/page/public_head/index.vue";var u=p.exports;openapp?window.apiready=function(){new i.a({render:function(e){return e(u)}}).$mount("#app")}:new i.a({render:function(e){return e(u)}}).$mount("#app"),window.share=function(){api.sendEvent({name:api.winName+"onshare"})}},81:function(e,t,n){},99:function(e,t,n){e.exports=n.p+"img/icon-back.png"}});