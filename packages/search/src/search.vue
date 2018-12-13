<template>
  <div class="wstl-search">
    <input type="text" class="wstl-search-input" @focus="getFocus" @blur="focusOut" @input="inputChange" v-model="value">
    <div class="wstl-search-panel" v-if="panel && showPanel">
      <ul>
        <li v-for="(item, index) in list" :key="index" @click="handleClick(item)">{{label ? item[label] : item}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'wstl-search',
  props: {
    //是否开启panel
    panel: {
      type: Boolean,
      default: false
    },
    //搜索面板展示内容
    list: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showPanel: false
    }
  },
  methods: {
    inputChange() {
      this.$emit('input', this.value);
    },
    getFocus() {
      this.showPanel = true;
    },
    focusOut() {
      setTimeout(() => {
        this.$nextTick(() => {
          this.showPanel = false;
        });
      }, 200);
    },
    handleClick(item) {
      this.$emit('select', item);
    }
  }
}
</script>

<style lang="less" scoped>
.wstl-search{
  display: inline-block;
  position: relative;
  .wstl-search-input{
    display: inline-block;
    height: 100%
  }
  .wstl-search-panel{
    position: absolute;
    border: 1px solid #e3e3e3;
    box-sizing: border-box;
    width: 100%;
    ul{
      margin: 0;
      padding: 0;
      list-style-type: none;
      li {
        padding: 8px 10px;
        background: #fff;
        font-size: 14px;
        &:hover{
          background: #e3e3e3;
          cursor: pointer;
        }
      }
    }
  }
}
</style>

