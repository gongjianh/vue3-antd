import { onMounted, ref, Ref, onBeforeUnmount } from 'vue'
import { isDev } from '@/utils/common'
import E from 'wangeditor'
const imgUrl = import.meta.env.VITE_APP_IMG_URL
export function useWangeditor(refEl: Ref, html?: Ref) {
    const editor = ref()
    onMounted(() => {
        editor.value = new E(refEl.value)
        editor.value.config.excludeMenus = ['emoticon', 'video']
        editor.value.config.uploadImgServer = isDev
            ? '/wgm-account/static/file/uploadImage'
            : import.meta.env.VITE_APP_API_URL_ACCOUNT + '/wgm-account/static/file/uploadImage'
        editor.value.config.uploadImgMaxSize = 1 * 1024 * 1024 // 2M
        editor.value.config.uploadFileName = 'imgFile'
        editor.value.config.zIndex = 5
        editor.value.config.showLinkImg = false
        // editor.value.config.height = 500
        editor.value.config.uploadImgHooks = {
            // 图片上传并返回了结果，想要自己把图片插入到编辑器中
            // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
            customInsert: function (insertImgFn, result) {
                // result 即服务端返回的接口
                // console.log('customInsert', result)

                // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
                insertImgFn(imgUrl + result.fileName)
            }
        }
        editor.value.config.onchange = function (newHtml) {
            if (html) html.value = newHtml
        }
        // 配置触发 onchange 的时间频率，默认为 200ms
        editor.value.config.onchangeTimeout = 500 // 修改为 500ms
        editor.value.create()
    })
    onBeforeUnmount(() => {
        editor.value.destroy()
        editor.value = null
    })
    return editor
}
export function wangeditor(refEl: Ref) {
    const editor = ref()
    editor.value = new E(refEl.value)
    editor.value.config.excludeMenus = ['emoticon', 'video']
    editor.value.config.uploadImgServer = isDev
        ? '/wgm-account/static/file/uploadImage'
        : import.meta.env.VITE_APP_API_URL_ACCOUNT + '/wgm-account/static/file/uploadImage'
    editor.value.config.uploadImgMaxSize = 2 * 1024 * 1024 // 2M
    editor.value.config.uploadFileName = 'imgFile'
    editor.value.config.zIndex = 5
    editor.value.config.showLinkImg = false
    // editor.value.config.height = 500
    editor.value.config.uploadImgHooks = {
        // 图片上传并返回了结果，想要自己把图片插入到编辑器中
        // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
        customInsert: function (insertImgFn, result) {
            // result 即服务端返回的接口
            // console.log('customInsert', result)

            // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
            insertImgFn(imgUrl + result.fileName)
        }
    }
    editor.value.create()

    return editor
}
