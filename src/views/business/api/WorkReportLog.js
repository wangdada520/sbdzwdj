import request from '@/utils/request'

// 工作汇报记录api

// 获取汇报记录列表
export function getrecordList(data) {
  return request({
    url: `/api-zwdj-business/taskReport/taskReport/recordList`,
    method: 'get',
    params: data
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
