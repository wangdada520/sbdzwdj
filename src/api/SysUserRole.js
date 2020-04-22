import request from '@/utils/request'
// 获取例表数据
export function list(data) {
  return request({
    url: '/api-sys/sys/sysUsers/list',
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
    url: '/api-sys/sys/sysUsers',
    method: 'post',
    data
  })
}
// 修改
export function EditModule(id, data) {
  return request({
    url: `/api-sys/sys/sysUsers/${id}`,
    method: 'put',
    data
  })
}
// 删除
export function deletesysUsers(id, data) {
  return request({
    url: `/api-sys/sys/sysUsers/${id}`,
    method: 'delete',
    data
  })
}
// 给角色分配用例
export function allotRole(data) {
  return request({
    url: '/api-sys/sys/sysUserRole/distributionRoleForUser',
    method: 'post',
    data
  })
}
// 查看详情
export function getdetials(id, data) {
  return request({
    url: `/api-sys/sys/sysUsers/${id}`,
    method: 'get',
    data
  })
}
// 重置密码
export function RestPassword(data) {
  return request({
    url: '/api-sys/sys/sysUsers/resetPassword',
    method: 'post',
    data
  })
}
