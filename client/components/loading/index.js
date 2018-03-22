
import './index.css'
var html = '<div class="loadingMan"></div>'
var speed = {
    '1': '1000ms',
    '2': '700ms',
    '3': '500ms'
}
export default class Loading{
    constructor(options){
        this.el = document.querySelector(options.el)
        this.loadingMan = this.createLoading()
        this.width = options.width || '2rem'
        this.height =  this.width
        this.background  = '14rem 2rem'
        this.duration = options.speed || '2'
        this.init()
    }
    init(){
        let num = parseInt(this.width)
        let unit = this.width.slice((num + '').length)
        this.loadingMan.style.backgroundSize = num * 7 + unit + ' ' + this.height
        this.loadingMan.style.width = this.width
        this.loadingMan.style.height = this.width
        this.loadingMan.style.animationDuration = speed[this.duration]
        this.loadingMan.style.webkitAnimationDuration = speed[this.duration]
        this.el.appendChild(this.loadingMan)
    }
    hide(){
        this.loadingMan.style.display = 'none'
    }
    show(){
        this.loadingMan.style.display = ''
    }
    createLoading(){
        var div = document.createElement('div')
        div.setAttribute('class', 'loadingMan')
        return div
    }
}