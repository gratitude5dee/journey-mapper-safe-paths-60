
import React from 'react';
import { useSafeMap } from '@/hooks/useSafeMap';
import MapControls from '@/components/MapControls';
import type { MapFeatureState } from '@/hooks/useMapFeatures';

interface MapContainerProps extends MapFeatureState {
  setShowHeatmap: (show: boolean) => void;
  setShowCluster: (show: boolean) => void;
  setShowDottedLine: (show: boolean) => void;
  setShowCustomIcons: (show: boolean) => void;
  setShowDataDriven: (show: boolean) => void;
  className?: string;
  children?: React.ReactNode;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  showCrimeHeatmap: showHeatmap,
  setShowCrimeHeatmap: setShowHeatmap,
  showCrimeCluster: showCluster,
  setShowCrimeCluster: setShowCluster,
  showDottedLine,
  setShowDottedLine,
  showCustomIcons,
  setShowCustomIcons,
  showDataDriven,
  setShowDataDriven,
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
