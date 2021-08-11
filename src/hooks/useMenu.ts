import { computed, onMounted, ref } from "vue"
import http from '@/utils/http'
import { useStore } from '@/store/userInfo'
const store = useStore()
export const menuList = ref<any[]>([])
async function getMenu() {
    const res = await http({
        url: '/web/menuRole/getMenuList',
        params: {
            roleId: store.state.user.info.roleId
        }
    })
    if (res.status == 0) {
        menuList.value = res.menuDtoList || []
    }
}
export function useMenu() {
    if (menuList.value.length > 0) return menuList
    getMenu()
    return menuList
}
