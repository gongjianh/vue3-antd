import { onMounted, ref } from 'vue'
import http from '@/utils/http'
export const chainList = ref<{ chainId: string, chainText: string }[]>([])
export async function getChainList() {
    const res = await http({
        url: '/web/barterRank/getChainSelectList'
    })
    if (res.status == 0) {
        chainList.value = res.barterChainList
    }
}
export function useChain() {
    onMounted(() => {
        getChainList()
    })
    return chainList
}