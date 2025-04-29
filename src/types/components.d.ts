declare module '@/components/map/MapContainer.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{
    center?: number[];
    zoom?: number;
    projection?: string;
    layers?: any[];
    controls?: any[];
    interactions?: any[];
  }>;
  export default component;
}

declare module '@/components/map/LayerManager.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{
    layers?: any[];
    selectedLayer?: string;
  }>;
  export default component;
}

declare module '@/components/map/StyleManager.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{
    styles?: any;
    selectedStyle?: string;
  }>;
  export default component;
}

declare module '@/components/map/PerformanceMonitor.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{
    map?: any;
    showFPS?: boolean;
    showMemory?: boolean;
    showLayers?: boolean;
  }>;
  export default component;
}
