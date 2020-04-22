import request from '@/utils/request'

// 获取行政区域列表
export function SysArealist(id, data) {
  return request({
    url: `/api-sys/sys/sysArea/getlistByfParentId/${id}`,
    method: 'get',
    params: data
  })
}

// 获取所有单位集合
export function getUnitList() {
  return request({
    url: `/api-sppy-business/anonymous/evaluation/getUnitList`,
    method: 'get'
  })
}

// 获取部门
export function getSysDepartment(id, data) {
  return request({
    url: `/api-sys/sys/SysDepartment/${id}`,
    method: 'get',
    params: data
  })
}

// 根据字典编码获取字典值列表
export function getByDictCode(data) {
  return request({
    url: '/api-sys/sys/sysDictvalue/byDictCode',
    method: 'get',
    params: data
  })
}
// 通过父级id获取子集部门
export function getByParentDeptId(data) {
  return request({
    url: '/api-sys/sys/SysDepartment/list/getByParentDeptId',
    method: 'get'
  })
}
// 获取用户列表
export function sysUserslist(data) {
  return request({
    url: '/api-sys/sys/sysUsers/list',
    method: 'get',
    params: {
      'pageNum': data.pageNum,
      'pageSize': data.pageSize,
      'search': data.search
    }
  })
}
// 获取用户
export function getsysUsers(id, data) {
  return request({
    url: `/api-sys/sys/sysUsers/${id}`,
    method: 'get',
    params: data
  })
}
// 选人
export function getselectList(data) {
  return request({
    url: `/api-sys/sys/sysUsers/selectList`,
    method: 'get',
    params: data
  })
}
