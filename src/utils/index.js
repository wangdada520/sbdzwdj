/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace(/\+/g, ' ') +
    '"}'
  )
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @param {Array} arr
 * @returns {Array}
 * 数组去重
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

/**
 * 表格高度自适应
 * obj（变更的值）
 * that（当前的this）
 * isonresize（是否需要判断窗口变化进行变化，空为支持）
 * number（需要减去的高度）
 */
export function listTable(obj, that, number, isonresize) {
  that.$nextTick(() => { // 页面渲染完成后的回调
    setTimeout(() => {
      that[obj] = tableHeight(that, number)
    }, 100)
  })
  /* if (!isonresize) {
    window.onresize = () => {
      return (() => {
        that[obj] = tableHeight(that, number)
      })()
    }
  }*/
}

/**
 * 表格高度统一配置
 */
export function tableHeight(that, number) {
  const thisNumber = number || 40
  return that.$refs.content.offsetHeight - (that.$refs.serach ? that.$refs.serach.offsetHeight : 0) - (that.$refs.pagination ? that.$refs.pagination.offsetHeight : 0) - Number(thisNumber)
}

/**
 * 处理undefind,null,''
 */
export function filterObject(data) {
  for (const key in data) {
    if (data[key] === undefined) {
      delete data[key]
    }
  }
  return data
}

/**
 * 获取当前年度的前几年
 * yearlengt需要获取当前年的前几年
 */
export function getNowyer() {
  var myDate = new Date()
  var endyear = myDate.getFullYear()
  var startyear = endyear - 5
  var newyer = []
  for (var i = startyear; i <= endyear; i++) {
    newyer.push(i)
  }
  return newyer
}

/**
 * 获取月份
 */
export function getMonth() {
  var result = []
  for (var i = 0; i < 12; i++) {
    result.push(i + 1)
  }
  return result
}

/**
 * 获取月份
 */
// 农历
let CalendarData = new Array(100)
const madd = new Array(12)
const tgString = '甲乙丙丁戊己庚辛壬癸'
const dzString = '子丑寅卯辰巳午未申酉戌亥'
const numString = '一二三四五六七八九十'
const monString = '正二三四五六七八九十冬腊'
const weekString = '日一二三四五六'
const sx = '鼠牛虎兔龙蛇马羊猴鸡狗猪'
let cYear, cMonth, cDay, TheDate
CalendarData = [0xA4B, 0x5164B, 0x6A5, 0x6D4, 0x415B5, 0x2B6, 0x957, 0x2092F, 0x497, 0x60C96, 0xD4A, 0xEA5, 0x50DA9, 0x5AD, 0x2B6, 0x3126E, 0x92E, 0x7192D, 0xC95, 0xD4A, 0x61B4A, 0xB55, 0x56A, 0x4155B, 0x25D, 0x92D, 0x2192B, 0xA95, 0x71695, 0x6CA, 0xB55, 0x50AB5, 0x4DA, 0xA5B, 0x30A57, 0x52B, 0x8152A, 0xE95, 0x6AA, 0x615AA, 0xAB5, 0x4B6, 0x414AE, 0xA57, 0x526, 0x31D26, 0xD95, 0x70B55, 0x56A, 0x96D, 0x5095D, 0x4AD, 0xA4D, 0x41A4D, 0xD25, 0x81AA5, 0xB54, 0xB6A, 0x612DA, 0x95B, 0x49B, 0x41497, 0xA4B, 0xA164B, 0x6A5, 0x6D4, 0x615B4, 0xAB6, 0x957, 0x5092F, 0x497, 0x64B, 0x30D4A, 0xEA5, 0x80D65, 0x5AC, 0xAB6, 0x5126D, 0x92E, 0xC96, 0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B, 0xA93, 0x40E95]
madd[0] = 0
madd[1] = 31
madd[2] = 59
madd[3] = 90
madd[4] = 120
madd[5] = 151
madd[6] = 181
madd[7] = 212
madd[8] = 243
madd[9] = 273
madd[10] = 304
madd[11] = 334

function GetBit(m, n) {
  return (m >> n) & 1
}
function e2c() {
  TheDate = (arguments.length !== 3) ? new Date() : new Date(arguments[0], arguments[1], arguments[2])
  let total, m, n, k
  let isEnd = false
  let tmp = TheDate.getYear()
  if (tmp < 1900) {
    tmp += 1900
  }
  total = (tmp - 1921) * 365 + Math.floor((tmp - 1921) / 4) + madd[TheDate.getMonth()] + TheDate.getDate() - 38

  if (TheDate.getYear() % 4 === 0 && TheDate.getMonth() > 1) {
    total++
  }
  for (m = 0; ; m++) {
    k = (CalendarData[m] < 0xfff) ? 11 : 12
    for (n = k; n >= 0; n--) {
      if (total <= 29 + GetBit(CalendarData[m], n)) {
        isEnd = true; break
      }
      total = total - 29 - GetBit(CalendarData[m], n)
    }
    if (isEnd) break
  }
  cYear = 1921 + m
  cMonth = k - n + 1
  cDay = total
  if (k === 12) {
    if (cMonth === Math.floor(CalendarData[m] / 0x10000) + 1) {
      cMonth = 1 - cMonth
    }
    if (cMonth > Math.floor(CalendarData[m] / 0x10000) + 1) {
      cMonth--
    }
  }
}

function GetcDateString() {
  var tmp = ''
  tmp += tgString.charAt((cYear - 4) % 10)
  tmp += dzString.charAt((cYear - 4) % 12)
  tmp += '('
  tmp += sx.charAt((cYear - 4) % 12)
  tmp += ')年 '
  if (cMonth < 1) {
    tmp += '(闰)'
    tmp += monString.charAt(-cMonth - 1)
  } else {
    tmp += monString.charAt(cMonth - 1)
  }
  tmp += '月'
  tmp += (cDay < 11) ? '初' : ((cDay < 20) ? '十' : ((cDay < 30) ? '廿' : '三十'))
  if (cDay % 10 !== 0 || cDay === 10) {
    tmp += numString.charAt((cDay - 1) % 10)
  }
  return tmp
}

export function GetLunarDay(solarYear, solarMonth, solarDay) {
  // solarYear = solarYear<1900?(1900+solarYear):solarYear;
  if (solarYear < 1921 || solarYear > 2020) {
    return ''
  } else {
    solarMonth = (parseInt(solarMonth) > 0) ? (solarMonth - 1) : 11
    e2c(solarYear, solarMonth, solarDay)
    return GetcDateString()
  }
}
/** js获取当前时间，并格式化为"yyyy-MM-dd HH:mm:ss"**/
export function getFormatDate() {
  var date = new Date()
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  var currentDate = date.getFullYear() + '-' + month + '-' + strDate +
    ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
  return currentDate
}
/**
 * 返回serach符合条件的value"
 * key:string类型,需要查询的条件
 * val:arry
 * **/
export function returnValue(key, val) {
  let values = ''
  if (val) {
    val.forEach(item => {
      if (item.serachvalue === key) {
        values = item.value
      }
    })
  }
  return values
}
