/**
 * @license addEventListener polyfill 1.0 / Eirik Backer / MIT Licence
 * https://gist.github.com/2864711/946225eb3822c203e8d6218095d888aac5e1748e
 */
(function (window, document, listeners_prop_name) {
  if ((!window.addEventListener || !window.removeEventListener) && window.attachEvent && window.detachEvent) {
    /**
     * @param {*} value
     * @return {boolean}
     */
    var is_callable = function (value) {
      return typeof value === 'function';
    };
    /**
     * @param {!Window|HTMLDocument|Node} self
     * @param {EventListener|function(!Event):(boolean|undefined)} listener
     * @return {!function(Event)|undefined}
     */
    var listener_get = function (self, listener) {
      var listeners = listener[listeners_prop_name];
      if (listeners) {
        var lis;
        var i = listeners.length;
        while (i--) {
          lis = listeners[i];
          if (lis[0] === self) {
            return lis[1];
          }
        }
      }
    };
    /**
     * @param {!Window|HTMLDocument|Node} self
     * @param {EventListener|function(!Event):(boolean|undefined)} listener
     * @param {!function(Event)} callback
     * @return {!function(Event)}
     */
    var listener_set = function (self, listener, callback) {
      var listeners = listener[listeners_prop_name] || (listener[listeners_prop_name] = []);
      return listener_get(self, listener) || (listeners[listeners.length] = [self, callback], callback);
    };
    /**
     * @param {string} methodName
     */
    var docHijack = function (methodName) {
      var old = document[methodName];
      document[methodName] = function (v) {
        return addListen(old(v));
      };
    };
    /**
     * @this {!Window|HTMLDocument|Node}
     * @param {string} type
     * @param {EventListener|function(!Event):(boolean|undefined)} listener
     * @param {boolean=} useCapture
     */
    var addEvent = function (type, listener, useCapture) {
      if (is_callable(listener)) {
        var self = this;
        self.attachEvent('on' + type, listener_set(self, listener, function (e) {
          e = e || window.event;
          e.preventDefault = e.preventDefault || function () {
            e.returnValue = false
          };
          e.stopPropagation = e.stopPropagation || function () {
            e.cancelBubble = true
          };
          e.target = e.target || e.srcElement || document.documentElement;
          e.currentTarget = e.currentTarget || self;
          e.timeStamp = e.timeStamp || (new Date()).getTime();
          listener.call(self, e);
        }));
      }
    };
    /**
     * @this {!Window|HTMLDocument|Node}
     * @param {string} type
     * @param {EventListener|function(!Event):(boolean|undefined)} listener
     * @param {boolean=} useCapture
     */
    var removeEvent = function (type, listener, useCapture) {
      if (is_callable(listener)) {
        var self = this;
        var lis = listener_get(self, listener);
        if (lis) {
          self.detachEvent('on' + type, lis);
        }
      }
    };
    /**
     * @param {!Node|NodeList|Array} obj
     * @return {!Node|NodeList|Array}
     */
    var addListen = function (obj) {
      var i = obj.length;
      if (i) {
        while (i--) {
          obj[i].addEventListener = addEvent;
          obj[i].removeEventListener = removeEvent;
        }
      } else {
        obj.addEventListener = addEvent;
        obj.removeEventListener = removeEvent;
      }
      return obj;
    };
    addListen([document, window]);
    if ('Element' in window) {
      /**
       * IE8
       */
      var element = window.Element;
      element.prototype.addEventListener = addEvent;
      element.prototype.removeEventListener = removeEvent;
    } else {
      /**
       * IE < 8
       */
      //Make sure we also init at domReady
      document.attachEvent('onreadystatechange', function () {
        addListen(document.all)
      });
      docHijack('getElementsByTagName');
      docHijack('getElementById');
      docHijack('createElement');
      addListen(document.all);
    }
  }
})(window, document, 'x-ms-event-listeners');

/**
 * define document.querySelector & document.querySelectorAll for IE7
 *
 * A not very fast but small hack. The approach is taken from
 * http://weblogs.asp.net/bleroy/archive/2009/08/31/queryselectorall-on-old-ie-versions-something-that-doesn-t-work.aspx
 *
 */
(function () {
  var style = document.createStyleSheet(), select = function (selector, maxCount) {
    var all = document.all, l = all.length, i, resultSet = [];
    style.addRule(selector, "foo:bar");
    for (i = 0; i < l; i += 1) {
      if (all[i].currentStyle.foo === "bar") {
        resultSet.push(all[i]);
        if (resultSet.length > maxCount) {
          break;
        }
      }
    }
    style.removeRule(0);
    return resultSet;
  };
  //  be rly sure not to destroy a thing!
  if (document.querySelectorAll || document.querySelector) {
    return;
  }
  document.querySelectorAll = function (selector) {
    return select(selector, Infinity);
  };
  document.querySelector = function (selector) {
    return select(selector, 1)[0] || null;
  };
}());

/**
 * Object.defineProperty for ie8
 */
var origDefineProperty = Object.defineProperty;
var arePropertyDescriptorsSupported = function() {
  var obj = {};
  try {
    origDefineProperty(obj, "x", { enumerable: false, value: obj });
    for (var _ in obj) {
      return false;
    }
    return obj.x === obj;
  } catch (e) {
    /* this is IE 8. */
    return false;
  }
};
var supportsDescriptors = origDefineProperty && arePropertyDescriptorsSupported();
if (!supportsDescriptors) {
  Object.defineProperty = function(a, b, c) {
    if (origDefineProperty && a.nodeType == 1) {
      return origDefineProperty(a, b, c);
    } else {
      a[b] = c.value || (c.get && c.get());
    }
  };
}