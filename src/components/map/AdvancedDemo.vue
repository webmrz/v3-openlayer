<template>
  <div class="advanced-demo">
    <div class="demo-controls">
      <el-button-group>
        <el-button @click="toggleWebGLDemo">WebGL 演示</el-button>
        <el-button @click="toggleHeatmapDemo">热力图演示</el-button>
        <el-button @click="toggleAnimationDemo">动画演示</el-button>
        <el-button @click="toggleBigDataDemo">大数据演示</el-button>
        <el-button @click="toggleOfflineDemo">离线演示</el-button>
        <el-button @click="toggle3DDemo">3D 演示</el-button>
      </el-button-group>
    </div>

    <div class="demo-content">
      <!-- WebGL 演示 -->
      <div v-if="showWebGLDemo" class="demo-section">
        <h3>WebGL 点图层演示</h3>
        <el-slider v-model="pointCount" :min="1000" :max="100000" @change="updateWebGLPoints" />
        <el-button @click="optimizeWebGL">优化渲染</el-button>
      </div>

      <!-- 热力图演示 -->
      <div v-if="showHeatmapDemo" class="demo-section">
        <h3>热力图演示</h3>
        <el-slider v-model="heatmapRadius" :min="5" :max="50" @change="updateHeatmap" />
        <el-color-picker v-model="heatmapColor" @change="updateHeatmap" />
      </div>

      <!-- 动画演示 -->
      <div v-if="showAnimationDemo" class="demo-section">
        <h3>轨迹动画演示</h3>
        <el-button @click="startAnimation">开始动画</el-button>
        <el-button @click="stopAnimation">停止动画</el-button>
        <el-slider v-model="animationSpeed" :min="1" :max="10" />
      </div>

      <!-- 大数据演示 -->
      <div v-if="showBigDataDemo" class="demo-section">
        <h3>大数据可视化演示</h3>
        <el-slider v-model="chunkSize" :min="100" :max="5000" @change="updateChunks" />
        <el-button @click="loadMoreData">加载更多数据</el-button>
      </div>

      <!-- 离线演示 -->
      <div v-if="showOfflineDemo" class="demo-section">
        <h3>离线地图演示</h3>
        <el-button @click="saveTiles">保存当前区域瓦片</el-button>
        <el-button @click="clearTiles">清理过期瓦片</el-button>
        <el-switch v-model="offlineMode" @change="toggleOfflineMode" />
      </div>

      <!-- 3D 演示 -->
      <div v-if="show3DDemo" class="demo-section">
        <h3>3D 地形演示</h3>
        <el-slider v-model="terrainHeight" :min="1" :max="10" @change="updateTerrain" />
        <el-button @click="toggleTerrain">切换地形</el-button>
      </div>
    </div>

    <!-- 性能监控 -->
    <div class="performance-monitor">
      <span>FPS: {{ fps }}</span>
      <span>内存: {{ memory }} MB</span>
      <span>图层数: {{ layerCount }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Map } from 'ol';
import { createWebGLPointsLayer, optimizeWebGLRender } from '@/utils/webgl';
import { HeatmapLayer } from '@/utils/heatmap-layer';
import { AnimationManager, TrackAnimation } from '@/utils/animation';
import { DataChunkManager } from '@/utils/data-chunk';
import { OfflineStorageManager } from '@/utils/offline-storage';
import { ThreeDRenderer } from '@/utils/3d-renderer';

const props = defineProps<{
  map: Map;
}>();

// 状态控制
const showWebGLDemo = ref(false);
const showHeatmapDemo = ref(false);
const showAnimationDemo = ref(false);
const showBigDataDemo = ref(false);
const showOfflineDemo = ref(false);
const show3DDemo = ref(false);

// 参数控制
const pointCount = ref(10000);
const heatmapRadius = ref(15);
const heatmapColor = ref('#ff0000');
const animationSpeed = ref(5);
const chunkSize = ref(1000);
const offlineMode = ref(false);
const terrainHeight = ref(5);

// 性能监控
const fps = ref(0);
const memory = ref(0);
const layerCount = ref(0);

// 实例
let webGLLayer: any = null;
let heatmapLayer: HeatmapLayer | null = null;
let animationManager: AnimationManager | null = null;
let dataChunkManager: DataChunkManager | null = null;
let offlineManager: OfflineStorageManager | null = null;
let threeDRenderer: ThreeDRenderer | null = null;

// 初始化
onMounted(() => {
  initManagers();
  startPerformanceMonitor();
});

// 清理
onUnmounted(() => {
  cleanup();
});

// 初始化管理器
const initManagers = () => {
  animationManager = new AnimationManager(props.map);
  offlineManager = new OfflineStorageManager();
  threeDRenderer = new ThreeDRenderer(props.map);
};

// 性能监控
const startPerformanceMonitor = () => {
  let lastTime = performance.now();
  let frames = 0;

  const monitor = () => {
    const currentTime = performance.now();
    frames++;

    if (currentTime - lastTime >= 1000) {
      fps.value = Math.round(frames * 1000 / (currentTime - lastTime));
      memory.value = Math.round(performance.memory?.usedJSHeapSize / 1024 / 1024 || 0);
      layerCount.value = props.map.getLayers().getLength();

      frames = 0;
      lastTime = currentTime;
    }

    requestAnimationFrame(monitor);
  };

  monitor();
};

// WebGL 演示
const toggleWebGLDemo = () => {
  showWebGLDemo.value = !showWebGLDemo.value;
  if (showWebGLDemo.value) {
    updateWebGLPoints();
  } else {
    props.map.removeLayer(webGLLayer);
  }
};

const updateWebGLPoints = () => {
  const features = generateRandomPoints(pointCount.value);
  if (webGLLayer) {
    props.map.removeLayer(webGLLayer);
  }
  webGLLayer = createWebGLPointsLayer(props.map, features);
};

const optimizeWebGL = () => {
  optimizeWebGLRender(props.map);
};

// 热力图演示
const toggleHeatmapDemo = () => {
  showHeatmapDemo.value = !showHeatmapDemo.value;
  if (showHeatmapDemo.value) {
    updateHeatmap();
  } else {
    props.map.removeLayer(heatmapLayer);
  }
};

const updateHeatmap = () => {
  const features = generateRandomPoints(1000);
  if (heatmapLayer) {
    props.map.removeLayer(heatmapLayer);
  }
  heatmapLayer = new HeatmapLayer({
    features,
    radius: heatmapRadius.value,
    gradient: [heatmapColor.value + '00', heatmapColor.value + 'ff']
  });
  props.map.addLayer(heatmapLayer);
};

// 动画演示
const toggleAnimationDemo = () => {
  showAnimationDemo.value = !showAnimationDemo.value;
  if (!showAnimationDemo.value) {
    stopAnimation();
  }
};

const startAnimation = () => {
  const feature = createTrackFeature();
  const coordinates = generateTrackCoordinates();
  const animation = new TrackAnimation(
    props.map,
    feature,
    coordinates,
    5000 / animationSpeed.value
  );
  animationManager?.addAnimation(animation);
};

const stopAnimation = () => {
  animationManager?.stop();
};

// 大数据演示
const toggleBigDataDemo = () => {
  showBigDataDemo.value = !showBigDataDemo.value;
  if (showBigDataDemo.value) {
    updateChunks();
  }
};

const updateChunks = () => {
  const features = generateRandomPoints(100000);
  dataChunkManager = new DataChunkManager(features, chunkSize.value);
  dataChunkManager.processChunks();
};

const loadMoreData = () => {
  // 实现数据加载逻辑
};

// 离线演示
const toggleOfflineDemo = () => {
  showOfflineDemo.value = !showOfflineDemo.value;
};

const saveTiles = async () => {
  const extent = props.map.getView().calculateExtent();
  // 实现瓦片保存逻辑
};

const clearTiles = async () => {
  await offlineManager?.cleanup();
};

const toggleOfflineMode = () => {
  // 实现离线模式切换逻辑
};

// 3D 演示
const toggle3DDemo = () => {
  show3DDemo.value = !show3DDemo.value;
};

const updateTerrain = () => {
  threeDRenderer?.updateTerrain();
};

const toggleTerrain = () => {
  // 实现地形切换逻辑
};

// 工具函数
const generateRandomPoints = (count: number) => {
  // 实现随机点生成逻辑
  return [];
};

const createTrackFeature = () => {
  // 实现轨迹要素创建逻辑
  return null;
};

const generateTrackCoordinates = () => {
  // 实现轨迹坐标生成逻辑
  return [];
};

// 清理
const cleanup = () => {
  if (webGLLayer) props.map.removeLayer(webGLLayer);
  if (heatmapLayer) props.map.removeLayer(heatmapLayer);
  if (animationManager) animationManager.stop();
  if (threeDRenderer) threeDRenderer.dispose();
};
</script>

<style scoped>
.advanced-demo {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.demo-controls {
  margin-bottom: 10px;
}

.demo-section {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.performance-monitor {
  position: fixed;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
}

.performance-monitor span {
  margin-right: 10px;
}
</style>