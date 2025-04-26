
import type { Map, MapboxOptions } from 'mapbox-gl';

export interface SafeMapOptions {
  /** HTML element ID where the map will be rendered */
  containerId: string;
  /** Mapbox style URL or style object */
  style: MapboxOptions['style'];
  /** Initial map center coordinates [longitude, latitude] */
  center: [number, number];
  /** Initial zoom level */
  initialZoom: number;
}

declare global {
  interface WindowEventMap {
    'safe-map-ready': CustomEvent;
  }
}
