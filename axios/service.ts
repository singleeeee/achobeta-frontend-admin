import { message } from 'ant-design-vue'
import type { AxiosError } from 'axios'
import axios from 'axios'
import { defaultRequestInterceptors, defaultResponseInterceptors } from './config'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, RequestConfig } from './types'
import { useUserStore } from '~/stores/modules/userStore'
import { responseCode } from '@/constants/responseCode'
import { REQUEST_TIMEOUT } from '@/constants'

const config = useRuntimeConfig()
export const PATH_URL = config.public.API_BASE_PATH

const abortControllerMap: Map<string, AbortController> = new Map()
const axiosInstance: AxiosInstance = axios.create({
  timeout: REQUEST_TIMEOUT,
  baseURL: PATH_URL,
})

axiosInstance.interceptors.request.use((res: InternalAxiosRequestConfig) => {
  const controller = new AbortController()
  const url = res.url || ''
  res.signal = controller.signal
  abortControllerMap.set(
    url,
    controller,
  )
  return res
})

axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => {
    const url = res.config.url || ''
    const code = res.data?.code
    const userStore = useUserStore()
    switch (code) {
      case responseCode.UNAUTHORIZED.value:
      case responseCode.UNVALID_TOKEN.value:
      case responseCode.UNLOGIN:
        message.error('登录失效,请重新登录')
        userStore.logOut()
        break
    }

    abortControllerMap.delete(url)
    // 这里不能做任何处理，否则后面的 interceptors 拿不到完整的上下文了
    return res
  },
  (error: AxiosError) => {
    console.error(error) // for debug
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.request.use(defaultRequestInterceptors)
axiosInstance.interceptors.response.use(defaultResponseInterceptors)
const service = {
  request: (config: RequestConfig) => {
    return new Promise((resolve, reject) => {
      if (config.interceptors?.requestInterceptors)
        config = config.interceptors.requestInterceptors(config as any)

      axiosInstance
        .request(config)
        .then((res) => {
          resolve(res)
        })
        .catch((err: any) => {
          reject(err)
        })
    })
  },
  cancelRequest: (url: string | string[]) => {
    const urlList = Array.isArray(url) ? url : [url]
    for (const _url of urlList) {
      abortControllerMap.get(_url)?.abort()
      abortControllerMap.delete(_url)
    }
  },
  cancelAllRequest() {
    for (const [_, controller] of abortControllerMap)
      controller.abort()

    abortControllerMap.clear()
  },
}

export default service
