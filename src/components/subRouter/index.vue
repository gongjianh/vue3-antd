<template>
<div>
  <router-view>
  </router-view>
</div>
  
</template>

<script lang="ts">
import {defineComponent, watch, ref} from 'vue'

export default defineComponent({
  name: "sub-router",
})
</script>
