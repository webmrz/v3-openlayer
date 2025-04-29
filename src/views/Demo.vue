<template>
  <div class="demo-view">
    <h2>演示视图</h2>
    <div class="demo-content">
      <p>这是一个演示页面，用于展示各种地图功能。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// 演示组件逻辑
</script>

<style scoped>
.demo-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

h2 {
  text-align: center;
  margin: 0 0 20px 0;
}

.demo-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
