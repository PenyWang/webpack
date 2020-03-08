var HtmlWebpackPlugin = require("html-webpack-plugin");
var package = require("./package.json");

console.log(__dirname);

module.exports = {

  entry: {
    index: "./src/index.js",
    index1: "./src/index1.js"  
  },
  output: {
    path: __dirname + "/dist",
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["babel-loader"]
      },
      {
        test: /\.(css|less)$/,
        use: ["style-loader", "css-loader", "postcss-loader", "less-loader"]
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: ['url-loader?limit=1024&name=images/[name]-[hash:4].[ext]']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
      filename: "index.html",
      chunks: ['index'],
      inject: 'body', // 如果为false，则不引入chunks指定的入口文件。如果为body或head则放置对应的模块尾部。
      title: package.name,
      minify: { 
        removeAttributeQuotes: true, //删除引号
        collapseWhitespace: true // 压缩成一行  删除空格
      }
    }),
    new HtmlWebpackPlugin({
      template: "index1.html",
      filename: "index1.html",
      chunks: ['index1']
    })
  ]
}