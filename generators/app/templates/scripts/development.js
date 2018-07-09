#!/usr/bin/env node
process.env.NODE_ENV = 'development';

/**
 * 开发服务器配置
 * @class {Application}
 */

const koa = require('koa');
const app = new koa();

app.on('error', function (err, ctx) {
  console.log('error occured:', err.stack);
});

const server = require('http').createServer(app.callback());
let isListened = false;

!isListened && server.listen(3000, function () {
  console.log('应用启动, at port %d, CTRL + C to 终止服务', 3000);
  isListened = true;
});