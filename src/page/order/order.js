import Vue from 'vue';
import Tpl from './index.vue';
import { Tab, Tabs } from 'vant';

import { RadioGroup, Radio } from 'vant';

Vue.use(Tab).use(Tabs);
Vue.use(RadioGroup);
Vue.use(Radio);

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