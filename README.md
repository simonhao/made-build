#Made-Build

##前端构建工具
#####Front-End Build Solution

#### 使用方法

####安装
```shell
npm install made-build -g
```

####DEMO

```
打开

Windows - C:\Users\Administrator\AppData\Roaming\npm\node_modules\made-build 
Mac - /usr/local/bin/node_modules/made_build

其中的test为DEMO
```
####开始构建
```shell
mb build
```
####构建完成
/dist为构建后的文件

####自定义配置
./test/conf/comm.js中
```javascript
exports.server = {
  web_domain: 'http://dev.qq.com',
  web_path: '/',
  static_domain: 'http://static.dev.qq.com',
  static_path: '/'
};
```
web_domaim为page服务器域名；static_domain为资源服务器域名

####查看
DEMO只能在服务器环境下运行，如果需要跑一个简易的Node服务，可以使用anywhere
```shell
npm install anywhere -g

cd test
anywhere 8080
```

####关于
made-build崇尚于将html,css,js共同放在同一个文件夹内作为组件的方式，这一点上和VueJS的.vue文件有点相似

```shell
./src/
├── comm --公用文件夹
└── show --项目文件夹
   └──page --页面目录
      ├──detail --detail页面组件
      └──index  --index页面目录
./dist/
├── page --html文件
  └── show --项目页面文件夹
    ├──detail.html --detail页面
    └──index.html  --index页面
└── static  -- 资源文件
  ├──comm --公用资源
  ├──show --项目资源文件夹
      └──page --页面css,js资源
  ├──base_style.css
  ├──comm_libs.js
  ├──comm_style.js
```

####联系
如果在配置或者使用的过程中有任何问题，可以提Issue，作者的登陆频率还是比较频繁的~
