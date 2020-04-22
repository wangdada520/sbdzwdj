import Cookies from 'js-cookie'

const TokenKey = 'token'
const Userid = 'userid'
const UserName = 'username'
const DepartmentName = 'departmentName'
const DepartmentId = 'departmentId'
const RoleId = 'RoleId'
const refreshToken = 'refreshToken'
const expirationTime = 'expirationTime' // 过期时间
// token
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setRefreshToken(token) {
  return Cookies.set(refreshToken, token)
}

export function getRefreshToken() {
  return Cookies.get(refreshToken)
}
// expirationTime
export function setExpirationTime(data) {
  return Cookies.set(expirationTime, data)
}

export function getExpirationTime() {
  return Cookies.get(expirationTime)
}
// user
export function getUserId() {
  return Cookies.get(Userid)
}
export function setUserId(userid) {
  return Cookies.set(Userid, userid)
}
// roleId
export function getRoleId() {
  return Cookies.get(RoleId)
}
export function setRoleId(roleId) {
  return Cookies.set(RoleId, roleId)
}
// userName
export function getUserName() {
  return Cookies.get(UserName)
}
export function setUserName(name) {
  return Cookies.set(UserName, name)
}
// departmentName
export function getDepartmentName() {
  return Cookies.get(DepartmentName)
}
export function setDepartmentName(name) {
  return Cookies.set(DepartmentName, name)
}
// departmentId
export function getDepartmentId() {
  return Cookies.get(DepartmentId)
}
export function setDepartmentId(id) {
  return Cookies.set(DepartmentId, id)
}
// examjson
export function examSetJson(Json) {
  return localStorage.setItem('examJson', JSON.stringify(Json))
}
// examgetjosn
export function examGetJson() {
  return localStorage.getItem('examJson')
}
