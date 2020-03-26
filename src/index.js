import(/* webpackChunkName: 'subPageA' */'./subPage/subPageA.js').then(function(subPageA){
  console.log('test split code for a single chunk', subPageA); 
})  // 此方法可以将subPageA.js 单独打包成一个文件 不能和optimization-splitChunks-cacheGroups-common混用
import('./subPage/subPageB.js').then(function(subPageB){
  console.log('test split code for a single chunk', subPageB);
}) // 无需在html中单独引入拆分后的包，此步骤会自动完成 如果通过devServer启动，引用文件的代码不会执行。但是手动打包后可以执行。
// import(/* webpackChunkName: 'jQuery' */'jquery').then(function($) { // if configure the webpack.ProvidePlugin, it will be useless
//   console.log($);  
// });  // test split thirdparty package for a single chunk
import './style/index.css';
import './style/index.less';
// import 'bootstrap/dist/css/bootstrap.css';
import utils from 'utils';

// require.include('./subPage/module.js'); // if have this require.include, it will be in index.chunk.js, else it will be in subPage.chunk.js
// require.ensure(['./subPage/subPageA.js','./subPage/subPageB.js'], function (){
//   let a = require('./subPage/subPageA.js'); // 需要手动引入这行代码，否则在index.chunk.js中不会调用subPage.chunk.js中的subPageA.js
// }, 'subPage'); // merge code to subPage.chunk.js
// require.ensure(['jquery'], function(){ // if configure the webpack.ProvidePlugin, it will be useless
//   let $ = require('jquery');
//   console.log($);
// }, 'jQuery'); // test split thirdparty package for a single chunk

if (module.hot) {
  module.hot.accept();
}
console.log('test wepack hot module, if change code, the page will not refresh');

console.log(utils()); // test resolve>>alias  omit(省略) reference path
console.log('test webpack.ProvidePlugin',$.isArray([])); // test webpack.ProvidePlugin

function * test () { // test transform-runtime
  yield $.isArray([]) + 1;
}
console.log('test transform-runtime', test().next());

fetch('/sug?code=utf-8&q=鞋') // test devServer proxy，此方式不适用手动打包后使用
  .then(response => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error('请求非200');
    }
  })
  .then(res => {
    console.log('test devServer proxy', res);
  })
  .catch(err => {
    console.error(err);
  });
