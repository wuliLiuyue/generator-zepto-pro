import request from '../../common/js/request';
import $URL from '../fetch';

request($URL.getList);

async function test() {
  console.log('test');
}

test();

export default test;