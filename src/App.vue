<template>
  <config-provider :locale="zhCN">
    <router-view></router-view>
  </config-provider>
</template>

<script setup>
import { ConfigProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import moment from 'moment';
import 'moment/dist/locale/zh-cn';
moment.locale('en')
</script>

<style lang="scss">
@import "style/common.scss";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  width: 100%;
  min-height: 100vh;
  .table-form {
    .ant-form-item {
      margin-bottom: 12px;
    }
    .ant-form-item-label {
      width: 100px;
    }
    .ant-form-item-control {
      width: 200px;
    }
    .time .ant-form-item-control {
      width: 358px;
    }
  }
}
</style>
