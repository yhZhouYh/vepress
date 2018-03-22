// import fly from 'flyio'
import base64 from "base-64";
import './index.less'
import Message from '../message'
import { login, quicklogin, captcha } from './dao'

export default class LoginModal {

    constructor() {
        this.$modal = LoginModal.initLoginModalHtml()
        this.userInfo = {} //暴露出用户信息
        this.count = 60
        this.validWord = '获取验证码'
        this.isCount = false
        this.timer = null
        this.quickLogin = false
        if (!LoginModal.instantiated) {
            this.init()
            LoginModal.instantiated = true
        }
    }

    init() {
        var tt = document.querySelector('body').appendChild(this.$modal)
        var login_modl = document.querySelector('.tf_login_modal')
        var username = login_modl.querySelector('#username')
        var pass = login_modl.querySelector('#password')
        var loginBtn = login_modl.querySelector('.login-btns .tf-button')
        var validImg = login_modl.querySelector('.validImg')
        var validDiv = login_modl.querySelector('.valid-div')
        this.checkBox = login_modl.querySelector('.checkbox-original')
        var mobileLogin = login_modl.querySelector('.mobileLogin')
        var passLogin = login_modl.querySelector('.passLogin')
        var passGroups = login_modl.querySelector('.pass-groups')
        var mobileGroups = login_modl.querySelector('.mobile-groups')
        var mobileBtn = login_modl.querySelector('.mobile-groups .tf-button')
        var mobile = login_modl.querySelector('#mobile')
        var vali = login_modl.querySelector('#vali')
        var wechat = login_modl.querySelector('.wechat')
        wechat.addEventListener('click', () => {
            LoginModal.qrcode.style.display = 'block'
        })

        mobileLogin.addEventListener('click', () => {
            mobileLogin.style.display = 'none'
            passLogin.style.display = ''
            mobileGroups.style.display = ''
            passGroups.style.display = 'none'
            this.quickLogin = true
        })
        passLogin.addEventListener('click', () => {
            passLogin.style.display = 'none'
            mobileLogin.style.display = ''
            passGroups.style.display = ''
            mobileGroups.style.display = 'none'
            this.quickLogin = false
        })
        mobileBtn.addEventListener('click', async () => {
            if (!this.isCount) {
                var mobileValue = mobile.value.trim()
                if (!LoginModal.mobileRgx.test(mobileValue)) {
                    new Message('请输入正确的手机号', 'error')
                    return
                }
                this.countDown(mobileBtn)

                var data = await captcha({
                    mobile: mobileValue
                })
            }

        })
        if (LoginModal.getCookie('check-box')) {
            this.checkBox.checked = true
        }
        var vcode = login_modl.querySelector('#valicode')
        var icon = login_modl.querySelector('.icon')
        var imgSrc = validImg.getAttribute('src')
        validImg.addEventListener('click', () => {
            var timeStamp = +new Date()
            validImg.setAttribute('src', imgSrc + '?t=' + timeStamp)
        })
        var _this = this
        loginBtn.addEventListener('click', async () => {
            if (!this.quickLogin) {
                var account = username.value.trim()
                var password = base64.encode(pass.value.trim())
                if (!LoginModal.mobileRgx.test(account) && !LoginModal.emailRgx.test(account)) {
                    var a = new Message('请输入正确的手机号或者邮箱', 'error')
                    return
                }
                try {
                    var data = await login({
                        account,
                        password,
                        type: LoginModal.mobileRgx.test(account) ? 1 : 0,
                        vcode: vcode.value.trim()
                    })
                    this.showValid(data)
                } catch (err) {
                    // if ((err.code && err.code == 'A001006') || (err.msg && err.msg == '验证码错误')) {
                    //     validDiv.style.display = ''
                    // }
                    // var timeStamp = +new Date()
                    // validImg.setAttribute('src', imgSrc + '?t=' + timeStamp)
                }
                // debugger
                // if (data) {
                //     this.showValid(data)
                // }

                // showValid(validDiv, data)
            } else {
                var mobileValue = mobile.value.trim()
                var valCode = vali.value.trim()
                if (!LoginModal.mobileRgx.test(mobileValue)) {
                    new Message('请输入正确的手机号', 'error')
                    return
                }
                if (!valCode) {
                    new Message('请填写验证码', 'error')
                    return
                }
                try {
                    var data = await quicklogin({
                        f: '',
                        mobile: mobileValue,
                        tid: '',
                        valcode: valCode
                    })
                    this.showValid(data)
                } catch(err){
                    
                }

                // if (data) {
                //     this.showValid(data)
                // }

            }

        })
        icon.addEventListener('click', () => {
            this.close()
        })
    }
    showValid(data) {
        var token = data.token
        this.userInfo = data.userInfo
        this.userInfo.token = token
        var uid = this.userInfo.uid
        var days = 7
        if (this.checkBox.checked) {
            days = 365
            LoginModal.setCookie('check-box', true, days)
        }
        LoginModal.setCookie('tf-token', token, days)
        LoginModal.setCookie('tf-uid', uid, days)
        location.href = location.href
    }
    close() {
        this.$modal.remove()
        LoginModal.instantiated = false
    }

    countDown(dom) {
        this.timer = setInterval(() => {
            this.validWord = '重新发送' + --this.count + 's'
            this.isCount = true
            if (this.count == 0) {
                this.isCount = false
                this.count = 60
                this.validWord = '获取验证码'
                clearInterval(this.timer)
                this.timer = null
            }
            dom.innerHTML = this.validWord
        }, 1000)

    }

}


LoginModal.initLoginModalHtml = () => {
    var div = document.createElement('div')
    div.innerHTML = `
    <div class="tf_modal">
        <div class="tf_login">
            <div class="modal_overlay"></div> 
            <div class="tf_login_modal fadeInDown tf-animate">
                <svg class="icon" style="" viewBox="0 0 1024 1024" version="1.1" p-id="2435" width="200" height="200"><defs><style type="text/css"/></defs><path d="M891.264 901.248a30.784 30.784 0 0 1-21.76-9.024L128.256 150.976a30.72 30.72 0 1 1 43.52-43.52l741.312 741.312a30.848 30.848 0 0 1-21.824 52.48" p-id="2436"/><path d="M150.016 901.248a30.72 30.72 0 0 1-21.76-52.544l741.312-741.248a30.784 30.784 0 0 1 43.456 43.52L171.776 892.224a30.72 30.72 0 0 1-21.76 9.024" p-id="2437"/></svg>
                <div class="login_head">
                    <span>登录</span>
                    <span class="mobileLogin">手机验证码登录</span>
                    <span class="passLogin" style="display:none">密码登录</span>
                </div>
                <div class="input-groups pass-groups">
                    <input class="username" type="text" name="username" id="username" placeholder="邮箱/手机号"/>
                    <input class="password" type="password" name="password" id="password" placeholder="密码"/>
                    <div class="valid-div" style="display:none">
                        <input class="validcode" type="text" name="valicode" id="valicode" placeholder="验证码"/>
                        <img src="/tf/auth/captchaPic" class="validImg" title="点击更换"/>
                    </div>
                </div>
                <div class="input-groups mobile-groups" style="display:none">
                     <input class="username" type="text" name="mobile" id="mobile" placeholder="手机号"/>
                     <input class="validcode" type="text" name="vali" id="vali" placeholder="验证码"/>
                     <button type="button" class="tf-button tf-button--primary">
                        <span>获取验证码</span>
                    </button>
                </div>
                <div class="login-middle">
                    <label class="tf-checkbox">
                        <div for="checkbox-1" class="checkbox-input">
                            <input id="checkbox-1" type="checkbox" class="checkbox-original" value="下次免登录"/>
                            <span class="checkbox-inner"></span>
                            <span class="checkbox-label">下次免登录</span>
                        </div>
                    </label>
                    <a href="http://www.timeface.cn/forgot_password" class="forget-pass pull-right">忘记密码</a>
                </div>
                <div class="login-btns">
                    <button type="button" class="tf-button tf-button--primary">
                        <span>登录</span>
                    </button>
                </div>
                <div class="login-register">
                    没有账号，<a href="http://www.timeface.cn/register">立即注册>></a>
                </div>
                <div class="social-accounts">
                    <span>更多账号登录</span>
                    <a href="https://graph.qq.com/oauth2.0/show?which=Login&display=pc&response_type=token&client_id=101006551&scope=all&state=timeface&redirect_uri=http%3A%2F%2Fwww.timeface.cn%2Fthirdlogin%3Frurl%3Dhttp%253A%252F%252Fwww.timeface.cn%252Flogin%253Flogintype%253Dqq" class="qq" title="腾讯qq账号登录">
                        
                    </a>
                    <a href="https://api.weibo.com/oauth2/authorize?client_id=2889481671&scope=all&display=default&redirect_uri=http%3A%2F%2Fwww.timeface.cn%2Fthirdlogin%3Frurl%3Dhttp%253A%252F%252Fwww.timeface.cn%252Flogin%253Flogintype%253Dweibo" class="sina" title="微博账号登录">
                       
                    </a>
                    <a href="javascript:;" class="wechat" title="微信账号登录">
                        
                    </a>
                </div>
            </div> 
        </div>
    </div>
    `.trim()
    return div
}

LoginModal.setCookie = (c_name, value, expiredays) => {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + "=" + escape(value) +
        ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ";path=/";
}

LoginModal.getCookie = (c_name) => {
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            var c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}

LoginModal.createWeiXin = (() => {
    var js = document.createElement('script')
    var barcodeId = 'weixin' + Date.now()
    var div = document.createElement('div')
    LoginModal.qrcode = div
    div.setAttribute('class', 'wechatQrcode')
    div.id = barcodeId
    document.body.appendChild(div)
    div.addEventListener('mouseleave', () => {
        div.style.display = 'none'
    })
    js.onload = () => {
        // 重定向地址添加登录类型
        let callbackUrl = 'http://www.timeface.cn/thirdlogin?rurl=http://www.timeface.cn/login?logintype=weixin'
        //weixin传递的参数
        var weixinObj = new WxLogin({
            id: barcodeId,
            appid: 'wx59614bdff7202183',
            scope: 'snsapi_login',
            redirect_uri: encodeURIComponent(callbackUrl)
        })
    }
    js.src = 'https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js'
    document.body.appendChild(js)

})()



LoginModal.mobileRgx = /^(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/
LoginModal.emailRgx = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/

