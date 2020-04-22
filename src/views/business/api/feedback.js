import request from '@/utils/request'

// 代表反馈路由功能模块
// 获取代表反馈列表
export function getFeedbackList(data) {
  return request({
    url: `/api-zwdj-business/work/representativeFeedback/list`,
    method: 'get',
    params: data
  })
}

// 获取代表反馈
export function getFeedback(id) {
  return request({
    url: `/api-zwdj-business/work/representativeFeedback/${id}`,
    method: 'get'
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
