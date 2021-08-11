<template>
    <a-layout style="min-height: 100vh">
        <a-layout-sider style="height: 100vh;position: fixed;left: 0;top: 0;">
            <div class="logo">
                <img src="@/assets/logo.png" alt />
                <span>物格码</span>
            </div>
            <a-menu
                style="height: calc(100vh - 64px);overflow: auto;"
                theme="dark"
                v-model:selectedKeys="selectedKeys"
                mode="inline"
            >
                <a-menu-item key="1">
                    <UnorderedListOutlined />
                    <span>礼包订单</span>
                </a-menu-item>
            </a-menu>
        </a-layout-sider>
        <a-layout style="margin-left: 200px;">
            <a-layout-header
                style="background: #fff;width: calc(100% - 200px); position: fixed;top: 0;left: 200px; z-index: 9;display: flex;justify-content: space-between;align-items: center;"
            >
                <a-breadcrumb style="margin: 20px 0">
                    <a-breadcrumb-item>首页</a-breadcrumb-item>
                    <a-breadcrumb-item>礼包订单</a-breadcrumb-item>
                </a-breadcrumb>
                <a-button type="link" @click="loginOut" class="out">退出</a-button>
            </a-layout-header>
            <a-layout-content
                style=" margin: 80px 16px 16px;padding: 16px; background: #fff;flex: unset;"
            >
                <router-view />
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>
<script lang="ts" setup>
import router from '@/router';
import userInfo from '@/store/userInfo';
import {
    PieChartOutlined,
    DesktopOutlined,
    UserOutlined,
    TeamOutlined,
    FileOutlined,
    UnorderedListOutlined
} from '@ant-design/icons-vue';
import { ref } from 'vue';

const collapsed = ref<boolean>(false)
const selectedKeys = ref<string[]>(['1'])
function loginOut() {
    localStorage.clear()
    userInfo.value = {} as any
    router.push('login')
}
</script>
<style lang="scss">
.logo {
    display: flex;
    color: #fff;
    align-items: center;
    height: 64px;
    padding-left: 24px;
    img {
        width: 40px;
    }
    span {
        font-size: 21px;
        margin-left: 12px;
    }
}
</style>