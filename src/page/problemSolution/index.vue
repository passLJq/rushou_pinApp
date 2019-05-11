<template>
  <div>
    <h1>{{tit}}</h1>
    <hr>
    <div class="cont">
      <p v-html="content"></p>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      tit: '',
      content: ''
    };
  },
  watch: {},
  computed: {},
  methods: {
    
  },
  created() {
    this.tit = pageParam('tit')
    this.content = '　　' + pageParam('content')
  },
  mounted() {}
};
</script>
<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-size: rems(24);
}

h1{
  font-size: rems(32);
  margin-left: rems(32);
  margin-top: rems(24);
  margin-bottom: rems(28);
  color: #333333;
}

hr{
  background-color: #F6F6FA;
  height: rems(2);
  margin: 0 rems(24);
}
.cont {
  padding: rems(28) rems(32);
  p{
    font-size: rems(28);
    color: #333333;
    line-height: rems(50);
  }
}
</style>