import request from '@/utils/request'
/**
 * 列表
 * */
export function getmessagePushRecordlist(data) {
  return request({
    url: `/api-message/message/messagePushRecord/list`,
    method: 'get',
    params: data
  })
}
/**
 * 删除推送设置管理
 * */
export function deletemessagePushRecord(id, data) {
  return request({
    url: `/api-message/message/messagePushRecord/${id}`,
    method: 'delete',
    data
  })
}
/**
 * 添加推送设置管理
 * */
export function addmessagePushRecord(data) {
  return request({
    url: `/api-message/message/messagePushRecord`,
    method: 'post',
    data
  })
}
/**
 * 修改推送设置管理
 * */
export function editmessagePushRecord(id, data) {
  return request({
    url: `/api-message/message/messagePushRecord/${id}`,
    method: 'put',
    data
  })
}
/**
 * 获取推送设置管理
 * */
export function getmessagePushRecord(id, data) {
  return request({
    url: `/api-message/message/messagePushRecord/${id}`,
    method: 'get',
    params: data
  })
}
