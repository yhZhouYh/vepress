module.exports = class Marquee {
    constructor(options) {
        this.interval = options.interval || 2000
        this.duration = options.duration || 300
        this.direction = options.direction || 'up'
        this.itemHeight = 0
        this.itemWidth = 0
        this.currenTranslateY = 0
        this.height = options.height
        this.length = 0
        this.currentIndex = 0
        this.noAnimate = false
        this.timer = ''
        this.cloneNode = ''
        this.ele = options.ele
        this.destroy()
        this.init()
        this.start()
    }
    destroy() {
        this.timer && clearInterval(this.timer)
    }
    init() {
        this.destroy()
        if (this.cloneNode) {
            this.ele.removeChild(this.cloneNode)
        }
        this.cloneNode = null
        let firstItem = this.ele.firstElementChild
        if (!firstItem) {
            return false
        }
        this.length = this.ele.children.length
        this.height = this.itemHeight || firstItem.offsetHeight
        this.width = this.itemWidth || firstItem.offsetWidth
        if (this.direction === 'up' || this.direction === 'left') {
            this.cloneNode = firstItem.cloneNode(true)
            this.ele.appendChild(this.cloneNode)
        } else {
            this.cloneNode = this.ele.lastElementChild.cloneNode(true)
            this.ele.insertBefore(this.cloneNode, firstItem)
        }
        return true
    }
    start() {

        if (this.direction === 'down') this.go(false)
        this.timer = setInterval(() => {

            if (this.direction === 'up') {
                this.currentIndex += 1
                this.currenTranslate = -this.currentIndex * this.height
            } else if(this.direction === 'down'){
                this.currentIndex -= 1
                this.currenTranslate = -(this.currentIndex + 1) * this.height
            }else if(this.direction === 'left'){
                this.currentIndex += 1
                this.currenTranslate = -this.currentIndex * this.width
            }else{
                this.currentIndex -= 1
                this.currenTranslate = -(this.currentIndex + 1) * this.width
            }
            if (this.direction === 'up' || this.direction === 'down') {
                this.ele.style.transform = 'translate3d(0,' + this.currenTranslate + 'px, 0)'
            } else {
                this.ele.style.transform = 'translate3d(' + this.currenTranslate + 'px,0 ,0)'
            }

            this.ele.style.transition = 'transform ' + this.duration + 'ms'

            if (this.currentIndex === this.length) {
                setTimeout(() => {
                    this.go(true)
                }, this.duration)
            } else if (this.currentIndex === -1) {
                setTimeout(() => {
                    this.go(false)
                }, this.duration)
            } else {
                this.noAnimate = false
            }
        }, this.interval + this.duration)
    }
    go(toFirst) {
        this.noAnimate = true
        if (toFirst) {
            this.currentIndex = 0
            this.currenTranslate = 0

        } else {
            this.currentIndex = this.length - 1
            this.currenTranslate = -(this.currentIndex + 1) * ((this.direction=== 'up' || this.dirction === 'down') ?this.height: this.width)
        }
        if (this.direction === 'up' || this.direction === 'down') {
            this.ele.style.transform = 'translate3d(0,' + this.currenTranslate + 'px, 0)'
        } else {
            this.ele.style.transform = 'translate3d(' + this.currenTranslate + 'px,0 ,0)'
        }
        this.ele.style.transition = ''
    }
}
