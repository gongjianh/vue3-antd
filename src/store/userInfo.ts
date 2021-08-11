import { ref } from "vue"

type userInfoType = {
    authToken: string;
    memberUser: object;
    userId: string | number
    userRankList: any[]
}


const userInfo = ref<userInfoType>({} as userInfoType)

userInfo.value = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo') as string) : {}

export default userInfo