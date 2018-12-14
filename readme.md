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