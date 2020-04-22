import request from '@/utils/request'
export function fetchLogs(params) {
  return request({
    url: '/api-sppy-business/work/workLogMark/list',
    method: 'get',
    params
  })
}

export function reviewLog(params) {
  return request({
    url: '/api-sppy-business/work/workLogMark/marking',
    method: 'post',
    data: params
  })
}

export function recommendPic(params) {
  return request({
    url: '/api-sppy-business/work/workLogMark/recommend',
    method: 'get',
    params
  })
}
