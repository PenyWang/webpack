import './style/index.css';
import './style/index.less';
import 'bootstrap/dist/css/bootstrap.css';
import a from 'b';

console.log(a());  // test resolve>>alias  omit(省略) reference path

function* test () {  // test transform-runtime 
  yield $.isArray([]) + 1;
}
console.log(test().next());

console.log($.isArray([]))  // test webpack.ProvidePlugin

fetch('/sug?code=utf-8&q=%E8%A2%9C%E5%AD%90&callback=cb').then(_ => {
  console.log(_)
})