import request from '../../common/js/request';

console.log(request);

request('/mobile/getList');

async function load() {
  console.log('test');
}

load();

console.log($.ajax);

export default load;