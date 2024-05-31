//------------------------------------------------------
// Load dependencies module
// 依存モジュール読み込み
//------------------------------------------------------

import webpackStream from 'webpack-stream' // Webpack 読み込み
const { webpack } = webpackStream
import { readFileSync } from 'node:fs' // ファイル / ディレクトリ操作
import { parse } from 'jsonc-parser'; // JSONC ファイル読み込み
import minimist from 'minimist' // Gulp で引数を解析
import IfPlugin from './modules/if-webpack-plugin/index.js' // Webpack の 条件分岐
import TerserPlugin from 'terser-webpack-plugin' // Webpack の minify 設定
import HardSourcePlugin from 'hard-source-webpack-plugin' // 中間キャッシュでビルド時間を短縮

//------------------------------------------------------
// Load original module
// 独自モジュール読み込み
//------------------------------------------------------

// import webConfig from '../src/config.json' assert { type: 'json' } // サイト共通設定（Experimental）
const webConfig = parse(readFileSync('./src/config.jsonc').toString()) // サイト共通設定

//------------------------------------------------------
// Development & Production Environment Branch processing
// 開発＆本番環境の振り分け処理
//------------------------------------------------------

const options = minimist(process.argv.slice(2), {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'development' }
})

const isProduction = (options.env === 'production') || (options.env === 'staging') ? true : false
const isStaging = options.env === 'staging' ? true : false
const isMode = (options.env === 'production') || (options.env === 'staging') ? 'production' : 'development'
let WEB_SITE_URL

if(isProduction) {
  if(isStaging) {
    WEB_SITE_URL = webConfig.SITE_URL.STG
  } else {
    WEB_SITE_URL = webConfig.SITE_URL.PROD
  }
} else {
  WEB_SITE_URL = webConfig.SITE_URL.DEV
}

//------------------------------------------------------
// WebPack Modules
// WebPack のモジュール設定
//------------------------------------------------------

const config = {
  target: ['web', 'es5'],  // Webpack 5 からの ES5 ( IE11 等 ) 向け設定
  mode: isMode,
  devtool: isProduction ? undefined : 'inline-source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'] // import する際に、拡張子を省略するための設定
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: [
          {
            loader: 'babel-loader?optional=runtime&cacheDirectory',
            options: {
              // plugins の内容が先に実行され、presets の内容が後に実行される
              // https://babeljs.io/docs/en/plugins/#plugin-ordering
              presets: [ // presets は下から上に実行される
                '@babel/preset-env', // (4)
                '@babel/preset-typescript' // (3)
              ],
              plugins: [ // plugins は上から下に実行される
                [ '@babel/plugin-proposal-class-properties' ], // (1)
                [ '@babel/plugin-transform-classes', { 'loose': true } ] // (2) ES6 を ES5 に変換
              ],
              cacheDirectory: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'WEB_BASE_URL': JSON.stringify(WEB_SITE_URL),
      'WEB_SITE_URL': JSON.stringify(WEB_SITE_URL + webConfig.CURRENT_DIR),
      'WEB_SITE_NAME': JSON.stringify(webConfig.WEB_SITE_NAME),
      'WEB_AUTHOR': JSON.stringify(webConfig.WEB_AUTHOR),
      'WEB_MODIFIER': JSON.stringify(webConfig.WEB_MODIFIER)
    }),
    // new HardSourcePlugin(
    //   // cacheDirectory: '.cache/hard-source/[confighash]'
    // )
  ],
  // Webpack 4 で minify の詳細設定するための記述
  optimization: {
    minimizer: [
      new IfPlugin(
        isProduction,
        new TerserPlugin({
          // LICENSE.txt を出力させない
          extractComments: false,
          terserOptions: {
            // cache: true, // v5 から廃止された
            // parallel: true, // v5 から廃止された
            output: {
              // Licence 表記を消さない
              comments: /^\**!|@preserve|@license|@cc_on/
            },
            compress: {
              // console.log を削除
              drop_console: true
            }
          }
        })
      )
    ]
  }
};

export default config