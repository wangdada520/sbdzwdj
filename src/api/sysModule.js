import request from '@/utils/request'
// 获取菜单例表数据
export function list(data) {
  return request({
    url: '/api-sys/sys/sysModule/list',
    method: 'get',
    params: {
      'pageNum': data.pageNum,
      'pageSize': data.pageSize,
      'search': data.search
    }
  })
}
// 修改菜单
export function EditModule(id, data) {
  return request({
    url: `/api-sys/sys/sysModule/${id}`,
    method: 'put',
    data
  })
}
// 删除菜单
export function deleteSysModule(id, data) {
  return request({
    url: `/api-sys/sys/sysModule/${id}`,
    method: 'delete',
    data
  })
}
// 新增菜单
export function AddModule(data) {
  return request({
    url: '/api-sys/sys/sysModule',
    method: 'post',
    data
  })
}
// 获取菜单
export function SysModuledetails(id, data) {
  return request({
    url: `/api-sys/sys/sysModule/${id}`,
    method: 'get',
    data
  })
}
// 通过父菜单ID获取下面的所有子级菜单集合
export function getListTree(pModuleId) {
  return request({
    url: '/api-sys/sys/sysModule/listByPModuleId',
    method: 'get',
    params: {
      'pModuleId': pModuleId
    }
  })
}
