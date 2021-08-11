import userInfo from '@/store/userInfo'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'



export const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'layout',
        redirect: '/order',
        component: () => import(/* webpackChunkName: "layout" */ '@/layout/index.vue'),
        meta: {
        },
        children: [
            {
                path: '/order',
                name: 'order',
                component: () => import(/* webpackChunkName: "layout" */ '@/view/order/order.vue'),
                meta: {
                    title: '礼包订单'
                },
            },
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "layout" */ '@/view/login/login.vue'),
        meta: {
            title: '登陆'
        },
    },
]

const router = createRouter({
    // import.meta.env.BASE_URL
    history: createWebHashHistory(''),
    routes
})
router.beforeEach((to, form, next) => {
    if (to.name != 'login' && !userInfo.value.authToken) {
        next('/login')
    }
    next()
})
export default router
