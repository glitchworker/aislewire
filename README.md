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
- npm v6.9.0 over
- node v8.3.0 over

## 🔰 Usage

1. [NodeJS](https://nodejs.org/en/) をダウンロードしインストールする（最新版を推奨）

2. ```ターミナル```または```コマンドプロンプト```を```管理者権限```で開く

3. ```npm install -g yarnpkg``` で Yarn をインストールする（npm のままビルドする場合は不要）

4. ```yarn global add gulp``` で Gulp をインストールする（npm の場合 ```npm install -g gulp```）

5. ```yarn install``` で必要なパッケージをインストール（npm の場合 ```npm install```）

6. ```/src/config.json``` を開き各項目を編集しておく（後からも変更可能）

7. ```yarn setup``` を初回に1度だけ実行する（npm の場合 ```npm run dev```）

8. ```yarn start``` で開発環境を起動する（自動的に既存のブラウザが起動）（npm の場合 ```npm run start```）

9. 後は ```/src/``` フォルダ内のファイルを編集し作業をする

10. 以降8〜9の繰り返し

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
| /src/config.json | 共通設定ファイル |

#### config.json

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
    "GIT": false,
    "GSX": false
  }
}
```

### src

| ファイル名 | 説明 |
|----|---|
| /src/templates/**/*.hbs | template 内で使う規定値 |
| /src/common/stylesheets/_config.scss | stylesheet 内で使う規定値 |
| /src/_modules/api/data.json | api で使う規定値 |
| /src/_modules/data/**/* | 共通の規定値（ json, js, yml 読み込み可能） |
| /src/_modules/import/data.json | import で使う規定値 |

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
META_FACEBOOK_IMAGE: ogp_image.jpg
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

#### /import/data.json

```json
[
  {
    "TYPE": "dir",
    "DATA": "フォルダ名",
    "OUTPUT": "出力先のパス"
  },
  {
    "TYPE": "file",
    "DATA": "ファイル名",
    "OUTPUT": "出力先のパス"
  }
]
```

## 💁 How to use

共通の規定値は ```config.json``` に定義してください。  
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
| #{$WEB_BASE_URL} | サイトURL |
| #{$WEB_SITE_URL} | サイトURL（カレントディレクトリを含む） |
| #{$WEB_SITE_NAME} | サイト名 |
| #{$WEB_AUTHOR} | サイト制作者 |
| #{$WEB_MODIFIER} | サイト編集者 |

> gulpfile.js に gulp-header を利用して渡しているので  
```#{$WEB_SITE_URL}``` 等で参照できます。

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
| yarn run clean | gulp clean | ビルドフォルダを削除 |
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
	│   │   │   ├── exampleFour.yml
	│   │   │   ├── exampleThree
	│   │   │   │   └── exampleThree.json
	│   │   │   ├── exampleTwo.js
	│   │   │   └── gsx.json
	│   │   └── import
	│   │       └── data.json
	│   ├── common
	│   │   ├── images
	│   │   │   ├── favicon.ico
	│   │   │   ├── favicon.png
	│   │   │   ├── ogp_image.jpg
	│   │   │   └── tile_image.png
	│   │   ├── scripts
	│   │   │   ├── javascript
	│   │   │   │   ├── common.js
	│   │   │   │   ├── index.js
	│   │   │   │   └── modules
	│   │   │   │       └── _Selector.js
	│   │   │   └── lib
	│   │   │       ├── html5shiv.min.js
	│   │   │       ├── jquery-1.12.4.min.js
	│   │   │       ├── jquery-3.4.0.min.js
	│   │   │       ├── polyfill.js
	│   │   │       └── selectivizr.min.js
	│   │   └── stylesheets
	│   │       ├── _config.scss
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
	│   │           └── _easing.scss
	│   ├── config.json
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
	│   │   │   └── modules
	│   │   └── sp
	│   │       ├── common.js
	│   │       ├── hoge.js
	│   │       ├── index.js
	│   │       └── modules
	│   ├── stylesheets
	│   │   ├── pc
	│   │   │   ├── app.scss
	│   │   │   ├── components
	│   │   │   ├── layouts
	│   │   │   │   ├── _content.scss
	│   │   │   │   ├── _default.scss
	│   │   │   │   └── _wrapper.scss
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
	│   │       │   ├── _default.scss
	│   │       │   └── _wrapper.scss
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
	    │   ├── gsx2json
	    │   │   ├── api.js
	    │   │   └── app.js
	    │   ├── handlebars
	    │   │   ├── config.js
	    │   │   ├── errorMessage.js
	    │   │   ├── extendBlocks.js
	    │   │   ├── getData.js
	    │   │   ├── getLayout.js
	    │   │   ├── index.js
	    │   │   ├── registerPartials.js
	    │   │   └── render.js
	    │   ├── node-sass-functions
	    │   │   ├── index.js
	    │   │   └── processor.js
	    │   └── node-sass-glob
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
同ディレクトリの ```data.json``` を編集することによって  
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

```config.json``` の ```LOCAL_SERVER``` の ```API``` を有効にすると起動します。

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

## ✨ GSX Server

```config.json``` の ```LOCAL_SERVER``` の ```GSX``` を有効にすると起動します。

> 機能としては GoogleSpreadsheet のシートを用意すれば API のリクエストを受け取り、  
または返してくれるシンプルな RESTful API サーバーを用意することが出来ます。  
> ※シートに関しては、```ウェブに公開``` を選択して外から閲覧出来る状態にしてください。
>
> GSX Server をブラウザで開くと ```/src/_modules/data/``` に ```gsx.json``` という  
ファイルが生成され、テンプレート内の共通変数としても呼び出す事が可能になります。  
スプレッドシートを更新した場合、 ```gsx.json``` を更新したい場合は、同じように  
ブラウザで開くと上書きされ、 watch が働くのでテンプレートには即座に自動で反映されます。

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

node-sass の functions 機能を使い様々な関数を利用することが可能です。   
※ /tasks/modules/node-sass-functions/ から読み込んでいます。   

例えば以下のような記述をすると、 ```/images/``` 配下の画像のURLを取得し   
さらに高さと横幅を取得し、自動的に出力する事が可能です。   

※出力先は /htdocs/assets/images/ からの相対パス   
※出力元は /src/images/ からの相対パス（基本的に ```pc/``` または ```sp/``` を指定）

```scss
$image: '（出力先）ディレクトリ名/ファイルパス';
$source: '（出力元）ディレクトリ名/';
$width: image-width($source + $image, true);
$height: image-height($source + $image, true);

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
$width: image-width($source + $image, false);
$height: image-height($source + $image, false);

background-image: image-url($image);
background-size: contain;
@include elementSize_vw($width, $height);
```

#### SCSS でフォントサイズや余白のレスポンシブ対応

mixin の内容は ```/src/common/stylesheets/mixins/``` を見れば分かりますが   
SP サイトなどを作成する際は、以下のように include する事で   
デザインの ```px``` や ```weight``` を上手いことレスポンシブ対応してくれます。

```scss
$size: 26;
@include fontSize_vw($size);
@include fontWeight('Medium');
@include lineHeight(44, $size);
@include letterSpacing(80);
```

また、 ```margin``` や ```padding``` も同様で以下のように指定が可能です。   
上記と同じくデザインの ```px``` の数値を入力するだけで大丈夫です。

```scss
// 一括の場合
@include margin_vw(10, 20, 30, 40);
// それぞれの場合
@include margin_top_vw(10);
@include margin_right_vw(20);
@include margin_bottom_vw(30);
@include margin_left_vw(40);

// 一括の場合
@include padding_vw(10, 20, 30, 40);
// それぞれの場合
@include padding_top_vw(10);
@include padding_right_vw(20);
@include padding_bottom_vw(30);
@include padding_left_vw(40);
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

現在は重要なお知らせはありません。

## 🆙 Version History

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