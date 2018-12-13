import Icon from './src/icon';

/* 生成单独的编译文件时使用 */
Icon.install = function(Vue) {
  Vue.component(Icon.name, Search);
};

export default Icon;