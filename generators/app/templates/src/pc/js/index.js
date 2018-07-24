import request from '../../common/js/request';
import $URL from '../fetch';

request($URL.getResult);

async function test() {
  console.log('test');
}

test();

export default test;