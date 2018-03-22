;(function(window) {
    var dis = 10
    var Event = {
        addHandler: function (oElement, sEvent, fnHandler) {
            oElement.addEventListener ? oElement.addEventListener(sEvent, fnHandler, false) : oElement.attachEvent("on" + sEvent, fnHandler)
        },
        removeHandler: function (oElement, sEvent, fnHandler) {
            oElement.removeEventListener ? oElement.removeEventListener(sEvent, fnHandler, false) : oElement.detachEvent("on" + sEvent, fnHandler)
        }
    }
    function getScrollHeight() {
        var scrollHeight = 0,
            bodyScrollHeight = 0,
            documentScrollHeight = 0;
        if (document.body) {
            bodyScrollHeight = document.body.scrollHeight;
        }
        if (document.documentElement) {
            documentScrollHeight = document.documentElement.scrollHeight;
        }
        scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
        return scrollHeight;
    }

    function getWindowHeight() {
        var windowHeight = 0;
        if (document.compatMode == "CSS1Compat") {
            windowHeight = document.documentElement.clientHeight;
        } else {
            windowHeight = document.body.clientHeight;
        }
        return windowHeight;
    }

    function debounce(func, wait, immediate) {
        var timeout
        return function() {
            var context = this,
                args = arguments
            var later = function() {
                timeout = null
                if (!immediate) func.apply(context, args)
            }
            var callNow = immediate && !timeout
            clearTimeout(timeout);
            timeout = setTimeout(later, wait)
            if (callNow) func.apply(context, args)
        }
    }

    function getScrollTop() {
        var scrollTop = 0,
            bodyScrollTop = 0,
            documentScrollTop = 0;
        if (document.body) {
            bodyScrollTop = document.body.scrollTop;
        }
        if (document.documentElement) {
            documentScrollTop = document.documentElement.scrollTop;
        }
        scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
        return scrollTop;
    }

    function myEfficientFn(func) {
        return debounce(function() {
            if (getScrollTop() + getWindowHeight() >= (getScrollHeight() - dis)) {
                return func()
            }
        }, 250)
    }
    var fn = ''
    var pulltoLoad = {
        load: function(func) {
            fn = myEfficientFn(func)
            Event.addHandler(window,'scroll',fn)
        },
        destroy: function(func) {
            if (fn) {
                Event.removeHandler(window,'scroll',fn)
                window.removeEventListener('scroll', fn)
            }

        }
    }
    if (typeof exports === 'object')
        module.exports = pulltoLoad
    else if (typeof define === 'function' && define.amd)
        define(function() { return pullToLoad })
    else
        window.pullToLoad = pullToLoad

})(typeof window != 'undefined' ? window : undefined);