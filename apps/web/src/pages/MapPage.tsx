
import React, { useState, useEffect } from 'react';
import MapComponent from '@/components/MapComponent';
import MapControls from '@/components/MapControls';
import { SafeMapOptions } from '@safe-routes/map';

// Define initial map options
const initialMapOptions: Omit<SafeMapOptions, 'containerId'> = {
  style: 'mapbox://styles/mapbox/dark-v11',
  center: [-98.5795, 39.8283], // Center of US
  initialZoom: 4,
};

const MapPage: React.FC = () => {
  // State for layer visibility and controls
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showCluster, setShowCluster] = useState(false);
  const [showDottedLine, setShowDottedLine] = useState(false);
  const [showCustomIcons, setShowCustomIcons] = useState(false);
  const [showDataDriven, setShowDataDriven] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<number>(0);
  
  // State for earthquake data
  const [earthquakeData, setEarthquakeData] = useState<GeoJSON.FeatureCollection | null>(null);
  const [loadingEarthquakes, setLoadingEarthquakes] = useState(false);
  const [errorEarthquakes, setErrorEarthquakes] = useState<string | null>(null);
  
  // Vector source URL for data-driven styling example
  const ethnicitySourceUrl = 'mapbox://examples.8fgz4egr';

  // Fetch earthquake data
  useEffect(() => {
    const fetchEarthquakeData = async () => {
      setLoadingEarthquakes(true);
      setErrorEarthquakes(null);
      
      try {
        const response = await fetch('https://docs.mapbox.com/mapbox-gl-js/assets/significant-earthquakes-2015.geojson');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Add month property to each feature
        data.features = data.features.map((feature: any) => {
          feature.properties.month = new Date(feature.properties.time).getMonth();
          return feature;
        });
        
        setEarthquakeData(data);
      } catch (error) {
        console.error('Error fetching earthquake data:', error);
        setErrorEarthquakes('Failed to load earthquake data. Please try again later.');
      } finally {
        setLoadingEarthquakes(false);
      }
    };
    
    fetchEarthquakeData();
  }, []);

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full">
      {/* Loading/Error States */}
      {loadingEarthquakes && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-blue-100 text-blue-800 p-2 rounded">
          Loading earthquake data...
        </div>
      )}
      
      {errorEarthquakes && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-red-100 text-red-800 p-2 rounded">
          Error: {errorEarthquakes}
        </div>
      )}

      {/* Map Controls */}
      <MapControls
        showHeatmap={showHeatmap}
        setShowHeatmap={setShowHeatmap}
        showCluster={showCluster}
        setShowCluster={setShowCluster}
        showDottedLine={showDottedLine}
        setShowDottedLine={setShowDottedLine}
        showCustomIcons={showCustomIcons}
        setShowCustomIcons={setShowCustomIcons}
        showDataDriven={showDataDriven}
        setShowDataDriven={setShowDataDriven}
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        isLoading={loadingEarthquakes}
      />

      {/* Map Component */}
      <MapComponent
        mapId="main-map"
        options={initialMapOptions}
        showHeatmap={showHeatmap}
        showCluster={showCluster}
        showDottedLine={showDottedLine}
        showCustomIcons={showCustomIcons}
        showDataDriven={showDataDriven}
        currentMonth={currentMonth}
        earthquakeData={earthquakeData}
        ethnicitySourceUrl={ethnicitySourceUrl}
      />
    </div>
  );
};

export default MapPage;
