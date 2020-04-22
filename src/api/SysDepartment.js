import request from '@/utils/request'
// 获取例表数据
export function list(data) {
  return request({
    url: '/api-sys/sys/SysDepartment/list',
    method: 'get',
    params: {
      'pageNum': data.pageNum,
      'pageSize': data.pageSize,
      'search': data.search
    }
  })
}// 获取部门
export function getSysDepartment(id, data) {
  return request({
    url: `/api-sys/sys/SysDepartment/${id}`,
    method: 'get',
    params: data
  })
}
// 新增
export function AddModule(data) {
  return request({
    url: '/api-sys/sys/SysDepartment',
    method: 'post',
    data
  })
}
// 修改
export function EditModule(id, data) {
  return request({
    url: `/api-sys/sys/SysDepartment/${id}`,
    method: 'put',
    data
  })
}
// 删除
export function deleteSysModule(id, data) {
  return request({
    url: `/api-sys/sys/SysDepartment/${id}`,
    method: 'delete',
    data
  })
}

