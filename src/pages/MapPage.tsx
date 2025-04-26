
import React, { useState } from 'react';
import MapComponent from '@/components/MapComponent';
import MapControls from '@/components/MapControls';
import { crimeData, crimeDataToGeoJSON } from '@/utils/crimeDataToGeoJSON';

// Define initial map options
const initialMapOptions = {
  style: 'mapbox://styles/mapbox/dark-v11',
  center: [-122.4194, 37.7749], // Center of San Francisco
  initialZoom: 12,
};

const MapPage: React.FC = () => {
  const [showCrimeHeatmap, setShowCrimeHeatmap] = useState(false);
  const [showCrimeCluster, setShowCrimeCluster] = useState(false);
  const [showDottedLine, setShowDottedLine] = useState(false);
  const [showCustomIcons, setShowCustomIcons] = useState(false);
  const [showDataDriven, setShowDataDriven] = useState(false);
  
  // Convert static crime data to GeoJSON
  const crimeGeoJSON = crimeDataToGeoJSON(crimeData);

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full">
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
        isLoading={false}
      />

      <MapComponent
        mapId="main-map"
        options={initialMapOptions}
        showCrimeHeatmap={showCrimeHeatmap}
        showCrimeCluster={showCrimeCluster}
        showDottedLine={showDottedLine}
        showCustomIcons={showCustomIcons}
        showDataDriven={showDataDriven}
        crimeData={crimeGeoJSON}
        ethnicitySourceUrl="mapbox://examples.8fgz4egr"
      />
    </div>
  );
};

export default MapPage;
