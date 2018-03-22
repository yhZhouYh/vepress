import TFRequest from '../request'


export function login(data){
   return TFRequest('/tf/auth/login', data)
}

export function quicklogin(data){
    return TFRequest('/tf/auth/quicklogin', data)
 }

export function captcha(data){
    return TFRequest('/tf/auth/captcha', data)
}