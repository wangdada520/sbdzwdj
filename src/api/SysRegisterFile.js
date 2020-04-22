import request from '@/utils/request'

// 获取列表数据
export function list(data) {
  return request({
    url: '/api-file-uploader/file/sysAccoperation/list',
    method: 'get',
    params: data
  })
}
// 根据字典编码获取字典值列表
export function getByDictCode(data) {
  return request({
    url: '/api-sys/sys/sysDictvalue/byDictCode',
    method: 'get',
    params: data
  })
}

// 删除
export function deleteSysAccoperation(id, data) {
  return request({
    url: `/api-file-uploader/file/sysAccoperation/${id}`,
    method: 'delete',
    data
  })
}

// 新增
export function addSysAccoperation(data) {
  return request({
    url: '/api-file-uploader/file/sysAccoperation',
    method: 'post',
    data
  })
}

// 查看详情
export function detialsSysAccoperation(id, data) {
  return request({
    url: `/api-file-uploader/file/sysAccoperation/${id}`,
    method: 'get',
    data
  })
}
