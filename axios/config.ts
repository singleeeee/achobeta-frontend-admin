import qs from 'qs'
import type { AxiosResponse, InternalAxiosRequestConfig } from './types'
import { objToFormData } from '@/utils'
import { TRANSFORM_REQUEST_DATA } from '@/constants'

function defaultRequestInterceptors(config: InternalAxiosRequestConfig) {
  if (
    config.method === 'post'
    && config.headers['Content-Type'] === 'application/x-www-form-urlencoded'
  )
    config.data = qs.stringify(config.data)
  else if (
    TRANSFORM_REQUEST_DATA
    && config.method === 'post'
    && config.headers['Content-Type'] === 'multipart/form-data'
    && !(config.data instanceof FormData)
  )
    config.data = objToFormData(config.data)

  if (config.method === 'get' && config.params) {
    let url = config.url as string
    url += '?'
    const keys = Object.keys(config.params)
    for (const key of keys) {
      if (config.params[key] !== void 0 && config.params[key] !== null)
        url += `${key}=${encodeURIComponent(config.params[key])}&`
    }
    url = url.substring(0, url.length - 1)
    config.params = {}
    config.url = url
  }
  return config
}

function defaultResponseInterceptors(response: AxiosResponse) {
  if (response?.config?.responseType === 'blob') {
    // 如果是文件流，直接过
    return response
  }

  const sendedContent: { params: any, data: any } = { params: {}, data: {} }
  try {
    sendedContent.params = response.config.params
    sendedContent.data = JSON.parse(response.config.data)
  }
  catch {
    sendedContent.data = response.config.data
  }

  console.log(response.config.url, sendedContent, response.data)
  return response.data
}

export { defaultRequestInterceptors, defaultResponseInterceptors }
