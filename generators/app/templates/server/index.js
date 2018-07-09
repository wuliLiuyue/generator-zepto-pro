'use strict';

const path = require('path');
const process = require('process');
const assets = require('koa-static');
const koaOnError = require('koa-onerror');

const publicPath = path.resolve('./src');
const templatePath = path.resolve('./server/views');

module.exports = (app) => {
  app.use(assets(publicPath, { maxage: 1000 * 60 * 60 * 24 * 60, gzip: true }));

  koaOnError(app, { template: templatePath + '/500.html' });
};