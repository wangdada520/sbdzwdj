import request from '@/utils/request'

// 详情工作动态功能模块

// 获取催办督察记录
export function WorkTrend(data) {
  return request({
    url: `/api-zwdj-business/supervision/supervisionRecord/getListBySrTaskId`,
    method: 'get',
    params: data
  })
}
// 工作动态扣分记录
export function getListByTaskId(data) {
  return request({
    url: `/api-zwdj-business/assess/assessRecord/getListByTaskId`,
    method: 'get',
    params: data
  })
}
// 工作签收记录
export function getAcceptByTaskId(data) {
  return request({
    url: `/api-zwdj-business/taskAccept/taskAccept/getAcceptByTaskId`,
    method: 'get',
    params: data
  })
}
// 获取工作动态签收情况
export function FocusonRecordList(data) {
  return request({
    url: `/api-zwdj-business/taskAccept/taskAccept/getAcceptByTaskId`,
    method: 'get',
    params: data
  })
}
// 获取领导关注记录
export function getTaskFocusRecord(data) {
  return request({
    url: `/api-zwdj-business/concern/myConcern/getTaskFocusRecord`,
    method: 'get',
    params: data
  })
}
// 获取领导浏览记录
export function selTaskRecord(data) {
  return request({
    url: `/api-zwdj-business/leaderBrowsingRecord/leaderBrowsingRecord/selTaskRecord`,
    method: 'get',
    params: data
  })
}

