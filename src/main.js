import _ from 'lodash'

console.log('1+2=', _.add(1,2))
let el = document.getElementById('msg');
if (!el) {
  el = document.createElement('div');
  el.id = 'msg';
  document.body.appendChild(el);
}

el.innerText = '1+2=' + _.add(1,2)