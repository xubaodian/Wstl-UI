<template>
 <i :class="'wstl-icon-' + name"></i>
</template>

<script>
export default {
  name: 'wstl-search',
  props: {
    //是否开启panel
    name: {
      type: String,
      default: ''
    }
  },
  data() {
  }
}
</script>

<style lang="less" scoped>
</style>

