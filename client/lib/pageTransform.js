/**
 * Created by jf on 2015/9/11.
 * Modified by bear on 2016/9/7.
 * Modified by yunhui on 2016/11/23(修复多层加载的BUG)
 */
var pageManager = {
  $container: $('#container'),
  _pageStack: [],
  _configs: [],
  _pageAppend: function () { },
  _defaultPage: null,
  _pageIndex: 1,
  setDefault: function (defaultPage) {
    this._defaultPage = this._find('name', defaultPage);
    return this;
  },
  setPageAppend: function (pageAppend) {
    this._pageAppend = pageAppend;
    return this;
  },
  init: function () {
    var self = this;

    $(window).on('hashchange', function () {
      interceptor()
      var state = history.state || {};
      var url = location.hash.indexOf('#') === 0 ? location.hash : '#';
      var page = self._find('url', url) || self._defaultPage;
      pageManager.$container.html('')
       var html = $(page.template).html();
      pageManager.$container.html(html)
      // if (state._pageIndex <= self._pageIndex || self._findInStack(url)) {
      //   self._back(page);
      // } else {
      //   self._go(page);
      // }
    });

    if (history.state && history.state._pageIndex) {
      this._pageIndex = history.state._pageIndex;
    }

    this._pageIndex--;

    var url = location.hash.indexOf('#') === 0 ? location.hash : '#';
    var page = self._find('url', url) || self._defaultPage;
    this._go(page);
    return this;
  },
  push: function (config) {
    this._configs.push(config);
    return this;
  },
  go: function (to) {
    var config = this._find('name', to);
    if (!config) {
      return;
    }
    location.hash = config.url;
  },
  _go: function (page) {
    interceptor() //拦截路由
    this._pageIndex++;
     pageManager.$container.html('')
       var html = $(page.template).html();
      pageManager.$container.html(html)
    // console.log(this._pageIndex)
    // history.replaceState && history.replaceState({ _pageIndex: this._pageIndex }, '', location.href);

    // var html = $(config.template).html();
    // console.log(config)
    // var $html = $(html).addClass('slideIn').addClass(config.name);
    // var that = this
    // $html.on('animationend webkitAnimationEnd', function () {

    //   $html.removeClass('slideIn').addClass('js_show');
    // });
    // this.$container.html('')
    // this.$container.append($html);
    // this._pageAppend.call(this, $html);
    // this._pageStack.push({
    //   config: config,
    //   dom: $html
    // });

    // if (!config.isBind) {
    //   this._bind(config);
    // }

    return this;
  },
  back: function () {
    history.back();
  },
  _back: function (config) {
    interceptor() //拦截路由
    this.$container.html('')
    this._pageIndex--;

    var stack = this._pageStack.pop();
    if (!stack) {
      return;
    }

    var url = location.hash.indexOf('#') === 0 ? location.hash : '#';
    var found = this._findInStack(url);
    if (!found) {
      var html = $(config.template).html();
      var $html = $(html).addClass('js_show').addClass(config.name);
      $html.insertBefore(stack.dom);

      if (!config.isBind) {
        this._bind(config);
      }

      this._pageStack.push({
        config: config,
        dom: $html
      });
    }
    var html = $(config.template).html();
    var $html = $(html).addClass('js_show').addClass(config.name);
    stack.dom.addClass('slideOut').on('animationend webkitAnimationEnd', function () {
      stack.dom.remove();
    });
    this.$container.append($html);
    return this;
  },
  _findInStack: function (url) {
    var found = null;
    for (var i = 0, len = this._pageStack.length; i < len; i++) {
      var stack = this._pageStack[i];
      if (stack.config.url === url) {
        found = stack;
        break;
      }
    }
    return found;
  },
  _find: function (key, value) {
    var page = null;
    for (var i = 0, len = this._configs.length; i < len; i++) {
      if (this._configs[i][key] === value) {
        page = this._configs[i];
        break;
      }
    }
    return page;
  },
  _bind: function (page) {
    var events = page.events || {};
    for (var t in events) {
      for (var type in events[t]) {
        this.$container.on(type, t, events[t][type]);
      }
    }
    page.isBind = true;
  }
};

function fastClick() {
  var supportTouch = function () {
    try {
      document.createEvent("TouchEvent");
      return true;
    } catch (e) {
      return false;
    }
  }();
  var _old$On = $.fn.on;

  $.fn.on = function () {
    if (/click/.test(arguments[0]) && typeof arguments[1] == 'function' && supportTouch) { // 只扩展支持touch的当前元素的click事件
      var touchStartY, callback = arguments[1];
      _old$On.apply(this, ['touchstart', function (e) {
        touchStartY = e.changedTouches[0].clientY;
      }]);
      _old$On.apply(this, ['touchend', function (e) {
        if (Math.abs(e.changedTouches[0].clientY - touchStartY) > 10) return;

        e.preventDefault();
        callback.apply(this, [e]);
      }]);
    } else {
      _old$On.apply(this, arguments);
    }
    return this;
  };
}

// function preload() {
//     $(window).on("load", function() {
//         var imgList = [
//             "./images/layers/content.png",
//             "./images/layers/navigation.png",
//             "./images/layers/popout.png",
//             "./images/layers/transparent.gif"
//         ];
//         for (var i = 0, len = imgList.length; i < len; ++i) {
//             new Image().src = imgList[i];
//         }
//     });
// }

function androidInputBugFix() {
  // .container 设置了 overflow 属性, 导致 Android 手机下输入框获取焦点时, 输入法挡住输入框的 bug
  // 相关 issue: https://github.com/weui/weui/issues/15
  // 解决方法:
  // 0. .container 去掉 overflow 属性, 但此 demo 下会引发别的问题
  // 1. 参考 http://stackoverflow.com/questions/23757345/android-does-not-correctly-scroll-on-input-focus-if-not-body-element
  //    Android 手机下, input 或 textarea 元素聚焦时, 主动滚一把
  if (/Android/gi.test(navigator.userAgent)) {
    window.addEventListener('resize', function () {
      if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
        window.setTimeout(function () {
          document.activeElement.scrollIntoViewIfNeeded();
        }, 0);
      }
    })
  }
}

function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return unescape(arr[2]);
  else
    return null;
}
window.getCookie = getCookie

function interceptor(url) {
  if (location.hash != '#login' && location.hash != '#podview') {
    if (getCookie('tf_uid') == null) {
      location.href = "/activies/uprint"
    } else {
      
      window.tf_uid = getCookie('tf_uid')
      console.log(window.tf_uid)
    }
  }
}




function setPageManager() {
  var pages = {},
    tpls = $('script[type="text/html"]');
  var winH = $(window).height();

  for (var i = 0, len = tpls.length; i < len; ++i) {
    var tpl = tpls[i],
      name = tpl.id.replace(/tpl_/, '');
    pages[name] = {
      name: name,
      url: '#' + name,
      template: '#' + tpl.id
    };
  }
  pages.home.url = '#';

  for (var page in pages) {
    pageManager.push(pages[page]);
  }
  pageManager.setDefault('home').init();
}

function loadJS(src, cb) {
  var scripts = document.getElementsByTagName("script")
  console.log(scripts)
  for (var i = 0, l = scripts.length; i < l; i++) {
    console.log(scripts[i])
    if (scripts[i].src == src) {
      console.log(111)
      break;
    } else {
      var script = document.createElement("script");
      script.src = src;
      script.async = true;
      scripts[0].parentNode.insertBefore(script, scripts[0]);
      if (cb && typeof (cb) === "function") {
        script.onload = cb;
      }
      return script;
    }
  }
}

function wxjsdk() {
  var url = location.origin+'/activies/uprint'
  if(sq_id){
    url+='?sq_id='+sq_id
  }
  var shareObj = {
    title: '照片拍的再多再美，不印出来都白搭！',
    desc: '我的天呐，手机里的照片印成书原来如此简单，轻松上传，你也可以拥有属于自己的照片书！',
    link: location.origin+'/activies/uprint',
    imgUrl: 'http://img1.timeface.cn/times/e5c5779dd799ba71f30877601ad8dd5a.jpg'
  }
  $.ajax({
    url: '/activies/wxConfig',
    type: 'get',
    data: {
      url: location.href.split('#')[0]
    },
    dataType: 'json',
    success: function (wxConfig) {
      wxConfig.jsApiList = ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'scanQRCode', 'chooseImage', 'previewImage', 'uploadImage']
      wx.config(wxConfig)
      wx.ready(function () {
        wx.onMenuShareTimeline(shareObj)
        wx.onMenuShareAppMessage(shareObj)
        wx.onMenuShareQQ(shareObj)
        wx.onMenuShareWeibo(shareObj)
        wx.onMenuShareQZone(shareObj)
      })
    }
  })
}

function init() {
  fastClick();
  androidInputBugFix();
  window.loadJS = loadJS;
  setPageManager();
  window.pageManager = pageManager;
  window.home = function () {
    location.hash = '';
  };
  wxjsdk()
}
init();