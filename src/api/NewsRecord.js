import request from '@/utils/request'
// 获取信息发布记录列表
export function nrlist(data) {
  return request({
    url: '/api-sys/news/newsRecord/list',
    method: 'get',
    params: {
      'pageNum': data.pageNum,
      'pageSize': data.pageSize,
      'search': data.search
    }
  })
}

// 删除信息发布
export function deleteNews(id, data) {
  return request({
    url: `/api-sys/news/newsRecord/${id}`,
    method: 'delete',
    data
  })
}

// 新增
export function addNewsRecord(data) {
  return request({
    url: '/api-sys/news/newsRecord',
    method: 'post',
    data
  })
}

// 获取
export function getNewsRecord(id, data) {
  return request({
    url: `/api-sys/news/newsRecord/${id}`,
    method: 'get',
    params: data
  })
}
// 修改
export function editNewsRecord(id, data) {
  return request({
    url: `/api-sys/news/newsRecord/${id}`,
    method: 'put',
    data
  })
}
// 修改发布状态
export function editNewsRecordStutas(id, stutas, data) {
  return request({
    url: `/api-sys/news/newsRecord/${id}/${stutas}`,
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
