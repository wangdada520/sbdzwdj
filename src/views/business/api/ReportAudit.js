import request from '@/utils/request'

// 审核首页api

// 获取审核列表
export function getTaskCheckList(data) {
  return request({
    url: `/api-zwdj-business/taskCheck/taskCheck/list`,
    method: 'get',
    params: data
  })
}

// 获取审核
export function getTaskCheckdetalis(id) {
  return request({
    url: `/api-zwdj-business/taskCheck/taskCheck/${id}`,
    method: 'get'
  })
}
// 通过id获取审核
export function getTaskCheck(id) {
  return request({
    url: `/api-zwdj-business/taskCheck/taskCheck/${id}`,
    method: 'get'
  })
}
// 审核
export function putCheckde(id, data) {
  console.log(id)
  console.log(data)
  return request({
    url: `/api-zwdj-business/taskCheck/taskCheck/${id}`,
    method: 'put',
    data
  })
}
