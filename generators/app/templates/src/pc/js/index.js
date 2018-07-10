import request from '../../common/js/request';

console.log(request);

request('/pc/getList');

async function pc() {
  console.log('pc123');
}

pc();

export default pc;