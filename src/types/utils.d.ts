declare module '@/utils/coordinate' {
  export function transformCoordinates(
    coordinates: number[],
    sourceProj: string,
    targetProj: string
  ): number[];

  export function formatCoordinates(
    coordinates: number[],
    precision: number
  ): string;

  export function calculateDistance(
    coord1: number[],
    coord2: number[]
  ): number;

  export function calculateArea(
    coordinates: number[][]
  ): number;
}

declare module '@/utils/performance' {
  export class PerformanceMonitor {
    constructor(map: any);
    start(): void;
    stop(): void;
    getFPS(): number;
    getMemoryUsage(): number;
    getLayerCount(): number;
  }

  export function optimizeLayerVisibility(
    map: any,
    viewport: any
  ): void;

  export function simplifyGeometries(
    features: any[],
    tolerance: number
  ): any[];
}

declare module '@/utils/error-handling' {
  export function handleMapError(error: Error): void;
  export function handleLayerError(error: Error): void;
  export function handleTileError(error: Error): void;
  export function handleInteractionError(error: Error): void;
}
