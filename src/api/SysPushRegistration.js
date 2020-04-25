import request from '@/utils/request'
/**
 * 列表
 * */
export function getmessagePushSetlist(data) {
  return request({
    url: `/api-message/message/messagePushSet/list`,
    method: 'get',
    params: data
  })
}
/**
 * 删除推送设置注册
 * */
export function deletemessagePushSet(id, data) {
  return request({
    url: `/api-message/message/messagePushSet/${id}`,
    method: 'delete',
    data
  })
}
/**
 * 添加推送设置注册
 * */
export function addmessagePushSet(data) {
  return request({
    url: `/api-message/message/messagePushSet`,
    method: 'post',
    data
  })
}
/**
 * 修改推送设置注册
 * */
export function editmessagePushSet(id, data) {
  return request({
    url: `/api-message/message/messagePushSet/${id}`,
    method: 'put',
    data
  })
}
/**
 * 获取推送设置注册
 * */
export function getmessagePushSet(id, data) {
  return request({
    url: `/api-message/message/messagePushSet/${id}`,
    method: 'get',
    params: data
  })
}
