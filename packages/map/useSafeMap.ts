
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import type { Map } from 'mapbox-gl';
import type { SafeMapOptions } from './types';

/**
 * A React hook that creates and manages a Mapbox GL JS map instance.
 * IMPORTANT: Ensure mapboxgl.accessToken is set *before* calling this hook.
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
 * mapboxgl.accessToken = 'YOUR_TOKEN'; // Set token first
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
  const isInitialized = useRef(false); // Prevent re-initialization on fast refresh

  useEffect(() => {
    const container = document.getElementById(containerId);

    if (!container || isInitialized.current) {
      return;
    }

    if (!mapboxgl.accessToken) {
      console.error(
        'Mapbox token not set. Please set mapboxgl.accessToken globally before using useSafeMap.'
      );
      return;
    }
    
    // Check if the container already has a map instance attached by Mapbox GL JS
    if (container.classList.contains('mapboxgl-map')) {
      console.warn(`Map container "${containerId}" already has a map instance. Skipping initialization.`);
      return;
    }

    let map: mapboxgl.Map;
    try {
      console.log(`Initializing Mapbox map in container: ${containerId}`);
      map = new mapboxgl.Map({
        container: containerId,
        style,
        center,
        zoom: initialZoom,
      });

      map.once('load', () => { // Use once to prevent multiple dispatches on style reload
        console.log(`Map style loaded for container: ${containerId}`);
        const event = new CustomEvent('safe-map-ready', { detail: { mapId: containerId } });
        window.dispatchEvent(event);
      });

      map.on('error', (e) => {
        console.error(`Mapbox error in container ${containerId}:`, e.error?.message || e);
      });

      mapRef.current = map;
      isInitialized.current = true; // Mark as initialized

    } catch (error) {
      console.error(`Error initializing Mapbox map in ${containerId}:`, error);
      isInitialized.current = false; // Reset initialization status on error
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        console.log(`Removing Mapbox map instance from container: ${containerId}`);
        mapRef.current.remove();
        mapRef.current = undefined;
        isInitialized.current = false; // Reset on cleanup
      }
    };
  }, [containerId, style, center, initialZoom]);

  // Return the current map instance
  return mapRef.current;
};
