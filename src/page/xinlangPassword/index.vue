<template>
  <div class="box">
    <div class="myli" @click='chek(2)'>
      <p>修改密码</p>
      <i class="newright-arrow"></i>
    </div>
    <div class="myli" @click='chek(3)'>
      <p>找回密码</p>
      <i class="newright-arrow"></i>
    </div>
  </div>
</template>

<script>
export default {
  components:{},
  props:{},
  data(){
    return {
    }
  },
  watch:{},
  computed:{},
  methods:{
     chek(status){
        https({
          url:siteUrl +'Main/MemberPay/GetPayPwdUrl',
          method:'get',
          data:{
            uid:getname(),
            devicetype:1,
            type:status
          },
          headers:1,
          successBack:function(ret){
              if(ret.success&&ret.status==1){
                var title=''
                if(status==2){
                  title='重置密码'
                }else if(status==3){
                  title='找回密码'
                }
                OpenWebPage(ret.Data,'密码设置')
              }else{
                promptMsg(ret.err)
              }
          }
        })
      }
  },
  created(){},
  mounted(){}
}
</script>
<style lang="scss">

.password {
    width: 80%;
    border-radius: 18px;
    border: 1px solid rgba(255,85,65,1);
    color: #FF5541;
    padding: rem(8) 0;
    text-align: center;
    margin: rem(30) auto 0;
    font-size: rem(17);
}

.myli {
    color: #333;
    margin: 0 15px;
    padding: 14px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #F6F6FA;
    font-size: rem(14);
}
.box{
  margin-top: 20px
}

</style>