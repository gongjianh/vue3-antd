import { ref } from 'vue'
import { message } from 'ant-design-vue'
interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: any;
  url?: string;
  type?: string;
  size: number;
  originFileObj: any;
}

interface FileInfo {
  file: FileItem;
  fileList: FileItem[];
}

export function useUploadFile() {
  const fileList = ref<FileItem[]>([])
  const loading = ref<boolean>(false)
  const file = ref<string>('')

  const handleChange = (info: FileInfo) => {

    console.log("==========>>>>>>>", fileList.value, info)
    if (info.file.status === 'uploading') {
      loading.value = true
      return
    }
    if (info.file.status === 'done') {
      loading.value = false
      if (info.file.response.status === 0) {
        file.value = info.file.response.fileName
        fileList.value.map(el => {
          el.name = el.response?.fileName || el.name
          el.url = import.meta.env.VITE_APP_IMG_URL + (el.name as any)
          return el
        })
      } else {
        message.error(info.file.response.msg || '上传失败')
      }
    }
    if (info.file.status === 'error') {
      loading.value = false
      message.error('上传出错，请重试！')
    }
  }

  const beforeUpload = (file: FileItem) => {
    console.log(file)
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('上传的图片类型错误！')
    }
    const isLt2M = file.size / 1024 / 1024 < 1
    if (!isLt2M) {
      message.error('图片大小必须小于1MB!')
    }
    return isJpgOrPng && isLt2M
  }

  return {
    fileList,
    loading,
    file,
    beforeUpload,
    handleChange
  }
}
