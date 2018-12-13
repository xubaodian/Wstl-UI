<template>
  <div id="app">
    <wstl-search 
      v-model="inputText"
      :panel="true" 
      :list="searchList" 
      @select="value => inputText = value"/>
    this si test
    <h3>ceshi 1234123</h3>
    <div>{{ inputText }}</div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return  {
      inputText: '',
      searchList: [
        '1231',
        '测试时'
      ]
    };
  },
  mounted() {
  }
};
</script>

<style>
#app{
  background:url("./asserts/bk.jpg") no-repeat;
  width:100%;
  height:100%;
  background-size:100% 100%;
}
</style>
