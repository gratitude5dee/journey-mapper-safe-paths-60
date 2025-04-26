
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import type { Map } from 'mapbox-gl';

export interface SafeMapOptions {
  /** HTML element ID where the map will be rendered */
  containerId: string;
  /** Mapbox style URL or style object */
  style: mapboxgl.MapboxOptions['style'];
  /** Initial map center coordinates [longitude, latitude] */
  center: [number, number];
  /** Initial zoom level */
  initialZoom: number;
}

/**
 * A React hook that creates and manages a Mapbox GL JS map instance.
 */
export const useSafeMap = ({
  containerId,
  style,
  center,
  initialZoom,
}: SafeMapOptions): Map | undefined => {
  const mapRef = useRef<Map>();

  useEffect(() => {
    // Don't initialize the map if there's no container or if the map already exists
    const container = document.getElementById(containerId);
    if (!container || mapRef.current) return;
    
    // Don't initialize if the token isn't set
    if (!mapboxgl.accessToken) {
      console.warn('Mapbox token not set. Please set mapboxgl.accessToken before initializing the map.');
      return;
    }

    try {
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
    } catch (error) {
      console.error('Error initializing Mapbox map:', error);
    }
  }, [containerId, style, center, initialZoom]);

  return mapRef.current;
};
