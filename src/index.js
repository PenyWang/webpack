import './style/index.css';
import './style/index.less';
import 'bootstrap/dist/css/bootstrap.css';
import localJQ from 'localJQ';
console.log(localJQ.isArray([]));
// document.write("hello webpack-plugins1");

// function* test () {  // 通过@babel/plugin-transform-runtime 可以对es6以上的api进行转义，使其兼容ie浏览器
//   yield $.isArray([]) + 1;
// }

// console.log(test().next());