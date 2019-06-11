import request from '@/utils/request'
const IMAGE_HOST = '"http://cdn.liangwenquan.top/"';
export function policy(formData) {
  return request({
    url:'/common/uploadFile',
    method:'post',
    data:formData
  })
}
