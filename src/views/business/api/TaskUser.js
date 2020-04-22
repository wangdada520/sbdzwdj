import request from '@/utils/request'

// 任务相关人路由功能模块
// 获取任务已选相关人员
export function getChosedList(data) {
  return request({
    url: `/api-zwdj-business/task/taskRelationshipPeople/getChosedList`,
    method: 'get',
    params: data
  })
}
