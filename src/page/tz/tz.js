import Vue from 'vue';
import Tpl from './tz.vue';

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