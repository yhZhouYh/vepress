// import Observer from './observer'
import ArtTemplate from './art-template'

export default class TfConvert {
    constructor(options) {
        this.$el = isElementNode(options.el) ? options.el : document.querySelector(options.el)
        this.$refs = {

        }
        this.template = options.template
        this.data = options.data
        this.methods = options.methods
        this.init()

    }

    init() {
        var html = ArtTemplate.render(this.template, this.data)
        var domDiv = this.createElement(html)
        this.fragment = this.node2Fragment(domDiv)
        this.compileElement(this.fragment)
        this.$el.appendChild(this.fragment)

    }
    node2Fragment(el) {
        //创建文档碎片
        let fragment = document.createDocumentFragment()
        Array.from(el.childNodes).map((item, index) => {
            //向文档碎片里添加dom节点
            fragment.appendChild(item.cloneNode(true)) //复制原子节点，不然就会剪切掉原el
        })
        return fragment
    }
    createElement(html) {
        var div = document.createElement('div')
        div.innerHTML = html
        return div
    }
    compileElement(el) {
        let childNodes = el.childNodes
        var _this = this
        Array.from(childNodes).map((node) => {
            let text = node.textContent
            let reg = /\{\{(.*)\}\}/ //{{}}
            if (isElementNode(node)) {
                _this.compile(node)
            }
            //递归编译
            if (node.childNodes && node.childNodes.length) {
                _this.compileElement(node);
            }
        })
    }
    compile(node) {
        let _this = this
        let nodeAttrs = node.attributes;
        [...nodeAttrs].forEach((attr) => {
            let attrName = attr.name
            let eventType = isEventDirective(attrName)
            let methodName = ''
            let params = []
            let reg = /\([\s\S]*?\)/
            let attrValue = attr.value
            if (attrName == 'ref') {
                this.$refs[attrValue] = node
            }
            if (eventType) {
                let matches = attrValue.match(reg)
                if (matches == null) {
                    methodName = attrValue
                } else {
                    methodName = attrValue.split(reg)[0]
                    let text = matches[0]
                    let s = text.indexOf('(')
                    let e = text.lastIndexOf(')')
                    params = text.substring(s + 1, e).split(',')
                }
                node.addEventListener(eventType, (e) => {
                    _this.methods[methodName].call(_this, ...params, e)
                }, false);
                node.removeAttribute(attrName);
            }

        })
    }
}

function isElementNode(node) {
    return node.nodeType == 1
}

// function isEventDirective (dir) {
//     return dir.indexOf('on-') == 0
// }

function isEventDirective(attr) {
    var reg = /on-(abort|blur|cancel|canplay|canplaythrough|change|click|close|contextmenu|cuechange|dblclick|drag|dragend|dragenter|dragleave|dragover|dragstart|drop|durationchange|emptied|ended|error|focus|input|invalid|keydown|keypress|keyup|load|loadeddata|loadedmetadata|loadstart|mousedown|mouseenter|mouseleave|mousemove|mouseout|mouseover|mouseup|mousewheel|pause|play|playing|progress|ratechange|reset|resize|scroll|seeked|seeking|select|show|stalled|submit|suspend|timeupdate|toggle|volumechange|waiting|autocomplete|autocompleteerror|beforecopy|beforecut|beforepaste|copy|cut|paste|search|selectstart|wheel|webkitfullscreenchange|webkitfullscreenerror|touchstart|touchmove|touchend|touchcancel|pointerdown|pointerup|pointercancel|pointermove|pointerover|pointerout|pointerenter|pointerleave|Abort|Blur|Cancel|CanPlay|CanPlayThrough|Change|Click|Close|ContextMenu|CueChange|DblClick|Drag|DragEnd|DragEnter|DragLeave|DragOver|DragStart|Drop|DurationChange|Emptied|Ended|Error|Focus|Input|Invalid|KeyDown|KeyPress|KeyUp|Load|LoadedData|LoadedMetadata|LoadStart|MouseDown|MouseEnter|MouseLeave|MouseMove|MouseOut|MouseOver|MouseUp|MouseWheel|Pause|Play|Playing|Progress|RateChange|Reset|Resize|Scroll|Seeked|Seeking|Select|Show|Stalled|Submit|Suspend|TimeUpdate|Toggle|VolumeChange|Waiting|AutoComplete|AutoCompleteError|BeforeCopy|BeforeCut|BeforePaste|Copy|Cut|Paste|Search|SelectStart|Wheel|WebkitFullScreenChange|WebkitFullScreenError|TouchStart|TouchMove|TouchEnd|TouchCancel|PointerDown|PointerUp|PointerCancel|PointerMove|PointerOver|PointerOut|PointerEnter|PointerLeave)/g
    var matches = reg.exec(attr)
    if (matches == null) {
        return
    } else {
        return matches[1]
    }
}