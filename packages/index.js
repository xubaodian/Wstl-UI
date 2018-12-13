import Search from './search/index';

//组件列表
const components = [
  Search
];

//导入时，Vue调用的安装函数，可参考 vue插件开发的官方教程地址 https://cn.vuejs.org/v2/guide/plugins.html
const install = function(Vue, opts = {}) {
  
  //依次安装插件
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default { install };
export { Search };