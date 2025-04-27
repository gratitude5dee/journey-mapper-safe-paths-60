
import React, { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@safe-routes/directions'; // Using our aliased import
import MapComponentWithInstance from '@/components/MapComponentWithInstance';
import MapControls from '@/components/MapControls';
import { DirectionsInputs } from '@/components/DirectionsInputs';

// Define initial map options - centered on San Francisco
const initialMapOptions = {
  style: 'mapbox://styles/mapbox/dark-v11',
  center: [-122.4194, 37.7749] as [number, number],
  initialZoom: 12,
};

const MapPage: React.FC = () => {
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showCluster, setShowCluster] = useState(false);
  const [showDottedLine, setShowDottedLine] = useState(false);
  const [showCustomIcons, setShowCustomIcons] = useState(false);
  const [showDataDriven, setShowDataDriven] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<number>(0);
  const [errorEarthquakes, setErrorEarthquakes] = useState<string | null>(null);
  
  const directionsControlRef = useRef<MapboxDirections | null>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  
  // Effect to add/remove Directions control
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!mapboxgl.accessToken) {
      console.error("Mapbox access token is not set. Cannot initialize Directions control.");
      setErrorEarthquakes("Mapbox token missing, cannot show directions.");
      return;
    }

    if (!directionsControlRef.current) {
      console.log("Initializing Directions Control...");
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
        console.log("Directions control added.");

        directionsControlRef.current.on('route', (e: any) => {
          if (e.route && e.route.length > 0) {
            console.log('Route calculated:', e.route[0].distance, e.route[0].duration);
            setErrorEarthquakes(null);
          } else {
            console.log('Route event received, but no route data found.', e);
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
      if (control && map && map.hasControl(control as any)) {
        try {
          map.removeControl(control as any);
          console.log("Directions control removed.");
        } catch (e) {
          console.error("Error removing directions control:", e);
        }
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
      
      <DirectionsInputs
        initialProfile="mapbox/driving-traffic"
        onSetOrigin={(query) => directionsControlRef.current?.setOrigin(query)}
        onSetDestination={(query) => directionsControlRef.current?.setDestination(query)}
        onSetProfile={(profile) => directionsControlRef.current?.setProfile(profile)}
        onReverse={() => directionsControlRef.current?.reverse()}
      />
      
      <MapControls
        showCrimeHeatmap={showHeatmap}
        setShowCrimeHeatmap={setShowHeatmap}
        showCrimeCluster={showCluster}
        setShowCrimeCluster={setShowCluster}
        showDottedLine={showDottedLine}
        setShowDottedLine={setShowDottedLine}
        showCustomIcons={showCustomIcons}
        setShowCustomIcons={setShowCustomIcons}
        showDataDriven={showDataDriven}
        setShowDataDriven={setShowDataDriven}
        isLoading={false}
      />

      <MapComponentWithInstance
        mapId="main-map"
        options={initialMapOptions}
        showCrimeHeatmap={showHeatmap}
        showCrimeCluster={showCluster}
        showDottedLine={showDottedLine}
        showCustomIcons={showCustomIcons}
        showDataDriven={showDataDriven}
        currentMonth={currentMonth}
        crimeData={null}
        ethnicitySourceUrl="mapbox://examples.8fgz4egr"
        onMapLoad={(map) => {
          if (!mapInstanceRef.current) {
            mapInstanceRef.current = map;
            setCurrentMonth(prev => prev);
          }
        }}
      />
    </div>
  );
};

export default MapPage;
