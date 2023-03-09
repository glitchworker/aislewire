//------------------------------------------------------
// Load dependencies module
// 依存モジュール読み込み
//------------------------------------------------------

// Gulp Modules
const { src, dest, series, parallel, watch } = require('gulp'); // Gulp 本体
const concat = require('gulp-concat'); // 複数ファイルの結合
const postcss = require('gulp-postcss'); // PostCSS 本体
const header = require('gulp-header'); // 先頭に記述を追加
const changed = require('gulp-changed'); // ファイルの変更点を監視
const gulpIf = require('gulp-if'); // pipe 内で条件分岐
const purgecss = require('gulp-purgecss') // 未使用の CSS を削除

// PostCSS Modules
const sass = require('./tasks/modules/postcss-node-sass'); // SCSS を使用可能にする
const sassGlob = require('./tasks/modules/node-sass-glob'); // node-sass に glob 機能を追加
const sassFunctions = require('./tasks/modules/node-sass-functions'); // node-sass に function 機能を追加
const autoprefixer = require('autoprefixer'); // プレフィックスを付与
const sorter = require('css-declaration-sorter'); // CSS をソートする
const mqpacker = require('node-css-mqpacker'); // MediaQuery を 1 つにまとめる
const cssNano = require('cssnano'); // CSS を圧縮する

// Task Debugger Module
const path = require('path'); // パス解析
const url = require('url'); // URL をパースする
const minimist = require('minimist'); // 引数を解析
const plumber = require('gulp-plumber'); // エラー回避
const fs = require('fs'); // ファイル / ディレクトリ操作
const del =require('del'); // ファイル / ディレクトリ削除
const exec = require('child_process').exec; // コマンド実行

// WebServer Module
const bs = require('browser-sync').create(); // Web サーバー作成
const ssi = require('connect-ssi'); // SSI を有効化
const jsonServer = require('gulp-json-srv'); // API サーバー作成
const gitServer = require('node-git-server'); // ローカル Git を作成

// Webpack Module
const webpack = require('webpack'); // Webpack 読み込み
const webpackStream = require('webpack-stream'); // Gulp で Webpack を読み込む
const { merge } = require('webpack-merge'); // 共通の Webpack 設定をマージ
const glob = require('glob'); // Glob でディレクトリ検索

//------------------------------------------------------
// Load original module
// 独自モジュール読み込み
//------------------------------------------------------

const webConfig = require('./src/config'); // サイト共通設定
const handlebars = require('./tasks/modules/handlebars'); // Handlebars 拡張
const webpackConfig = require('./tasks/webpack.config'); // Webpack 共通設定

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
    javascripts: {
      concat: 'common.js',
      src: `${rootDir.src}/common/scripts/javascript/**/!(_)*.js`,
      watch: `${rootDir.src}/common/scripts/javascript/**/!(_)*.js`,
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
    watch: [`${rootDir.src}/templates/**/*.{hbs,html}`, `${rootDir.src}/_modules/data/**/*.{json,js,yml}`],
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
      src: `${rootDir.src}/javascripts/pc/**/!(_)*.js`,
      watch: `${rootDir.src}/javascripts/pc/**/!(_)*.js`,
      dest: `${rootDir.htdocs}/${rootDir.assets.pc}js/`
    },
    sp: {
      entries: `${rootDir.src}/javascripts/sp`,
      src: `${rootDir.src}/javascripts/sp/**/!(_)*.js`,
      watch: `${rootDir.src}/javascripts/sp/**/!(_)*.js`,
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
      watch: `${rootDir.src}/_modules/data/**/*.{json,js,yml}`
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

const logStyle = col => str => `\u001b[${col}m${str}\u001b[0m`;

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
].join('\n');

const commentsJs = [
  '/*!',
  ' * <%= pkg.WEB_SITE_NAME %> - <%= filename %>',
  ' * --------------------',
  ' * @author <%= pkg.WEB_AUTHOR %>',
  ` * @link ${webConfig.WEB_SITE_URL}`,
  ' * --------------------',
  ' */',
  ''
].join('\n');

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
    webConfig.ASSETS_HOST.length ? done(`${webConfig.ASSETS_HOST}`) : done('');
  },
  asset_cache_buster: (http_path, real_path, done) => {
    webConfig.CACHE_VERSION.length ? done(`v=${webConfig.CACHE_VERSION}`) : done('');
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
glob.sync('**/*.js', {
  ignore: '**/_*.js',
  cwd: paths.javascripts.pc.entries
}).map((key) => {
  defaultEntries[key] = path.resolve(paths.javascripts.pc.entries, key)
})
glob.sync('**/*.js', {
  ignore: '**/_*.js',
  cwd: paths.javascripts.sp.entries
}).map((key) => {
  spEntries[key] = path.resolve(paths.javascripts.sp.entries, key)
})

// Webpack Common 設定
const webpackCommon = merge(webpackConfig, {
  output: {
    filename: paths.common.javascripts.concat,
    sourceMapFilename: !isProduction ? 'common.map' : undefined
  }
})

// Webpack Default 設定
const webpackDefault = merge(webpackConfig, {
  entry: !webConfig.WEBPACK_ENTRIES ? undefined : defaultEntries,
  output: {
    filename: !webConfig.WEBPACK_ENTRIES ? paths.javascripts.concat : '[name]',
    sourceMapFilename: !isProduction ? 'app.map' : undefined
  }
})

// Webpack SP 設定
const webpackSP = merge(webpackConfig, {
  entry: !webConfig.WEBPACK_ENTRIES ? undefined : spEntries,
  output: {
    filename: !webConfig.WEBPACK_ENTRIES ? paths.javascripts.concat : '[name]',
    sourceMapFilename: !isProduction ? 'app.map' : undefined
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
  const baseURL = bs.getOption('urls');
  const localURL = url.parse(baseURL.get('local', false));
  const externalURL = url.parse(baseURL.get('external', false));

  // API サーバー起動のログ出力
  if (webConfig.LOCAL_SERVER.API) {
    console.log(`[${colors.green('API Mock Server')}] ${typeface.bold('Access URLs: ')}`);
    console.log(` ${typeface.strong('---------------------------------------')}`);
    console.log(`       Local: ${colors.magenta(`${localURL.protocol}//${localURL.hostname}:${paths.modules.api.port}${paths.modules.api.dest}/db`)}`);
    console.log(`    External: ${colors.magenta(`${externalURL.protocol}//${externalURL.hostname}:${paths.modules.api.port}${paths.modules.api.dest}/db`)}`);
    console.log(` ${typeface.strong('---------------------------------------')}`);
    console.log(`[${colors.green('API Mock Server')}] Serving files from: ${colors.magenta(`${rootDir.src}${paths.modules.api.dest}`)}`);
  }

  // GSX サーバー起動のログ出力
  if (webConfig.LOCAL_SERVER.GSX) {
    console.log(`[${colors.green('GSX API Server')}] ${typeface.bold('Access URLs: ')}`);
    console.log(` ${typeface.strong('---------------------------------------')}`);
    console.log(`       Local: ${colors.magenta(`${localURL.protocol}//${localURL.hostname}:5000${paths.modules.api.dest}`)}`);
    console.log(`    External: ${colors.magenta(`${externalURL.protocol}//${externalURL.hostname}:5000${paths.modules.api.dest}`)}`);
    console.log(` ${typeface.strong('---------------------------------------')}`);
    console.log(`[${colors.green('GSX API Server')}] Serving files from: ${colors.magenta(`${rootDir.src}/_modules/data/gsx.json`)}`);
  }

  // Git サーバー起動＆ログ出力
  if (webConfig.LOCAL_SERVER.GIT) {
    const repos = new gitServer(path.resolve(__dirname, paths.modules.git.src), {
      autoCreate: true
    });
    const port = process.env.PORT || paths.modules.git.port;
    repos.on('push', push => {
      console.log(`[${colors.yellow('Node Git Server')}] PUSH: ${colors.magenta(`${push.repo} / ${push.commit} ( ${push.branch} )`)}`);
      push.accept();
    });
    repos.on('fetch', fetch => {
      console.log(`[${colors.yellow('Node Git Server')}] FETCH: ${colors.magenta(`${fetch.repo} / ${fetch.commit}`)}`);
      fetch.accept();
    });
    repos.listen(port, () => {
      console.log(`[${colors.yellow('Node Git Server')}] ${typeface.bold('Repository Base URL: ')}`);
      console.log(` ${typeface.strong('---------------------------------------')}`);
      console.log(`       Local: ${colors.magenta(`${localURL.protocol}//${localURL.hostname}:${port}/develop`)}`);
      console.log(`    External: ${colors.magenta(`${externalURL.protocol}//${externalURL.hostname}:${port}/develop`)}`);
      console.log(` ${typeface.strong('---------------------------------------')}`);
      console.log(`[${colors.yellow('Node Git Server')}] Serving files from: ${colors.magenta(`${paths.modules.git.src}`)}`);
    });
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
  const jsonData = JSON.parse(fs.readFileSync(paths.modules.import.json));
  jsonData.forEach((page, i) => {
    if (page.TYPE === 'dir') {
      jsonDataPath = `${paths.modules.import.src}/${page.DATA}/**/*`
    } else {
      jsonDataPath = `${paths.modules.import.src}/${page.DATA}`
    }
    return src(jsonDataPath, { allowEmpty: true })
    .pipe(plumber(plumberConfig))
    .pipe(changed(page.OUTPUT, { hasChanged: changed.compareContents }))
    .pipe(dest(`${rootDir.htdocs}/${page.OUTPUT}`));
  });
  return done();
}

// library settings
const libraryCopy = () =>
  src(paths.common.libraryCopy.lib)
  .pipe(plumber(plumberConfig))
  .pipe(changed(paths.common.libraryCopy.dest))
  .pipe(dest(paths.common.libraryCopy.dest))

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
  .pipe(changed(paths.common.images.dest, { hasChanged: changed.compareContents }))
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
  src(paths.stylesheets.pc.src, !isProduction ? { sourcemaps: true } : undefined)
  .pipe(plumber(plumberConfig))
  .pipe(header(stylesheetsConfig))
  .pipe(postcss(postcssConfig))
  .pipe(concat(paths.stylesheets.concat))
  .pipe(gulpIf(isProduction, header(commentsCss, {pkg: webConfig, filename: paths.stylesheets.concat})))
  .pipe(dest(paths.stylesheets.pc.dest, !isProduction ? { sourcemaps: true } : undefined))
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
  .pipe(changed(paths.images.pc.dest, { hasChanged: changed.compareContents }))
  .pipe(dest(paths.images.pc.dest))

// Stylesheets Settings SP
const stylesheetsSP = () =>
  src(paths.stylesheets.sp.src, !isProduction ? { sourcemaps: true } : undefined)
  .pipe(plumber(plumberConfig))
  .pipe(header(stylesheetsConfig))
  .pipe(postcss(postcssConfig))
  .pipe(concat(paths.stylesheets.concat))
  .pipe(gulpIf(isProduction, header(commentsCss, {pkg: webConfig, filename: paths.stylesheets.concat})))
  .pipe(dest(paths.stylesheets.sp.dest, !isProduction ? { sourcemaps: true } : undefined))
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
  .pipe(changed(paths.images.sp.dest, { hasChanged: changed.compareContents }))
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
const apiServerInit = () => apiServer = jsonServer.create(apiServerConfig)

// watch directory
const apiDirectory = () => src(paths.modules.api.watch).pipe(apiServer.pipe())

// gsxServer init
const gsxServerInit = done => {
  exec(`node ./${rootDir.tasks}/modules/gsx2json/app.js`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
  });
  return done();
}

//------------------------------------------------------
// Other Settings
// その他設定
//------------------------------------------------------

// remove directory
const removeDirectory = cb => del([ rootDir.htdocs ], cb);

// remove git directory
const removeGit = cb => del([ `${rootDir.git}`, `${rootDir.src}/.git` ], cb);

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
const buildTaskPC = series(importData, libraryCopy, javascriptsCommon, imagesCommon, templates, stylesheets, javascripts, images, purgeCSSpc)
const watchTaskPC = parallel(browserSyncInit, watchLibraryCommon, watchJavascriptsCommon, watchImagesCommon, watchTemplates, watchStylesheets, watchJavascripts, watchImages)

const buildTaskSP = series(importData, libraryCopy, javascriptsCommon, imagesCommon, templates, stylesheets, javascripts, images, stylesheetsSP, javascriptsSP, imagesSP, purgeCSSpc, purgeCSSsp)
const watchTaskSP = parallel(browserSyncInit, watchLibraryCommon, watchJavascriptsCommon, watchImagesCommon, watchTemplates, watchStylesheets, watchJavascripts, watchImages, watchStylesheetsSP, watchJavascriptsSP, watchImagesSP)

// task if else
const buildTask = webConfig.ASSETS_DIR.SP.length ? buildTaskSP : buildTaskPC
const watchTask = webConfig.ASSETS_DIR.SP.length ? watchTaskSP : watchTaskPC

// build task
exports.build = buildTask

// clean task
exports.clean = series(removeDirectory)

// clean git task
exports.cleanGit = series(removeGit)

// import task
exports.import = series(importData)

// purgecss task
exports.purgeCSSpc = series(purgeCSSpc)

// purgecss task
exports.purgeCSSsp = series(purgeCSSsp)

// setup task
if (webConfig.LOCAL_SERVER.GIT) {
  exports.setup = parallel(repositoryCopy, repositoryHiddenCopy, buildTask)
} else {
  exports.setup = buildTask
}

// default task
if (webConfig.LOCAL_SERVER.API) {
  if (webConfig.LOCAL_SERVER.GSX) {
    exports.default = parallel(watchTask, apiServerInit, apiDirectory, watchAPI, gsxServerInit)
  } else {
    exports.default = parallel(watchTask, apiServerInit, apiDirectory, watchAPI)
  }
} else {
  if (webConfig.LOCAL_SERVER.GSX) {
    exports.default = parallel(watchTask, gsxServerInit)
  } else {
    exports.default = watchTask
  }
}