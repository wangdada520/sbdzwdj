import request from '@/utils/request'

// 回访管理功能模块路由

// 获取回访管理数据列表
export function getTaskList(data) {
  return request({
    url: `/api-zwdj-business/visit/visitManageRecord/getTaskList`,
    method: 'get',
    params: data
  })
}

// 添加信访记录
export function addVisitMan(data) {
  return request({
    url: `/api-zwdj-business/visit/visitManageRecord`,
    method: 'post',
    data
  })
}

// 获取信访记录
export function getManageRecord(id) {
  return request({
    url: `/api-zwdj-business/visit/visitManageRecord/${id}`,
    method: 'get'
  })
}

// 修改信访记录
export function putManageRecord(id, data) {
  return request({
    url: `/api-zwdj-business/visit/visitManageRecord/${id}`,
    method: 'put',
    data
  })
}
