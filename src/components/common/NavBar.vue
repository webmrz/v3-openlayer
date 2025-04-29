<template>
  <el-menu
    :default-active="activeIndex"
    class="nav-menu"
    mode="horizontal"
    router
  >
    <el-menu-item index="/">首页</el-menu-item>
    <el-menu-item index="/map">地图</el-menu-item>
    <el-menu-item index="/demo">演示</el-menu-item>
    <el-menu-item index="/analysis">空间分析</el-menu-item>
    <el-menu-item index="/visualization">数据可视化</el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeIndex = computed(() => route.path)
</script>

<style scoped>
.nav-menu {
  border-bottom: solid 1px #e6e6e6;
  padding: 0 20px;
}
</style>
