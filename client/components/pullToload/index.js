import _throttle from "lodash/throttle";
export default class TfPullToLoad {
    constructor(options = {}) {
        this.scroller = document.querySelector(options.el)
        this.box = options.box ? document.querySelector(options.box) : window
        this.loadFunc = options.loadFunc
        this.delay = options.delay || 200
        this.gap = options.gap || 5
        this.load = false
        this.init()
    }
    init() {
        this.throFunc = _throttle(this.scrollFunc.bind(this), this.delay)
        this.box.addEventListener("scroll", this.throFunc);
    }
    destroy() {
        this.box.removeEventListener("scroll", this.throFunc);
    }
    scrollFunc() {
        let isBottom = this.getRect(this.scroller).isBottom;
        if (isBottom && !this.load) {
            this.load = true
            this.loadFunc()
        }
    }
    getRect(ele) {
        var inHeight = window.innerHeight,
            rect = ele.getBoundingClientRect();
        rect.isVisible = rect.top - inHeight < this.gap; // 是否在可视区域
        rect.isBottom = rect.bottom - inHeight <= this.gap; //弹性值
        return rect;
    }
}