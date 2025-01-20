# AisleWire

[![license](https://img.shields.io/github/license/glitchworker/aislewire.svg)](https://github.com/glitchworker/aislewire/blob/master/LICENSE)

**AisleWire for front-end website Developments.**

gulp / handlebars / scss / webpack (babel)

## 🤔 AisleWire ?

AisleWire（アイルワイヤー）  
Aisle は座席列間の```《通路》```やラテン語で```《翼》```を意味し  
Wire は```《線》```や```《網》```などを意味します。  
あらゆるモノへの```《繋がり》```と```《強さ》```を表しています。

## 📌 Require

- Windows or Mac or Linux ( Verified )
- This function requires supervisor permission.
- node v20.12.2 over
- npm v10.2.4 over

## 🔰 Usage

1. [NodeJS](https://nodejs.org/en/) をダウンロードしインストールする（最新版LTSを推奨）

2. ```ターミナル```または```コマンドプロンプト```を```管理者権限```で開く

3. ```npm install -g yarn``` で Yarn をインストールする（npm のままビルドする場合は不要）

4. ```yarn install``` で必要なパッケージをインストール（npm の場合 ```npm install```）

5. ```/src/config.jsonc``` を開き各項目を編集しておく（後からも変更可能）

6. ```yarn setup``` を初回に1度だけ実行する（npm の場合 ```npm run setup```）

7. ```yarn start``` で開発環境を起動する（自動的に既存のブラウザが起動）（npm の場合 ```npm run start```）

8. 後は ```/src/``` フォルダ内のファイルを編集し作業をする

9. 以降7〜8の繰り返し

> 本番環境にアップロードする場合、```yarn prod``` を実行し ```/htdocs/``` 内をアップする  
※ 各設定ファイルについては Setting 、開発用のコマンドについては Scripts を参照
> 
> また、6 の時に ```LOCAL_SERVER``` の ```GIT``` 項目を ```true``` にしておくと  
ローカルGitの環境が構築され以降、本番にアップロードするまでの間バージョン管理として利用できます。  
※ネットワークを介せば他のパソコンからも共同編集が可能になり便利です。  
　使用方法は通常のGitと同じ要領なので有効にしておく事をオススメします。

## 🔧 Setting

### project

| ファイル名 | 説明 |
|----|---|
| /gulpfile.js | gulp に関する設定ファイル |
| /tasks/webpack.config.js | webpack に関する設定ファイル |
| /src/config.jsonc | 共通設定ファイル |

#### config.jsonc

```json
{
  "WEB_SITE_NAME": "これはサイト名です",
  "WEB_AUTHOR": "これは作成者です",
  "WEB_MODIFIER": "これは編集者です",
  "SITE_URL": {
    "DEV": "http://dev.hoge.com/",
    "STG": "http://stg.hoge.com/",
    "PROD": "http://prod.hoge.com/"
  },
  "CURRENT_DIR": "",
  "ABSOLUTE_DIR": false,
  "ASSETS_DIR": {
    "COMMON": "assets/",
    "PC": "assets/",
    "SP": ""
  },
  "LOCAL_SERVER": {
    "API": false,
    "GIT": false
  },
  "ASSETS_HOST": "",
  "CACHE_VERSION": "",
  "HTTPS_SERVER": false,
  "WEBPACK_ENTRIES": false,
  "PURGE_CSS": false
}
```

### src

| ファイル名 | 説明 |
|----|---|
| /src/templates/**/*.hbs | template 内で使う規定値 |
| /src/common/stylesheets/_config.scss | stylesheet 内で使う規定値 |
| /src/_modules/api/data.json | api で使う規定値 |
| /src/_modules/data/**/* | 共通の規定値（ json, yml 読み込み可能） |
| /src/_modules/import/data.jsonc | import で使う規定値 |

#### /api/data.json
```json
{
  "users": [
    {
      "id": 1,
      "name": "hoge",
      "email": "hoge@hoge.com"
    },
	  {
      "id": 2,
      "name": "fuga",
      "email": "fuga@fuga.com"
    }
  ]
}
```

#### /**/*.hbs

```yaml
---
layout: pc
RESPONSIVE: true
REDIRECT: false

BODY_CLASS: index
ADD_STYLES:
ADD_SCRIPTS_HEADER:
ADD_SCRIPTS_FOOTER:

LANGUAGE: ja
NAMESPACE: website
META_CHARSET: UTF-8
META_ROBOTS: index,follow
META_VIEWPORT: width=device-width,initial-scale=1,minimum-scale=1,shrink-to-fit=no,viewport-fit=cover
META_TITLE: これはタイトルです
META_SHARE_TITLE:
META_KEYWORDS: これはキーワードです
META_DESCRIPTION: これはディスクリプションです
META_SHARE_DESCRIPTION:
META_AUTHOR:
META_COPYRIGHT:
META_APPLE_ICON: favicon.png
META_ICON: favicon.png
META_XHTML_ICON: favicon.ico
META_FACEBOOK: true
META_FACEBOOK_IMAGE: ogp_image.png
META_FACEBOOK_LOCALE: ja_JP
META_FACEBOOK_ID:
META_TWITTER: true
META_TWITTER_CARD: summary_large_image
META_TWITTER_ACCOUNT:
META_TWITTER_APP_ANDROID:
META_TWITTER_APP_IPAD:
META_TWITTER_APP_IPHONE:
META_GOOGLE: false
META_WINDOWS: false
META_WINDOWS_IMAGE: tile_image.png
META_WINDOWS_COLOR: #000000
META_OLD_BROWSER: false
META_PWA_MODE: false
---
```

#### /import/data.jsonc

```json
[
  {
    "TYPE": "dir",
    "DATA": "入力元フォルダ名",
    "OUTPUT": "出力先のパス"
  },
  {
    "TYPE": "file",
    "DATA": "入力元ファイル名",
    "OUTPUT": "出力先のパス"
  }
]
```

## 💁 How to use

共通の規定値は ```config.jsonc``` に定義してください。  
規定値の参照方法などは以下をご覧ください。

#### handlebarsの場合

| 記述 | 説明 |
|----|---|
| {{ RELATIVE_PATH }} | ディレクトリ相対パス |
| {{ CURRENT_DIR }} | カレントディレクトリ |
| {{ ASSETS_DIR.COMMON }} | アセットディレクトリ（ Common ） |
| {{ ASSETS_DIR.PC }} | アセットディレクトリ（ PC ） |
| {{ ASSETS_DIR.SP }} | アセットディレクトリ（ SP ） |
| {{ FILE_PATH }} | ファイルパス |
| {{ WEB_SITE_URL }} | サイトURL（カレントディレクトリを含む） |
| {{ WEB_SITE_NAME }} | サイト名 |

> ```/src/templates/pages/*.hcb``` 内の先頭に各ページの個別設定が出来ます。  
※ handlebars の仕様に乗っ取り ```{{}}``` 等で変数として参照が可能です。  
上記以外にも、各ページに設定された内容はどこでも呼び出せます。  
以下は一部例なので詳細はファイルを閲覧ください。  
※項目はユーザーの任意で追加することも可能です。

| 記述 | 説明 |
|----|---|
| {{ META_TITLE }} | ページ名 |
| {{ META_KEYWORDS }} | ページキーワード |
| {{ META_DESCRIPTION }} | ページデスクリプション |
| {{ META_AUTHOR }} | ページ製作者 |
| {{ META_APPLE_ICON }} | iPhone用アイコン |
| {{ META_ICON }} | モダン用アイコン |
| {{ META_XHTML_ICON }} | 旧IE用アイコン |
| {{ META_FACEBOOK }} | facebookのmetaタグ |
| {{ META_TWITTER }} | twitterのmetaタグ |
| {{ META_WINDOWS }} | windowsのmetaタグ |

> また ```layout``` の項目を ```pc``` or ```sp``` に変更すれば  
```/src/templates/layouts/*.hcb``` にあるファイルをひな形として  
共通テンプレートとして読み込むことが出来ます。  
レスポンシブ対応をしない場合、 ```RESPONSIVE``` の項目を ```true``` に変更すれば   
レイアウトやページの出し分けが可能になります。
>
> 出力先に関しては ```/src/templates/pages/``` に任意で配置された  
ディレクトリ構成のまま ```/htdocs/``` に書き出されるようにしているので  
ユーザーが任意で構成を考え、設置してください。

#### scssの場合

| 記述 | 説明 |
|----|---|
| #{config.$WEB_BASE_URL} | サイトURL |
| #{config.$WEB_SITE_URL} | サイトURL（カレントディレクトリを含む） |
| #{config.$WEB_SITE_NAME} | サイト名 |
| #{config.$WEB_AUTHOR} | サイト制作者 |
| #{config.$WEB_MODIFIER} | サイト編集者 |

> gulpfile.js に gulp-header を利用して渡しているので  
```#{$WEB_SITE_URL}``` 等で参照できます。

<u>**v0.1.4 から NodeSass から DartSass 変更しました。**</u>

> ※ v0.1.4 では NodeSass から DartSass への移行中のため  
上記は app.scss でしか参照出来ません。  
※ v0.1.5 以降では参照することが可能になりました。

#### Javascriptの場合

| 記述 | 説明 |
|----|---|
| WEB_BASE_URL | サイトURL |
| WEB_SITE_URL | サイトURL（カレントディレクトリを含む） |
| WEB_SITE_NAME | サイト名 |
| WEB_AUTHOR | サイト制作者 |
| WEB_MODIFIER | サイト編集者 |

> webpack に DefinePlugin として渡しているので  
```WEB_SITE_URL``` 等で参照できます。

## Scripts

### setup

#### 開発環境初期化

| Yarn コマンド | Gulp コマンド | 説明 |
|----|---|---|
| yarn setup | gulp setup | 開発環境の初期化（初回に 1 度だけ実行） |

### watch

#### 監視タスク実行

| Yarn コマンド | Gulp コマンド | 説明 |
|----|---|---|
| yarn start | gulp | 開発サーバーを起動する |

### build

#### ビルド出力

| Yarn コマンド | Gulp コマンド | 説明 |
|----|---|---|
| yarn dev | gulp build | 開発用のファイルを出力 |
| yarn stg | gulp build --env staging | ステージング用のファイルを出力 |
| yarn prod | gulp build --env production | 本番用のファイルを出力 |

### others / clean

#### インポートデータのタスク実行

| Yarn コマンド | Gulp コマンド | 説明 |
|----|---|---|
| yarn import | gulp import | 追加データの出力 |

#### ディレクトリ削除

| Yarn コマンド | Gulp コマンド | 説明 |
|----|---|---|
| yarn run clear | gulp clear | ビルドフォルダを削除 |
| yarn run clearGit | gulp clearGit | ローカルGitを削除 |

## 🌻 Structure

### outline

	./
	├── LICENSE
	├── README.md
	├── gulpfile.js
	├── package.json
	├── _setup
	│   └── git
	│       ├── hidden
	│       │   ├── FETCH_HEAD
	│       │   ├── HEAD
	│       │   ├── config
	│       │   ├── description
	│       │   ├── hooks
	│       │   │   ├── applypatch-msg.sample
	│       │   │   ├── commit-msg.sample
	│       │   │   ├── post-update.sample
	│       │   │   ├── pre-applypatch.sample
	│       │   │   ├── pre-commit.sample
	│       │   │   ├── pre-push.sample
	│       │   │   ├── pre-rebase.sample
	│       │   │   ├── prepare-commit-msg.sample
	│       │   │   └── update.sample
	│       │   ├── info
	│       │   │   └── exclude
	│       │   ├── objects
	│       │   │   ├── info
	│       │   │   └── pack
	│       │   └── refs
	│       │       ├── heads
	│       │       └── tags
	│       └── repository
	│           ├── HEAD
	│           ├── config
	│           ├── description
	│           ├── hooks
	│           │   ├── applypatch-msg.sample
	│           │   ├── commit-msg.sample
	│           │   ├── post-update.sample
	│           │   ├── pre-applypatch.sample
	│           │   ├── pre-commit.sample
	│           │   ├── pre-push.sample
	│           │   ├── pre-rebase.sample
	│           │   ├── prepare-commit-msg.sample
	│           │   └── update.sample
	│           ├── info
	│           │   └── exclude
	│           ├── objects
	│           │   ├── info
	│           │   └── pack
	│           └── refs
	│               ├── heads
	│               └── tags
	├── src
	│   ├── _modules
	│   │   ├── api
	│   │   │   └── data.json
	│   │   ├── data
	│   │   │   ├── example.json
	│   │   │   ├── exampleTwo
	│   │   │   │   └── exampleTwo.json
	│   │   │   ├── exampleThree.yml
	│   │   │   └── exampleFour.json
	│   │   └── import
	│   │       └── data.jsonc
	│   ├── common
	│   │   ├── images
	│   │   │   ├── favicon.ico
	│   │   │   ├── favicon.png
	│   │   │   ├── ogp_image.png
	│   │   │   └── tile_image.png
	│   │   ├── scripts
	│   │   │   ├── javascript
	│   │   │   │   ├── common.js
	│   │   │   │   ├── index.js
	│   │   │   │   └── modules
	│   │   │   │       └── Selector.js
	│   │   │   └── lib
	│   │   │       ├── html5shiv.min.js
	│   │   │       ├── jquery-1.12.4.min.js
	│   │   │       ├── jquery-3.7.1.min.js
	│   │   │       ├── polyfill.js
	│   │   │       └── selectivizr.min.js
	│   │   └── stylesheets
	│   │       ├── _config.scss
	│   │       ├── _global.scss
	│   │       ├── _reset.scss
	│   │       ├── mixins
	│   │       │   ├── _clearfix.scss
	│   │       │   ├── _css3fix.scss
	│   │       │   ├── _elementSize.scss
	│   │       │   ├── _fontDecoration.scss
	│   │       │   ├── _fontSize.scss
	│   │       │   ├── _fontWeight.scss
	│   │       │   ├── _hideaway.scss
	│   │       │   ├── _inlineBlock.scss
	│   │       │   ├── _inlinefix.scss
	│   │       │   ├── _mediaqueries.scss
	│   │       │   └── _opacity.scss
	│   │       ├── utils
	│   │       │   ├── _align.scss
	│   │       │   ├── _display.scss
	│   │       │   ├── _float.scss
	│   │       │   ├── _font.scss
	│   │       │   ├── _margin.scss
	│   │       │   ├── _padding.scss
	│   │       │   ├── _tooltips.scss
	│   │       │   ├── _visibility.scss
	│   │       │   └── _width.scss
	│   │       └── vars
	│   │           ├── _color.scss
	│   │           ├── _easing.scss
	│   │           └── _variable.scss
	│   ├── config.jsonc
	│   ├── images
	│   │   ├── pc
	│   │   │   ├── common
	│   │   │   │   └── image.png
	│   │   │   ├── hoge
	│   │   │   │   ├── fuga
	│   │   │   │   │   └── image.png
	│   │   │   │   └── image.png
	│   │   │   ├── image.png
	│   │   │   └── index
	│   │   │       └── image.png
	│   │   └── sp
	│   │       ├── common
	│   │       │   └── image.png
	│   │       ├── hoge
	│   │       │   ├── fuga
	│   │       │   │   └── image.png
	│   │       │   └── image.png
	│   │       ├── image.png
	│   │       └── index
	│   │           └── image.png
	│   ├── javascripts
	│   │   ├── pc
	│   │   │   ├── common.js
	│   │   │   ├── hoge.js
	│   │   │   ├── index.js
	│   │       ├── sample.ts
	│   │   │   └── modules
	│   │   │       ├── Caller.ts
	│   │   │       ├── interface.ts
	│   │   │       ├── Man.ts
	│   │   │       └── Woman.ts
	│   │   └── sp
	│   │       ├── common.js
	│   │       ├── hoge.js
	│   │       ├── index.js
	│   │       ├── sample.ts
	│   │       └── modules
	│   │           ├── Caller.ts
	│   │           ├── interface.ts
	│   │           ├── Man.ts
	│   │           └── Woman.ts
	│   ├── stylesheets
	│   │   ├── pc
	│   │   │   ├── app.scss
	│   │   │   ├── components
	│   │   │   ├── layouts
	│   │   │   │   ├── _content.scss
	│   │   │   │   └── _default.scss
	│   │   │   ├── pages
	│   │   │   │   ├── _hoge.scss
	│   │   │   │   ├── _hoge_fuga.scss
	│   │   │   │   └── _index.scss
	│   │   │   └── partials
	│   │   │       ├── _footer.scss
	│   │   │       └── _header.scss
	│   │   └── sp
	│   │       ├── app.scss
	│   │       ├── components
	│   │       ├── layouts
	│   │       │   ├── _content.scss
	│   │       │   └── _default.scss
	│   │       ├── pages
	│   │       │   ├── _hoge.scss
	│   │       │   ├── _hoge_fuga.scss
	│   │       │   └── _index.scss
	│   │       └── partials
	│   │           ├── _footer.scss
	│   │           └── _header.scss
	│   └── templates
	│       ├── components
	│       │   └── exampleComponent.hbs
	│       ├── layouts
	│       │   ├── pc.hbs
	│       │   └── sp.hbs
	│       ├── pages
	│       │   ├── hoge
	│       │   │   ├── fuga
	│       │   │   │   └── index.hbs
	│       │   │   └── index.hbs
	│       │   └── index.hbs
	│       └── partials
	│           ├── footer.hbs
	│           └── header.hbs
	└── tasks
	    ├── modules
	    │   ├── dart-sass-functions
	    │   │   ├── index.js
	    │   │   ├── processor.js
	    │   │   └── roundPrecision.js
	    │   ├── dart-sass-glob
	    │   │   └── index.js
	    │   ├── handlebars
	    │   │   ├── config.js
	    │   │   ├── errorMessage.js
	    │   │   ├── extendBlocks.js
	    │   │   ├── getData.js
	    │   │   ├── getLayout.js
	    │   │   ├── index.js
	    │   │   ├── registerPartials.js
	    │   │   └── render.js
	    │   ├── if-webpack-plugin
	    │   │   └── index.js
	    │   └── postcss-dart-sass
	    │       └── index.js
	    └── webpack.config.js

### src

	./src
	├── _modules
	│   ├── api
	│   ├── data
	│   └── import
	├── common
	│   ├── images
	│   ├── scripts
	│   │   ├── javascript
	│   │   │   └── modules
	│   │   └── lib
	│   └── stylesheets
	│       ├── mixins
	│       ├── utils
	│       └── vars
	├── images
	│   ├── pc
	│   └── sp
	├── javascripts
	│   ├── pc
	│   │   └── modules
	│   └── sp
	│       └── modules
	├── stylesheets
	│   ├── pc
	│   │   ├── components
	│   │   ├── layouts
	│   │   ├── pages
	│   │   └── partials
	│   └── sp
	│       ├── components
	│       ├── layouts
	│       ├── pages
	│       └── partials
	└── templates
	    ├── components
	    ├── layouts
	    ├── pages
	    └── partials

### htdocs

	./htdocs
	├── assets
	│   ├── common
	│   │   ├── images
	│   │   └── js
	│   │       └── lib
	│   ├── css
	│   ├── images
	│   └── js
	└── sp

## ✨ Import Copy Data

> ```/src/_modules/import/``` にファイルを設置し、  
同ディレクトリの ```data.jsonc``` を編集することによって  
指定した先にコピーしてくれる機能です、外部ソースを取り込む時など  
重宝するのでご利用ください。

```json
[
  {
    "TYPE": "dir",
    "DATA": "hoge",
    "OUTPUT": "assets/hoge/"
  },
  {
    "TYPE": "file",
    "DATA": "hoge.json",
    "OUTPUT": "assets/hoge"
  }
]
```

例えば、上記の様に設定するとフォルダの場合は  
```assets/hoge/``` の中に ```hoge``` 内のデータがコピーされます。  
ファイルの場合は
```assets/``` に ```hoge.json``` がコピーされます。

## ✨ API Mock Server

```config.jsonc``` の ```LOCAL_SERVER``` の ```API``` を有効にすると起動します。

> 機能としては JSON ファイルを用意しておけば API のリクエストを受け取り、  
または返してくれるシンプルな RESTful API サーバーを用意することが出来ます。  
対応しているメソッドは GET / POST / PUT / DELETE さらに PATCH もサポートしています。  
JSONP または CORS に対応していますのでクロスドメインでも使えるようになっています。

```/src/_modules/api/``` 以下に JSON ファイルを設置することによって  
そのファイルを API としてレスポンスが返されるようになります。  
※ファイル数に制限は無く配下にいくつでも JSON ファイルを設置することが出来ます。  
デフォルトのポート番号は 9000 番に設定されているので  
http://localhost:9000/api/ 等でアクセスする事が可能です。  
```/api/db``` にアクセスするとディレクトリ内全ての JSON が結合したデータを取得出来ます。

例として以下のような ```/src/_modules/api/data.json``` を配置しています。

```json
{
  "users": [
    {
      "id": 1,
      "name": "hoge",
      "email": "hoge@hoge.com"
    },
	  {
      "id": 2,
      "name": "fuga",
      "email": "fuga@fuga.com"
    }
  ]
}
```

この場合、```/api/users``` にアクセスすると users のみを取得することも可能です。

```json
[
  {
    "id": 1,
    "name": "hoge",
    "email": "hoge@hoge.com"
  },
  {
    "id": 2,
    "name": "fuga",
    "email": "fuga@fuga.com"
  }
]
```

また、```/api/users?id=1``` とすれば絞り込み検索も可能です。

```json
[
  {
    "id": 1,
    "name": "hoge",
    "email": "hoge@hoge.com"
  }
]
```

### 一部細かい機能の紹介

※このサーバーは [json-server](https://github.com/typicode/json-server) を使用しているので  
　その他細かい使い方は上記の公式ドキュメント等々をご参考ください。

#### Filter
パラメーター名による絞り込みは以下で可能です。

http://localhost:9000/api/users?name=hoge&email=hoge@hoge.com  
http://localhost:9000/api/users?id=1&id=2  
http://localhost:9000/api/users?name=fuga

#### Slice
```_start``` と ```_end``` 又は ```_limit``` を使用して  
データをスライスすることが出来ます。

http://localhost:9000/api/users?_start=1&_end=3

#### Sort
```_sort``` と ```_order``` を使用して  
データをソートして並べ替える事が出来ます。  
※デフォルトは昇順で返されます。

降順  
http://localhost:9000/api/users?_sort=id&_order=DESC  
昇順  
http://localhost:9000/api/users?_sort=id&_order=ASC

#### Operators

```_gte``` と ```_lte``` を使用してデータの取得範囲を制限することが出来ます。  
http://localhost:9000/api/users?id_gte=1&id_lte=3

```_ne``` を使用して一部データを除外することが出来ます。  
http://localhost:9000/api/users?id_ne=1

```_like``` を使用して正規表現を使ってフィルタリング出来ます。  
http://localhost:9000/api/users?name_like=hoge

#### Full-text search

```q``` を使用して全てのデータから検索することが出来ます。  
http://localhost:9000/api/users?q=fuga

#### Filter

```id``` に任意のシートIDを指定するとそのシートをパースしてくれます。  
http://localhost:5000/api?id=シートID

```q``` を使用して全てのデータから検索することが出来ます。  
http://localhost:5000/api?q=検索名

```rows``` を true または false にすると項目の表示/非表示が可能になります。  
http://localhost:5000/api?rows=false

```columns``` を true または false にすると項目の表示/非表示が可能になります。  
http://localhost:5000/api?columns=false

## 🚿 Browsers support

通常の設定では比較的新しいブラウザで機能するようになっています。  
```/src/templates/pages/*.hbs``` の中の ``META_OLD_BROWSER`` を ```true``` にすると   
```Internet Explorer 7``` までの旧ブラウザにも対応する事が出来ます。  
上記の場合は一部 Polyfill を使用していますが ``Internet Explorer 8`` までは  
レスポンシブには非対応になっています。 ```RESPONSIVE``` 項目を ``false`` にするか  
``css3-mediaqueries`` などの Fallback を使用してご利用ください。

## 📱 PWA mode (Mobile Only)

```/src/templates/pages/*.hbs``` の中の ```META_PWA_MODE``` を ```true``` にすると   
ホーム追加時にフルスクリーンで立ち上がるWebAppモードを有効にすることが出来ます。

## 🤔 What you can do with templates ?

本テンプレートでブラックボックス化している機能の詳細を   
以下に随時記述していきますのでご参考ください。

#### 繰り返しの要素を handlebars に出力したい場合

```html
<li class="list0">リスト1：テキスト1</li>
<li class="list1">リスト2：テキスト2</li>
<li class="list2">リスト3：テキスト3</li>
<li class="list3">リスト4：テキスト4</li>
<li class="list4">リスト5：テキスト5</li>
```

```/src/_modules/data/``` 配下にファイルを配置し hbs で読み取れる状態にします。   
例として ```/src/_modules/data/example.json``` という名前で作成した場合

```json
{
  "rows": [
    {
      "リスト1": "テキスト1",
      "リスト2": "テキスト2",
      "リスト3": "テキスト3",
      "リスト3": "テキスト5"
    }
  ]
}
```

hbs 上に以下の記述を書くことによって出力することが可能です。   
※もちろんその他の配列でも同様に呼び出す事が可能です。

```hbs
{{#each data.example.rows}}
  {{#each this}}
  <li class="list{{ @index }}">{{ @key }}：{{ this }}</li>
  {{/each}}
{{/each}}
```

#### SCSS で画像パスを取得する方法

dart-sass の functions 機能を使い様々な関数を利用することが可能です。   
※ /tasks/modules/dart-sass-functions/ から読み込んでいます。   

例えば以下のような記述をすると、 ```/images/``` 配下の画像のURLを取得し   
さらに高さと横幅を取得し、自動的に出力する事が可能です。   

※出力先は /htdocs/assets/images/ からの相対パス   
※出力元は /src/images/ からの相対パス（基本的に ```pc/``` または ```sp/``` を指定）

```scss
$image: '（出力先）ディレクトリ名/ファイルパス';
$source: '（出力元）ディレクトリ名/';
$width: math.div(image-width($source + $image, true), 1);
$height: math.div(image-height($source + $image, true), 1);

background-image: image-url($image);
width: $width;
height: $height;
```

また、 ```true``` を ```false``` に変更すると ```px``` を省く数字のみ取得が可能になるので   
以下のようなレスポンシブスタイルを作る事も出来ます。   
※ ```elementSize_vw``` は ```/src/common/stylesheets/mixins/``` から include しています。

```scss
$image: '（出力先）ディレクトリ名/ファイルパス';
$source: '（出力元）ディレクトリ名/';
$width: math.div(image-width($source + $image, false), 2);
$height: math.div(image-height($source + $image, false), 2);

background-image: image-url($image);
background-size: contain;
@include config.elementSize_vw($width, $height);
```

#### SCSS でフォントサイズや余白のレスポンシブ対応

mixin の内容は ```/src/common/stylesheets/mixins/``` を見れば分かりますが   
SP サイトなどを作成する際は、以下のように include する事で   
デザインの ```px``` や ```weight``` を上手いことレスポンシブ対応してくれます。

```scss
$size: 26;
@include config.fontSize_vw($size);
@include config.fontWeight('Medium');
@include config.lineHeight(44, $size);
@include config.letterSpacing(80);
```

また、 ```margin``` や ```padding``` も同様で以下のように指定が可能です。   
上記と同じくデザインの ```px``` の数値を入力するだけで大丈夫です。

```scss
// 一括の場合
@include config.margin_vw(10, 20, 30, 40);
// それぞれの場合
@include config.margin_top_vw(10);
@include config.margin_right_vw(20);
@include config.margin_bottom_vw(30);
@include config.margin_left_vw(40);

// 一括の場合
@include config.padding_vw(10, 20, 30, 40);
// それぞれの場合
@include config.padding_top_vw(10);
@include config.padding_right_vw(20);
@include config.padding_bottom_vw(30);
@include config.padding_left_vw(40);
```

## 🎉 Dependencies

- [NodeJS](https://nodejs.org/en/)
- [Gulp](http://gulpjs.com/)
- [npm](https://www.npmjs.com/)
- [Yarn](https://yarnpkg.com/)
- [Handlebars.js](https://handlebarsjs.com/)
- [Scss](http://sass-lang.com/)
- [PostCSS](http://postcss.org/)
- [Babel](https://babeljs.io/)
- [webpack](https://webpack.js.org/)
- [Browsersync](https://www.browsersync.io/)

## 🐛 Issues

- [GitHub Issues](https://github.com/glitchworker/aislewire/issues)

## 👍 Thanks

- [Adobe Blank](https://github.com/adobe-fonts/adobe-blank)

## 🚀 Important Notices

<u>**v0.1.5 以降 dart-sass で config.jsonc の変数が参照可能になりました**</u>

> Sass の function を使う方法は、やはり依存してしまうので今回も避けて   
```_global.scss``` ファイルと ```config.jsonc``` の変数を合わせたものを   
```_variable.scss``` というファイルで出力し ```_config.scss``` から   
参照出来るようにシンプルな設計で可能なように実装しました。   
これにて他の変数と同じく ```config``` から呼び出すことが可能になりました。

<u>**v0.1.4 で node-sass から dart-sass に移行**</u>

> 2019年10月から ```Sass``` に [Sass Module System](https://sass-lang.com/blog/the-module-system-is-launched#future-plans) という機能追加が行われました。   
大きな変更は ```@import``` に置き換わる [@use](https://sass-lang.com/blog/the-module-system-is-launched#use-the-heart-of-the-module-system) や [@forward](https://sass-lang.com/blog/the-module-system-is-launched#forward-for-library-authors) を用いたファイルの読み込み方法になり   
別ファイルの変数などを使いたい場合 ```@import``` で可能だったグローバルスコープは使えなくなり   
```@use``` ではファイルスコープへ変更され、ファイル単位で毎回呼び出す事が必要になりました。   
2021年10月から ```@import``` は既に[非推奨](https://sass-lang.com/blog/libsass-is-deprecated)になっており ```LibSass``` はまだサポートされているが   
公式が推奨している ```DartSass``` からは機能が廃止されている。   
2022年10月には ```@import``` の完全廃止されサポートが終了してしまうので移行しました。   
しかし厳格化されたことにより ```glob``` は実質不可 ```外部変数呼び出し``` 等が厳しくなったので   
現在はそのあたりをどういう仕組みで運用していくべきか試行錯誤中です。

<u>**v0.2.6 で CommonJS から ES Modules に移行 ＆ GSX Server の削除**</u>

> ECMA Script Modules の略で ECMA Script（エクマ スクリプト）は、 Ecma International のもとで標準化手続きが行われてい JavaScript の規格です。   
近年多くのパッケージが [Pure ESM package](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c) へ移行を始めており、   
```CommonJS（require）``` から ```ES Modules（import）``` へ変更されておりアップデートが出来なかったり、使用することが出来ない為すべての依存関係を修正いたしました。   
そのため、Node.js のバージョンが最低でも v16 以降が必要になるが v18 以上が推奨されているため最新の安定版 v20 へアップデートしました。   
その他 ESM の詳細に関しては [Node.js](https://nodejs.org/api/esm.html) 公式のドキュメントを参照ください。   
また、バージョンが古くなり動作しない＆あまり使用されていなかったので GSX Server の機能を削除しました。

<u>**v0.3.0 で Gulp 4 から Gulp 5 に移行**</u>

> 2024年3月29日に5年ぶりに [Gulp v5.0.0](https://github.com/gulpjs/gulp/releases/tag/v5.0.0#individual-changelogs) のバージョンアップが公開されました。   
破壊的な変更点も沢山あり、大きな変更点とすると ```Node.js``` の ```10.13``` 以前のバージョンのサポートが終了した点と   
デフォルトのストリームエンコーディングが ```UTF-8``` に変更された事によって画像などバイナリデータを使用するためには   
タスクの src オプションに対して ```{ encoding: false }``` を必ず指定する必要があり対応をいたしました。   
基本的にタスクは非同期処理で書かなければいけないようでそのあたりに関しても修正しています。   
その他 ESM 周りにも諸々対応をしたようで、細かい修正内容に関しては上記のリンクから参照ください。   
また何故か今回のアップデートで scss の @use で一部アンダーバーの省略が出来なくなった箇所を修正しました。

<u>**v0.3.0 で共通設定ファイルなど一部ファイル拡張子を変更**</u>

> ```/src/config.json``` および ```/src/_modules/import/data.json``` のファイル拡張子を jsonc へ変更しました。   
JSONC とは ```JSON with Comments``` の略で本来 JSON 形式ではコメントが書けない仕様となっていますが   
JavaScript スタイルのコメントを記述できるようにしたデータフォーマットです。    
Microsoft が提供している [jsonc-parser](https://github.com/Microsoft/node-jsonc-parser) を使用して実現しています。   
この拡張子は [VSCode](https://code.visualstudio.com/docs/languages/json#_json-with-comments) の設定ファイルや TypeScript の tsconfig.json などでも幅広く利用されているものです。    
そのため VSCode を使用していた場合自動的にコード補完が機能します。    
※豆知識として [Babel](https://babeljs.io/docs/en/config-files#supported-file-extensions) の .babelrc は JSONC ではなく JSON5 である。

## 🆙 Version History

### v0.3.4（2025年1月20日）

- package.json の更新（@babel/core, @babel/plugin-transform-classes, @babel/preset-env, @babel/preset-typescript, del, glob, gulp-purgecss, image-size, mime, postcss, sass, terser-webpack-plugin, webpack, webpack-cli）
- README.md の変更

### v0.3.3（2024年10月1日）

- package.json の更新（@babel/core, @babel/plugin-transform-classes, @babel/preset-env, autoprefixer, babel-loader, browser-sync, cssnano, directory-tree, glob, jsonc-parser, mime, postcss, sass, webpack, webpack-merge）
- README.md の変更

### v0.3.2（2024年6月17日）

- package.json の更新（@babel/core, @babel/plugin-transform-classes, @babel/preset-env, @babel/preset-typescript, cssnano, sass, webpack）
- README.md の変更

### v0.3.1（2024年5月31日）

- package.json の更新（@babel/core, @babel/plugin-transform-classes, @babel/preset-env, @babel/preset-typescript, glob, sass）
- gulpfile.js で Plumber の設定で一部記述が誤っていたのを修正
- README.md の変更

### v0.3.0（2024年4月28日）

- Node.js の[脆弱性](https://jvn.jp/vu/JVNVU94343502/) に伴い node を v20.11.0 から v20.12.2 以上に変更
- package.json の更新（cssnano, gulp, mime, sass）
- gulpfile.js で src にバイナリを取り扱っている箇所に { encoding: false } のオプションを追加（v5 以降はデフォルトで UTF-8 が指定されるようになった為対応）
- /src/config.json のファイル拡張子を config.jsonc へ変更（JSON with Comments 対応でコメントがかけるようになりました）
- /src/_modules/import/data.json のファイル拡張子を data.jsonc へ変更（JSON with Comments 対応でコメントがかけるようになりました）
- 上記にともない gulpfile.js と webpack.config.js の該当箇所を修正
- 不要な Javascript ライブラリが残っていたので削除しました
- _default.scss に文章の折り返し指定の CSS を追加
- 共通 SCSS 周りの整理
- README.md の変更

### v0.2.9（2024年4月9日）

- package.json の更新（@babel/core, @babel/plugin-transform-classes, @babel/preset-env, @babel/preset-typescript, @babel/plugin-proposal-class-properties, autoprefixer, css-declaration-sorter, cssnano, glob, gulp-purgecss, postcss, sass, webpack）
- gulpfile.js のタスク周りを v5 に向けて微調整
- README.md の変更

### v0.2.8（2024年2月26日）

- package.json の更新（cssnano, sass, webpack）
- postcss-dart-sass のロジックを微調整
- README.md の変更

### v0.2.7（2024年2月12日）

- package.json から round-precision を削除しローカルモジュールに組み込み
- package.json に追加（@babel/preset-typescript, @babel/plugin-proposal-class-properties）
- TypeScript 等対応への変更にともない webpack.config.js に TypeScript 向け設定を追加（jsx, ts, tsx もトランスパイル対応）
- gulpfile.js で JavaScript タスク周りで js 以外の拡張子以外も使えるように変更（jsx, ts, tsx も監視対象へ）
- _Selector.js から Selector.js に変更（アンダースコアをつけて監視対象外にしていたが、特に不要だったため）
- README.md の変更

### v0.2.6（2024年2月11日）

- CommonJS から ES Modules へ移行（require から import へ変更したため全てのファイルの依存関係を修正）
- パッケージ更新に伴い node を v20.11.0 npm を v10.2.4 以上に変更
- GSX Server の機能を削除（バージョンが古くなっており機能しなくなっていた＆あまり使用されていないため）
- package.json の更新（del, gulp-changed, gulp-postcss, mime, slash）
- README.md の変更

### v0.2.5（2024年2月8日）

- package.json の更新（@babel/core, @babel/plugin-transform-classes, @babel/preset-env, autoprefixer, browser-sync, css-declaration-sorter, cssnano, image-size, postcss, sass, terser-webpack-plugin, webpack, webpack-merge）
- config.jsonc に PURGE_CSS の項目を追加（true で HTML 上で使用されていないスタイルを CSS ファイルから削除したものを出力することが出来るようになります。元々 true で書き出されていたが、デフォルトは false に変更され任意で設定が出来るように変更）
- README.md の変更

### v0.2.4（2023年9月27日）

- package.json の更新（@babel/core, @babel/plugin-transform-classes, @babel/preset-env, autoprefixer, ss-declaration-sorter, glob, postcss, sass）
- jQuery のバージョンを最新の 3.7.1 に変更
- README.md の変更

### v0.2.3（2023年8月28日）

- package.json の更新（@babel/core, postcss）
- 一部 Windows でファイルパスが Undefined になっていたため registerPartial.js を更新
- README.md の変更

### v0.2.2（2023年8月15日）

- package.json の更新（@babel/core, @babel/plugin-transform-classes, @babel/preset-env, autoprefixer, babel-loader, browser-sync, css-declaration-sorter, cssnano, glob, handlebars, postcss, sass, terser-webpack-plugin, webpack, webpack-cli, webpack-merge）
- jQuery のバージョンを最新の 3.7.0 に変更
- README.md の変更

### v0.2.1（2023年4月24日）

- package.json の更新（@babel/core, @babel/preset-env, css-declaration-sorter, cssnano, del, glob, postcss, sass, webpack, webpack-cli）
- パッケージ更新に伴い node を v16.20.0 npm を v8.19.4 以上に変更
- jQuery のバージョンを最新の 3.6.4 に変更
- OGP 画像を jpg から png に変更
- README.md の変更

### v0.2.0（2023年3月23日）

- package.json の更新（@babel/core, autoprefixer, browser-sync, glob, sass, webpack）
- 2022年末頃から Twitter のシェア機能にて share を使った場合 Android の公式アプリが立ち上がらなくなる事象が起きているので intent/tweet を使用する方向性に暫定対応（src/common/scripts/javascript/common.js）
- README.md の変更

### v0.1.9（2023年3月9日）

- package.json の更新（@babel/core, @babel/plugin-transform-classes, browser-sync, cssnano, glob, sass, terser-webpack-plugin, webpack）
- glob の仕様が変更されたので gulpfile.js と registerPartial.js を更新
- css-declaration-sorter のソートの影響で一部の CSS3 が有効にならない場合があったので gulpfile.js の設定項目に keepOverrides を追加
- README.md の変更

### v0.1.8（2023年2月13日）

- package.json の更新（@babel/core, @babel/plugin-transform-classes, @babel/preset-env, autoprefixer, babel-loader, browser-sync, css-declaration-sorter, cssnano, directory-tree, glob, gulp-purgecss, image-size, minimist, node-git-server, postcss, sass, terser-webpack-plugin, webpack, webpack-cli）
- handlebars にて変数定義を拡張するヘルパー関数を追加（include）
- jQuery のバージョンを最新の 3.6.3 に変更
- README.md の変更

### v0.1.7（2022年4月27日）

- package.json の更新（@babel/core, autoprefixer, babel-loader, browser-sync, css-declaration-sorter, cssnano, glob, minimist, postcss, webpack）
- config.jsonc に WEBPACK_ENTRIES の項目を追加（true で js ファイルを単体出力出来るようになります）
- config.jsonc に HTTPS_SERVER の項目を追加（SSL 環境が必要な場合に true にすると HTTPS でアクセスが可能になる）
- config.jsonc に ASSETS_HOST の項目を追加（CSS 内のパスを別ドメインに向ける場合フルパスで入力する）
- config.jsonc に CACHE_VERSION の項目を追加（キャッシュ対策をするために数字を入力 20220426 みたいな感じをいれると ?v= パラメータとして付与される）
- gulpfile.js に上記の機能実装を追加＆整理
- dart-sass-functions の inline_image 関数の mime 修正（ バージョン2 から lookup() が廃止され getType() に変更になりエラーが出ていた為 ）
- README.md の変更

### v0.1.6（2022年2月25日）

- package.json の更新（@babel/core, @babel/plugin-transform-classes, @babel/preset-env, autoprefixer, css-declaration-sorter, node-css-mqpacker, cssnano, directory-tree, fancy-log, gulp-purgecss, image-size, postcss, sass, terser-webpack-plugin, webpack, webpack-cli）
- package.json から css-mqpacker を削除し node-css-mqpacker を追加（非推奨でバージョンが止まっていた為）
- 上記対応のため gulpfile.js の微修正
- README.md の変更

### v0.1.5（2021年11月12日）

- gulpfile.js に DartSass 用の共通スタイルシートを出力するタスクを追加
- 上記に伴い _global.scss ファイルと共通変数を合わせたものを _variable.scss に出力し参照出来るように変更
- README.md の変更

### v0.1.4（2021年11月11日）

- node-sass から dart-sass に完全移行
- package.json から node-sass を削除し sass ( Dart Sass ) を追加
- 上記に伴い DartSass の仕様変更に基づき記述を全て見直し修正 ( Built-In Modules 対応 )
- README.md の変更

### v0.1.3（2021年11月10日）

- package.json の更新（autoprefixer, css-declaration-sorter, cssnano, terser-webpack-plugin, webpack）
- package.json へ追加（node-sass, postcss）
- package.json から postcss-node-sass を削除し内部モジュールに組み込み
- 上記に伴い各種 PostCSS 8 へのバージョンアップ対応
- README.md の変更

### v0.1.2（2021年11月8日）

- package.json の更新（@babel/core, @babel/plugin-transform-classes, @babel/preset-env, babel-loader, browser-sync, directory-tree, glob, gulp-changed, gulp-purgecss, gulp-postcss, handlebars, image-size, js-yaml, mime, terser-webpack-plugin, webpack, webpack-cli, webpack-merge, webpack-stream）
- パッケージ更新にともない npm のバージョンを 7.0.0 以上 node のバージョンを 12.0.0 以上に変更
- Webpack 5 への変更にともない webpack.config.js に ES5 ( IE11 等 ) 向け設定を追加
- terser-webpack-plugin のバージョン 5 への変更にともない廃止オプションをコメントアウト
- handlebars のモジュール getData.js の directory-tree 周りの修正
- 上記にともない yaml.safeLoad は js-yaml4 で削除されたので yaml.load に変更
- 一部パッケージで依存関係があるため PostCSS 8 への対応がされてないものもあるので今回は更新無し
- README.md の変更

### v0.1.1（2020年10月15日）

- gulpfile.js の修正（webpack-merge アップデート対応）
- package.json の更新（@babel/core, @babel/plugin-transform-classes, @babel/preset-env, autoprefixer, browser-sync, del, directory-tree, front-matter, gulp-purgecss, gulp-postcss, image-size, js-yaml, mime, through2, webpack, webpack-cli, webpack-merge, webpack-stream）
- package.json から非推奨になった uglifyjs-webpack-plugin を削除し後継プラグインの terser-webpack-plugin を追加
- 上記にともない webpack.config.js の UglifyJSPlugin を TerserPlugin に置き換え
- README.md の変更

### v0.1.0（2020年5月7日）

- gulpfile.js の修正（AUTHOR の値が継承出来ていなかったのを修正）
- package.json の更新（@babel/core, @babel/preset-env, gulp-purgecss, mime, webpack）
- README.md の変更

### v0.0.9（2020年4月21日）

- _fontSize.scss に mixin 関数追加（lineHeight, letterSpacing）
- README.md の変更（テンプレートの使い方を追加）

### v0.0.8（2020年4月10日）

- handlebars の拡張関数から if_eq を削除し、汎用型ヘルパー関数を追加（and, or, not, eq, ne, lt, eqlt, gt, eqgt）```※書式：{{#if (演算子 値1 値2) }} / 例：layout == 'pc' の場合 {{#if (eq layout 'pc') }}``` のように指定が可能
- package.json から if-webpack-plugin を削除しローカルモジュールに組み込み
- package.json の更新（@babel/core, @babel/plugin-transform-classes, @babel/preset-env, autoprefixer, babel-loader, css-declaration-sorter, gulp-purgecss, handlebars, minimist, node-git-server, webpack, webpack-cli）
- README.md の変更

### v0.0.7（2020年1月31日）

- package.json の更新（@babel/core, @babel/plugin-transform-classes, @babel/preset-env, autoprefixer, css-declaration-sorter, front-matter, gulp-purgecss, handlebars, webpack）
- README.md の変更

### v0.0.6（2019年11月11日）

- テンプレートに ```RESPONSIVE``` の項目を追加（これにより ```rp.hbs``` は廃止）
- package.json の更新（@babel/core, @babel/plugin-transform-classes, @babel/preset-env, autoprefixer, glob, handlebars, webpack-cli）
- README.md の変更

### v0.0.5（2019年10月11日）

- handlebars にて if を拡張するヘルパー関数を追加（if_eq）
- HTMLで使用してない要素のスタイルを自動で削除してくれる機能を追加
- package.json に追加（gulp-purgecss）
- package.json の更新（@babel/core, @babel/preset-env, autoprefixer, gulp-changed, handlebars, image-size, webpack, webpack-cli）
- README.md の変更

### v0.0.4（2019年9月15日）

- webpack.config.js のオプションに cacheDirectory: true を追加
- package.json の更新（@babel/core, @babel/preset-env, del, handlebars, webpack, webpack-cli, webpack-merge）
- README.md の変更

### v0.0.3（2019年8月20日）

- node-sass-functions の一部ロジックの改修
- package.json の更新（directory-tree, gulp-changed, webpack,webpack-cli）
- README.md の変更

### v0.0.2（2019年8月16日）

- Webpack 4.38.0 を 4.39.1 へ更新
- package.json にて Node.js の Engine を 8.3.x 以上に変更
- 上記に伴い .node-version を Git に含まないように変更
- README.md の変更

### v0.0.1（2019年8月10日）

- 初回リリース

### v0.0.0（2019年7月12日）

- 開発スタート

## 📝 License
Copyright (c) 2019 GlitchWorker (http://loxis.jp/)  
Licensed under the MIT license.