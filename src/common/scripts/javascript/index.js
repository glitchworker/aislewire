import Selector from './modules/_Selector';

class Index {

  constructor() {
    new Selector();
    this.init();
  }

  init() {
    return this.main();
  }

  main() {
    //------------------------------------------------------
    // Redirect Scripts - PCとSPのリダイレクト処理
    //------------------------------------------------------

    const _isMobile = mobileType[0] === 'mobile';

    window.redirectPC = url => _isMobile || (location.href = url + location.search);
    window.redirectSP = url => (_isMobile) && (location.href = url + location.search);

    //------------------------------------------------------
    // DOMContentLoaded - 初回読み込み後に実行
    //------------------------------------------------------

    return document.addEventListener('DOMContentLoaded', (function() {

      // Social Share - SNSシェアボタンの処理
      const SITE_URL = location.href.replace('#', '') + location.search;
      const SITE_SHARE = document.querySelector('meta[property="og:description"]').getAttribute('content');

      Common.twitterShare('.tw', SITE_URL, SITE_SHARE);
      Common.facebookShare('.fb', SITE_URL);
      Common.lineShare('.li', SITE_URL, SITE_SHARE);
      Common.googleShare('.gp', SITE_URL);

      // Font Kerning - フォントのカーニング処理
      Common.textKerning('.kerning');

    }), false);
  }
}

new Index();