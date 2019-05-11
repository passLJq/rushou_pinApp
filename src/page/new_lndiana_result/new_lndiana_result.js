import Vue from 'vue';
import Tpl from './new_lndiana_result.vue';

// import { Tab, Tabs } from 'vant';

// Vue.use(Tab).use(Tabs);

// import { Swipe, SwipeItem } from 'vant';

// Vue.use(Swipe).use(SwipeItem);

import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad,{
  throttleWait:200,
  error: './image/man.jpg',
  loading: './image/man.jpg',
})

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