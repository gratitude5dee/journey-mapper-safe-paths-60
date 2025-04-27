
import React, { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@safe-routes/directions';
import MapComponentWithInstance from '@/components/MapComponentWithInstance';
import MapControls from '@/components/MapControls';
import { DirectionsInputs } from '@/components/DirectionsInputs';

const initialMapOptions = {
  style: 'mapbox://styles/mapbox/navigation-night-v1', // Changed to navy blue theme
  center: [-122.4194, 37.7749] as [number, number],
  initialZoom: 12,
};

interface MapFeatureState {
  showHeatmap: boolean;
  showCluster: boolean;
  showDottedLine: boolean;
  showCustomIcons: boolean;
  showDataDriven: boolean;
  currentMonth: number;
}

const MapPage: React.FC = () => {
  const [state, setState] = useState<MapFeatureState>({
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

  // Effect to add/remove Directions control
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!mapboxgl.accessToken) {
      console.error("Mapbox access token is not set");
      setErrorEarthquakes("Mapbox token missing");
      return;
    }

    if (!directionsControlRef.current) {
      directionsControlRef.current = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: 'metric',
        profile: 'mapbox/driving-traffic',
        controls: {
          inputs: false,
          instructions: false,
          profileSwitcher: false
        },
      });

      try {
        map.addControl(directionsControlRef.current, 'top-left');

        directionsControlRef.current.on('route', (e: any) => {
          if (e.route && e.route.length > 0) {
            console.log('Route calculated:', e.route[0].distance, e.route[0].duration);
            setErrorEarthquakes(null);
          }
        });

        directionsControlRef.current.on('error', (e: any) => {
          console.error('Directions error:', e.error);
          setErrorEarthquakes(`Directions Error: ${e.error}`);
        });

      } catch (e) {
        console.error("Failed to add Directions control:", e);
        directionsControlRef.current = null;
      }
    }

    return () => {
      const control = directionsControlRef.current;
      if (control && map.hasControl(control as any)) {
        map.removeControl(control as any);
        directionsControlRef.current = null;
      }
    };
  }, [mapInstanceRef.current]);

  const handleSetProfile = (profile: string) => {
    if (directionsControlRef.current) {
      directionsControlRef.current.setProfile(profile);
    }
  };

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full">
      {errorEarthquakes && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-red-100 text-red-800 p-2 rounded">
          {errorEarthquakes}
        </div>
      )}
      
      <DirectionsInputs
        onSetOrigin={(query) => directionsControlRef.current?.setOrigin(query)}
        onSetDestination={(query) => directionsControlRef.current?.setDestination(query)}
        onSetProfile={handleSetProfile}
        onReverse={() => directionsControlRef.current?.reverse()}
      />

      <MapControls
        {...state}
        setShowHeatmap={(show) => setState(prev => ({ ...prev, showHeatmap: show }))}
        setShowCluster={(show) => setState(prev => ({ ...prev, showCluster: show }))}
        setShowDottedLine={(show) => setState(prev => ({ ...prev, showDottedLine: show }))}
        setShowCustomIcons={(show) => setState(prev => ({ ...prev, showCustomIcons: show }))}
        setShowDataDriven={(show) => setState(prev => ({ ...prev, showDataDriven: show }))}
        setCurrentMonth={(month) => setState(prev => ({ ...prev, currentMonth: month }))}
        isLoading={false}
      />

      <MapComponentWithInstance
        mapId="main-map"
        options={initialMapOptions}
        {...state}
        onMapLoad={(map) => {
          if (!mapInstanceRef.current) {
            mapInstanceRef.current = map;
          }
        }}
        earthquakeData={null}
        ethnicitySourceUrl="mapbox://examples.8fgz4egr"
      />
    </div>
  );
};

export default MapPage;
