import Search from './src/search';

/* 生成单独的编译文件时使用 */
Search.install = function(Vue) {
  Vue.component(Search.name, Search);
};

export default Search;