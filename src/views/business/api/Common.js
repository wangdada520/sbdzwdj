// 公用api
import request from '@/utils/request'

// 获取复杂详情
export function getDetail(data) {
  return request({
    url: `/api-zwdj-business/task/taskRecord/getDetail`,
    method: 'get',
    params: data
  })
}

// 获取工作汇报
export function getTaskReport(id) {
  return request({
    url: `/api-zwdj-business/taskReport/taskReport/${id}`,
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
// 根据汇报id获取审核详情（List）
export function getChecksByReportId(data) {
  return request({
    url: `/api-zwdj-business/taskCheck/taskCheck/getChecksByReportId`,
    method: 'get',
    params: data
  })
}

