# OpenLayers 测试指南

## 1. 单元测试

### 1.1 测试工具配置
```typescript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ['./jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### 1.2 工具函数测试
```typescript
// utils/coordinate.test.ts
import { transformCoordinate, checkBounds } from '../utils/coordinate';

describe('Coordinate Utils', () => {
  test('transformCoordinate should transform coordinates correctly', () => {
    const result = transformCoordinate([116.3, 39.9], 'EPSG:4326', 'EPSG:3857');
    expect(result).toBeDefined();
    expect(result.length).toBe(2);
  });

  test('checkBounds should validate coordinate bounds', () => {
    expect(checkBounds([116.3, 39.9])).toBe(true);
    expect(checkBounds([200, 100])).toBe(false);
  });
});
```

### 1.3 图层管理测试
```typescript
// components/map/LayerManager.test.ts
import { LayerManager } from '../components/map/LayerManager';
import { TileLayer } from 'ol/layer';

describe('LayerManager', () => {
  let layerManager: LayerManager;
  let mockLayer: TileLayer;

  beforeEach(() => {
    layerManager = new LayerManager();
    mockLayer = new TileLayer();
  });

  test('should add layer correctly', () => {
    layerManager.addLayer(mockLayer);
    expect(layerManager.getLayers()).toContain(mockLayer);
  });

  test('should remove layer correctly', () => {
    layerManager.addLayer(mockLayer);
    layerManager.removeLayer(mockLayer);
    expect(layerManager.getLayers()).not.toContain(mockLayer);
  });
});
```

## 2. 集成测试

### 2.1 地图初始化测试
```typescript
// components/map/MapContainer.test.ts
import { mount } from '@vue/test-utils';
import MapContainer from '../components/map/MapContainer.vue';
import { Map } from 'ol';

describe('MapContainer', () => {
  let wrapper: any;
  let map: Map;

  beforeEach(() => {
    wrapper = mount(MapContainer);
    map = wrapper.vm.map;
  });

  test('should initialize map with correct options', () => {
    expect(map).toBeDefined();
    expect(map.getTarget()).toBeDefined();
    expect(map.getLayers().getLength()).toBeGreaterThan(0);
  });

  test('should handle view change correctly', async () => {
    const newCenter = [116.3, 39.9];
    await wrapper.vm.setCenter(newCenter);
    expect(map.getView().getCenter()).toEqual(newCenter);
  });
});
```

### 2.2 交互功能测试
```typescript
// components/map/MapInteractions.test.ts
import { mount } from '@vue/test-utils';
import MapInteractions from '../components/map/MapInteractions.vue';

describe('MapInteractions', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(MapInteractions);
  });

  test('should handle click event correctly', async () => {
    const mockEvent = {
      coordinate: [116.3, 39.9],
      pixel: [100, 100]
    };

    await wrapper.vm.handleMapClick(mockEvent);
    expect(wrapper.vm.selectedFeature).toBeDefined();
  });

  test('should handle zoom event correctly', async () => {
    const initialZoom = wrapper.vm.currentZoom;
    await wrapper.vm.handleZoomIn();
    expect(wrapper.vm.currentZoom).toBe(initialZoom + 1);
  });
});
```

## 3. 性能测试

### 3.1 渲染性能测试
```typescript
// performance/render.test.ts
import { measureRenderPerformance } from '../utils/performance';

describe('Render Performance', () => {
  test('should maintain stable FPS with large dataset', async () => {
    const result = await measureRenderPerformance(10000);
    expect(result.averageFPS).toBeGreaterThan(30);
    expect(result.maxMemoryUsage).toBeLessThan(100 * 1024 * 1024); // 100MB
  });

  test('should handle layer switching efficiently', async () => {
    const result = await measureLayerSwitchPerformance();
    expect(result.switchTime).toBeLessThan(100); // 100ms
  });
});
```

### 3.2 内存使用测试
```typescript
// performance/memory.test.ts
import { measureMemoryUsage } from '../utils/performance';

describe('Memory Usage', () => {
  test('should not leak memory during layer operations', async () => {
    const initialMemory = performance.memory.usedJSHeapSize;
    await performLayerOperations();
    const finalMemory = performance.memory.usedJSHeapSize;

    expect(finalMemory - initialMemory).toBeLessThan(10 * 1024 * 1024); // 10MB
  });
});
```

## 4. 测试最佳实践

1. **单元测试**
   - 测试独立的功能模块
   - 使用模拟数据
   - 保持测试简单明确

2. **集成测试**
   - 测试组件交互
   - 模拟用户操作
   - 验证状态变化

3. **性能测试**
   - 设置性能基准
   - 监控关键指标
   - 定期运行测试

4. **测试覆盖率**
   - 保持高覆盖率
   - 关注边界情况
   - 定期更新测试

5. **测试维护**
   - 及时更新测试
   - 保持测试可读性
   - 添加测试文档
