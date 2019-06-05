import request from '@/utils/request'
export function policy(formData) {
  return request({
    url:'/common/uploadFile',
    method:'post',
    data:formData
  })
}
