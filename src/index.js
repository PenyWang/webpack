import './style/index.css';
import './style/index.less';

document.write("hello webpack-plugins1");

function* fib(max) {
  var
      t,
      a = 0,
      b = 1,
      n = 0;
  while (n < max) {
      yield a;
      [a, b] = [b, a + b];
      n ++;
  }
  return;
}

var f = fib(5);
console.log(f.next()); // {value: 0, done: false}
f.next(); // {value: 1, done: false}
f.next(); // {value: 1, done: false}
f.next(); // {value: 2, done: false}
f.next(); // {value: 3, done: false}
f.next(); // {value: undefined, done: true}