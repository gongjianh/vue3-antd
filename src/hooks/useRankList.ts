import { ref } from 'vue'
import http from '@/utils/http'
const shenfenList = ref<{ rankText: string, rankId: number }[]>([])
async function getShenfenList() {
  if (shenfenList.value.length) return
  const res = await http({
    url: '/web/barterRank/getRankTextList'
  })
  if (res.status == 0) {
    shenfenList.value = res.rankTextList || []
  }
}

export function useRankList() {
  if (!shenfenList.value.length) {
    getShenfenList()
  }
  return shenfenList
}