import request from '@/utils/request'

// 详情办理详情功能模块

// 获取办理列表
export function Transaction(data) {
  return request({
    url: `/api-zwdj-business/taskReport/taskReport/getListByTaskId`,
    method: 'get',
    params: data
  })
}
// 添加任务评价
export function taskComment(data) {
  return request({
    url: `/api-zwdj-business/comm/taskComment`,
    method: 'post',
    data
  })
}
// 获取任务评价
export function getCommentList(data) {
  return request({
    url: `/api-zwdj-business/comm/taskComment/getCommentList`,
    method: 'get',
    params: data
  })
}

