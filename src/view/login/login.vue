<template>
    <div
        style="width: 400px; position: absolute;top: 50%;left: 50%;transform: translateX(-50%) translateY(-50%);"
    >
        <div class="login-logo">
            <img src="@/assets/logo.png" alt />
            <div>物格码商户系统</div>
        </div>
        <div
            style="width: 400px;box-shadow: 0 21px 41px 0 rgb(0 0 0 / 20%);padding: 30px;border-radius: 4px;"
        >
            <h1>商户登陆</h1>
            <br />
            <a-form
                layout="vertical"
                name="custom-validation"
                ref="formRef"
                :model="formState"
                :rules="rules"
            >
                <a-form-item label="手机号" name="userMobile">
                    <a-input-search
                        :maxlength="11"
                        v-model:value="formState.userMobile"
                        @search="getCode"
                    >
                        <template #enterButton>
                            <a-button :disabled="codedisabled">{{ text }}</a-button>
                        </template>
                    </a-input-search>
                </a-form-item>
                <a-form-item label="验证码" name="reqCode">
                    <a-input v-model:value="formState.reqCode" autocomplete="off" />
                </a-form-item>
                <br />
                <a-form-item>
                    <a-button style="width: 100%;" @click="handleOk" type="primary">立即登陆</a-button>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import { message } from 'ant-design-vue'
import http from '@/utils/http'
import { useRouter } from "vue-router";
import userInfo from "@/store/userInfo";
const router = useRouter()

let formState = reactive({
    userMobile: '',
    reqCode: ''
})
const formRef = ref()

const codedisabled = ref(false)
async function getCode() {
    await formRef.value.validate('userMobile')
    codedisabled.value = true
    const res = await http({
        url: '/wgm-account/api/memberAuthCode/sendMobileMessage',
        params: {
            userMobile: formState.userMobile
        }
    })
    if (res.status == 0) {
        message.success('短信已发送')
        changeText()
        return
    }
    message.error(res.msg)
    codedisabled.value = false
}
const loading = ref(false)
async function handleOk() {
    await formRef.value.validate()
    loading.value = true
    const res = await http({
        url: '/wgm-account/api/memberUser/doUserMobileLogin',
        params: {
            ...formState
        }
    })
    loading.value = false
    if (res.status == 0) {
        message.success('登录成功')
        localStorage.setItem('userInfo', JSON.stringify(res))
        userInfo.value = res as any
        router.push('/order')
    }
}

const text = ref('发送验证码')
let num = 60
let timeId: any = 0
function changeText() {
    timeId = setInterval(() => {
        text.value = (num--) + 's 再次发送'
        if (num == -1) {
            num = 60
            text.value = '再次发送'
            codedisabled.value = false
            clearInterval(timeId)
        }
    }, 1000)
}

const isPhone = async (rule, value) => {
    if (!value) return Promise.resolve()
    if (!/^1[3-9]{1}\d{9}$/.test(value)) {
        return Promise.reject('请输入手机号码')
    }
    return Promise.resolve()
}
const rules = {
    userMobile: [
        { required: true, message: '请输入手机号码', trigger: 'blur' },
        { validator: isPhone, trigger: 'blur' }
    ],
    reqCode: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
    ]
}
function changeVal(a) {

}
</script>
<style lang="scss">
.login-logo {
    width: fit-content;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    img {
        width: 66px;
        margin-right: 12px;
    }
    font-size: 28px;
    font-weight: 500;
}
</style>