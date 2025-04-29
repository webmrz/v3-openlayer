# OpenLayers 错误处理与边界情况

## 1. 错误处理机制

### 1.1 全局错误处理
```typescript
// 全局错误处理器
window.addEventListener('error', (event) => {
  console.error('Global Error:', event.error);
  // 发送错误日志
  sendErrorLog({
    type: 'global',
    message: event.error.message,
    stack: event.error.stack,
    timestamp: new Date().toISOString()
  });
});

// 未捕获的 Promise 错误
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
  // 发送错误日志
  sendErrorLog({
    type: 'promise',
    message: event.reason.message,
    stack: event.reason.stack,
    timestamp: new Date().toISOString()
  });
});
```

### 1.2 地图错误处理
```typescript
// 地图加载错误
map.on('loaderror', (event) => {
  console.error('Map Load Error:', event.error);
  // 显示错误提示
  showErrorToast('地图加载失败，请刷新页面重试');
});

// 图层错误处理
layer.on('error', (event) => {
  console.error('Layer Error:', event.error);
  // 重试加载
  retryLayerLoad(layer);
});

// 瓦片加载错误
tileLayer.getSource().on('tileloaderror', (event) => {
  console.error('Tile Load Error:', event.error);
  // 使用备用瓦片
  useFallbackTile(event.tile);
});
```

## 2. 边界情况处理

### 2.1 数据边界
```typescript
// 检查坐标范围
const checkCoordinateBounds = (coord: number[]) => {
  const [x, y] = coord;
  if (x < -180 || x > 180 || y < -90 || y > 90) {
    throw new Error('坐标超出有效范围');
  }
  return coord;
};

// 处理无效几何
const handleInvalidGeometry = (geometry: Geometry) => {
  try {
    geometry.getCoordinates();
  } catch (error) {
    console.warn('Invalid Geometry:', error);
    // 修复或跳过无效几何
    return fixGeometry(geometry) || null;
  }
};

// 数据验证
const validateFeature = (feature: Feature) => {
  const geometry = feature.getGeometry();
  if (!geometry) {
    throw new Error('要素缺少几何信息');
  }

  const properties = feature.getProperties();
  if (!properties.id) {
    throw new Error('要素缺少ID属性');
  }

  return true;
};
```

### 2.2 投影转换
```typescript
// 安全投影转换
const safeTransform = (coord: number[], from: string, to: string) => {
  try {
    return transform(coord, from, to);
  } catch (error) {
    console.error('Projection Transform Error:', error);
    // 使用默认投影
    return transform(coord, from, 'EPSG:4326');
  }
};

// 检查投影支持
const checkProjectionSupport = (code: string) => {
  try {
    getProjection(code);
    return true;
  } catch (error) {
    console.warn('Unsupported Projection:', code);
    return false;
  }
};
```

## 3. 异常恢复机制

### 3.1 图层恢复
```typescript
// 图层加载失败恢复
const recoverLayer = async (layer: Layer) => {
  try {
    // 尝试重新加载
    await layer.getSource().refresh();
  } catch (error) {
    console.error('Layer Recovery Failed:', error);
    // 使用备用图层
    useFallbackLayer(layer);
  }
};

// 瓦片加载失败恢复
const recoverTile = (tile: Tile) => {
  const src = tile.getSrc();
  if (!src) return;

  // 重试加载
  const image = tile.getImage();
  image.src = src;
  image.onload = () => {
    tile.setState(2); // 2 = LOADED
  };
  image.onerror = () => {
    // 使用备用瓦片
    useFallbackTile(tile);
  };
};
```

### 3.2 状态恢复
```typescript
// 保存地图状态
const saveMapState = () => {
  const state = {
    center: map.getView().getCenter(),
    zoom: map.getView().getZoom(),
    rotation: map.getView().getRotation(),
    layers: map.getLayers().getArray().map(layer => ({
      id: layer.get('id'),
      visible: layer.getVisible(),
      opacity: layer.getOpacity()
    }))
  };
  localStorage.setItem('mapState', JSON.stringify(state));
};

// 恢复地图状态
const restoreMapState = () => {
  try {
    const state = JSON.parse(localStorage.getItem('mapState') || '{}');
    if (state.center && state.zoom) {
      map.getView().setCenter(state.center);
      map.getView().setZoom(state.zoom);
      map.getView().setRotation(state.rotation || 0);

      state.layers?.forEach((layerState: any) => {
        const layer = map.getLayers().getArray()
          .find(l => l.get('id') === layerState.id);
        if (layer) {
          layer.setVisible(layerState.visible);
          layer.setOpacity(layerState.opacity);
        }
      });
    }
  } catch (error) {
    console.error('State Restoration Failed:', error);
    // 使用默认状态
    useDefaultMapState();
  }
};
```

## 4. 性能边界处理

### 4.1 大数据处理
```typescript
// 检查数据量
const checkDataSize = (features: Feature[]) => {
  const size = features.length;
  if (size > 100000) {
    console.warn('Large dataset detected:', size);
    // 启用数据分片
    return enableDataChunking(features);
  }
  return features;
};

// 内存使用监控
const monitorMemoryUsage = () => {
  if (performance.memory) {
    const used = performance.memory.usedJSHeapSize;
    const total = performance.memory.totalJSHeapSize;
    const ratio = used / total;

    if (ratio > 0.8) {
      console.warn('High memory usage detected');
      // 触发内存清理
      triggerMemoryCleanup();
    }
  }
};
```

### 4.2 渲染性能
```typescript
// FPS 监控
const monitorFPS = () => {
  let lastTime = performance.now();
  let frames = 0;

  const checkFPS = () => {
    const currentTime = performance.now();
    frames++;

    if (currentTime - lastTime >= 1000) {
      const fps = Math.round(frames * 1000 / (currentTime - lastTime));

      if (fps < 30) {
        console.warn('Low FPS detected:', fps);
        // 降低渲染质量
        reduceRenderQuality();
      }

      frames = 0;
      lastTime = currentTime;
    }

    requestAnimationFrame(checkFPS);
  };

  checkFPS();
};
```

## 5. 用户交互边界

### 5.1 操作限制
```typescript
// 缩放限制
const limitZoom = (event: MapBrowserEvent) => {
  const zoom = map.getView().getZoom();
  if (zoom < 5 || zoom > 18) {
    event.preventDefault();
    showToast('缩放级别超出限制');
  }
};

// 平移限制
const limitPan = (event: MapBrowserEvent) => {
  const extent = map.getView().calculateExtent();
  const limit = [-180, -90, 180, 90];

  if (!intersects(extent, limit)) {
    event.preventDefault();
    showToast('超出地图范围');
  }
};
```

### 5.2 交互优化
```typescript
// 事件节流
const throttledHandler = throttle((event: MapBrowserEvent) => {
  // 处理事件
}, 100);

// 事件防抖
const debouncedHandler = debounce((event: MapBrowserEvent) => {
  // 处理事件
}, 300);

// 添加事件监听
map.on('pointermove', throttledHandler);
map.on('moveend', debouncedHandler);
```

## 6. 最佳实践

1. **错误处理**
   - 实现全局错误捕获
   - 提供友好的错误提示
   - 记录错误日志

2. **边界检查**
   - 验证输入数据
   - 检查坐标范围
   - 监控性能指标

3. **异常恢复**
   - 实现自动重试机制
   - 提供备用方案
   - 保存和恢复状态

4. **性能优化**
   - 监控内存使用
   - 优化渲染性能
   - 处理大数据集

5. **用户体验**
   - 限制操作范围
   - 优化交互响应
   - 提供状态反馈
