/**
 * 会议管理api
 * */
import request from '@/utils/request'
/**
 * 添加会议纪要
 * */
export function addtaskMeeting(data) {
  return request({
    url: '/api-zwdj-business/task/taskMeeting',
    method: 'post',
    data
  })
}
/**
 * 会议纪要列表
 * */
export function gettaskMeetinglist(data) {
  return request({
    url: '/api-zwdj-business/task/taskMeeting/list',
    method: 'get',
    params: data
  })
}
/**
 * 获取任务相关人列表
 * */
export function gettaskRelationshipPeoplelist(data) {
  return request({
    url: '/api-zwdj-business/task/taskRelationshipPeople/list',
    method: 'get',
    params: data
  })
}
/**
 * 获取会议纪要
 * */
export function gettaskMeeting(id, data) {
  return request({
    url: `/api-zwdj-business/task/taskMeeting/${id}`,
    method: 'get',
    params: data
  })
}
/**
 * 删除会议纪要
 * */
export function deletetaskMeeting(id, data) {
  return request({
    url: `/api-zwdj-business/task/taskMeeting/${id}`,
    method: 'delete',
    data
  })
}
