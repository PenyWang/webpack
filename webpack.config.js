let webpack = require("webpack");
    HtmlWebpackPlugin = require("html-webpack-plugin"), // effect：将html按照对应的模板打包到dist目录下
    MiniCssExtractPlugin = require("mini-css-extract-plugin"), // effect：将css以link方式插入html
    { CleanWebpackPlugin } = require("clean-webpack-plugin"), // effect：打包时，先清空dist文件夹。Be careful：clean-webpack-plugin 3.0版本需要解构CleanWebpackPlugin
    UglifyjsWebpackPlugin = require("uglifyjs-webpack-plugin"), // effect: compress code and remove useless code
    OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin"), // effect: compress css code
    PurifycssWebpack = require("purifycss-webpack"), // effect: remove useless css code
    GlobAll = require("glob-all"), // effect: Specify(指定) which files purifycss works on
    package = require("./package.json"); 
    
module.exports = {

  mode: 'production',
 
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
          options: { //此配置可单独放置到.babelrc文件中
            "presets": [
              [
                "@babel/preset-env", //解析es6 语法
                {
                  "targets": {
                    "browsers": ["last 2 versions"] // 针对每个浏览器最后的两个版本进行转义
                  }
                }
              ]
            ],
            "plugins": [ //转义es6及以上的api 按需加载模块 比ployfill节省空间 
              "@babel/transform-runtime" // 垫片
            ] 
          }
        }], //将es6语法，转义成es6， 不包含es6 api
        exclude: /(node_modules)/
      },
      {
        test: /\.(css|less)$/, 
        use: ["style-loader", "css-loader", "postcss-loader", "less-loader"] // 多个loader从右到左解析，less-loader解析less文件源码，postcss解析css3语法及浏览器兼容及压缩css，css-loader解析css语句，style-loader将css以style形式插入html
      },
      // { 
      //   test: /\.(css|less)/, // need provide MiniCssExtractPlugin in plugins
      //   use: [ MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "less-loader" ] // 该插件作用，将css文件提取出来，以link方式插入html。暂未发现该插件的实战场景，因为用style-loader即可以style的形式插入html即可。
      // },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: ["url-loader?esModule=false&limit=1024&name=images/[name]-[hash:4].[ext]"] // 如果html要使用img，url-loader里esModule需要设置为false(否则:html>>img>>src为[object Module] )，只有url-loader、file-loader支持ext的写法(ext代表文件后缀名)。
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/, // 处理字体文件
        use: ["file-loader?name=style/[name]-[hash:4].[ext]"] // file-loader和url-loader的区别：url-loader可以根据limit转为base64，file-loader不可以。url-loader只能处理图片文件，file-loader都可以处理。
      },
      {
        test: /index\.html$/,  
        use: ["html-loader?attributes=img:src&title=123"] // 可以处理html中引用的图片，生成正确的路径。 使用html loader 会使得HtmlWebpackPlugin的title等一些解析失效
      }
      // { // must after the babel-loader, the syntax will be incorrect by babel-loader
      //   test: /\.js$/,
      //   use: ['eslint-loader'], // check syntax, too strict，not recommended(推荐)
      //   exclude: /(node_modules)/
      // }
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
    new webpack.ProvidePlugin({ // effect: 将模块引用变为全局变量，无需import, 可以通过index.js中查看效果
      $: 'jquery',
      jquery: 'jquery'
    }),
    new CleanWebpackPlugin(),  // clean-webpack-plugin 3.0 实例化时不需要传入["dist"]参数
    new webpack.HotModuleReplacementPlugin(), // if change code, the page will not refresh
    // new PurifycssWebpack({
    //   paths: [] // 经测试 GlobAll.sync 未起作用，默认会将html中未引用到的样式选择器全部去除
    //   // paths: GlobAll.sync([
    //   //   __dirname + '/src/index.js', // sepcify which files purifycss works on
    //   //   // you can add other filepath in here
    //   // ])
    // }),
    // new UglifyjsWebpackPlugin({ // mode=production is ok, no need for it
    //   uglifyOptions: {
    //     ecma: 5
    //   }
    // }),
    // new MiniCssExtractPlugin({ // effect：将js中所有引用的css打包到一个css文件中，以link方式插入html。需结合loader一起使用。 不推荐使用 会造成额外http请求。但如果要去除无用css代码，必须适用该插件。
    //   filename: "[name]-[hash:4].css"  
    // }),
    // new OptimizeCssAssetsWebpackPlugin({ // effect compress css, need to MiniCssExtractPlugin together
    //   cssProcessor: require('cssnano') // postcss is ok, no need for it. but if use MiniCssExtractPlugin must use it.
    // }),
  ],
  resolve: {  
    alias: { 'b': __dirname + '/src/lib/test'}  // 给模块路径设置别名，可模拟引用第三方包的效果，可在index.js中查看效果
  },
  devServer: {
    port: 3000, // 本地服务端口号
    open: true, // 启动后是否自动打开浏览器
    hot: true, // if change code, the page will not refresh
    inline: true, // 当代码由变动时， true：刷新整个页面，false：将页面嵌套至iframe内部。inline默认为true。
    historyApiFallback: true, // if the url path is error, it will jump to index.html
    host: '0.0.0.0', // 服务所在ip，windows下如果无法访问，可在浏览器改用localhost。只有设置了0.0.0.0才可以在其他设备访问通过本机ip进行访问。
    openPage: 'main.html', // browser automatically opens the specified(指定的) page, default page is index.html
    proxy: { // it's a proxy server, proxy can resolve the cros problem during the development
      '/sug': { // in code you only need use '/sug ' to httpRequest
        target: 'https://suggest.taobao.com/', // 如果上线后API域名和网站域名为同一域名，适用于proxy，否则打包上线之后，API请求域名为网站域名。
        changeOrigin: true, 
        logLevel: 'debug' // by this config, you can see the request origin in devServer console
      }
    }
  }
}