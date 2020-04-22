import request from '@/utils/request'

// 获取列表数据
export function list(data) {
  return request({
    url: '/api-sys/sys/sysDict/list',
    method: 'get',
    params: {
      'pageNum': data.pageNum,
      'pageSize': data.pageSize,
      'search': data.search
    }
  })
}

// 新增
export function addSysDict(data) {
  return request({
    url: '/api-sys/sys/sysDict',
    method: 'post',
    data
  })
}

// 修改
export function editSysDict(id, data) {
  return request({
    url: `/api-sys/sys/sysDict/${id}`,
    method: 'put',
    data
  })
}

// 获取字典
export function getSysDict(id, data) {
  return request({
    url: `/api-sys/sys/sysDict/${id}`,
    method: 'get',
    data
  })
}

// 删除
export function deleteSysDict(id, data) {
  return request({
    url: `/api-sys/sys/sysDict/${id}`,
    method: 'delete',
    data
  })
}

// 修改字典值
export function editSysDictvalue(id, data) {
  return request({
    url: `/api-sys/sys/sysDictvalue/${id}`,
    method: 'put',
    data
  })
}

// 删除字典值
export function deleteSysDictvalue(id, data) {
  return request({
    url: `/api-sys/sys/sysDictvalue/${id}`,
    method: 'delete',
    data
  })
}

// 字典值新增
export function addSysDictvalue(data) {
  return request({
    url: '/api-sys/sys/sysDictvalue',
    method: 'post',
    data
  })
}
// 根据字典编码获取字典值列表,用于下拉选择字典值
export function byDictName(data) {
  return request({
    url: `/api-sys/sys/sysDictvalue/byDictCode`,
    method: 'get',
    params: {
      'dictcode': data.dictcode
    }
  })
}

// 字典值列表
export function DictvalueList(data) {
  return request({
    url: '/api-sys/sys/sysDictvalue/list',
    method: 'get',
    params: {
      'pageNum': data.pageNum,
      'pageSize': data.pageSize,
      'search': data.search
    }
  })
}
