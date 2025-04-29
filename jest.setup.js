import { config } from '@vue/test-utils';

// 配置Vue Test Utils
config.global.mocks = {
  $t: (key) => key
};

// 模拟window对象
Object.defineProperty(window, 'performance', {
  value: {
    memory: {
      usedJSHeapSize: 0,
      totalJSHeapSize: 0
    }
  }
});

// 模拟requestAnimationFrame
global.requestAnimationFrame = (callback) => {
  return setTimeout(callback, 0);
};

// 模拟cancelAnimationFrame
global.cancelAnimationFrame = (id) => {
  clearTimeout(id);
};
