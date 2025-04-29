<template>
  <div class="home">
    <h1>Vue3 + OpenLayers 地图应用</h1>
    <MapContainer />
  </div>
</template>

<script setup lang="ts">
import MapContainer from '@/components/map/MapContainer.vue'
</script>

<style scoped>
.home {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

h1 {
  text-align: center;
  padding: 20px;
  margin: 0;
}
</style>
