/**
 * 工作交办api
 * */
import request from '@/utils/request'
/**
 * 获取任务主表列表
 * */
export function gettaskRecordlist(data) {
  return request({
    url: '/api-zwdj-business/task/taskRecord/list',
    method: 'get',
    params: data
  })
}
/**
 * 新增、编辑任务
 * */
export function addtaskRecordsaveTask(data) {
  return request({
    url: '/api-zwdj-business/task/taskRecord/saveTask',
    method: 'post',
    data
  })
}
/**
 * 复杂详情
 * */
export function gettaskRecordDetail(data) {
  return request({
    url: '/api-zwdj-business/task/taskRecord/getDetail',
    method: 'get',
    params: data
  })
}
/**
 * 工作交办列表
 * */
export function getMyListtaskRecord(data) {
  return request({
    url: '/api-zwdj-business/task/taskRecord/getMyList',
    method: 'get',
    params: data
  })
}
/**
 * 任务派发
 * */
export function addsendTasktaskRecord(data) {
  return request({
    url: '/api-zwdj-business/task/taskRecord/sendTask',
    method: 'get',
    params: data
  })
}
/**
 * 删除任务主表
 * */
export function deletetaskRecord(id, data) {
  return request({
    url: `/api-zwdj-business/task/taskRecord/${id}`,
    method: 'delete',
    data
  })
}
/**
 * 工作台账列表
 * */
export function gettaskRecordsearchList(data) {
  return request({
    url: `/api-zwdj-business/task/taskRecord/searchList`,
    method: 'get',
    params: data
  })
}
