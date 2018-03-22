var _ = {}

//获取对象key的数组
_.keys = (obj) => {
    if (!_isObject(obj)) { return [] }
    if (Object.keys) {
        return Object.keys(obj)
    } else {
        var keys = []
        for (var key in obj) {
            keys.push(key)
        }
        return keys
    }
}

_.isArray = (a) => {
    return Array.isArray ? Array.isArray(a) : Object.prototype.toString.call(a) === '[object Array]';
}
_.isObject = (obj) => {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj; //null的判断
};

['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'].map((name) => {
    _['is' + name] = (obj) => {
        return Object.prototype.toString.call(obj) === '[object ' + name + ']';
    }
})


_.isEmpty = function (obj) {
    if (obj == null) return true;
    return _.keys(obj).length === 0;
};

//判断是不是dom节点
_.isElement = (obj) => {
    // 确保 obj 不是 null 
    // 并且 obj.nodeType === 1
    return !!(obj && obj.nodeType === 1);
};

_.isFunction = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Function]' || typeof obj == 'function'
}

_.isNaN = function (obj) {
    //[Object Number] && NaN != NaN
    return _.isNumber(obj) && obj !== +obj;
};

export default _