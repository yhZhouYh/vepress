import ax from 'axios'
import queryString from '../../lib/querystring'
import message from '../message'
// import LoginModal from './modal'


var request = {}
export default function TFRequest(url, data, options) {
    if (!request[url]) {
        request[url] = {
            loading: false
        }
    }

    return new Promise((resolve, reject) => {
        options = Object.assign({}, { methods: 'post' }, options);
        if (options.form) {
            data = queryString.stringify(data)
        }
        ax[options.methods](url, data, {
            headers: { ...options.headers }
        }).then(res => {
            if (res.data.code == '000') {
                resolve(res.data.data)
            } else {
                resolve(res.data)
            }
        }).catch(error => {

            // console.log(error)
            var errRes = error.response
            switch (errRes.status) {
                case 401:
                    // new LoginModal()
                    reject(errRes.data)
                    break;
                case 500:
                    new message('网络繁忙，请稍后')
                    break;
                case 400:
                    new message(errRes.data.msg, 'warn')
                    // reject(errRes.data)
                    break;
                default:
                    if (errRes.data) {
                        new message(errRes.data.msg, 'warn')
                    } else {
                        new message('网络繁忙，请稍后')
                    }
                    reject(errRes.data)
            }
        })

    })
}

