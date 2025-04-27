
import React from 'react';
import { useSafeMap } from '@/hooks/useSafeMap';
import MapControls from '@/components/MapControls';
import type { MapFeatureState } from '@/hooks/useMapFeatures';

interface MapContainerProps {
  // Extend from MapFeatureState props while making them optional in this interface
  showCrimeHeatmap?: boolean; 
  setShowCrimeHeatmap?: (show: boolean) => void;
  showCrimeCluster?: boolean;
  setShowCrimeCluster?: (show: boolean) => void;
  showDottedLine?: boolean;
  setShowDottedLine?: (show: boolean) => void;
  showCustomIcons?: boolean;
  setShowCustomIcons?: (show: boolean) => void;
  showDataDriven?: boolean;
  setShowDataDriven?: (show: boolean) => void;
  isLoading?: boolean;
  
  // Additional MapContainer props
  showHeatmap?: boolean;
  setShowHeatmap?: (show: boolean) => void;
  showCluster?: boolean;
  setShowCluster?: (show: boolean) => void;
  className?: string;
  children?: React.ReactNode;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  showCrimeHeatmap,
  setShowCrimeHeatmap,
  showCrimeCluster,
  setShowCrimeCluster,
  showDottedLine,
  setShowDottedLine,
  showCustomIcons,
  setShowCustomIcons,
  showDataDriven,
  setShowDataDriven,
  showHeatmap = showCrimeHeatmap,
  setShowHeatmap = setShowCrimeHeatmap,
  showCluster = showCrimeCluster,
  setShowCluster = setShowCrimeCluster,
  isLoading = false,
  className = "h-screen",
  children
}) => {
  const mapInstance = useSafeMap({
    containerId: 'map',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [-122.4194, 37.7749],
    initialZoom: 12,
  });

  return (
    <div className={`relative ${className} w-full`}>
      <div id="map" className="absolute inset-0" />
      
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
        isLoading={isLoading}
      />

      {children}
    </div>
  );
};
