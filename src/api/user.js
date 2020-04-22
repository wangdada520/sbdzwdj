import request from '@/utils/request'
import { getUserId } from '@/utils/auth'
export function login(data) {
  return request({
    url: '/api-auth/auth/token/getToken',
    method: 'get',
    params: {
      'password': data.password,
      'userName': data.username,
      'verCode': data.verCode
    }
  })
}

export function getInfo(roleId) {
  return request({
    url: '/api-sys/sys/account/getMenuList',
    method: 'get',
    params: {
      id: getUserId(),
      roleId: roleId // 角色id
    }

  })
}
// 获取用例
export function getRorls(roleId) {
  return request({
    url: '/api-sys/sys/account/myModuleusecaseByModuleId',
    method: 'get',
    params: {
      roleId: roleId // 角色id
    }
  })
}
// 获取用户的角色列表
export function getRoleList() {
  return request({
    url: '/api-sys/sys/account/getRoleList',
    method: 'get'
  })
}
// 获取图像验证码
export function getCaptcha(userName) {
  return request({
    url: '/api-auth/auth/token/getCaptcha',
    method: 'get',
    params: {
      userName: userName
    }
  })
}
// 修改密码
export function updateUsernewPassword(data) {
  return request({
    url: '/api-sys/sys/sysUsers/changePassword',
    method: 'post',
    data
  })
}
