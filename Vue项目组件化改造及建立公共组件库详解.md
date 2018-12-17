## Vue项目组件化改造及建立公共组件库详解
Vue组件库git地址：git地址： https://github.com/xubaodian/Wstl-UI.git <br>
现在绝大部分公司都已经采用组件化的方式进行web开发，无论是使用Vue，还是使用React等等，基本的开发步骤如下：<br>
1、需求论证，讨论出项目基本需求。<br>
2、交互设计，ui设计，接口设计。这个阶段把业务模型确定下来，UI基本确定，与后台约定接口形式。<br>
3、构建前端项目，基于Vue或React等等，根据交互和UI设计进行任务分工，不同人员开发不同的页面。<br>
4、每个web开发人员拿到任务后，首先把页面划分成组件，然后进行开发，如何用到其它项目组件，直接复制过来。<br>
5、组件合并起来组成页面进行联调，并最终打包前端页面。<br>
有相当一大部分公司或项目开发方式都是如此，这么开发其实有两个弊端，十分明显。<br>

**1、伪组件化**<br>

我们知道，组件化开发的目的是解耦功能，提高代码复用率和开发效率，进而加快项目开发周期与产品发布速度。如果我们仅仅是把页面分成几个部分，各自为政，这其实不是组件化开发。<br>
因为在项目里，多个页面之间大部分时候，能提取很多公共组件出来（文件上传，搜索框，时间输入，工具栏等等），如果这些组件每个开发人员都实现，无疑是浪费时间的。<br>

**2、项目间组件管理麻烦**

假如我们新的项目需要大量用到其它项目已实现的组件，很多人会把其它项目的组件直接复制过来，这其实是不利于组件管理的，因为组件代码在多个项目中都有，假如这个组件实现是有缺陷的，我们必须在多个项目中进行修改。如何这种问题经常存在，而且项目又多，给代码管理带来很多工作。<br>

这些问题有什么好的解决办法呢？<br>

针对问题1，要求web开发人员多做沟通，对业务进行抽象，尽可能把项目中可能复用的组件抽象出来(文件上传，搜索框，时间输入，工具栏等等)，单独开发，应用到各个页面中。这样问题1就解决了。<br>

针对问题2，有什么好的方案呢？<br>
我们应该注意到平时引用其它组件或框架时，一般都是npm直接安装到项目中，然后使用。我们如果也能建立自己的组件库，通过npm安装到项目中就好了。<br>
npm除了可安装哪些东西呢？<br>
1、npm官方仓库的上库，插件等。<br>
2、git仓库上的前端库。<br>
3、本地的文件夹。<br>
对于2，3两种情况，文件夹或库必须符合npm的一些标准，具体不细说，可以去npm官方网站上查看。简单来说，用npm init初始化的项目，都可以用npm安装，main的执行文件就是后续import引用的默认文件。<br>
那么问题2的解决办法也就出来了：<br>

**建立公共组件库，放到公司私有git仓库上。然后通过npm安装到各个项目中使用。**<br>

**注意：如果没有私有git仓库,代码又不能放到网上git仓库，可以用如下方法解决，代码放到svn上，然后下载到本地，再通过npm把本地文件夹安装到项目中去。**<br>

解决方案已经说了，下面说下具体实现吧，下面的组件库是基于Vue插件实现的。<br>

首先说下Vue插件的开发和使用。<br>
我们使用插件的方法如下：
```javascript
//导入插件
import MyPlugin from ...;

//注册插件
Vue.use(MyPlugin)
//然后就可以项目中使用该插件了
new Vue({
  //... options
})
```
以Vue官方路由插件Vue-Router来说：
```javascript
import Vue from 'vue';
import VueRouter from 'vue-router';

// 注册路由
Vue.use(VueRouter)
```
这样就可以在项目中使用Vue路由了。<br>

插件的注册原理是什么呢？<br>
Vue.use注册插件的时候，会调用插件的install方法，该方法的第一参数是Vue构造器，插件可以通过install方法，将插件，函数，组建等等注册到Vue构造器上。代码如下：
```javascript
MyPlugin.install = function (Vue, options) {
  // 1. 添加全局方法或属性
  Vue.myGlobalMethod = function () {
    // 逻辑...
  }

  // 2. 添加全局资源命令
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 逻辑...
    }
    ...
  })

  // 3. 注入组件
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
    ...
  })
  //或通过下面方法注入组建，name是组件名，component是组件实例
  Vue.component(name, component);

  // 4. 添加实例原型方法
  Vue.prototype.$myMethod = function (methodOptions) {
    // 逻辑...
  }
}
```
通过以上方法，我们可以给Vue实例添加自定义命令，原型方法，注入组建，添加全局方法等等。<br>
我们可以新建Vue项目，作为组件库放到git仓库上，然后通过npm安装到其它项目中。<br>
组件库的搭建过程挺麻烦，不一一讲解，我直接把我搭建好的demo地址发出来，需要的可以直接下载：git地址： https://github.com/xubaodian/Wstl-UI.git <br>
简单解释下demo：<br>
packages文件夹是组件地址，packages/index.js是组件入口地址，所有组件都在install方法中注册到Vue实例中。<br>
config文件夹下是webpack配置，是我自己写的，参考Vue官方脚手架的webpack配置，有些区别，在文件中都有注释。<br>
webpack.dev.js:启动example的webpack配置，example用来测试组件<br>

webpack.prod.js:生成example的生产环境文件的webpack配置<br>

webpack.common.js:打包组件库的webpack配置，所有组件生成一个js文件和一个css文件

webpack.component.js:分开打包组件的webpack配置，每个组件生成一个js文件和一个css文件<br>

src文件夹下是测试组件的Vue项目。<br>

有什么疑问可以在给我留言，或发邮件给我，472784995@qq.com,或在github上留言。

