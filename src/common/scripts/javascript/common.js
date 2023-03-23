(function() {
  let textKerningCSS = undefined;
  let _toConsumableArray = undefined;
  let hasPassiveEvents = undefined;
  let isIosDevice = undefined;
  let locks = undefined;
  let documentListenerAdded = undefined;
  let initialClientY = undefined;
  let previousBodyOverflowSetting = undefined;
  let previousBodyPaddingRight = undefined;
  let allowTouchMove = undefined;
  let preventDefault = undefined;
  let setOverflowHidden = undefined;
  let restoreOverflowSetting = undefined;
  let isTargetElementTotallyScrolled = undefined;
  let handleScroll = undefined;

  const CommonScript = (window.Common = class Common {
    static initClass() {

      //------------------------------------------------------
      // 文字をカーニング調整
      //------------------------------------------------------

      // CSS設定 @type {{first: string, rspace: string, rspace2: string}}
      textKerningCSS = {
        first: '-.5em',
        rspace: '-.75em',
        rspace2: '-.5em'
      };

      //------------------------------------------------------
      // 指定要素のスクロールを無効化
      //
      // 無効化の例：
      // const modal = document.querySelector('.modal_list');
      // Common.disableBodyScroll(modal, { reserveScrollBarGap: true });
      //
      // 有効化の例：
      // Common.enableBodyScroll(modal);
      //------------------------------------------------------

      _toConsumableArray = function(arr) {
        if (Array.isArray(arr)) {
          let i = 0;
          const arr2 = Array(arr.length);
          while (i < arr.length) {
            arr2[i] = arr[i];
            i++;
          }
          return arr2;
        } else {
          return Array.from(arr);
        }
      };

      // Passive Event が対応しているかどうかを判断
      // https://stackoverflow.com/questions/41594997/ios-10-safari-prevent-scrolling-behind-a-fixed-overlay-and-maintain-scroll-posi
      hasPassiveEvents = false;
      if (typeof window !== 'undefined') {
        const passiveTestOptions = Object.defineProperty({}, 'passive', { get() {
          hasPassiveEvents = true;
          return undefined;
        }
      }
        );
        window.addEventListener('testPassive', null, passiveTestOptions);
        window.removeEventListener('testPassive', null, passiveTestOptions);
      }

      isIosDevice = (typeof window !== 'undefined') && window.navigator && window.navigator.platform && /iP(ad|hone|od)/.test(window.navigator.platform);
      locks = [];
      documentListenerAdded = false;
      initialClientY = -1;
      previousBodyOverflowSetting = undefined;
      previousBodyPaddingRight = undefined;

      allowTouchMove = el =>
        locks.some(function(lock) {
          if (lock.options.allowTouchMove && lock.options.allowTouchMove(el)) {
            return true;
          }
          return false;
        })
      ;

      preventDefault = function(rawEvent) {
        const e = rawEvent || window.event;
        if (allowTouchMove(e.target)) {
          return true;
        }
        if (e.touches.length > 1) {
          return true;
        }
        if (e.preventDefault) {
          e.preventDefault();
        }
        return false;
      };

      setOverflowHidden = function(options) {
        setTimeout(function() {
          if (previousBodyPaddingRight === undefined) {
            const _reserveScrollBarGap = !!options && (options.reserveScrollBarGap === true);
            const scrollBarGap = window.innerWidth - (document.documentElement.clientWidth);
            if (_reserveScrollBarGap && (scrollBarGap > 0)) {
              previousBodyPaddingRight = document.body.style.paddingRight;
              document.body.style.paddingRight = scrollBarGap + 'px';
            }
          }
          if (previousBodyOverflowSetting === undefined) {
            previousBodyOverflowSetting = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
          }
        });
      };

      restoreOverflowSetting = function() {
        setTimeout(function() {
          if (previousBodyPaddingRight !== undefined) {
            document.body.style.paddingRight = previousBodyPaddingRight;
            previousBodyPaddingRight = undefined;
          }
          if (previousBodyOverflowSetting !== undefined) {
            document.body.style.overflow = previousBodyOverflowSetting;
            previousBodyOverflowSetting = undefined;
          }
        });
      };

      // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#Problems_and_solutions
      isTargetElementTotallyScrolled = function(targetElement) {
        if (targetElement) { return (targetElement.scrollHeight - (targetElement.scrollTop)) <= targetElement.clientHeight; } else { return false; }
      };

      handleScroll = function(event, targetElement) {
        const clientY = event.targetTouches[0].clientY - initialClientY;
        if (allowTouchMove(event.target)) {
          return false;
        }
        if (targetElement && (targetElement.scrollTop === 0) && (clientY > 0)) {
          return preventDefault(event);
        }
        if (isTargetElementTotallyScrolled(targetElement) && (clientY < 0)) {
          return preventDefault(event);
        }
        event.stopPropagation();
        return true;
      };
    }

    //------------------------------------------------------
    // ページ内 Body のクラスを取得
    //------------------------------------------------------

    static getName(str) {
      return document.querySelector(`body.page-${str.toLowerCase()}`);
    }

    //------------------------------------------------------
    // URLからパラメータを取得
    //------------------------------------------------------

    static getParam() {
      const array = [];
      const param = location.search.substring(1).split('&');
      let i = 0;
      while (param[i]) {
        const keyValue = param[i].split('=');
        array[keyValue[0]] = keyValue[1];
        i++;
      }
      return array;
    }

    //------------------------------------------------------
    // 配列をシャッフルする
    //------------------------------------------------------

    static shuffleArray(array) {
      const { length } = array;
      let i = length - 1;
      while (i > 0) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
        i--;
      }
      return array;
    }

    //------------------------------------------------------
    // 指定した文字数で分割し配列で返す
    //------------------------------------------------------

    static splitByLength(str, length) {
      const resultArr = [];
      if (!str || !length || (length < 1)) {
        return resultArr;
      }
      let index = 0;
      let start = index;
      let end = start + length;
      while (start < str.length) {
        resultArr[index] = str.substring(start, end);
        index++;
        start = end;
        end = start + length;
      }
      return resultArr;
    }

    //------------------------------------------------------
    // Twitterのシェアダイアログを表示
    //------------------------------------------------------

    static twitterShare(i_target, i_url, i_text) {
      if (document.querySelector(i_target) !== null) {
        document.querySelector(i_target).addEventListener('click', (function(e) {
          e.preventDefault();
          // Android for Twitter App Bug fix.
          // let url = 'http://twitter.com/share?url=';
          let url = 'http://twitter.com/intent/tweet?url=';
          url += encodeURIComponent(i_url);
          url += `&text=${encodeURIComponent(i_text)}`;
          window.open(url, 'share', [
            'width=550',
            'height=450',
            'location=yes',
            'resizable=yes',
            'toolbar=no',
            'menubar=no',
            'scrollbars=no',
            'status=no'
          ].join(',')
          );
          return false;
        }), false);
      }
    }

    //------------------------------------------------------
    // Facebookのシェアダイアログを表示
    //------------------------------------------------------

    static facebookShare(i_target, i_url) {
      if (document.querySelector(i_target) !== null) {
        document.querySelector(i_target).addEventListener('click', (function(e) {
          e.preventDefault();
          let url = 'http://www.facebook.com/share.php?u=';
          url += encodeURIComponent(i_url);
          window.open(url, 'share', [
            'width=550',
            'height=450',
            'location=yes',
            'resizable=yes',
            'toolbar=no',
            'menubar=no',
            'scrollbars=no',
            'status=no'
          ].join(',')
          );
          return false;
        }), false);
      }
    }

    //------------------------------------------------------
    // LINEのシェアダイアログを表示
    //------------------------------------------------------

    static lineShare(i_target, i_url, i_text) {
      if (document.querySelector(i_target) !== null) {
        document.querySelector(i_target).addEventListener('click', (function(e) {
          let url;
          e.preventDefault();
          if (mobileType[0] === 'mobile') {
            url = 'http://line.me/R/msg/text/?';
            url += encodeURIComponent(i_text);
            url += `%20${encodeURIComponent(i_url)}`;
          } else {
            url = 'https://timeline.line.me/social-plugin/share?url=';
            url += encodeURIComponent(i_url);
          }
          window.open(url, 'share', [
            'width=550',
            'height=450',
            'location=yes',
            'resizable=yes',
            'toolbar=no',
            'menubar=no',
            'scrollbars=no',
            'status=no'
          ].join(',')
          );
          return false;
        }), false);
      }
    }

    //------------------------------------------------------
    // Google+のシェアダイアログを表示
    //------------------------------------------------------

    static googleShare(i_target, i_url) {
      if (document.querySelector(i_target) !== null) {
        document.querySelector(i_target).addEventListener('click', (function(e) {
          e.preventDefault();
          let url = 'https://plus.google.com/share?url=';
          url += encodeURIComponent(i_url);
          window.open(url, 'share', [
            'width=550',
            'height=450',
            'location=yes',
            'resizable=yes',
            'toolbar=no',
            'menubar=no',
            'scrollbars=no',
            'status=no'
          ].join(',')
          );
          return false;
        }), false);
      }
    }

    // カーニングのやつ @param $target
    static textKerning($target) {
      Array.prototype.forEach.call(document.querySelectorAll($target), function(el, i) {
        const __$target = el;

        // altとtitleをいったん格納する
        const __alt = [];
        const __title = [];
        let __$img = __$target.getElementsByTagName('img');
        let __$a = __$target.getElementsByTagName('a');
        if (__$img.length > 0) {
          Array.prototype.forEach.call(__$img, function(el, i) {
            __alt.push(el.getAttribute('alt'));
            el.setAttribute('alt', '');
          });
        }
        if (__$a.length > 0) {
          Array.prototype.forEach.call(__$a, function(el, i) {
            __title.push(el.getAttribute('title'));
            el.setAttribute('title', '');
          });
        }

        // もにょもにょする
        let __text = __$target.innerHTML;
        __text = __text.replace(/^(\s|\t|\n)+|(\s|\t|\n)+$/g, ''); //文章の頭とケツの半角・全角スペース、タブ、改行削除
        __text = __text.replace(/(\n)((\s|\t)+)/g, ''); //改行後の頭の半角・全角スペース、タブ削除
        __text = __text.replace(/^(（|〔|［|｛|〈|《|「|『|【)/g, '<span class=\'rspace-first\'>$1</span>'); //文頭調整
        __text = __text.replace(/(<br \/>|<br>)(（|〔|［|｛|〈|《|「|『|【)/g, '$1<span class=\'rspace-first\'>$2</span>'); //br改行後の文頭調整
        __text = __text.replace(/(、|。|，|．|）|〕|］|｝|〉|》|」|』|】)(、|。|，|．|）|〕|］|｝|〉|》|」|』|】)(（|〔|［|｛|〈|《|「|『|【)/g, '<span class=\'rspace2\'>$1</span><span class=\'rspace\'>$2</span>$3');
        __text = __text.replace(/(、|。|，|．|）|〕|］|｝|〉|》|」|』|】)(（|〔|［|｛|〈|《|「|『|【)/g, '<span class=\'rspace2\'>$1</span>$2');
        __$target.innerHTML = __text;
        const target = __$target.querySelectorAll('.rspace-first');
        const target2 = __$target.querySelectorAll('.rspace');
        const target3 = __$target.querySelectorAll('.rspace2');
        i = 0;
        while (i < target.length) {
          target[i].style.position = 'relative';
          target[i].style.left = textKerningCSS.first;
          target[i].style.letterSpacing = textKerningCSS.first;
          i++;
        }
        i = 0;
        while (i < target2.length) {
          target2[i].style.letterSpacing = textKerningCSS.rspace;
          i++;
        }
        i = 0;
        while (i < target3.length) {
          target3[i].style.letterSpacing = textKerningCSS.rspace2;
          i++;
        }

        // altとtitleつけなおす
        __$img = __$target.getElementsByTagName('img');
        __$a = __$target.getElementsByTagName('a');
        if (__$img.length > 0) {
          Array.prototype.forEach.call(__$img, function(el, i) {
            el.setAttribute('alt', __alt[i]);
          });
        }
        if (__$a.length > 0) {
          Array.prototype.forEach.call(__$a, function(el, i) {
            el.setAttribute('title', __title[i]);
          });
        }

      });
    }

    static disableBodyScroll(targetElement, options) {
      if (isIosDevice) {
        if (!targetElement) {
          console.error('disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.');
          return;
        }
        if (targetElement && !locks.some((lock => lock.targetElement === targetElement))) {
          const lock = {
            targetElement,
            options: options || {}
          };
          locks = [].concat(_toConsumableArray(locks), [ lock ]);
          targetElement.ontouchstart = function(event) {
            if (event.targetTouches.length === 1) {
              initialClientY = event.targetTouches[0].clientY;
            }
          };
          targetElement.ontouchmove = function(event) {
            if (event.targetTouches.length === 1) {
              handleScroll(event, targetElement);
            }
          };
          if (!documentListenerAdded) {
            document.addEventListener('touchmove', preventDefault, hasPassiveEvents ? {passive: false} : undefined);
            documentListenerAdded = true;
          }
        }
      } else {
        setOverflowHidden(options);
        const _lock = {
          targetElement,
          options: options || {}
        };
        locks = [].concat(_toConsumableArray(locks), [ _lock ]);
      }
    }

    static clearAllBodyScrollLocks() {
      if (isIosDevice) {
        locks.forEach(function(lock) {
          lock.targetElement.ontouchstart = null;
          lock.targetElement.ontouchmove = null;
        });
        if (documentListenerAdded) {
          document.removeEventListener('touchmove', preventDefault, hasPassiveEvents ? {passive: false} : undefined);
          documentListenerAdded = false;
        }
        locks = [];
        initialClientY = -1;
      } else {
        restoreOverflowSetting();
        locks = [];
      }
    }

    static enableBodyScroll(targetElement) {
      if (isIosDevice) {
        if (!targetElement) {
          console.error('enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.');
          return;
        }
        targetElement.ontouchstart = null;
        targetElement.ontouchmove = null;
        locks = locks.filter(lock => lock.targetElement !== targetElement);
        if (documentListenerAdded && (locks.length === 0)) {
          document.removeEventListener('touchmove', preventDefault, hasPassiveEvents ? {passive: false} : undefined);
          documentListenerAdded = false;
        }
      } else if ((locks.length === 1) && (locks[0].targetElement === targetElement)) {
        restoreOverflowSetting();
        locks = [];
      } else {
        locks = locks.filter(lock => lock.targetElement !== targetElement);
      }
    }
  });

  CommonScript.initClass();
  return CommonScript;
})();

module.exports = Common;