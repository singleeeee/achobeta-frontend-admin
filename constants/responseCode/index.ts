export const responseCode = {
  SUCCESS: {
    name: '请求成功',
    value: 200,
  },
  ERROR: {
    name: '请求错误',
    value: 400,
  },
  UNAUTHORIZED: {
    name: '未授权',
    value: 401,
  },
  FORBIDDEN: {
    name: '禁止访问',
    value: 403,
  },
  NOT_FOUND: {
    name: '请求资源不存在',
    value: 404,
  },
  INTERNAL_SERVER_ERROR: {
    name: '服务器内部错误',
    value: 500,
  },
  UNLOGIN: {
    name: '未登录',
    value: 2001,
  },
  UNVALID_TOKEN: {
    name: '无效的token',
    value: 2009,
  },
  UNVALID_TIME: {
    name: '招新已开始',
    value: 5002,
  },

}
