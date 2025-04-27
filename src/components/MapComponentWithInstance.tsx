
import React, { useEffect } from 'react';
import { Map } from 'mapbox-gl';
import MapComponent from './MapComponent';

export interface MapComponentWithInstanceProps {
  mapId: string;
  options: {
    style: string;
    center: [number, number];
    initialZoom: number;
  };
  showHeatmap: boolean;
  showCluster: boolean;
  showDottedLine: boolean;
  showCustomIcons: boolean;
  showDataDriven: boolean;
  currentMonth: number;
  earthquakeData: GeoJSON.FeatureCollection | null;
  ethnicitySourceUrl: string;
  onMapLoad: (map: Map) => void;
}

const MapComponentWithInstance: React.FC<MapComponentWithInstanceProps> = ({
  mapId,
  options,
  showHeatmap,
  showCluster,
  showDottedLine,
  showCustomIcons,
  showDataDriven,
  currentMonth,
  earthquakeData,
  ethnicitySourceUrl,
  onMapLoad
}) => {
  useEffect(() => {
    const mapContainer = document.getElementById(mapId);
    if (!mapContainer) {
      console.error(`Map container with id ${mapId} not found.`);
      return;
    }

    const initializeMap = () => {
      const map = new Map({
        container: mapId,
        style: options.style,
        center: options.center,
        zoom: options.initialZoom
      });

      map.on('load', () => {
        onMapLoad(map);
      });
    };

    if (mapContainer) {
      initializeMap();
    }

    return () => {
      // Cleanup function if needed
    };
  }, [mapId, options, onMapLoad]);

  return (
    <MapComponent
      mapId={mapId}
      options={options}
      showHeatmap={showHeatmap}
      showCluster={showCluster}
      showDottedLine={showDottedLine}
      showCustomIcons={showCustomIcons}
      showDataDriven={showDataDriven}
      currentMonth={currentMonth}
      earthquakeData={earthquakeData}
      ethnicitySourceUrl={ethnicitySourceUrl}
    />
  );
};

export default MapComponentWithInstance;
