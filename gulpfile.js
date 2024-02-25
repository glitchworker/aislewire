//------------------------------------------------------
// Load dependencies module
// 依存モジュール読み込み
//------------------------------------------------------

// Gulp Modules
import gulp from 'gulp'
const { src, dest, series, parallel, watch } = gulp // Gulp 本体
import concat from 'gulp-concat' // 複数ファイルの結合
import postcss from 'gulp-postcss' // PostCSS 本体
import header from 'gulp-header' // 先頭に記述を追加
import changed, { compareContents } from 'gulp-changed' // ファイルの変更点を監視
import gulpIf from 'gulp-if' // pipe 内で条件分岐
import purgecss from 'gulp-purgecss' // 未使用の CSS を削除

// PostCSS Modules
import sass from './tasks/modules/postcss-dart-sass/index.js' // SCSS を使用可能にする
import sassGlob from './tasks/modules/dart-sass-glob/index.js' // dart-sass に glob 機能を追加
import sassFunctions from './tasks/modules/dart-sass-functions/index.js' // dart-sass に function 機能を追加
import autoprefixer from 'autoprefixer' // プレフィックスを付与
import sorter from 'css-declaration-sorter' // CSS をソートする
import mqpacker from 'node-css-mqpacker' // MediaQuery を 1 つにまとめる
import cssNano from 'cssnano' // CSS を圧縮する

// Task Debugger Module
import path from 'path' // パス解析
import url from 'url' // URL をパースする
import minimist from 'minimist' // 引数を解析
import plumber from 'gulp-plumber' // エラー回避
import { readFileSync } from 'node:fs' // ファイル / ディレクトリ操作
import { deleteAsync } from 'del' // ファイル / ディレクトリ削除

// WebServer Module
import browserSync from 'browser-sync'
const bs = browserSync.create() // Web サーバー作成
import ssi from 'connect-ssi' // SSI を有効化
import jsonServer from 'gulp-json-srv' // API サーバー作成
import gitServer from 'node-git-server' // ローカル Git を作成

// Webpack Module
import webpack from 'webpack' // Webpack 読み込み
import webpackStream from 'webpack-stream' // Gulp で Webpack を読み込む
import { merge } from 'webpack-merge' // 共通の Webpack 設定をマージ
import { glob, globSync, globStream, globStreamSync, Glob } from 'glob' // Glob でディレクトリ検索

//------------------------------------------------------
// Load original module
// 独自モジュール読み込み
//------------------------------------------------------

import webConfig from './src/config.json' assert { type: 'json' } // サイト共通設定
import handlebars from './tasks/modules/handlebars/index.js' // Handlebars 拡張
import webpackConfig from './tasks/webpack.config.js' // Webpack 共通設定

//------------------------------------------------------
// Development & Production Environment Branch processing
// 開発＆本番環境の振り分け処理
//------------------------------------------------------

const options = minimist(process.argv.slice(2), {
  string: 'env',
  default: {
    env: process.env.NODE_ENV || 'development'
  }
})
const isProduction = (options.env === 'production') || (options.env === 'staging') ? true : false
const isStaging = options.env === 'staging' ? true : false

//------------------------------------------------------
// Additional settings of webConfig
// webConfig の追加設定
//------------------------------------------------------

let WEB_SITE_URL;

if (isProduction) {
  if (isStaging) {
    WEB_SITE_URL = webConfig.SITE_URL.STG
  } else {
    WEB_SITE_URL = webConfig.SITE_URL.PROD
  }
} else {
  WEB_SITE_URL = webConfig.SITE_URL.DEV
}

webConfig.WEB_BASE_URL = WEB_SITE_URL // config.json に WEB_BASE_URL 項目を追加
webConfig.WEB_SITE_URL = WEB_SITE_URL + webConfig.CURRENT_DIR // config.json に WEB_SITE_URL 項目を追加

//------------------------------------------------------
// Path Settings
// パス設定
//------------------------------------------------------

const rootDir = {
  src: 'src',
  htdocs: 'htdocs',
  assets: {
    pc: webConfig.ASSETS_DIR.PC,
    sp: webConfig.ASSETS_DIR.SP,
    common: webConfig.ASSETS_DIR.COMMON
  },
  tasks: 'tasks',
  setup: '_setup',
  git: '_git'
}

const paths = {
  common: {
    stylesheets: {
      src: `${rootDir.src}/common/stylesheets/_global.scss`,
      watch: [`${rootDir.src}/common/stylesheets/_global.scss`],
      dest: `${rootDir.src}/common/stylesheets/vars/`
    },
    javascripts: {
      concat: 'common.js',
      src: `${rootDir.src}/common/scripts/javascript/**/!(_)*.{js,jsx,ts,tsx}`,
      watch: `${rootDir.src}/common/scripts/javascript/**/!(_)*.{js,jsx,ts,tsx}`,
      dest: `${rootDir.htdocs}/${rootDir.assets.common}common/js/`
    },
    images: {
      src: `${rootDir.src}/common/images/**/*.*`,
      watch: `${rootDir.src}/common/images/**/*.*`,
      dest: `${rootDir.htdocs}/${rootDir.assets.common}common/images/`
    },
    libraryCopy: {
      lib: `${rootDir.src}/common/scripts/lib/**/!(_)*.js`,
      watch: `${rootDir.src}/common/scripts/lib/**/!(_)*.js`,
      dest: `${rootDir.htdocs}/${rootDir.assets.common}common/js/lib/`
    }
  },
  templates: {
    src: `${rootDir.src}/templates/pages/**/*.{hbs,html}`,
    layouts: `${rootDir.src}/templates/layouts`,
    partials: {
      partials: `${rootDir.src}/templates/partials`,
      components: `${rootDir.src}/templates/components`
    },
    globals: webConfig,
    watch: [`${rootDir.src}/templates/**/*.{hbs,html}`, `${rootDir.src}/_modules/data/**/*.{json,yml}`],
    dest: `${rootDir.htdocs}`
  },
  stylesheets: {
    concat: 'app.css',
    pc: {
      src: `${rootDir.src}/stylesheets/pc/app.scss`,
      watch: [`${rootDir.src}/common/stylesheets/**/*.scss`, `${rootDir.src}/stylesheets/pc/**/*.scss`],
      dest: `${rootDir.htdocs}/${rootDir.assets.pc}css/`
    },
    sp: {
      src: `${rootDir.src}/stylesheets/sp/app.scss`,
      watch: [`${rootDir.src}/common/stylesheets/**/*.scss`, `${rootDir.src}/stylesheets/sp/**/*.scss`],
      dest: `${rootDir.htdocs}/${rootDir.assets.sp}css/`
    },
    purge: {
      pc: {
        src: `${rootDir.htdocs}/${rootDir.assets.pc}css/app.css`,
        dest: `${rootDir.htdocs}/**/*.html`
      },
      sp: {
        src: `${rootDir.htdocs}/${rootDir.assets.sp}css/app.css`,
        dest: `${rootDir.htdocs}/sp/**/*.html`
      }
    }
  },
  javascripts: {
    concat: 'app.js',
    pc: {
      entries: `${rootDir.src}/javascripts/pc`,
      src: `${rootDir.src}/javascripts/pc/**/!(_)*.{js,jsx,ts,tsx}`,
      watch: `${rootDir.src}/javascripts/pc/**/!(_)*.{js,jsx,ts,tsx}`,
      dest: `${rootDir.htdocs}/${rootDir.assets.pc}js/`
    },
    sp: {
      entries: `${rootDir.src}/javascripts/sp`,
      src: `${rootDir.src}/javascripts/sp/**/!(_)*.{js,jsx,ts,tsx}`,
      watch: `${rootDir.src}/javascripts/sp/**/!(_)*.{js,jsx,ts,tsx}`,
      dest: `${rootDir.htdocs}/${rootDir.assets.sp}js/`
    }
  },
  images: {
    pc: {
      src: `${rootDir.src}/images/pc/**/*.*`,
      watch: `${rootDir.src}/images/pc/**/*.*`,
      dest: `${rootDir.htdocs}/${rootDir.assets.pc}images/`
    },
    sp: {
      src: `${rootDir.src}/images/sp/**/*.*`,
      watch: `${rootDir.src}/images/sp/**/*.*`,
      dest: `${rootDir.htdocs}/${rootDir.assets.sp}images/`
    }
  },
  modules: {
    data: {
      src: `${rootDir.src}/_modules/data`,
      watch: `${rootDir.src}/_modules/data/**/*.{json,yml}`
    },
    import: {
      src: `${rootDir.src}/_modules/import`,
      json: `${rootDir.src}/_modules/import/data.json`
    },
    api: {
      port: 9000,
      src: `./${rootDir.src}/_modules/api/`,
      watch: `${rootDir.src}/_modules/api/**/*.json`,
      dest: '/api'
    },
    git: {
      port: 7005,
      src: `${rootDir.git}`,
      repository: {
        src: `${rootDir.setup}/git/repository/**/*`,
        dest: `${rootDir.git}/develop.git`
      },
      hidden: {
        src: `${rootDir.setup}/git/hidden/**/*`,
        dest: `${rootDir.src}/.git`
      }
    }
  }
}

//------------------------------------------------------
// console.log Color Settings
// console.log の色設定
//------------------------------------------------------

const logStyle = col => str => `\u001b[${col}m${str}\u001b[0m`

const typeface = {
  bold: logStyle('1'),
  strong: logStyle('2'),
  italic: logStyle('3'),
  underline: logStyle('4')
}

const colors = {
  black: logStyle('30'),
  red: logStyle('31'),
  green: logStyle('32'),
  yellow: logStyle('33'),
  blue: logStyle('34'),
  magenta: logStyle('35'),
  cyan: logStyle('36'),
  white: logStyle('37')
}

//------------------------------------------------------
// Comment information Settings
// コメント情報の設定
//------------------------------------------------------

const commentsCss = [
  '/* --------------------------------------------------------',
  ' Name:      <%= pkg.WEB_SITE_NAME %> - <%= filename %>',
  ' Author:    <%= pkg.WEB_AUTHOR %>',
  ' Info:      <%= pkg.WEB_SITE_NAME %>',
  '----------------------------------------------------------- */',
  ''
].join('\n')

const commentsJs = [
  '/*!',
  ' * <%= pkg.WEB_SITE_NAME %> - <%= filename %>',
  ' * --------------------',
  ' * @author <%= pkg.WEB_AUTHOR %>',
  ` * @link ${webConfig.WEB_SITE_URL}`,
  ' * --------------------',
  ' */',
  ''
].join('\n')

//------------------------------------------------------
// Handlebars Settings
// Handlebars 設定
//------------------------------------------------------

const handlebarsConfig = {
  data: paths.modules.data.src,
  globals: paths.templates.globals,
  layouts: paths.templates.layouts,
  partials: paths.templates.partials
}

//------------------------------------------------------
// Stylesheets Settings
// Stylesheets 設定
//------------------------------------------------------

const stylesheetsConfig = (
  `$WEB_BASE_URL: "${webConfig.WEB_BASE_URL}";\n` +
  `$WEB_SITE_URL: "${webConfig.WEB_SITE_URL}";\n` +
  `$WEB_SITE_NAME: "${webConfig.WEB_SITE_NAME}";\n` +
  `$WEB_AUTHOR: "${webConfig.WEB_AUTHOR}";\n` +
  `$WEB_MODIFIER: "${webConfig.WEB_MODIFIER}";\n`
)

const assetConfig = {
  images_path: `${rootDir.src}/images`,
  http_images_path: '../images',
  asset_host: (http_path, done) => {
    webConfig.ASSETS_HOST.length ? done(`${webConfig.ASSETS_HOST}`) : done('')
  },
  asset_cache_buster: (http_path, real_path, done) => {
    webConfig.CACHE_VERSION.length ? done(`v=${webConfig.CACHE_VERSION}`) : done('')
  }
}

//------------------------------------------------------
// PostCSS Plugin Settings
// PostCSS プラグイン設定
//------------------------------------------------------

const postcssConfig = isProduction ? [
  sass({ functions: sassFunctions(assetConfig), indentWidth: 2, importer: [sassGlob] }),
  autoprefixer({ overrideBrowserslist: ['> 0%'] }),
  sorter({
    order: 'smacss',
    keepOverrides: true
  }),
  mqpacker,
  cssNano
] : [
  sass({ functions: sassFunctions(assetConfig), indentWidth: 2, importer: [sassGlob] }),
  autoprefixer({ overrideBrowserslist: ['> 0%'] }),
  sorter({
    order: 'smacss',
    keepOverrides: true
  }),
  mqpacker
]

//------------------------------------------------------
// Javascripts Settings
// Javascripts 設定
//------------------------------------------------------

// Webpack Entries 設定
const defaultEntries = {}
const spEntries = {}

if(webConfig.WEBPACK_ENTRIES) {
  globSync('**/*.js', {
    ignore: '**/_*.js',
    cwd: paths.javascripts.pc.entries
  }).map((key) => {
    defaultEntries[key] = path.resolve(paths.javascripts.pc.entries, key)
  })
  globSync('**/*.js', {
    ignore: '**/_*.js',
    cwd: paths.javascripts.sp.entries
  }).map((key) => {
    spEntries[key] = path.resolve(paths.javascripts.sp.entries, key)
  })
}

// Webpack Common 設定
const webpackCommon = merge(webpackConfig, {
  output: {
    filename: paths.common.javascripts.concat,
    sourceMapFilename: isProduction ? undefined : 'common.map'
  }
})

// Webpack Default 設定
const webpackDefault = merge(webpackConfig, {
  entry: webConfig.WEBPACK_ENTRIES ? defaultEntries : undefined,
  output: {
    filename: webConfig.WEBPACK_ENTRIES ? '[name]' : paths.javascripts.concat,
    sourceMapFilename: isProduction ? undefined : 'app.map'
  }
})

// Webpack SP 設定
const webpackSP = merge(webpackConfig, {
  entry: webConfig.WEBPACK_ENTRIES ? spEntries : undefined,
  output: {
    filename: webConfig.WEBPACK_ENTRIES ? '[name]' : paths.javascripts.concat,
    sourceMapFilename: isProduction ? undefined : 'app.map'
  }
})

//------------------------------------------------------
// BrowserSync Settings
// BrowserSync 設定
//------------------------------------------------------

const browserSyncConfig = {
  server: {
    https: webConfig.HTTPS_SERVER,
    baseDir: rootDir.htdocs,
    middleware: [
      ssi({
        baseDir: path.join(`${rootDir.htdocs}`),
        ext: '.html'
      })
    ]
  },
  reloadDelay: 120,
  notify: false,
  ghostMode: false,
  logPrefix: 'Local Web Server',
  logFileChanges: false,
  startPath: webConfig.CURRENT_DIR
}

const browserSyncCallbacks = (err, bs) => {
  // サーバー URL 取得
  const baseURL = bs.getOption('urls')
  const localURL = url.parse(baseURL.get('local', false))
  const externalURL = url.parse(baseURL.get('external', false))

  // API サーバー起動のログ出力
  if (webConfig.LOCAL_SERVER.API) {
    console.log(`[${colors.green('API Mock Server')}] ${typeface.bold('Access URLs: ')}`)
    console.log(` ${typeface.strong('---------------------------------------')}`)
    console.log(`       Local: ${colors.magenta(`${localURL.protocol}//${localURL.hostname}:${paths.modules.api.port}${paths.modules.api.dest}/db`)}`)
    console.log(`    External: ${colors.magenta(`${externalURL.protocol}//${externalURL.hostname}:${paths.modules.api.port}${paths.modules.api.dest}/db`)}`)
    console.log(` ${typeface.strong('---------------------------------------')}`)
    console.log(`[${colors.green('API Mock Server')}] Serving files from: ${colors.magenta(`${rootDir.src}${paths.modules.api.dest}`)}`)
  }

  // Git サーバー起動＆ログ出力
  if (webConfig.LOCAL_SERVER.GIT) {
    const repos = new gitServer(path.resolve(__dirname, paths.modules.git.src), {
      autoCreate: true
    })
    const port = process.env.PORT || paths.modules.git.port
    repos.on('push', push => {
      console.log(`[${colors.yellow('Node Git Server')}] PUSH: ${colors.magenta(`${push.repo} / ${push.commit} ( ${push.branch} )`)}`)
      push.accept()
    })
    repos.on('fetch', fetch => {
      console.log(`[${colors.yellow('Node Git Server')}] FETCH: ${colors.magenta(`${fetch.repo} / ${fetch.commit}`)}`)
      fetch.accept()
    })
    repos.listen(port, () => {
      console.log(`[${colors.yellow('Node Git Server')}] ${typeface.bold('Repository Base URL: ')}`)
      console.log(` ${typeface.strong('---------------------------------------')}`)
      console.log(`       Local: ${colors.magenta(`${localURL.protocol}//${localURL.hostname}:${port}/develop`)}`)
      console.log(`    External: ${colors.magenta(`${externalURL.protocol}//${externalURL.hostname}:${port}/develop`)}`)
      console.log(` ${typeface.strong('---------------------------------------')}`)
      console.log(`[${colors.yellow('Node Git Server')}] Serving files from: ${colors.magenta(`${paths.modules.git.src}`)}`)
    })
  }
}

//------------------------------------------------------
// APIServer Settings
// APIServer 設定
//------------------------------------------------------

const apiServerConfig = {
  port: paths.modules.api.port,
  baseUrl: paths.modules.api.dest,
  static: paths.modules.api.src,
  verbosity: {
    level: 'error',
    urlTracing: false
  }
}

//------------------------------------------------------
// Plumber Settings
// Plumber でエラーが出た時に止めないようにする
//------------------------------------------------------

const plumberConfig = error => {
  console.log(error)
  this.emit('end')
}

//------------------------------------------------------
// Common Build Settings
// 共通ビルド設定
//------------------------------------------------------

// import settings
const importData = done => {
  const jsonData = JSON.parse(readFileSync(paths.modules.import.json));
  let jsonDataPath;
  jsonData.forEach((page, i) => {
    if (page.TYPE === 'dir') {
      jsonDataPath = `${paths.modules.import.src}/${page.DATA}/**/*`
    } else {
      jsonDataPath = `${paths.modules.import.src}/${page.DATA}`
    }
    return src(jsonDataPath, { allowEmpty: true })
    .pipe(plumber(plumberConfig))
    .pipe(changed(page.OUTPUT, { hasChanged: compareContents }))
    .pipe(dest(`${rootDir.htdocs}/${page.OUTPUT}`))
  });
  return done()
}

// library settings
const libraryCopy = () =>
  src(paths.common.libraryCopy.lib)
  .pipe(plumber(plumberConfig))
  .pipe(changed(paths.common.libraryCopy.dest))
  .pipe(dest(paths.common.libraryCopy.dest))

// Stylesheets common settings
const stylesheetsCommon = () =>
  src(paths.common.stylesheets.src)
  .pipe(header(stylesheetsConfig))
  .pipe(concat('_variable.scss'))
  .pipe(dest(paths.common.stylesheets.dest))

// javascripts common settings
const javascriptsCommon = () =>
  src(paths.common.javascripts.src)
  .pipe(plumber(plumberConfig))
  .pipe(webpackStream(webpackCommon, webpack))
  .pipe(gulpIf(isProduction, header(commentsJs, {pkg: webConfig, filename: paths.common.javascripts.concat})))
  .pipe(dest(paths.common.javascripts.dest))
  .pipe(bs.stream())

// images common settings
const imagesCommon = () =>
  src(paths.common.images.src)
  .pipe(plumber(plumberConfig))
  .pipe(changed(paths.common.images.dest, { hasChanged: compareContents }))
  .pipe(dest(paths.common.images.dest))

//------------------------------------------------------
// Build Settings
// ビルド設定
//------------------------------------------------------

// Templates Settings
const templates = () =>
  src(paths.templates.src)
  .pipe(plumber(plumberConfig))
  .pipe(handlebars(handlebarsConfig))
  .pipe(dest(paths.templates.dest))
  .pipe(bs.stream())

// Stylesheets Settings
const stylesheets = () =>
  src(paths.stylesheets.pc.src, isProduction ? undefined : { sourcemaps: true })
  .pipe(plumber(plumberConfig))
  .pipe(header(stylesheetsConfig))
  .pipe(postcss(postcssConfig))
  .pipe(concat(paths.stylesheets.concat))
  .pipe(gulpIf(isProduction, header(commentsCss, {pkg: webConfig, filename: paths.stylesheets.concat})))
  .pipe(dest(paths.stylesheets.pc.dest, isProduction ? undefined : { sourcemaps: true }))
  .pipe(bs.stream())

// Javascripts Settings
const javascripts = () =>
  src(paths.javascripts.pc.src)
  .pipe(plumber(plumberConfig))
  .pipe(webpackStream(webpackDefault, webpack))
  .pipe(gulpIf(isProduction, header(commentsJs, {pkg: webConfig, filename: paths.javascripts.concat})))
  .pipe(dest(paths.javascripts.pc.dest))
  .pipe(bs.stream())

// Images Settings
const images = () =>
  src(paths.images.pc.src)
  .pipe(plumber(plumberConfig))
  .pipe(changed(paths.images.pc.dest, { hasChanged: compareContents }))
  .pipe(dest(paths.images.pc.dest))

// Stylesheets Settings SP
const stylesheetsSP = () =>
  src(paths.stylesheets.sp.src, isProduction ? undefined : { sourcemaps: true })
  .pipe(plumber(plumberConfig))
  .pipe(header(stylesheetsConfig))
  .pipe(postcss(postcssConfig))
  .pipe(concat(paths.stylesheets.concat))
  .pipe(gulpIf(isProduction, header(commentsCss, {pkg: webConfig, filename: paths.stylesheets.concat})))
  .pipe(dest(paths.stylesheets.sp.dest, isProduction ? undefined : { sourcemaps: true }))
  .pipe(bs.stream())

// Javascripts Settings SP
const javascriptsSP = () =>
  src(paths.javascripts.sp.src)
  .pipe(plumber(plumberConfig))
  .pipe(webpackStream(webpackSP, webpack))
  .pipe(gulpIf(isProduction, header(commentsJs, {pkg: webConfig, filename: paths.javascripts.concat})))
  .pipe(dest(paths.javascripts.sp.dest))
  .pipe(bs.stream())

// Images Settings SP
const imagesSP = () =>
  src(paths.images.sp.src)
  .pipe(plumber(plumberConfig))
  .pipe(changed(paths.images.sp.dest, { hasChanged: compareContents }))
  .pipe(dest(paths.images.sp.dest))

// Purge CSS
const purgeCSSpc = () =>
  src(paths.stylesheets.purge.pc.src)
  .pipe(
    purgecss({
      content: [paths.stylesheets.purge.pc.dest]
    })
  )
  .pipe(concat('app.purge.css'))
  .pipe(dest(paths.stylesheets.pc.dest))

  // Purge CSS
const purgeCSSsp = () =>
  src(paths.stylesheets.purge.sp.src)
  .pipe(
    purgecss({
      content: [paths.stylesheets.purge.sp.dest]
    })
  )
  .pipe(concat('app.purge.css'))
  .pipe(dest(paths.stylesheets.sp.dest))

//------------------------------------------------------
// Local & API & Git server Settings
// ローカル & API & Git サーバー設定
//------------------------------------------------------

// browserSync init
const browserSyncInit = () => bs.init(null, browserSyncConfig, browserSyncCallbacks)

// apiServer init
let apiServer
const apiServerInit = () => apiServer = jsonServer.create(apiServerConfig)

// watch directory
const apiDirectory = () => src(paths.modules.api.watch).pipe(apiServer.pipe())

//------------------------------------------------------
// Other Settings
// その他設定
//------------------------------------------------------

// remove directory
const removeDirectory = done => deleteAsync([ rootDir.htdocs ], done);

// remove git directory
const removeGit = done => deleteAsync([ `${rootDir.git}`, `${rootDir.src}/.git` ], done);

// Git Repository
const repositoryCopy = () =>
  src(paths.modules.git.repository.src)
  .pipe(plumber(plumberConfig))
  .pipe(dest(paths.modules.git.repository.dest))

// Git Repository ( hidden )
const repositoryHiddenCopy = () =>
  src(paths.modules.git.hidden.src)
  .pipe(plumber(plumberConfig))
  .pipe(dest(paths.modules.git.hidden.dest))

//------------------------------------------------------
// Monitoring Task
// 監視タスク
//------------------------------------------------------

// watch stylesheets common
const watchStylesheetsCommon = () => watch(paths.common.stylesheets.watch, stylesheetsCommon)

// watch javascripts common
const watchJavascriptsCommon = () => watch(paths.common.javascripts.watch, javascriptsCommon)

// watch images common
const watchImagesCommon = () => watch(paths.common.images.watch, imagesCommon)

// watch library common
const watchLibraryCommon = () => watch(paths.common.libraryCopy.watch, libraryCopy)

// watch templates
const watchTemplates = () => watch(paths.templates.watch, templates)

// watch stylesheets
const watchStylesheets = () => watch(paths.stylesheets.pc.watch, stylesheets)

// watch javascripts
const watchJavascripts = () => watch(paths.javascripts.pc.watch, javascripts)

// watch images
const watchImages = () => watch(paths.images.pc.watch, images)

// watch stylesheets SP
const watchStylesheetsSP = () => watch(paths.stylesheets.sp.watch, stylesheetsSP)

// watch javascripts SP
const watchJavascriptsSP = () => watch(paths.javascripts.sp.watch, javascriptsSP)

// watch images SP
const watchImagesSP = () => watch(paths.images.sp.watch, imagesSP)

// watch api
const watchAPI = () => watch(paths.modules.api.watch, apiDirectory)

//------------------------------------------------------
// Declaring Each Task
// 各タスクの宣言
//------------------------------------------------------

// task setting
let buildTaskPC, buildTaskSP, setupTask, taskDefault
if(webConfig.PURGE_CSS) {
  buildTaskPC = series(importData, libraryCopy, stylesheetsCommon, javascriptsCommon, imagesCommon, templates, stylesheets, javascripts, images, purgeCSSpc)
  buildTaskSP = series(importData, libraryCopy, stylesheetsCommon, javascriptsCommon, imagesCommon, templates, stylesheets, javascripts, images, stylesheetsSP, javascriptsSP, imagesSP, purgeCSSpc, purgeCSSsp)
} else {
  buildTaskPC = series(importData, libraryCopy, stylesheetsCommon, javascriptsCommon, imagesCommon, templates, stylesheets, javascripts, images)
  buildTaskSP = series(importData, libraryCopy, stylesheetsCommon, javascriptsCommon, imagesCommon, templates, stylesheets, javascripts, images, stylesheetsSP, javascriptsSP, imagesSP)
}
const watchTaskPC = parallel(browserSyncInit, watchLibraryCommon, watchStylesheetsCommon, watchJavascriptsCommon, watchImagesCommon, watchTemplates, watchStylesheets, watchJavascripts, watchImages)
const watchTaskSP = parallel(browserSyncInit, watchLibraryCommon, watchStylesheetsCommon, watchJavascriptsCommon, watchImagesCommon, watchTemplates, watchStylesheets, watchJavascripts, watchImages, watchStylesheetsSP, watchJavascriptsSP, watchImagesSP)

// task if else
const buildTask = webConfig.ASSETS_DIR.SP.length ? buildTaskSP : buildTaskPC
const watchTask = webConfig.ASSETS_DIR.SP.length ? watchTaskSP : watchTaskPC

// clean task
const clean = series(removeDirectory)
// clean git task
const cleanGit = series(removeGit)
// imports task
const imports = series(importData)
// purgecss task
const purgeCSSpcTask = series(purgeCSSpc)
// purgecss task
const purgeCSSspTask = series(purgeCSSsp)

// setup task
if(webConfig.LOCAL_SERVER.GIT) {
  setupTask = parallel(repositoryCopy, repositoryHiddenCopy, buildTask)
} else {
  setupTask = buildTask
}

// default task
if (webConfig.LOCAL_SERVER.API) {
  taskDefault = parallel(watchTask, apiServerInit, apiDirectory, watchAPI)
} else {
  taskDefault = watchTask
}

export {
  taskDefault as default,
  buildTask as build,
  clean,
  cleanGit,
  imports as import,
  purgeCSSpcTask as purgeCSSpc,
  purgeCSSspTask as purgeCSSsp,
  setupTask as setup
}