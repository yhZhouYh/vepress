(function(w) {
    var loadJS = function(src, cb) {
        "use strict";
        var ref = w.document.getElementsByTagName("script")[0];
        var script = w.document.createElement("script");
        script.src = src;
        script.async = true;
        ref.parentNode.insertBefore(script, ref);
        if (cb && typeof(cb) === "function") {
            script.onload = cb;
        }
        return script;
    };
    // commonjs
    if (typeof module !== "undefined") {
        console.log(1111)
        module.exports = loadJS;
    } else {
        console.log(11111)
        w.loadJS = loadJS;
    }
}(typeof global !== "undefined" ? global : this));