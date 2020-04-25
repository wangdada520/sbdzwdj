import request from '@/utils/request'

// 工作计划功能模块路由
// 获取工作计划列表
export function getPlanList(data) {
  return request({
    url: `/api-zwdj-business/work/workPlan/getPlanList`,
    method: 'get',
    params: data
  })
}

// 获取工作计划
export function getworkPlan(id) {
  return request({
    url: `/api-zwdj-business/work/workPlan/${id}`,
    method: 'get'
  })
}
// 添加工作计划
export function addworkPlan(data) {
  return request({
    url: `/api-zwdj-business/work/workPlan`,
    method: 'post',
    data
  })
}

// 修改工作计划
export function putworkPlan(id, data) {
  return request({
    url: `/api-zwdj-business/work/workPlan/${id}`,
    method: 'put',
    data
  })
}
