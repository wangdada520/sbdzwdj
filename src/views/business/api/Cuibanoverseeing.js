/**
 * 催办督办api
 * */
import request from '@/utils/request'
/**
 * 获取催办/督办列表
 * */
export function getDBList(data) {
  return request({
    url: '/api-zwdj-business/taskReport/taskReport/getDBList',
    method: 'get',
    params: data
  })
}
/**
 * 添加催办督察记录
 * */
export function addsupervisionRecord(data) {
  return request({
    url: '/api-zwdj-business/supervision/supervisionRecord',
    method: 'post',
    data
  })
}
/**
 * 批量添加催办督察记录
 * */
export function addsupervisionRecordinsertList(data) {
  return request({
    url: '/api-zwdj-business/supervision/supervisionRecord/insertList',
    method: 'post',
    data
  })
}
/**
 * 添加催办督办常用语
 * */
export function addsupervisionCommonLanguage(data) {
  return request({
    url: '/api-zwdj-business/supervision/supervisionCommonLanguage',
    method: 'post',
    data
  })
}
/**
 * 获取催办督办常用语列表
 * */
export function getsupervisionCommonLanguagelist(data) {
  return request({
    url: '/api-zwdj-business/supervision/supervisionCommonLanguage/list',
    method: 'get',
    params: data
  })
}
/**
 * 获取催办督察记录列表
 * */
export function getsupervisionRecordlist(data) {
  return request({
    url: '/api-zwdj-business/supervision/supervisionRecord/list',
    method: 'get',
    params: data
  })
}
/**
 * 获取催办督察记录
 * */
export function getsupervisionRecord(id, data) {
  return request({
    url: `/api-zwdj-business/supervision/supervisionRecord/${id}`,
    method: 'get',
    params: data
  })
}
