import request from '@/utils/request'
// 获取附件
export function acquireFile(id, data) {
  return request({
    url: `/api-file-uploader/file/sysAccessories/${id}`,
    method: 'get',
    data
  })
}
