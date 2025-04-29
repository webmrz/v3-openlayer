<template>
  <div class="visualization-view">
    <div class="visualization-container">
      <div class="map-container">
        <MapContainer />
      </div>
      <div class="controls-panel">
        <el-card class="controls-card">
          <template #header>
            <div class="card-header">
              <span>可视化控制</span>
            </div>
          </template>
          <el-form label-width="100px">
            <el-form-item label="可视化类型">
              <el-select v-model="visualizationType">
                <el-option label="热力图" value="heatmap" />
                <el-option label="聚类图" value="cluster" />
                <el-option label="流向图" value="flow" />
              </el-select>
            </el-form-item>
            <el-form-item label="数据字段">
              <el-select v-model="dataField">
                <el-option label="人口" value="population" />
                <el-option label="GDP" value="gdp" />
                <el-option label="温度" value="temperature" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="applyVisualization">应用</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MapContainer from '@/components/map/MapContainer.vue'

const visualizationType = ref('heatmap')
const dataField = ref('population')

const applyVisualization = () => {
  // 实现可视化效果
}
</script>

<style scoped>
.visualization-view {
  width: 100%;
  height: 100%;
  padding: 20px;
}

.visualization-container {
  display: flex;
  height: calc(100% - 40px);
  gap: 20px;
}

.map-container {
  flex: 1;
  height: 100%;
}

.controls-panel {
  width: 300px;
}

.controls-card {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
