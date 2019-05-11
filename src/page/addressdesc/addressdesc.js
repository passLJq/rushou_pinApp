import Vue from 'vue';
import Tpl from './addressdesc.vue';
import { Switch } from 'vant';

Vue.use(Switch);
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