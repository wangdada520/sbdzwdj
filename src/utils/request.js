import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'

import {
  getToken,
  getRoleId,
  getExpirationTime,
  getRefreshToken,
  setExpirationTime,
  setRefreshToken,
  setToken
} from '@/utils/auth'
import { baseUrl } from '@/utils/baseurl'
// create an axios instance
const service = axios.create({
  baseURL: baseUrl, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 200000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['token'] = getToken()
      config.headers['roleId'] = getRoleId()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // 刷新token
    /* if (res.data && res.data.access_token) {
      store.dispatch('user/saveToken', res.data.access_token)
    }*/
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      if (res.code === 3001) { // 百度人脸识别返回错误码
        return
      }
      if (res.code !== 1000) {
        Message({
          message: res.msg || 'error',
          type: 'error',
          duration: 5 * 1000
        })
      }
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 1000) {
        setExpirationTime('')
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      }
      return Promise.reject(res.code || 'error')
    } else {
      // console.log(Number(getExpirationTime()) + '缓存时间')
      // console.log(new Date().getTime() + '当前时间')
      // console.log(Number(getExpirationTime()) - new Date().getTime())
      if (Number(getExpirationTime()) - new Date().getTime() < (5 * 60 * 1000) && Number(getExpirationTime())) { // token时间快过期时提前5分钟触发得新设置操作
        axios.get(baseUrl + '/api-auth/auth/token/refreshToken', {
          params: {
            refreshToken: getRefreshToken()
          }
        })
          .then(function(response) {
            const data = response.data
            if (data.code === 200) {
              setToken(data.data.token)
              setRefreshToken(data.data.refreshToken)
              const Nowdata = new Date().getTime() + (data.data.tokenExpire * 1000) // 当前日期时间戳-服务器时间戳得到间隔时间
              setExpirationTime(Nowdata)
            } else {
              setExpirationTime('')
            }
          })
          .catch(function(error) {
            console.log(error)
          })
      }
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
