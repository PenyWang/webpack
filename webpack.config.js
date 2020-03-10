var HtmlWebpackPlugin = require("html-webpack-plugin");
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var { CleanWebpackPlugin } = require('clean-webpack-plugin');
var package = require("./package.json");

console.log(__dirname);

module.exports = {
 
  entry: {
    index: "./src/index.js", // 入口文件
    main: "./src/main.js"  // 多入口写法
  },
  output: {
    path: __dirname + "/dist",
    filename: '[name].[hash:5].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["babel-loader"], //将es6语法，转义成es6， 不包含es6 api
        exclude: /(node_modules)/
      },
      {
        test: /\.(less)$/, 
        use: ["style-loader", "css-loader", "postcss-loader", "less-loader"]
      },
      { // 暂未找到该插件的使用场景，直接用style-loader以style的形式插入html即可。该插件作用，将css文件提取出来，以link方式插入html。
        test: /\.css/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', "postcss-loader" ]
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: ['url-loader?esModule=false&limit=1024&name=images/[name]-[hash:4].[ext]'] // 如果html要使用img，url-loader里esModule需要设置为false
      },
      {
        test: /\.html$/,  // 使用html loader 会使得HtmlWebpackPlugin的title等一些解析失效
        use: ['html-loader?attributes=img:src&title=123'] // 可以处理html中引用的图片或css，生成正确的路径
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
      filename: "index.html",
      chunks: ['index'],
      inject: 'body', // 如果为false，则不引入chunks指定的入口文件。如果为body或head则放置对应的模块尾部。
      minify: { 
        removeAttributeQuotes: true, //删除引号
        collapseWhitespace: true // 压缩成一行  删除空格
      }
    }),
    new HtmlWebpackPlugin({
      title: package.name,
      template: "main.html",
      filename: "main.html",
      chunks: ['main']
    }),
    new MiniCssExtractPlugin({
      filename: '[name]-[hash:4].css'
    }),
    new CleanWebpackPlugin()
  ]
}