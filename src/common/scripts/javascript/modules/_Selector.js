//------------------------------------------------------
// UserAgent Browser Selector - ブラウザクラス振り分け
//------------------------------------------------------

class Selector {

  constructor() {
    this.init();
  }

  init() {

    const selector = function(u, n) {
      const e = document.documentElement;
      let l = [];
      n = (n ? n : "");
      userAgent.ua = u.toLowerCase();
      l = l.concat(userAgent.getPlatform());
      l = l.concat(userAgent.getMobile());
      l = l.concat(userAgent.getBrowser());
      l = l.concat(userAgent.getIpadApp());
      l = l.concat(userAgent.getLang());
      l = l.concat(screenInfo.getPixelRatio());
      l = l.concat(screenInfo.getInfo());
      l = l.concat([ "js" ]);

      const updateScreen = function() {
        e.className = e.className.replace(RegExp(" ?orientation_\\w+", "g"), "").replace(RegExp(" [min|max|cl]+[w|h]_\\d+", "g"), "");
        return e.className = e.className + " " + screenInfo.getInfo().join(" ");
      };

      if (window.addEventListener) {
        window.addEventListener("resize", updateScreen);
        window.addEventListener("orientationchange", updateScreen);
      } else {
        window.attachEvent("resize", updateScreen);
        window.attachEvent("orientationchange", updateScreen);
      }

      const data = dataUriInfo.getImg();
      data.onload = (data.onerror = () => e.className += ` ${dataUriInfo.checkSupport().join(" ")}`);

      if (!Array.prototype.filter) { // IE Fix
        Array.prototype.filter = function(fun) { //, thisp
          "use strict";
          if ((this === undefined) || (this === null)) { throw new TypeError(); }
          const t = Object(this);
          const len = t.length >>> 0;
          if (typeof fun !== "function") { throw new TypeError(); }
          const res = [];
          const thisp = arguments[1];
          let i = 0;

          while (i < len) {
            if (i in t) {
              const val = t[i];
              if (fun.call(thisp, val, i, t)) { res.push(val); }
            }
            i++;
          }
          return res;
        };
      }
      l = l.filter(e => e);
      l[0] = (n ? n + l[0] : l[0]);
      e.className = l.join(` ${n}`);
      return e.className;
    };

    var userAgent = {
      ua: "",
      is(t) {
        return RegExp(t, "i").test(userAgent.ua);
      },

      version(p, n) {
        n = n.replace(".", "_");
        let i = n.indexOf("_");
        let v = "";
        while (i > 0) {
          v += ` ${p}${n.substring(0, i)}`;
          i = n.indexOf("_", i + 1);
        }
        v += ` ${p}${n}`;
        return v;
      },

      getIphoneDeviceName() {
        let version;
        const is_ = userAgent.is;
        if (is_('iphone')) {
          version = ' ';
          if (((window.screen.width === 414) && (window.screen.height === 896)) || (((window.screen.width === 896) && (window.screen.height === 414)) && (window.devicePixelRatio === 3))) {
            version += 'iphoneXSMax';
          } else if (((window.screen.width === 414) && (window.screen.height === 896)) || (((window.screen.width === 896) && (window.screen.height === 414)) && (window.devicePixelRatio === 2))) {
            version += 'iphoneXR';
          } else if (((window.screen.width === 375) && (window.screen.height === 812)) || (((window.screen.width === 812) && (window.screen.height === 375)) && (window.devicePixelRatio === 3))) {
            version += 'iphoneX iphoneXS';
          } else if (((window.screen.width === 414) && (window.screen.height === 736)) || (((window.screen.width === 736) && (window.screen.height === 414)) && (window.devicePixelRatio === 3))) {
            version += 'iphone6_plus iphone7_plus iphone6s_plus iphone7s_plus iphone8_plus';
          } else if (((window.screen.width === 375) && (window.screen.height === 667)) || (((window.screen.width === 667) && (window.screen.height === 375)) && (window.devicePixelRatio === 2))) {
            version += 'iphone6 iphone6s iphone7 iphone7s iphone8';
          } else if (((window.screen.width === 320) && (window.screen.height === 568)) || (((window.screen.width === 568) && (window.screen.height === 320)) && (window.devicePixelRatio === 2))) {
            version += 'iphone5 iphone5s iphone5c';
          } else if (((window.screen.width === 320) && (window.screen.height === 480)) || (((window.screen.width === 480) && (window.screen.height === 320)) && (window.devicePixelRatio === 2))) {
            version += 'iphone4 iphone4s';
          } else if (((window.screen.width === 320) && (window.screen.height === 480)) || (((window.screen.width === 480) && (window.screen.height === 320)) && (window.devicePixelRatio === 1))) {
            version += 'iphone3 iphone3g iphone3gs';
          } else {
            version = '';
          }
        } else {
          version = '';
        }
        return version;
      },

      getPlatform() {
        const { ua } = userAgent;
        const ver = userAgent.version;
        const is_ = userAgent.is;
        return [ (is_("ipad|ipod|iphone") ? (((/CPU( iPhone)? OS (\d+[_|\.]\d+([_|\.]\d+)*)/i.test(ua) ? `ios${ver("ios", RegExp.$2)}` : "")) + " " + ((/(ip(ad|od|hone))/g.test(ua) ? RegExp.$1 : "")) + "" + ((/(iphone)/g.test(ua) ? userAgent.getIphoneDeviceName() : ""))) : (is_("mac") ? `mac${/mac os x ((\d+)[.|_](\d+))/.test(ua) ? (` mac${RegExp.$2} mac${(RegExp.$1).replace(".", "_")}`) : ""}` : (is_("win") ? `win${is_("windows nt 6.3") ? " win8_1" : (is_("windows nt 6.2") ? " win8" : (is_("windows nt 6.1") ? " win7" : (is_("windows nt 6.0") ? " vista" : (is_("windows nt 5.2") || is_("windows nt 5.1") ? " win_xp" : (is_("windows nt 5.0") ? " win_2k" : (is_("windows nt 4.0") || is_("WinNT4.0") ? " win_nt" : ""))))))}` : (is_("freebsd") ? "freebsd" : (is_("x11|linux") ? "linux" : (is_("playbook") ? "playbook" : (is_("kindle|silk") ? "kindle" : (is_("playbook") ? "playbook" : (is_("j2me") ? "j2me" : ""))))))))) ];
      },

      getMobile() {
        const is_ = userAgent.is;
        return [ (is_("android|iphone|ipod|ipad|mobi|mobile|j2me|blackberry|playbook|kindle|silk") ? "mobile" : "") ];
      },

      getBrowser() {
        const g = "gecko";
        const w = "webkit";
        const c = "chrome";
        const f = "firefox";
        const s = "safari";
        const o = "opera";
        const a = "android";
        const b = "blackberry";
        const d = "device_";
        const { ua } = userAgent;
        const is_ = userAgent.is;
        return [ ((!(/opera|webtv|firefox/i.test(ua)) && /trident|msie/i.test(ua) && /(msie\s|rv\:)(\d+)/.test(ua)) ? (`ie ie${/trident\/4\.0/.test(ua) ? "8" : RegExp.$2}`) : (is_("firefox/") ? g + " " + f + ((/firefox\/((\d+)(\.(\d+))(\.\d+)*)/.test(ua) ? ` ${f}${RegExp.$2} ${f}${RegExp.$2}_${RegExp.$4}` : "")) : (is_("gecko/") ? g : (is_("opera") ? o + ((/version\/((\d+)(\.(\d+))(\.\d+)*)/.test(ua) ? ` ${o}${RegExp.$2} ${o}${RegExp.$2}_${RegExp.$4}` : ((/opera(\s|\/)(\d+)\.(\d+)/.test(ua) ? ` ${o}${RegExp.$2} ${o}${RegExp.$2}_${RegExp.$3}` : "")))) : (is_("konqueror") ? "konqueror" : (is_("blackberry") ? (b + ((/Version\/(\d+)(\.(\d+)+)/i.test(ua) ? ` ${b}${RegExp.$1} ${b}${RegExp.$1}${RegExp.$2.replace(".", "_")}` : ((/Blackberry ?(([0-9]+)([a-z]?))[\/|;]/g.test(ua) ? ` ${b}${RegExp.$2}${RegExp.$3 ? ` ${b}${RegExp.$2}${RegExp.$3}` : ""}` : ""))))) : (is_("android") ? (a + ((/Version\/(\d+)(\.(\d+))+/i.test(ua) ? ` ${a}${RegExp.$1} ${a}${RegExp.$1}${RegExp.$2.replace(".", "_")}` : "")) + ((/Android (.+); (.+) Build/i.test(ua) ? ` ${d}${((RegExp.$2).replace(RegExp(" ", "g"), "_")).replace(/-/g, "_")}` : ""))) : (is_("chrome") ? w + " " + c + ((/chrome\/((\d+)(\.(\d+))(\.\d+)*)/.test(ua) ? ` ${c}${RegExp.$2}${(RegExp.$4 > 0) ? ` ${c}${RegExp.$2}_${RegExp.$4}` : ""}` : "")) : (is_("iron") ? w + " iron" : (is_("applewebkit/") ? (w + " " + s + ((/version\/((\d+)(\.(\d+))(\.\d+)*)/.test(ua) ? ` ${s}${RegExp.$2} ${s}${RegExp.$2}${RegExp.$3.replace(".", "_")}` : ((RegExp(" Safari\\/(\\d+)", "i").test(ua) ? ((((RegExp.$1 === "419") || (RegExp.$1 === "417") || (RegExp.$1 === "416") || (RegExp.$1 === "412")) ? ` ${s}2_0` : (RegExp.$1 === "312" ? ` ${s}1_3` : (RegExp.$1 === "125" ? ` ${s}1_2` : (RegExp.$1 === "85" ? ` ${s}1_0` : ""))))) : ""))))) : (is_("mozilla/") ? g : ""))))))))))) ];
      },

      getIpadApp() {
        const is_ = userAgent.is;
        return [ ((is_("ipad|iphone|ipod") && !is_("safari")) ? "ipad_app" : "") ];
      },

      getLang() {
        const { ua } = userAgent;
        return [ (/[; |\[](([a-z]{2})(\-[a-z]{2})?)[)|;|\]]/i.test(ua) ? (`lang_${RegExp.$2}`).replace("-", "_") + ((RegExp.$3 !== "" ? (` lang_${RegExp.$1}`).replace("-", "_") : "")) : "") ];
      }
    };

    var screenInfo = {
      width: (window.outerWidth || document.documentElement.clientWidth) - 15,
      height: window.outerHeight || document.documentElement.clientHeight,
      screens: [ 0, 768, 980, 1200 ],
      screenSize() {
        screenInfo.width = (window.outerWidth || document.documentElement.clientWidth) - 15;
        screenInfo.height = window.outerHeight || document.documentElement.clientHeight;
        const { screens } = screenInfo;
        let i = screens.length;
        const array = [];
        const maxw = undefined;
        const minw = undefined;
        while (i--) {
          if (screenInfo.width >= screens[i]) {
            if (i) { array.push(`minw_${screens[(i)]}`); }
            if (i <= 2) { array.push(`maxw_${screens[(i) + 1] - 1}`); }
            break;
          }
        }
        return array;
      },

      getOrientation() {
        if (screenInfo.width < screenInfo.height) { return [ "orientation_portrait" ]; } else { return [ "orientation_landscape" ]; }
      },

      getInfo() {
        let array = [];
        array = array.concat(screenInfo.screenSize());
        array = array.concat(screenInfo.getOrientation());
        return array;
      },

      getPixelRatio() {
        const array = [];
        const pixelRatio = (window.devicePixelRatio ? window.devicePixelRatio : 1);
        if (pixelRatio > 1) {
          array.push(`retina_${parseInt(pixelRatio)}x`);
          array.push("hidpi");
        } else {
          array.push("no-hidpi");
        }
        return array;
      }
    };

    var dataUriInfo = {
      data: new Image(),
      div: document.createElement("div"),
      isIeLessThan9: false,
      getImg() {
        dataUriInfo.data.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        dataUriInfo.div.innerHTML = "<!--[if lt IE 9]><i></i><![endif]-->";
        dataUriInfo.isIeLessThan9 = dataUriInfo.div.getElementsByTagName("i").length === 1;
        return dataUriInfo.data;
      },

      checkSupport() {
        if ((dataUriInfo.data.width !== 1) || (dataUriInfo.data.height !== 1) || dataUriInfo.isIeLessThan9) {
          return [ "no-datauri" ];
        } else {
          return [ "datauri" ];
        }
      }
    };

    var selector_n = selector_n || "";
    selector(navigator.userAgent, selector_n);

    const _ua = userAgent.getBrowser().join(" ");
    window.browserType = _ua.split(/\s/);

    const _pl = userAgent.getPlatform().join(" ");
    window.smartphoneType = _pl.split(/\s/);

    const _mo = userAgent.getMobile().join(" ");
    return window.mobileType = _mo.split(/\s/);
  }
}

module.exports = Selector;