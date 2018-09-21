// 引用utils
import utils from '../utils/index.js'
// 配置API接口地址
var root = process.env.API_ROOT
// 引用axios
var axios = require('axios')
// 自定义判断元素类型JS
function toType (obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
// 参数过滤函数
function filterNull (o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}
let utoken = utils.getUrlParam('token') // 获取token  存在的话 设置 token
if (utoken) {
  utils.addCookie('utoken', utoken)
} else {
  utils.deleteCookie('utoken')
}

/*
  接口处理函数
  这个函数每个项目都是不一样的，我现在调整的是适用于
  https://cnodejs.org/api/v1 的接口，如果是其他接口
  需要根据接口的参数进行调整。参考说明文档地址：
  https://cnodejs.org/topic/5378720ed6e2d16149fa16bd
  主要是，不同的接口的成功标识和失败提示是不一致的。
  另外，不同的项目的处理方法也是不一致的，这里出错就是简单的alert
*/
// import { Indicator } from 'mint-ui';
// import { Toast } from 'mint-ui';

function apiAxios (method, url, params, success, failure) {
  if (params) {
    params = filterNull(params)
  }
  let token = utils.getCookie('token')

  axios({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
    baseURL: root,
    withCredentials: false,
    headers: {'Content-Type': 'application/json', 'channel': 'qkz', 'Authorization': token, 'appenv': 'h5'}
  })
    .then(function (res) {
      // console.log(res);
      // res.code == 99982 && token
      if (res.data.msg === 'SUCCESS') {
        if (success) {
          success(res.data)
        }
      } else if (res.data.code === 999992) {
        success(res.data)
      } else if (res.data.code === 999991 || res.data.code === 99999) {
        success(res.data)
      } else {
        if (failure) {
          failure(res.data)
        } else {
          // console.log(res.data)
          if (res.data.code === 99982) {
            // utils.appLogin();
            success(res.data)
          } else {
            // window.alert('error: ' + JSON.stringify(res.data))
          }
        }
      }
    })
    .catch(function (err) {
      var msg = err.response
      if (err) {
        console.log(msg)
        //   window.alert('api error, HTTP CODE: ' + res.status)
      }
    })
}

// 返回在vue模板中的调用接口
export default {
  get: function (url, params, success, failure) {
    return apiAxios('GET', url, params, success, failure)
  },
  post: function (url, params, success, failure) {
    return apiAxios('POST', url, params, success, failure)
  },
  put: function (url, params, success, failure) {
    return apiAxios('PUT', url, params, success, failure)
  },
  delete: function (url, params, success, failure) {
    return apiAxios('DELETE', url, params, success, failure)
  }
}