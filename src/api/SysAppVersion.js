import request from '@/utils/request'

// 获取列表数据
export function list(data) {
  return request({
    url: '/api-sys/sys/sysVersion/list',
    method: 'get',
    params: {
      'pageNum': data.pageNum,
      'pageSize': data.pageSize,
      'search': data.search
    }
  })
}

// 删除
export function deleteSysVersion(id, data) {
  return request({
    url: `/api-sys/sys/sysVersion/${id}`,
    method: 'delete',
    data
  })
}

// 新增
export function addSysVersion(data) {
  return request({
    url: '/api-sys/sys/sysVersion',
    method: 'post',
    data
  })
}

// 修改
export function editSysVersion(id, data) {
  return request({
    url: `/api-sys/sys/sysVersion/${id}`,
    method: 'put',
    data
  })
}

// 获取SysVersion
export function getSysVersion(id, data) {
  return request({
    url: `/api-sys/sys/sysVersion/${id}`,
    method: 'get',
    data
  })
}
