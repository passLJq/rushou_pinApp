import Vue from 'vue';
import Tpl from './index.vue';
import { Swipe, SwipeItem } from 'vant';
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad,{
  throttleWait:200,
  loading: './image/bkg_cover.jpg',
  error: './image/bkg_cover.jpg'
})
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