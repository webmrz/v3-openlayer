<template>
  <div class="map-view">
    <h2>地图视图</h2>
    <MapContainer />
  </div>
</template>

<script setup lang="ts">
import MapContainer from '@/components/map/MapContainer.vue'
</script>

<style scoped>
.map-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

h2 {
  text-align: center;
  padding: 20px;
  margin: 0;
}
</style>
