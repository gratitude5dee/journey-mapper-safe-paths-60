
import React, { useState, useEffect } from 'react';
import MapComponent from '@/components/MapComponent';
import MapControls from '@/components/MapControls';
import { parseCSV } from '@/utils/csvParser';

// Define initial map options
const initialMapOptions: Omit<SafeMapOptions, 'containerId'> = {
  style: 'mapbox://styles/mapbox/dark-v11',
  center: [-98.5795, 39.8283], // Center of US
  initialZoom: 4,
};

// Define the SafeMapOptions type here since we can't import it
interface SafeMapOptions {
  containerId: string;
  style: string;
  center: [number, number];
  initialZoom: number;
}

const MapPage: React.FC = () => {
  // State for layer visibility and controls
  const [showCrimeHeatmap, setShowCrimeHeatmap] = useState(false);
  const [showCrimeCluster, setShowCrimeCluster] = useState(false);
  const [showDottedLine, setShowDottedLine] = useState(false);
  const [showCustomIcons, setShowCustomIcons] = useState(false);
  const [showDataDriven, setShowDataDriven] = useState(false);
  
  // State for crime data
  const [crimeData, setCrimeData] = useState<GeoJSON.FeatureCollection | null>(null);
  const [loadingCrimeData, setLoadingCrimeData] = useState(false);
  const [errorCrimeData, setErrorCrimeData] = useState<string | null>(null);
  
  // Vector source URL for data-driven styling example
  const ethnicitySourceUrl = 'mapbox://examples.8fgz4egr';

  // Fetch crime data
  useEffect(() => {
    const fetchCrimeData = async () => {
      setLoadingCrimeData(true);
      setErrorCrimeData(null);
      
      try {
        const response = await fetch('/crime_frequency_aggregated.csv');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const csvText = await response.text();
        const parsedData = parseCSV(csvText);
        
        // Convert to GeoJSON
        const features: GeoJSON.Feature[] = parsedData.map(row => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [parseFloat(row.longitude), parseFloat(row.latitude)]
          },
          properties: {
            frequency: parseFloat(row.frequency) || 0
          }
        }));
        
        const geoJsonData: GeoJSON.FeatureCollection = {
          type: 'FeatureCollection',
          features
        };
        
        setCrimeData(geoJsonData);
      } catch (error) {
        console.error('Error fetching crime data:', error);
        setErrorCrimeData('Failed to load crime data. Please try again later.');
      } finally {
        setLoadingCrimeData(false);
      }
    };
    
    fetchCrimeData();
  }, []);

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full">
      {/* Loading/Error States */}
      {loadingCrimeData && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-blue-100 text-blue-800 p-2 rounded">
          Loading crime data...
        </div>
      )}
      
      {errorCrimeData && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-red-100 text-red-800 p-2 rounded">
          Error: {errorCrimeData}
        </div>
      )}

      {/* Map Controls */}
      <MapControls
        showCrimeHeatmap={showCrimeHeatmap}
        setShowCrimeHeatmap={setShowCrimeHeatmap}
        showCrimeCluster={showCrimeCluster}
        setShowCrimeCluster={setShowCrimeCluster}
        showDottedLine={showDottedLine}
        setShowDottedLine={setShowDottedLine}
        showCustomIcons={showCustomIcons}
        setShowCustomIcons={setShowCustomIcons}
        showDataDriven={showDataDriven}
        setShowDataDriven={setShowDataDriven}
        isLoading={loadingCrimeData}
      />

      {/* Map Component */}
      <MapComponent
        mapId="main-map"
        options={initialMapOptions}
        showCrimeHeatmap={showCrimeHeatmap}
        showCrimeCluster={showCrimeCluster}
        showDottedLine={showDottedLine}
        showCustomIcons={showCustomIcons}
        showDataDriven={showDataDriven}
        crimeData={crimeData}
        ethnicitySourceUrl={ethnicitySourceUrl}
      />
    </div>
  );
};

export default MapPage;
