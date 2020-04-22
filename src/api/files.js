import request from '@/utils/request'

// 获取附件
export function queryFile(data) {
  return request({
    url: '/api-file-uploader/file/sysAccessories/queryFile',
    method: 'get',
    params: data
  })
}
// 根据id直接获得附件
export function queryFileid(id, data) {
  return request({
    url: `/api-file-uploader/file/sysAccessories/${id}`,
    method: 'get',
    params: data
  })
}
