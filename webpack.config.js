var HtmlWebpackPlugin = require("html-webpack-plugin"); // effect：将html按照对应的模板打包到dist目录下
var MiniCssExtractPlugin = require("mini-css-extract-plugin"); // effect：将css以link方式插入html
var { CleanWebpackPlugin } = require("clean-webpack-plugin"); // effect：打包时，先清空dist文件夹。Be careful：clean-webpack-plugin 3.0版本需要解构CleanWebpackPlugin
var package = require("./package.json"); 

module.exports = {
 
  entry: {
    index: "./src/index.js", // 入口文件
    main: "./src/main.js"  // 多入口写法
  },
  output: {
    path: __dirname + "/dist",
    filename: "[name].[hash:5].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
          options: {
            "presets": [
              [
                "@babel/preset-env",
                {
                  "targets": {
                    "browsers": ["last 2 versions"] // 针对每个浏览器最后的两个版本进行转义
                  }
                }
              ]
            ],
            "plugins": [
              "@babel/transform-runtime"
            ] 
          }
        }], //将es6语法，转义成es6， 不包含es6 api
        exclude: /(node_modules)/
      },
      {
        test: /\.(css|less)$/, 
        use: ["style-loader", "css-loader", "postcss-loader", "less-loader"] // 多个loader从右到左解析，less-loader解析less文件源码，postcss解析css3语法及浏览器兼容及压缩css，css-loader解析css语句，style-loader将css以style形式插入html
      },
      // { // 不推荐使用 不属于最佳实践
      //   test: /\.css/,
      //   use: [ MiniCssExtractPlugin.loader, "css-loader", "postcss-loader" ] // 该插件作用，将css文件提取出来，以link方式插入html。暂未发现该插件的实战场景，因为用style-loader即可以style的形式插入html即可。
      // },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: ["url-loader?esModule=false&limit=1024&name=images/[name]-[hash:4].[ext]"] // 如果html要使用img，url-loader里esModule需要设置为false，只有url-loader、file-loader只会ext的写法。
      },
      {
        test: /\.html$/,  
        use: ["html-loader?attributes=img:src&title=123"] // 可以处理html中引用的图片，生成正确的路径。 使用html loader 会使得HtmlWebpackPlugin的title等一些解析失效
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html", //模板文件
      filename: "index.html", //打包后文件名称
      chunks: ["index"], // 对应entry的attributeName，表示在html中引入对应的入口文件
      inject: "body", // 如果为false，则不引入任何入口文件。如果为body或head则放置对应的模块尾部。
      minify: { 
        removeAttributeQuotes: true, //删除引号
        collapseWhitespace: true // 压缩成一行  删除空格
      }
    }),
    new HtmlWebpackPlugin({
      title: package.name,
      template: "main.html",
      filename: "main.html",
      chunks: ["main"]
    }),
    new MiniCssExtractPlugin({ 
      filename: "[name]-[hash:4].css"
    }),
    new CleanWebpackPlugin()  // clean-webpack-plugin 3.0 实例化时不需要传入["dist"]参数
  ]
}