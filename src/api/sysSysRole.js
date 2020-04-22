import request from '@/utils/request'
// 获取例表数据
export function list(data) {
  return request({
    url: '/api-sys/sys/sysSysRole/list',
    method: 'get',
    params: {
      'pageNum': data.pageNum,
      'pageSize': data.pageSize,
      'search': data.search
    }
  })
}
// 新增
export function AddModule(data) {
  return request({
    url: '/api-sys/sys/sysSysRole',
    method: 'post',
    data
  })
}
// 修改
export function EditModule(id, data) {
  return request({
    url: `/api-sys/sys/sysSysRole/${id}`,
    method: 'put',
    data
  })
}
// 删除
export function deleteSysModule(id, data) {
  return request({
    url: `/api-sys/sys/sysSysRole/${id}`,
    method: 'delete',
    data
  })
}
// 给角色分配用例
export function allotRole(data) {
  return request({
    url: '/api-sys/sys/sysSysRole/distributionSysSysRoleFunction',
    method: 'post',
    data
  })
}
// 根据roleId获取用例集合
export function getListByRoleId(data) {
  return request({
    url: '/api-sys/sys/sysSysRole/getListByRoleId',
    method: 'post',
    data
  })
}
