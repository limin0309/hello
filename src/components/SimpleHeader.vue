
<template>
  <div id="NavBar">
    <van-nav-bar :title="title" :left-arrow="isleftarrow" @click-left="onClickLeft" />
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    back: {
      type: String,
      default: ''
    },
    isleftarrow: {
      type: Boolean,
      default: false
    }
  },
  emits: ['callback'],
  setup(props, ctx) {
    const isback = ref(props.noback)
    const router = useRouter()
    const onClickLeft = () => {
      if (!props.back) {
        router.go(-1)
      } else {
        router.push({ path: props.back })
      }
      ctx.emit('callback')
    }
    return {
      onClickLeft,
      isback
    }
  }
}
</script>

<style lang="less" scoped>
  #NavBar {
  position: fixed;
  top: 0;
  left: 0;
  height: 46px;
  line-height: 46px;
  width:100%;
  z-index: 100;
}
.van-nav-bar{
  font-size: 18px!important;
  /* 设置导航栏的渐变色 */
  background: #4578BC;
  border:0;
}
.van-hairline--bottom::after {
     /* 去除导航栏底部的白色横线 */
    border-bottom-width: 0px!important;
}
</style>
