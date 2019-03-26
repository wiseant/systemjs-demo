## 使用SystemJS动态加载有外部依赖库的js文件

### 目标

　　演示通过SystemJS动态加载依赖lodash.js库的脚本文件。

### 步骤

0. 初始化项目框架
      + 打开终端，切换到项目文件夹，执行`npm init -y`

      + 安装`webpack`，`npm i webpack webpack-cli webpack-dev-server -D`

      + 安装文件复制插件，`npm i copy-webpack-plugin -D`

      + 新建`public`目录，然后创建`index.html`、`dynamic-import.html`、`import-map.html`文件

      + 新建`src`目录，并创建`main.js`文件

      + 新建`libs`目录，从[systemjs官网](https://github.com/systemjs/systemjs/releases)下载0.21.6(该分支当前最新版本)压缩包，将system.js解压到`libs`目录

      + 编辑`package.json`文件, 在`scripts`里面加入`"dev"`和`"build"`

         ```json
           "scripts": {
             "test": "echo \"Error: no test specified\" && exit 1",
             "dev": "webpack-dev-server --open",
             "build": "webpack --mode development"
           }
         ```

1. 安装lodash库，`npm i lodash -S`

2. 编写`src/main.js`文件

   ```js
   import _ from 'lodash'
   
   console.log('1+2=', _.add(1,2))
   let el = document.getElementById('msg');
   if (!el) {
     el = document.createElement('div');
     el.id = 'msg';
     document.body.appendChild(el);
   }
   
   el.innerText = '1+2=' + _.add(1,2)
   ```

   *代码再简单不过了，就是调用了lodash库里面的add方法，计算出1+2的结果，同时输出在控制台和网页中。*

3. 编写`public/index.html`文件

   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <meta charset="utf-8" />
     <meta http-equiv="X-UA-Compatible" content="IE=edge">
     <meta name="viewport" content="width=device-width, initial-scale=1">
     <title>浏览器直接引入脚本示例</title>
     <script src="https://unpkg.com/lodash@4.17.10/lodash.js"></script>
   </head>
   <body>
     动态脚本加载示例 => <a href="dynamic-import.html">dynamic import by SystemJS</a>
     <p></p>
     <script type="text/javascript" src="bundle.js"></script>
   </body>
   </html>
   ```

4. 编写`public/dynamic-import.html`文件

   ```html
   <!DOCTYPE html>
   <html>
   
   <head>
     <meta charset="utf-8" />
     <meta http-equiv="X-UA-Compatible" content="IE=edge">
     <meta name="viewport" content="width=device-width, initial-scale=1">
     <title>使用SystemJS动态加载依赖lodash的js文件</title>
     <script src="system.js"></script>
   </head>
   
   <body>
     <a href="/">返回</a>
     <p></p>
   </body>
   <script>
     SystemJS.config({
       map: {
         lodash: 'https://unpkg.com/lodash@4.17.10/lodash.js'
       }
     })
     SystemJS.import('./bundle.js');
   </script>
   </html>
   ```

   *特别留意SystemJS.config()方法的调用，能实现动态加载有外部依赖的js文件，关键就在map的设置*

5. 编写`webpack.config.js`

   ```js
   const path = require('path');
   // 插件都是一个类，所以我们命名的时候尽量用大写开头
   const CopyWebpackPlugin = require('copy-webpack-plugin');
   
   module.exports = {
     // 入口文件
     entry: {
       app: './src/main.js'
     },
     // 输出到dist文件夹, 文件名字为bundle.js，打包模式为UMD
     output: {
       filename: 'bundle.js',
       path: path.resolve(__dirname, './dist'),
       libraryTarget: 'umd', //如果指定为amd格式，浏览器将不能直接引用，不影响通过SystemJS动态加载
     },
     // 将lodash设置为外部依赖，它们的代码不会被打包进生成的buildle.js文件
     externals: {
       "lodash": {
         amd: "lodash",
         commonjs: "lodash",
         commonjs2: "lodash",
         root: '_' // **特别注意root项的设置，即为浏览器中lodash全局变量的名字，不能乱填**
       }
     },
     // 配置开发服务器使用的端口及目录
     devServer: {
       port: 3000,
       contentBase: './dist'
     },
     plugins: [
       // 复制文件
       new CopyWebpackPlugin([
         { from: path.resolve(__dirname, 'libs/system.js') },
         { from: path.resolve(__dirname, 'public/index.html') },
         { from: path.resolve(__dirname, 'public/dynamic-import.html') },
         { from: path.resolve(__dirname, 'public/import-map.html') }
       ])
     ]
   }
   ```

   *打包格式非常重要，可以尝试改为amd格式，然后试试网页能否正常访问*

6. 执行`npm run dev`，打开首页，正常输出"1+2=3"，切换到动态加载页面也可以见到同样的输出，在控制台中也会输出相同的日志。

7. 执行`npm run build`进行代码打包，可以看到生成的`bundle.js`文件非常小，确实不包含外部库的代码。

8. 最后，system.js官网上有一篇关于[Import Maps](https://github.com/systemjs/systemjs/blob/master/docs/import-maps.md)的说明，貌似可以映射外部依赖，但是没研究明白。把没有调通的代码也贴一下，希望有一天能搞明白。

   ```html
   <!DOCTYPE html>
   <html>
   
   <head>
     <meta charset="utf-8" />
     <meta http-equiv="X-UA-Compatible" content="IE=edge">
     <meta name="viewport" content="width=device-width, initial-scale=1">
     <title>SystemJS 示例</title>
   </head>
   
   <body>
   </body>
   
   <script type="systemjs-importmap">
   {
     "imports": {
       "lodash": "https://unpkg.com/lodash@4.17.10/lodash.js"
     }
   }
   </script>
   <!-- Alternatively:
   <script type="systemjs-importmap" src="path/to/map.json">
   -->
   <!-- SystemJS must be loaded after the import map -->
   <script src="system.js"></script>
   <script>
     System.import('./bundle.js');
   </script>
   </html>
   ```

   