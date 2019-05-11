<template>
  <div>
    <div class="zhezhaoa" v-show="show[0]||show[1]" @click="close" id="mark" >
      <!-- 活动规则详情弹窗 -->
      <div v-show="show[0]" class="ruleDetails flex flex_v flex_align_center flex_pack_justify_between" id="rule">
        <div class="title gradient">活动细则</div>
        <div class="content">
          <span id="text" class="color_333" v-html="contents"></span>
        </div>
        <div class="bottom flex flex_align_center flex_pack_center">
          <div class="btn gradient  flex flex_align_center flex_pack_center" @click="close">我知道了</div>
        </div>
      </div>
      <!-- 中奖号码 -->
      <div v-show="show[1]" class="showNum flex flex_v flex_align_center" id="showNum">
        <div class="title gradient">
          我的号码
        </div>
        <div class="content" id="content" onclick="closeRule()">
          <div class="item flex flex_align_center flex_pack_justify_between" v-for="item in num" :key="item">
            <span :style="item==wincode&&isDone?'color:#ff5541;':'color:#999;'">{{item}}</span>
            <span :style="item==wincode&&isDone?'color:#ff5541;':'color:#999;'">{{item==wincode&&isDone?'已获奖':isDone?'未获奖':'未开奖'}}</span>
          </div>
        </div>
        <div class="btn flex flex_align_center flex_pack_center">
          <div class="gradient" @click="close">我知道了</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props:{
      winningcode: {
        type: String,
        required: false
      },
      done: {
        type: String,
        required: false
      },
      cloudid: {
        type: String,
        required: false
      },
      showPop: {
        type: Array,
        required: false
      },
      content: {
        type: String,
        required: false
      },
    },
    data() {
      return {
        show: [false, false],  // 活动规则，抽奖号码
        isDone: false,
        num: [],               // 抽奖号码 
        wincode: '',
        contents: ''
      }
    },
    created() {
      
    },
    computed: {

    },
    watch: {
      done(val) {
        if (val != 1) {
          this.isDone = true
        } else {
          this.isDone = false
        }
      },
      showPop(val) {
        if (!val[0]&&!val[1]) {
          this.show = [false, false]
        } else if (!val[0]&&val[1]) {
          this.getNumber()
        } else {
          this.contents = this.$props.content
          this.show = val
        }
      },
      winningcode(val) {
        if (val!='') {
          this.wincode = val
        }
      },
      content(val) {
        this.contents = val
      }
    },
    methods: {
      getNumber() {
        https({
          url: siteUrl + 'Marketing/Cloudbuy/GetCloudCode',
          data: {
            cloudid: this.$props.cloudid,
            currentPage: '1',
            pageSize: '999',
            uid: getname()
          },
          headers: 1,
          successBack: ret => {
            if (ret.status == 1 && ret.success) {
              this.num = ret.Data
              this.show = [false, true]
            } else {
              promptMsg(ret.err)
            }
          }
        })
      },
      close() {
        this.$emit('closePop')
      }
    }
  }
</script>
<style lang="scss">
  ::-webkit-scrollbar {
    display: none;
  }
  @import "showRule.scss";
</style>