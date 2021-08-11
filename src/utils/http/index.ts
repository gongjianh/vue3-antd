import qs from 'qs'
import Axios from 'axios'
import { Modal, message as Message } from 'ant-design-vue'
import { ResultEnum } from '@/enums/httpEnum'
import type { AxiosRequestConfig } from 'axios';
import { isDev } from '../common';
const axios = Axios.create()
import router from '@/router';
import { storage } from '../Storage';
import userInfo from '@/store/userInfo';
interface CAxiosRequestConfig extends AxiosRequestConfig {
    showMsg?: boolean;
}

axios.defaults.timeout = 30000
// axios.defaults.baseURL = isDev ? '' : (import.meta.env.VITE_APP_API_URL_ACCOUNT as string)

axios.interceptors.response.use(
    res => {
        const { data } = res
        //  这里 status，result，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
        const { status, msg } = data
        // 请求成功
        const hasSuccess = data && data.status === ResultEnum.SUCCESS
        // 显示提示信息
        if (!hasSuccess && (res.config as CAxiosRequestConfig).showMsg !== false) {
            Message.error(msg || '获取失败,系统异常!')
        }
        return res
    },
    error => {
        const { response, code, message } = error || {}
        const msg: string =
            response && response.data && response.data.message
                ? response.data.message
                : ''
        const err: string = error.toString()

        try {
            if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
                if (error.config.showMsg !== false) Message.error('接口请求超时,请刷新页面重试!')
                return {
                    data: {
                        msg: '接口请求超时,请刷新页面重试!',
                        status: -1
                    }
                }
            }
            if (err && err.includes('Network Error')) {
                if (error.config.showMsg !== false) Modal.confirm({
                    title: '网络异常',
                    content: '请检查您的网络连接是否正常!'
                })
                return {
                    data: {
                        msg: '网络异常，请检查您的网络连接是否正常',
                        status: -1
                    }
                }
            }
        } catch (error) {
            throw new Error(error)
        }
        // 请求是否被取消
        const isCancel = Axios.isCancel(error)
        let msgText = ''


        if (!isCancel) {
            if (error.response && error.response.status) {
                switch (error.response.status) {
                    case 400:
                        msgText = msg
                        break
                    // 401: 未登录
                    // 未登录则跳转登录页面，并携带当前页面的路径
                    // 在登录成功后返回当前页面，这一步需要在登录页操作。
                    case 401:
                        msgText = '登录已过期，请重新登陆'
                        break
                    case 403:
                        msgText = '用户得到授权，但是访问是被禁止的。!'
                        break
                    // 404请求不存在
                    case 404:
                        msgText = '网络请求错误,未找到该资源!'
                        break
                    case 405:
                        msgText = '网络请求错误,请求方法未允许!'
                        break
                    case 408:
                        msgText = '网络请求超时!'
                        break
                    case 500:
                        msgText = '服务器错误,请联系管理员!'
                        break
                    case 501:
                        msgText = '网络未实现!'
                        break
                    case 502:
                        msgText = '网络错误!'
                        break
                    case 503:
                        msgText = '服务不可用，服务器暂时过载或维护!'
                        break
                    case 504:
                        msgText = '网络超时!'
                        break
                    case 505:
                        msgText = 'http版本不支持该请求!'
                        break
                    default:
                        msgText = msg
                }
                if (error.config.showMsg !== false) Message.error(msgText)
            }
        } else {
            console.warn(error, '请求被取消！')
        }
        return {
            data: {
                msg: msgText,
                status: -1
            }
        }
    }
)

axios.interceptors.request.use((config) => {
    config.headers.authToken = userInfo.value.authToken
    return config
})


const account = '/wgm-account'
const web = '/wgm-web'
const VITE_APP_API_URL_ACCOUNT = import.meta.env.VITE_APP_API_URL_ACCOUNT as string
const VITE_APP_API_URL_WEB = import.meta.env.VITE_APP_API_URL_WEB as string
const VITE_APP_API_URL_MALL = import.meta.env.VITE_APP_API_URL_WEB as string

function request(
    config: CAxiosRequestConfig
): Promise<{ status: number; msg: string; count: number;[key: string]: any }> {
    config.method = config.method ?? 'POST'
    return new Promise((resolve, reject) => {
        axios.request(config).then(res => {
            return resolve(res.data)
        })
    })
}

export default request
