// 公用api
import request from '@/utils/request'

// 获取我关注的列表
export function Myattention(data) {
  return request({
    url: `/api-zwdj-business/concern/myConcern/list`,
    method: 'get',
    params: data
  })
}
// 我的关注列表
export function Mybranchedpassage(data) {
  return request({
    url: `/api-zwdj-business/task/taskRecord/myWorkList`,
    method: 'get',
    params: data
  })
}

