import Vue from 'vue';
import Tpl from './new_lndianaDetail.vue';
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad,{
  throttleWait:200,
  error: './image/bkg_cover.jpg',
  loading: './image/bkg_cover.jpg',
})

import { Swipe, SwipeItem } from 'vant';
Vue.use(Swipe).use(SwipeItem);

var app=''
if(openapp){
  window.apiready= function () {
    app=new Vue({
    render:h => h(Tpl),
    }).$mount('#app');
 }
}else{
  app=new Vue({
    render:h => h(Tpl),
  }).$mount('#app')
}