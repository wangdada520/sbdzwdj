import request from '@/utils/request'

// 回访管理记录功能模块路由
// 获取信访记录列表
export function getRecordList(data) {
  return request({
    url: `/api-zwdj-business/visit/visitManageRecord/list`,
    method: 'get',
    params: data
  })
}
