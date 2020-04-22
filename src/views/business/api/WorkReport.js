import request from '@/utils/request'

// 工作汇报首页api

// 获取待汇报列表
export function getTaskReportList(data) {
  return request({
    url: `/api-zwdj-business/taskReport/taskReport/list`,
    method: 'get',
    params: data
  })
}

// 获取汇报
export function getTaskReportById(id) {
  return request({
    url: `/api-zwdj-business/taskReport/taskReport/${id}`,
    method: 'get'
  })
}

// 汇报
export function putTaskReport(id, data) {
  console.log(id)
  console.log(data)
  return request({
    url: `/api-zwdj-business/taskReport/taskReport/${id}`,
    method: 'put',
    data
  })
}
