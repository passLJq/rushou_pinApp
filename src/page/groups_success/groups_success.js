import Vue from 'vue';
import Tpl from './groups_success.vue';
import { Tab, Tabs } from 'vant';

Vue.use(Tab).use(Tabs);
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