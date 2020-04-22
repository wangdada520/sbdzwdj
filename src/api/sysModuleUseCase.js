import request from '@/utils/request'
// 获取菜单例表数据
export function list(id, data) {
  return request({
    url: `/api-sys/sys/sysModuleUseCase/AllListByModuleId/${id}`,
    method: 'get',
    params: {
      'pageNum': data.pageNum,
      'pageSize': data.pageSize,
      'search': data.search
    }
  })
}
// 修改用例
export function EditModule(id, data) {
  return request({
    url: `/api-sys/sys/sysModuleUseCase/${id}`,
    method: 'put',
    data
  })
}
// 删除用例
export function deleteSysModule(id, data) {
  return request({
    url: `/api-sys/sys/sysModuleUseCase/${id}`,
    method: 'delete',
    data
  })
}
// 新增用例
export function AddModule(data) {
  return request({
    url: '/api-sys/sys/sysModuleUseCase',
    method: 'post',
    data
  })
}
