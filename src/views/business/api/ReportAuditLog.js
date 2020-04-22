// 汇报审核记录api
import request from '@/utils/request'

// 获取单位推进情况列表
export function getrecordList(data) {
  return request({
    url: `/api-zwdj-business/taskCheck/taskCheck/recordList`,
    method: 'get',
    params: data
  })
}
