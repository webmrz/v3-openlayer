<template>
  <div class="analysis-view">
    <div class="analysis-container">
      <div class="map-container">
        <MapContainer />
      </div>
      <div class="tools-panel">
        <el-card class="tools-card">
          <template #header>
            <div class="card-header">
              <span>空间分析工具</span>
            </div>
          </template>
          <el-button-group>
            <el-button @click="startMeasure('distance')">距离测量</el-button>
            <el-button @click="startMeasure('area')">面积测量</el-button>
          </el-button-group>
          <el-divider />
          <el-button-group>
            <el-button @click="startBuffer">缓冲区分析</el-button>
            <el-button @click="startIntersect">相交分析</el-button>
          </el-button-group>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MapContainer from '@/components/map/MapContainer.vue'

const startMeasure = (type: 'distance' | 'area') => {
  // 实现测量功能
}

const startBuffer = () => {
  // 实现缓冲区分析
}

const startIntersect = () => {
  // 实现相交分析
}
</script>

<style scoped>
.analysis-view {
  width: 100%;
  height: 100%;
  padding: 20px;
}

.analysis-container {
  display: flex;
  height: calc(100% - 40px);
  gap: 20px;
}

.map-container {
  flex: 1;
  height: 100%;
}

.tools-panel {
  width: 300px;
}

.tools-card {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-button-group {
  margin-bottom: 10px;
}
</style>
