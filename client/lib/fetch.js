import 'es6-promise'
import 'whatwg-fetch'

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

function parseJSON(response) {
  return response.json()
}

var connect = {
  get(url, options) {
    const opts = {...options }
    opts.header = {
      ...opts.header
    }
    var dataString = JSON.stringify(opts.data)
    //模拟序列化
    var data = dataString.replace(/{/g, '').replace(/}/g, '').replace(/:/g, '=').replace(/,/g, '&').replace(/"/g, '')
    return fetch(url + '?' + data).then(checkStatus).then(parseJSON).then((res) => {
      if (res.code && res.code != '000') {
        throw new Error(res.code);
      } else {
        opts.success(res)
      }

    }).catch((err) => {
      if (Object.prototype.toString.call(opts.error) == '[object Function]') {
        opts.error(err.message)
      } else {
        console.log(err)
      }
    })
  },
  post(url, options) {
    // let ops = Object.assign({ method: 'post', headers: { 'Content-Type': 'application/json'} }, options)
    let opts = {
      method: 'post',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: {}
    }
    opts = Object.assign({},opts, options)
    if (opts.headers['Content-Type'] == 'application/x-www-form-urlencoded') {
      var data = opts.body
      opts.body = Object.keys(data).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
      }).join('&');
    }

    // opts.method = 'post'
    return fetch(url, opts).then(checkStatus).then(parseJSON).then((res) => {
      if (res.code != '000') {
        throw new Error(res.code);
      } else {
        opts.success(res)
      }
    }).catch((err) => {
      if (Object.prototype.toString.call(opts.error) == '[object Function]') {
        opts.error(err.message)
      } else {
        console.log(err)
      }
    })
  }

}
export default connect