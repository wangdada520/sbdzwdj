import request from '@/utils/request'

// 工作沟通路由功能模块

// 获取工作沟通列表
export function getWorkList(data) {
  return request({
    url: `/api-zwdj-business/work/workFeedback/getWorkList`,
    method: 'get',
    params: data
  })
}

// 添加工作沟通
export function addworkFeedback(data) {
  return request({
    url: `/api-zwdj-business/work/workFeedback`,
    method: 'post',
    data
  })
}

// 获取工作沟通
export function getworkFeedback(id) {
  return request({
    url: `/api-zwdj-business/work/workFeedback/${id}`,
    method: 'get'
  })
}
