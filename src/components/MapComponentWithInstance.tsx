
import React, { useEffect } from 'react';
import { Map } from 'mapbox-gl';
import MapComponent from './MapComponent';
import { useSafeMap } from '../hooks/useSafeMap';

interface MapComponentWithInstanceProps extends React.ComponentProps<typeof MapComponent> {
  onMapLoad: (map: Map) => void;
}

const MapComponentWithInstance: React.FC<MapComponentWithInstanceProps> = ({ onMapLoad, ...props }) => {
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

  return <MapComponent {...props} />;
};

export default MapComponentWithInstance;
