import request from '@/utils/request'

// 工作签收api

// 获取任务相关人列表
export function getPeoplelist(data) {
  return request({
    url: `/api-zwdj-business/task/taskRelationshipPeople/list`,
    method: 'get',
    params: data
  })
}

// 获取签收列表
export function getTaskAcceptList(data) {
  return request({
    url: `/api-zwdj-business/taskAccept/taskAccept/list`,
    method: 'get',
    params: data
  })
}
// 获取签收详情
export function getDetail(data) {
  return request({
    url: `/api-zwdj-business/task/taskRecord/getDetail`,
    method: 'get',
    params: data
  })
}

// 签收
export function putSign(data) {
  return request({
    url: `/api-zwdj-business/taskAccept/taskAccept/accept`,
    method: 'put',
    data
  })
}
