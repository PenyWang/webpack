// import(/* webpackChunkName: 'subPageA' */'./subPage/subPageA.js').then(function(subPageA){
//   console.log(subPageA); 
// })  // 此方法可以将subPageA.js 单独打包成一个文件 不能和optimization-splitChunks-cacheGroups-common混用
// import('./subPage/subPageB.js').then(function(subPageB){
//   console.log(subPageB);
// }) // 无需在html中单独引入拆分后的包，此步骤会自动完成
import './style/index.css';
import './style/index.less';
// import 'bootstrap/dist/css/bootstrap.css';
import utils from 'utils';

require.include('./subPage/module.js'); // if have this require.include, it will be in index.chunk.js, else it will be in subPage.chunk.js
require.ensure(['./subPage/subPageA.js','./subPage/subPageB.js'], function (){
  let a = require('./subPage/subPageA.js'); // 需要手动引入这行代码，否则在html中不会引入subPage
}, 'subPage'); // merge code to subPage.chunk.js

if (module.hot) {
  module.hot.accept();
}
console.log('test wepack hot module, if change code, the page will not refresh');

console.log(utils()); // test resolve>>alias  omit(省略) reference path
console.log($.isArray([])); // test webpack.ProvidePlugin

function * test () { // test transform-runtime
  yield $.isArray([]) + 1;
}
console.log(test().next());

fetch('/sug?code=utf-8&q=鞋') // test devServer proxy
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
