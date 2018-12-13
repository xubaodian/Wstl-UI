import Vue from 'vue';
import App from './App.vue';
import WsltUI from '../lib/wstl-ui.common';

import '../lib/index.css';

Vue.use(WsltUI);

new Vue({
  render: h => h(App)
}).$mount('#app');