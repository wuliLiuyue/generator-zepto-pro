# generator-zepto-pro
jquery zepto项目脚手架 支持热更新、mock数据

####ChangeLog
* 1.1.0 测试版本发布
* 1.10.0 框架新特性功能: 命令行添加新页面模版(在对应目录下新增css、js、html, 并在html中填入对应新增文件链接)

####Install
```
sudo npm install yo generator-zepto-pro -g
```
####How to use
* 安装脚手架
```
mkdir webapp && cd webapp
yo zepto-pro
npm run dev:mobile 启动服务
npm run build:mobile 打包编译
npm run dev:pc
npm run build:pc
npm run mock 启动mock服务
```
* 添加新页面模版
```
yo zepto-pro:router --mode=mobile --name=新页面名称 mobile项目添加新页面
yo zepto-pro:router --mode=pc --name=新页面名称 pc项目添加新页面
```

```
动态生成新页面html, 并插入对应css、js文件链接
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <% if (is_mobile) { %>
    <meta name="theme-color" content="#f60">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="format-detection" content="telephone=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <script src="http://g.tbcdn.cn/mtb/lib-flexible/0.3.4/??flexible_css.js,flexible.js"></script>
    <% } %>
    <title><%= name %></title>
    <link rel="stylesheet" href="../css/common.min.css">
  </head>
  <body>
    <div class="<%= name %>"><%= name %></div>
  <% if (is_mobile) { %>
  <script src="http://apps.bdimg.com/libs/zepto/1.1.4/zepto.min.js"></script>
  <% } else { %>
  <script src="http://apps.bdimg.com/libs/jquery/1.9.1/jquery.min.js"></script>
  <% } %>
  <script src="../js/common.js"></script>
  <script src="../js/<%= name %>.js"></script>
  </body>
</html>
```