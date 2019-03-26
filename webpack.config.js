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
      root: '_' //特别注意root项的设置，即为浏览器中lodash全局变量的名字，不能乱填
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