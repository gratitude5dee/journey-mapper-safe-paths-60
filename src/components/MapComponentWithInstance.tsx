
import React, { useEffect } from 'react';
import { Map } from 'mapbox-gl';
import MapComponent from './MapComponent';
import { useSafeMap } from '../hooks/useSafeMap';

interface MapComponentWithInstanceProps extends Omit<React.ComponentProps<typeof MapComponent>, 'earthquakeData'> {
  onMapLoad: (map: Map) => void;
  crimeData?: GeoJSON.FeatureCollection | null;
}

const MapComponentWithInstance: React.FC<MapComponentWithInstanceProps> = ({ onMapLoad, crimeData, ...props }) => {
  const mapInstance = useSafeMap({ containerId: props.mapId, ...props.options });

  useEffect(() => {
    if (mapInstance) {
      if (mapInstance.isStyleLoaded()) {
        onMapLoad(mapInstance);
      } else {
        const handleLoad = () => {
          onMapLoad(mapInstance);
          mapInstance.off('load', handleLoad);
        };
        mapInstance.on('load', handleLoad);
        return () => {
          if (mapInstance.getStyle()) {
            mapInstance.off('load', handleLoad);
          }
        };
      }
    }
  }, [mapInstance, onMapLoad]);

  // Pass earthquakeData as crimeData to maintain compatibility
  return <MapComponent {...props} crimeData={crimeData || null} />;
};

export default MapComponentWithInstance;
