import Vue from 'vue';
import Tpl from './index.vue';

import { Swipe, SwipeItem } from 'vant';
import { Tab, Tabs } from 'vant';
import { Progress } from 'vant';

Vue.use(Progress);
Vue.use(Tab).use(Tabs);
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