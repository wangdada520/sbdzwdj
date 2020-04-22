import request from '@/utils/request'

// 单位推进情况

// 获取单位推进情况列表
export function getPogressList(data) {
  return request({
    url: `/api-zwdj-business/taskReport/taskReport/getPogressList`,
    method: 'get',
    params: data
  })
}
