config文件夹下是webpack配置:<br>
webpack.dev.js:启动example的webpack配置，example用来测试组件<br>
webpack.prod.js:生成example的生产环境文件的webpack配置<br>
webpack.common.js:打包组件库的webpack配置，所有组件生成一个js文件和一个css文件<br>
webpack.component.js:分开打包组件的webpack配置，每个组件生成一个js文件和一个css文件<br>

命令：<br>
npm run dev<br>
启动例子<br>

npm run build<br>
打包例子，生成生产环境文件<br>

npm run common<br>
打包组件库，生成生产环境文件（一个js和一个css）<br>

npm run component<br>
分开打包组件库，每个组件都生成一个js和一个css件<br>




使用教程：<br>

在vue + webpack前端工程中：<br>
1、npm install git+地址（这个工程的git地址,根据你安装在哪修改）<br>
例如：npm install git+https://github.com/xubaodian/Wstl-UI.git <br>
在入口文件引入
```javascript
//引入vue
import Vue from 'vue';
//引入wstl-ui组件库
import WsltUI from 'wstl-ui';
//引入样式
import 'wstl-ui/lib/index.css';
//安装组件
Vue.use(WsltUI);
```
2、直接在页面中应用
先注释掉webpack.common.js配置文件中下面这行代码：<br>
```javascript
//若要在在页面中直接应用库js文件，这个选项注释掉,重新打包
libraryTarget: 'commonjs2'
```
然后重新打包，在html中如下应用
```html
  //引用组件库样式
  <link href="./lib/index.css" rel="stylesheet"/>
  //引用vue
  <script src="https://cdn.jsdelivr.net/npm/vue"></script>
  //引用组件库js
  <script src="./lib/wstl-ui.common.js"></script>
```