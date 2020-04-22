import request from '@/utils/request'

// 绩效考核
// 获取绩效考核设置列表
export function getAssessSetlist(data) {
  return request({
    url: `/api-zwdj-business/assess/assessSet/list`,
    method: 'get',
    params: data
  })
}
// 获取绩效考核记录列表
export function getAssessRecord(data) {
  return request({
    url: `/api-zwdj-business/assess/assessRecord/list`,
    method: 'get',
    params: data
  })
}

// 添加绩效考核记录
export function addAssessRecord(data) {
  return request({
    url: `/api-zwdj-business/assess/assessRecord`,
    method: 'post',
    data
  })
}

// 删除绩效考核记录
export function deleteList(id, data) {
  return request({
    url: `/api-zwdj-business/assess/assessRecord/${id}`,
    method: 'delete',
    data
  })
}

// 获取绩效考核记录
export function getDetalis(id) {
  return request({
    url: `/api-zwdj-business/assess/assessRecord/${id}`,
    method: 'get'
  })
}

// 修改绩效考核记录
export function modifileForm(id, data) {
  return request({
    url: `/api-zwdj-business/assess/assessRecord/${id}`,
    method: 'put',
    data
  })
}
