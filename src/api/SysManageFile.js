import request from '@/utils/request'

// 获取列表数据
export function list(data) {
  return request({
    url: '/api-file-uploader/file/sysAccessories/list',
    method: 'get',
    params: data
  })
}

// 获取列表数据
export function GetFile(id, data) {
  return request({
    url: `/api-file-uploader/file/sysAccessories/${id}`,
    method: 'get',
    data
  })
}
