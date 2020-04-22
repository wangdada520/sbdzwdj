import request from '@/utils/request'
// 获取信息分类例表数据
export function list(data) {
  return request({
    url: '/api-sys/news/newsCategory/list',
    method: 'get',
    params: {
      'pageNum': data.pageNum,
      'pageSize': data.pageSize,
      'search': data.search
    }
  })
}
// 修改分类
export function editNewsCategory(id, data) {
  return request({
    url: `/api-sys/news/newsCategory/${id}`,
    method: 'put',
    data
  })
}
// 删除分类
export function deleteNewsCategory(id, data) {
  return request({
    url: `/api-sys/news/newsCategory/${id}`,
    method: 'delete',
    data
  })
}
// 新增分类
export function addNewsCategory(data) {
  return request({
    url: '/api-sys/news/newsCategory',
    method: 'post',
    data
  })
}
// 获取分类
export function SysModuledetails(id, data) {
  return request({
    url: `/api-sys/news/newsCategory/${id}`,
    method: 'get',
    data
  })
}
// 根据ncpid获取子类所有的分类
export function listByNcpid(id) {
  return request({
    url: `/api-sys/news/newsCategory/listByNcpid`,
    method: 'get',
    params: {
      ncpid: id
    }
  })
}
