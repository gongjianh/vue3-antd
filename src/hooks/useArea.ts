import { ref, onMounted } from 'vue'
import http from '@/utils/http'
function getAreaList(id) {
  return http({
    url: '/api/mapArea/getAreaList',
    params: {
      areaId: id
    }
  })
}
type item = {
  value: number, label: string, isLeaf?: boolean, areaId: number, areaLng: number, areaLat: number, areaName: string
}

export function useArea() {
  const options = ref<item[]>([])
  const getAreaListAction = async id => {
    const res = await getAreaList(id)
    if (res.status == 0) {
      return res.areaList.map(el => {
        el.value = el.areaId
        el.label = el.areaName
        el.isLeaf = false
        return el
      })
    }
    return []
  }
  onMounted(async () => {
    options.value = await getAreaListAction(100000)
  })
  const loadData = async selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1]
    targetOption.loading = true
    const areaList = await getAreaListAction(targetOption.areaId)
    targetOption.loading = false
    if (selectedOptions.length == 2) {
      areaList.map(el => ((el.isLeaf = true), el))
    }
    targetOption.children = areaList
  }

  return {
    options,
    loadData
  }
}
