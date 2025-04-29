import { Map } from 'ol';

interface PerformanceMetrics {
  fps: number;
  memory: number;
  layerCount: number;
}

/**
 * 性能监控类
 */
export class PerformanceMonitor {
  private map: Map;
  private fps: number = 0;
  private memory: number = 0;
  private layerCount: number = 0;
  private lastTime: number = 0;
  private frames: number = 0;
  private animationFrameId: number | null = null;

  constructor(map: Map) {
    this.map = map;
    this.lastTime = performance.now();
  }

  /**
   * 开始监控
   */
  start(): void {
    this.monitor();
  }

  /**
   * 停止监控
   */
  stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * 获取性能指标
   */
  getMetrics(): PerformanceMetrics {
    return {
      fps: this.fps,
      memory: this.memory,
      layerCount: this.layerCount
    };
  }

  /**
   * 监控循环
   */
  private monitor(): void {
    const currentTime = performance.now();
    this.frames++;

    if (currentTime - this.lastTime >= 1000) {
      this.fps = Math.round(this.frames * 1000 / (currentTime - this.lastTime));
      this.memory = Math.round(performance.memory?.usedJSHeapSize / 1024 / 1024 || 0);
      this.layerCount = this.map.getLayers().getLength();

      this.frames = 0;
      this.lastTime = currentTime;
    }

    this.animationFrameId = requestAnimationFrame(() => this.monitor());
  }
}

/**
 * 测量渲染性能
 * @param pointCount 测试点数
 */
export const measureRenderPerformance = async (pointCount: number): Promise<{
  averageFPS: number;
  maxMemoryUsage: number;
}> => {
  const fpsSamples: number[] = [];
  const memorySamples: number[] = [];
  let maxMemory = 0;

  const monitor = () => {
    const fps = Math.round(1000 / (performance.now() - lastTime));
    const memory = performance.memory?.usedJSHeapSize || 0;

    fpsSamples.push(fps);
    memorySamples.push(memory);
    maxMemory = Math.max(maxMemory, memory);

    lastTime = performance.now();
  };

  let lastTime = performance.now();
  const interval = setInterval(monitor, 1000);

  // 模拟大量点渲染
  await new Promise(resolve => setTimeout(resolve, 5000));
  clearInterval(interval);

  const averageFPS = Math.round(fpsSamples.reduce((a, b) => a + b, 0) / fpsSamples.length);
  const maxMemoryUsage = Math.round(maxMemory / 1024 / 1024);

  return { averageFPS, maxMemoryUsage };
};

/**
 * 测量图层切换性能
 */
export const measureLayerSwitchPerformance = async (): Promise<{
  switchTime: number;
}> => {
  const startTime = performance.now();

  // 模拟图层切换操作
  await new Promise(resolve => setTimeout(resolve, 100));

  const switchTime = performance.now() - startTime;
  return { switchTime };
};
