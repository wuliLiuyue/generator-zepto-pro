import axios from 'axios';

const instance = axios.create({
  timeout: 30000 // 设置30s为超时
});

// 设置请求拦截器
instance.interceptors.request.use(config => {
  if(config.method === 'get') {
    type = 'params';
  }
  return config;
}, () => {
  return Promise.reject({
    message: '当前网络不佳，请稍后再试'
  });
});

// 设置响应拦截器
instance.interceptors.response.use(res => {
  if (!res.data.success) {
    return Promise.reject({
      message: res.data.message || '当前网络不佳，请稍后再试',
      code: res.data.code,
      data: res.data.data
    });
  }
  return res.data;
}, () => {
  return Promise.reject({
    message: '当前网络不佳，请稍后再试'
  });
});

export default instance;