import proj4 from 'proj4';
import { transform } from 'ol/proj';

// 注册常用投影
proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');
proj4.defs('EPSG:3857', '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs');

/**
 * 坐标转换
 * @param coord 坐标点 [x, y]
 * @param from 源投影
 * @param to 目标投影
 * @returns 转换后的坐标
 */
export const transformCoordinate = (coord: number[], from: string, to: string): number[] => {
  try {
    return transform(coord, from, to);
  } catch (error) {
    console.error('Coordinate transform error:', error);
    return coord;
  }
};

/**
 * 检查坐标范围
 * @param coord 坐标点 [x, y]
 * @returns 是否在有效范围内
 */
export const checkBounds = (coord: number[]): boolean => {
  const [x, y] = coord;
  return x >= -180 && x <= 180 && y >= -90 && y <= 90;
};

/**
 * 计算两点间距离
 * @param coord1 第一个点 [x1, y1]
 * @param coord2 第二个点 [x2, y2]
 * @returns 距离（米）
 */
export const calculateDistance = (coord1: number[], coord2: number[]): number => {
  const [x1, y1] = coord1;
  const [x2, y2] = coord2;

  const R = 6378137; // 地球半径（米）
  const dLat = (y2 - y1) * Math.PI / 180;
  const dLon = (x2 - x1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(y1 * Math.PI / 180) * Math.cos(y2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * 计算多边形面积
 * @param coordinates 多边形顶点坐标数组
 * @returns 面积（平方米）
 */
export const calculateArea = (coordinates: number[][]): number => {
  let area = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    const [x1, y1] = coordinates[i];
    const [x2, y2] = coordinates[i + 1];
    area += x1 * y2 - x2 * y1;
  }
  return Math.abs(area) / 2;
};
