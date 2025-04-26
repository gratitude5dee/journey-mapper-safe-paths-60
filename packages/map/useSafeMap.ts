
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import type { Map } from 'mapbox-gl';
import type { SafeMapOptions } from './types';

/**
 * A React hook that creates and manages a Mapbox GL JS map instance.
 * 
 * @param options - Configuration options for the map
 * @param options.containerId - HTML element ID where the map will be rendered
 * @param options.style - Mapbox style URL or style object
 * @param options.center - Initial map center coordinates [longitude, latitude]
 * @param options.initialZoom - Initial zoom level
 * 
 * @returns The Mapbox map instance or undefined if not initialized
 * 
 * @example
 * ```tsx
 * const mapInstance = useSafeMap({
 *   containerId: 'map',
 *   style: 'mapbox://styles/mapbox/light-v11',
 *   center: [-74.5, 40],
 *   initialZoom: 9
 * });
 * ```
 */
export const useSafeMap = ({
  containerId,
  style,
  center,
  initialZoom,
}: SafeMapOptions): Map | undefined => {
  const mapRef = useRef<Map>();

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: containerId,
      style,
      center,
      zoom: initialZoom,
    });

    map.on('style.load', () => {
      const event = new CustomEvent('safe-map-ready');
      window.dispatchEvent(event);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = undefined;
    };
  }, [containerId, style, center, initialZoom]);

  return mapRef.current;
};
