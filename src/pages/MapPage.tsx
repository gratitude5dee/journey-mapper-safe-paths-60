
import React, { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions';
import MapComponentWithInstance from '@/components/MapComponentWithInstance';
import MapControls from '@/components/MapControls';
import { toast } from "sonner";

const initialMapOptions = {
  style: 'mapbox://styles/mapbox/navigation-night-v1',
  center: [-122.4194, 37.7749] as [number, number],
  initialZoom: 12,
};

const MapPage: React.FC = () => {
  const [state, setState] = useState({
    showHeatmap: false,
    showCluster: false,
    showDottedLine: false,
    showCustomIcons: false,
    showDataDriven: false,
    currentMonth: 0,
  });
  
  const [errorEarthquakes, setErrorEarthquakes] = useState<string | null>(null);
  const directionsControlRef = useRef<MapboxDirections | null>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!mapboxgl.accessToken) {
      console.error("Mapbox access token is not set");
      toast.error("Mapbox token missing");
      return;
    }

    if (!directionsControlRef.current) {
      directionsControlRef.current = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: 'metric',
        profile: 'mapbox/driving-traffic',
        controls: {
          inputs: true,
          instructions: true,
          profileSwitcher: true
        },
      });

      try {
        map.addControl(directionsControlRef.current, 'top-left');

        directionsControlRef.current.on('route', (e: any) => {
          if (e.route && e.route.length > 0) {
            console.log('Route calculated:', e.route[0].distance, e.route[0].duration);
            toast.success("Route calculated successfully");
            setErrorEarthquakes(null);
          }
        });

        directionsControlRef.current.on('error', (e: any) => {
          console.error('Directions error:', e.error);
          toast.error(`Directions Error: ${e.error}`);
        });

      } catch (e) {
        console.error("Failed to add Directions control:", e);
        directionsControlRef.current = null;
      }
    }

    return () => {
      const control = directionsControlRef.current;
      if (control && map.hasControl(control)) {
        map.removeControl(control);
        directionsControlRef.current = null;
      }
    };
  }, [mapInstanceRef.current]);

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full">
      {errorEarthquakes && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-red-100 text-red-800 p-2 rounded">
          {errorEarthquakes}
        </div>
      )}
      
      <MapControls
        showHeatmap={state.showHeatmap}
        setShowHeatmap={(show) => setState(prev => ({ ...prev, showHeatmap: show }))}
        showCluster={state.showCluster}
        setShowCluster={(show) => setState(prev => ({ ...prev, showCluster: show }))}
        showDottedLine={state.showDottedLine}
        setShowDottedLine={(show) => setState(prev => ({ ...prev, showDottedLine: show }))}
        showCustomIcons={state.showCustomIcons}
        setShowCustomIcons={(show) => setState(prev => ({ ...prev, showCustomIcons: show }))}
        showDataDriven={state.showDataDriven}
        setShowDataDriven={(show) => setState(prev => ({ ...prev, showDataDriven: show }))}
        currentMonth={state.currentMonth}
        setCurrentMonth={(month) => setState(prev => ({ ...prev, currentMonth: month }))}
        isLoading={false}
      />

      <MapComponentWithInstance
        mapId="main-map"
        options={initialMapOptions}
        showHeatmap={state.showHeatmap}
        showCluster={state.showCluster}
        showDottedLine={state.showDottedLine}
        showCustomIcons={state.showCustomIcons}
        showDataDriven={state.showDataDriven}
        currentMonth={state.currentMonth}
        earthquakeData={null}
        ethnicitySourceUrl="mapbox://examples.8fgz4egr"
        onMapLoad={(map) => {
          if (!mapInstanceRef.current) {
            mapInstanceRef.current = map;
          }
        }}
      />
    </div>
  );
};

export default MapPage;
