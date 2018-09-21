const utils = {
  // 20160817-->2016年08月17日
  formatDate: (value) => {
    if (value) {
      return value.slice(4, 6) + '月' + value.slice(6, 8) + '日'
    }
  },
  // 两个时间差：天
  DateDiff: (checkTime1, checkTime2) => {
    return Math.floor((checkTime1 - checkTime2) / (24 * 60 * 60 * 1000))
  },
  // 格式化数据
  formatData: (value, fixed, unit) => {
    if (!!value || value === 0) {
      if (fixed || isFinite(fixed)) {
        if (unit) {
          return value.toFixed(fixed) + unit
        } else {
          return value.toFixed(fixed)
        }
      } else {
        if (unit) {
          return value + unit
        } else {
          return value
        }
      }
    } else {
      return '--'
    }
  },
  setLocalStorage: (key, val) => {
    window.localStorage.setItem(key, val)
  },
  getLocalStorage: (key) => {
    window.localStorage.getItem(key)
  },
  isBrowser: () => {
    var flag = 'android'
    var ua = window.navigator.userAgent.toLowerCase()
    if (ua.match(/MicroMessenger/i) === 'micromessenger') { // 是微信
      if (/(?:android)/.test(ua)) {
        console.log('Android')
        flag = 'android'
      } else {
        console.log('iphone')
        flag = 'iphone'
      } // ios终端
    } else {
      console.log(2)
    }
    return flag
  },
  /*
  获取URL中的参数值
   */
  getUrlParam: (name) => {
    var originUrl = window.location.href
    if (originUrl.indexOf('?from=singlemessage&isappinstalled=0') !== -1) {
      originUrl = originUrl.replace('?from=singlemessage&isappinstalled=0', '')
      if (originUrl.indexOf('?') === -1) {
        originUrl += '?from=singlemessage&isappinstalled=0'
      } else {
        originUrl += '&from=singlemessage&isappinstalled=0'
      }
    } else if (originUrl.indexOf('?from=singlemessage' !== -1)) {
      originUrl = originUrl.replace('?from=singlemessage', '')
      if (originUrl.indexOf('?') === -1) {
        originUrl += '?from=singlemessage'
      } else {
        originUrl += '&from=singlemessage'
      }
    }
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    // var r = window.location.search.substr(1).match(reg);
    var r = originUrl.substr(originUrl.indexOf('?') + 1).match(reg)
    if (r != null) {
      var v = String(unescape(r[2]))
      if (v.indexOf('#') === -1) {
        return v
      } else {
        return v.substr(0, v.indexOf('#'))
      }
    } else {
      return null
    }
  },
  // 设置cookie
  addCookie: (name, value, expiresHours) => {
    var date = new Date()
    expiresHours = expiresHours | 24 * 30
    if (expiresHours > 0) {
      date.setTime(date.getTime() + expiresHours * 3600 * 1000)
      document.cookie = name + '=' + value + ';expires=' + date.toGMTString() + ';path=/'
    }
  },
  // 获取cookie
  getCookie: (name) => {
    var strCookie = document.cookie
    var arrCookie = strCookie.split(';')
    for (var i = 0; i < arrCookie.length; i++) {
      var arr = arrCookie[i].split('=')
      if (arr[0].replace(/(^\s*)|(\s*$)/g, '') === name) {
        return arr[1]
      }
    }
    return ''
  },
  // 删除cookie
  deleteCookie: (name) => {
    var date = new Date()
    date.setTime(date.getTime() - 10000)
    document.cookie = name + '=v; expires=' + date.toGMTString() + ';path=/'
  },
  // 时间戳转为yyyy-mm-dd
  getNowtime: (data, detail) => {
    if (!data) {
      return ''
    }
    var date = new Date(data)
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    month = month < 10 ? ('0' + month) : month
    var day = date.getDate()
    day = day < 10 ? ('0' + day) : day
    var ymd = year + '-' + month + '-' + day
    if (!detail) {
      return ymd
    }
    var hour = date.getHours()
    hour = hour < 10 ? ('0' + hour) : hour
    var minu = date.getMinutes()
    minu = minu < 10 ? ('0' + minu) : minu
    var second = date.getSeconds()
    second = second < 10 ? ('0' + second) : second
    return ymd + ' ' + hour + ':' + minu + ':' + second
  },
  // 时间戳转为yyyy-mm-dd...*/
  getFormatTime: (data, detail) => {
    if (!data) {
      return ''
    }
    var date = new Date(data)
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    month = month < 10 ? ('0' + month) : month
    var day = date.getDate()
    day = day < 10 ? ('0' + day) : day
    var ymd = year + '-' + month + '-' + day

    var hour = date.getHours()
    hour = hour < 10 ? ('0' + hour) : hour
    var minu = date.getMinutes()
    minu = minu < 10 ? ('0' + minu) : minu
    var second = date.getSeconds()
    second = second < 10 ? ('0' + second) : second

    var xqValue = date.getDay()
    var xq = ''
    if (xqValue === 0) {
      xq = '周日'
    } else if (xqValue === 1) {
      xq = '周一'
    } else if (xqValue === 2) {
      xq = '周二'
    } else if (xqValue === 3) {
      xq = '周三'
    } else if (xqValue === 4) {
      xq = '周四'
    } else if (xqValue === 5) {
      xq = '周五'
    } else if (xqValue === 6) {
      xq = '周六'
    }
    if (detail === 'md') {
      return month + '月' + day + '日'
    }
    if (detail === 'm-d') {
      return month + '-' + day
    }
    if (detail === 'xq') {
      return xq
    }
    if (detail === 'hms') {
      return hour + ':' + minu + ':' + second
    }
    if (detail === 'hm') {
      return hour + ':' + minu
    }
    if (detail === 'mdhm') {
      return month + '-' + day + ' ' + hour + ':' + minu
    }
    if (detail === 'ymdhms') {
      return ymd + ' ' + hour + ':' + minu + ':' + second
    }
    if (detail === 'ymd') {
      return ymd
    }
    if (detail === 'ymdhm') {
      return year + '/' + month + '/' + day + ' ' + hour + ':' + minu
    }
    if (detail === 'dateStr') {
      return year + '' + month + day
    }
    if (detail === 'zdzb_time') {
      return year + '' + month + day + '-060101-223-8'
    }
    if (detail === 'ymd/') {
      return month + '/' + day + '/' + year
    }
    if (detail === 'ymd/hm') {
      return month + '/' + day + '/' + year + ' ' + hour + ':' + minu
    }
    if (detail === 'md/hm') {
      return month + '/' + day + ' ' + hour + ':' + minu
    }
    if (detail === 'y/m/d') {
      return year + '/' + month + '/' + day
    }
    if (detail === 'y-m-d') {
      return year + '-' + month + '-' + day
    }
    if (detail === 'y.m.d') {
      return year + '.' + month + '.' + day
    }
    if (detail === 'm/d') {
      return month + '/' + day
    }
    if (detail === 'y/m/d/hm') {
      return year + '/' + month + '/' + day + ' ' + hour + ':' + minu
    }
    if (detail === 'y.m') {
      return year + '.' + month
    }
    if (detail === 'm') {
      return month
    }
    if (detail === 'd') {
      return day
    }
    if (detail === 'md-hm') {
      return month + '月' + day + '日' + hour + ':' + minu
    }
    if (detail === 'yy-mm-dd') {
      return year + '年' + month + '月' + day + '日'
    }
  },
  // 单位换算
  getFormatUnit: (num) => {
    if (!Number(num) || isNaN(num)) {
      return 0
    }
    if (num > 10000 * 10000) {
      return (num / (10000 * 10000)).toFixed(2) + '亿'
    } else if (num > 10000) {
      return (num / 10000).toFixed(2) + '万'
    } else {
      return num
    }
  },
  dealUrlStr: (url, str) => {
    if (/\?/.test(url)) {
      return url + '&' + str
    } else {
      return url + '?' + str
    }
  },
  getStrDate: (str) => {
    return str.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
  },
  limitString: (str, rows, num, f) => {
    var width = document.body.scrollWidth - num
    var length = Math.floor(width / f) * rows - 2
    return (str.substring(0, length) + '...')
  }
}
export default utils
