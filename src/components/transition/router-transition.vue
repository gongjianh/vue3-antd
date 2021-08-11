<template>
  <router-view v-slot="{ Component, route }">
    <transition name="zoom-fade" mode="out-in" appear>
      <div>
        <keep-alive :include="/list/">
          <component :is="Component" />
        </keep-alive>
      </div>
    </transition>
  </router-view>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'

export default defineComponent({
  name: 'router-transition-list',
  props: {
    notNeedKey: {
      type: Boolean,
      default: false
    },
    animate: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    // const router = useRouter()
    const route = useRoute()
    // 需要缓存的路由组件
    const keepAliveComponents = ref<string[]>([])
    // 获取需要缓存的组件
    // const getKeepAliveComponents = () => {
    //   const comNames = router.getRoutes()
    //       .filter(item => item?.meta.keepAlive)
    //       .map(item => item?.meta?.componentName?.replace(/\B([A-Z])/g, "-$1").toLowerCase() || '')
    //   return [...new Set(comNames)]
    // }

    // 获取需要缓存的组件
    onBeforeRouteLeave((to, from) => {
      const currentComName = from.matched.find(item => item.name == from.name)
        ?.components?.default.name
      if (
        currentComName &&
        !keepAliveComponents.value.includes(currentComName) &&
        from.meta?.keepAlive
      ) {
        // 需要缓存的组件
        keepAliveComponents.value.push(currentComName)
      } else if (!from.meta?.keepAlive || to.name == 'Redirect') {
        // 不需要缓存的组件
        const index = keepAliveComponents.value.findIndex(
          name => name == currentComName
        )
        if (index != -1) {
          keepAliveComponents.value.splice(index, 1)
        }
      }
    })

    return {
      keepAliveComponents
    }
  }
})
</script>
