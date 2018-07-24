const URL = {
  getResult: '/getResult'
};

function wrap(obj) {
  for (let item in obj) {
    obj[item] = `${__PROXY__}${obj[item]}`;
  }
  return obj;
}

export default wrap(URL);