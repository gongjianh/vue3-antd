export const isFloat = async (rule, value) => {
  if (!value) return Promise.resolve()
  if (!/^\d+(\.\d+)?$/.test(value)) {
    return Promise.reject('请输入数字')
  }
  return Promise.resolve()
}
export const isnumber = async (rule, value) => {
  if (!value) return Promise.resolve()
  if (!/^(0|[1-9]\d*)$/.test(value)) {
    return Promise.reject('请输入整数')
  }
  return Promise.resolve()
}
export const isPhone = async (rule, value) => {
  if (!value) return Promise.resolve()
  if (!/^1[3-9]{1}\d{9}$/.test(value)) {
    return Promise.reject('请输入手机号码')
  }
  return Promise.resolve()
}
export const isCard = async (rule, value) => {
  if (!value) return Promise.resolve()
  if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
    return Promise.reject('请输入正确的身份证号码')
  }
  return Promise.resolve()
}
