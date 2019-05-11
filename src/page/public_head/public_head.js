import Vue from 'vue';
import Tpl from './index.vue';
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

// window.share = function () {
//     api.execScript({
//         frameName: api.winName,
//         script: 'onshare()'
//     });
// }
window.share = function () {
    api.sendEvent({
        name: api.winName + 'onshare'
    })
}