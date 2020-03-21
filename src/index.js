import './style/index.css';
import './style/index.less';
import 'bootstrap/dist/css/bootstrap.css';
import a from 'b';

if (module.hot) {
  module.hot.accept();
}
console.log('test wepack hot module, if change code, the page will not refresh');

console.log(a()); // test resolve>>alias  omit(省略) reference path
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
