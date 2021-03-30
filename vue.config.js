/*
 * @Author: your name
 * @Date: 2021-03-30 13:44:29
 * @LastEditTime: 2021-03-30 18:07:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /hello-world/vue.config.js
 */
const path = require('path')
const glob = require('glob')
const npmConfigArgv = JSON.parse(process.env.npm_config_argv)
const original = npmConfigArgv.original
const length = npmConfigArgv.original.length
let moduleName = length===2?original[1]:null
console.log(moduleName,'moduleNamecscsa')
module.exports = {
  // 基本 URL
  publicPath: '/',
   // 按需求定 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上，例如 https://www.my-app.com/。
  // publicPath: process.env.NODE_ENV === 'production'
  //   ? '/production-sub-path/'
  //   : '/'

  // 静态资源目录
  assetsDir: 'assets',
  // eslint
  lintOnSave: true,
  // 生产环境的 source map
  productionSourceMap: false,
  // multi-page 模式
  pages: pagesEntry('./src/pages/*'),
  devServer: { // webpack-dev-server 相关配置
    port: '8080', // 端口号
    https: false, // 关闭https
    hotOnly: false, // 取消热更新
    // proxy: { // 使用代理
    //   '/api': {
    //      target: '//www.woyouzhe.com', // 目标代理服务器地址
    //     changeOrigin: true, // 允许跨域
    //     pathRewrite:{
    //       '^/api': '' // 重写路径，需要设置重写的话，要在后面的调用接口前加上/api来代替target
    //     }
    //   }
    // }
  }
}

// 配置pages参数
function pagesEntry (entry) {
  console.log(process.env.RUNTIME_ENV,'process.env.RUNTIME_ENV')
  const entries = {}
  if ( moduleName) {
    console.log(`正在打包模块：${moduleName}`)
    entries[moduleName] = {
      // page的入口
      entry: `src/pages/${moduleName}/main.js`,
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: moduleName + 'index.html',
      title: setMeta(moduleName).title,
      keywords: setMeta(moduleName).keywords,
      description: setMeta(moduleName).description,
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  } else {
  console.log('走else')
  glob.sync(entry).forEach(item => {
    const fileName = path.basename(item, path.extname(item))
    entries[fileName] = {
      // 入口文件
      entry: 'src/pages/' + fileName + '/main.js',
      // 模板文件
      template: 'public/index.html',
      // 输入文件
      filename: fileName + '.html',
      // 自定义参数
      title: setMeta(fileName).title,
      keywords: setMeta(fileName).keywords,
      description: setMeta(fileName).description,
      chunks: ['chunk-vendors', 'chunk-common', fileName],
    }

  })

}
return entries
}

// 配置自定义参数
function setMeta (fileName) {
  let meta = {}
  switch (fileName) {
    case 'index':
      meta = {
        title: '首页'
      }
      break
    case 'about':
      meta = {
        title: '关于我们'
      }
      break
    default:
      meta = {
        title: '标题'
      }
      break
  }
  return Object.assign({
    keywords: '关键词',
    description: '关键描述'
  }, meta)
}
