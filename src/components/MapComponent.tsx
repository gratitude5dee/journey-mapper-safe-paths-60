
import React, { useEffect, useRef } from 'react';
import { useSafeMap } from '@/hooks/useSafeMap';
import type { SafeMapOptions } from '@/hooks/useSafeMap';
import mapboxgl, { Map, Marker } from 'mapbox-gl';

interface MapComponentProps {
  mapId: string;
  options: Omit<SafeMapOptions, 'containerId'>;
  // Feature flags
  showCrimeHeatmap: boolean;
  showCrimeCluster: boolean;
  showDottedLine: boolean;
  showCustomIcons: boolean;
  showDataDriven: boolean;
  // Data and controls
  crimeData: GeoJSON.FeatureCollection | null;
  ethnicitySourceUrl: string;
}

// Define source and layer IDs consistently
const CRIME_SOURCE_ID = 'crimes';
const CRIME_HEATMAP_LAYER_ID = 'crimes-heat';
const CRIME_POINT_LAYER_ID = 'crimes-point';
const CRIME_CLUSTER_SOURCE_ID = 'crime-clusters';
const CRIME_CLUSTER_CIRCLES_LAYER_ID = 'crime-cluster-circles';
const CRIME_CLUSTER_COUNT_LAYER_ID = 'crime-cluster-count';
const CRIME_UNCLUSTERED_POINT_LAYER_ID = 'crime-unclustered-point';
const ETHNICITY_SOURCE_ID = 'ethnicity';
const DATADRIVEN_LAYER_ID = 'population-circles';
const DOTTED_SOURCE_ID = 'route-data';
const DOTTED_LAYER_ID = 'route-line';
const DOTTED_IMAGE_ID = 'pattern-dot';

const MapComponent: React.FC<MapComponentProps> = ({
  mapId,
  options,
  showCrimeHeatmap,
  showCrimeCluster,
  showDottedLine,
  showCustomIcons,
  showDataDriven,
  crimeData,
  ethnicitySourceUrl
}) => {
  const mapInstance = useSafeMap({ containerId: mapId, ...options });
  const iconMarkersRef = useRef<Marker[]>([]);
  
  // Helper function to add or update a source
  const addOrUpdateSource = (map: Map, id: string, sourceOptions: mapboxgl.AnySourceData) => {
    const existingSource = map.getSource(id);
    if (existingSource && sourceOptions.type === 'geojson' && 'setData' in existingSource) {
      (existingSource as mapboxgl.GeoJSONSource).setData(sourceOptions.data as GeoJSON.FeatureCollection);
    } else if (!existingSource) {
      map.addSource(id, sourceOptions);
    }
  };

  // Helper function to remove layer and source
  const removeLayerAndSource = (map: Map, layerId: string | string[], sourceId: string) => {
    const layers = Array.isArray(layerId) ? layerId : [layerId];
    layers.forEach(id => {
      if (map.getLayer(id)) {
        map.removeLayer(id);
      }
    });
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }
  };

  // Crime data handling
  useEffect(() => {
    if (!mapInstance || !crimeData) return;

    addOrUpdateSource(mapInstance, CRIME_SOURCE_ID, {
      type: 'geojson',
      data: crimeData,
      cluster: showCrimeCluster,
      clusterMaxZoom: 14,
      clusterRadius: 50
    });

    return () => {
      // Source cleanup will be handled by feature-specific effects
    };
  }, [mapInstance, crimeData, showCrimeCluster]);

  // Heatmap Layer
  useEffect(() => {
    if (!mapInstance || !crimeData) return;

    const addHeatmapLayer = () => {
      if (!mapInstance.getLayer(CRIME_HEATMAP_LAYER_ID)) {
        mapInstance.addLayer({
          id: CRIME_HEATMAP_LAYER_ID,
          type: 'heatmap',
          source: CRIME_SOURCE_ID,
          paint: {
            // Adjust weight based on crime frequency
            'heatmap-weight': ['interpolate', ['linear'], ['get', 'frequency'], 
              0, 0,
              10, 0.3,
              50, 0.6,
              100, 1
            ],
            'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
            'heatmap-color': [
              'interpolate', ['linear'], ['heatmap-density'],
              0, 'rgba(33,102,172,0)',
              0.2, 'rgb(103,169,207)',
              0.4, 'rgb(209,229,240)',
              0.6, 'rgb(253,219,199)',
              0.8, 'rgb(239,138,98)',
              1, 'rgb(178,24,43)'
            ],
            'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
            'heatmap-opacity': 0.8
          }
        });
      }

      if (!mapInstance.getLayer(CRIME_POINT_LAYER_ID)) {
        mapInstance.addLayer({
          id: CRIME_POINT_LAYER_ID,
          type: 'circle',
          source: CRIME_SOURCE_ID,
          paint: {
            // Adjust radius based on crime frequency
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 
              7, ['interpolate', ['linear'], ['get', 'frequency'], 
                1, 1, 
                50, 4, 
                100, 8
              ], 
              16, ['interpolate', ['linear'], ['get', 'frequency'], 
                1, 5, 
                50, 20, 
                100, 40
              ]
            ],
            // Adjust color based on crime frequency
            'circle-color': ['interpolate', ['linear'], ['get', 'frequency'], 
              1, 'rgba(33,102,172,0)', 
              10, 'rgb(103,169,207)', 
              30, 'rgb(209,229,240)', 
              50, 'rgb(253,219,199)', 
              70, 'rgb(239,138,98)', 
              100, 'rgb(178,24,43)'
            ],
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity': 0.8
          }
        });
      }
    };

    if (showCrimeHeatmap && mapInstance.isStyleLoaded()) {
      addHeatmapLayer();
    } else if (showCrimeHeatmap) {
      mapInstance.once('style.load', addHeatmapLayer);
    } else {
      if (mapInstance.getLayer(CRIME_HEATMAP_LAYER_ID)) mapInstance.removeLayer(CRIME_HEATMAP_LAYER_ID);
      if (mapInstance.getLayer(CRIME_POINT_LAYER_ID)) mapInstance.removeLayer(CRIME_POINT_LAYER_ID);
    }

    return () => {
      if (mapInstance && mapInstance.getLayer(CRIME_HEATMAP_LAYER_ID)) {
        mapInstance.removeLayer(CRIME_HEATMAP_LAYER_ID);
      }
      if (mapInstance && mapInstance.getLayer(CRIME_POINT_LAYER_ID)) {
        mapInstance.removeLayer(CRIME_POINT_LAYER_ID);
      }
    };
  }, [mapInstance, showCrimeHeatmap, crimeData]);

  // Cluster Layer
  useEffect(() => {
    if (!mapInstance || !crimeData) return;

    const addClusterLayers = () => {
      if (!mapInstance.getLayer(CRIME_CLUSTER_CIRCLES_LAYER_ID)) {
        mapInstance.addLayer({
          id: CRIME_CLUSTER_CIRCLES_LAYER_ID,
          type: 'circle',
          source: CRIME_SOURCE_ID,
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#51bbd6',
              30, '#f1f075',
              75, '#f28cb1'
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              20,
              30, 30,
              75, 40
            ]
          }
        });
      }

      if (!mapInstance.getLayer(CRIME_CLUSTER_COUNT_LAYER_ID)) {
        mapInstance.addLayer({
          id: CRIME_CLUSTER_COUNT_LAYER_ID,
          type: 'symbol',
          source: CRIME_SOURCE_ID,
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
          }
        });
      }

      if (!mapInstance.getLayer(CRIME_UNCLUSTERED_POINT_LAYER_ID)) {
        mapInstance.addLayer({
          id: CRIME_UNCLUSTERED_POINT_LAYER_ID,
          type: 'circle',
          source: CRIME_SOURCE_ID,
          filter: ['!', ['has', 'point_count']],
          paint: {
            // Adjust color based on crime frequency
            'circle-color': ['interpolate', ['linear'], ['get', 'frequency'], 
              0, '#11b4da', 
              50, '#f7a35c', 
              100, '#8b0000'
            ],
            // Adjust radius based on crime frequency
            'circle-radius': ['interpolate', ['linear'], ['get', 'frequency'], 
              0, 4, 
              50, 8,
              100, 16
            ],
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
          }
        });
      }
    };

    if (showCrimeCluster && mapInstance.isStyleLoaded()) {
      addClusterLayers();
    } else if (showCrimeCluster) {
      mapInstance.once('style.load', addClusterLayers);
    } else {
      if (mapInstance.getLayer(CRIME_CLUSTER_CIRCLES_LAYER_ID)) mapInstance.removeLayer(CRIME_CLUSTER_CIRCLES_LAYER_ID);
      if (mapInstance.getLayer(CRIME_CLUSTER_COUNT_LAYER_ID)) mapInstance.removeLayer(CRIME_CLUSTER_COUNT_LAYER_ID);
      if (mapInstance.getLayer(CRIME_UNCLUSTERED_POINT_LAYER_ID)) mapInstance.removeLayer(CRIME_UNCLUSTERED_POINT_LAYER_ID);
    }

    return () => {
      if (mapInstance) {
        if (mapInstance.getLayer(CRIME_CLUSTER_CIRCLES_LAYER_ID)) mapInstance.removeLayer(CRIME_CLUSTER_CIRCLES_LAYER_ID);
        if (mapInstance.getLayer(CRIME_CLUSTER_COUNT_LAYER_ID)) mapInstance.removeLayer(CRIME_CLUSTER_COUNT_LAYER_ID);
        if (mapInstance.getLayer(CRIME_UNCLUSTERED_POINT_LAYER_ID)) mapInstance.removeLayer(CRIME_UNCLUSTERED_POINT_LAYER_ID);
      }
    };
  }, [mapInstance, showCrimeCluster, crimeData]);

  // Data-Driven Styling
  useEffect(() => {
    if (!mapInstance) return;

    const addDataDrivenLayer = () => {
      if (!mapInstance.getSource(ETHNICITY_SOURCE_ID)) {
        mapInstance.addSource(ETHNICITY_SOURCE_ID, {
          type: 'vector',
          url: ethnicitySourceUrl
        });
      }

      if (!mapInstance.getLayer(DATADRIVEN_LAYER_ID)) {
        mapInstance.addLayer({
          id: DATADRIVEN_LAYER_ID,
          type: 'circle',
          source: ETHNICITY_SOURCE_ID,
          'source-layer': 'sf2010',
          paint: {
            'circle-radius': { base: 1.75, stops: [[12, 2], [22, 180]] },
            'circle-color': [
              'match',
              ['get', 'ethnicity'],
              'White', '#fbb03b',
              'Black', '#223b53',
              'Hispanic', '#e55e5e',
              'Asian', '#3bb2d0',
              '#ccc'
            ]
          }
        });
      }
    };

    if (showDataDriven && mapInstance.isStyleLoaded()) {
      addDataDrivenLayer();
    } else if (showDataDriven) {
      mapInstance.once('style.load', addDataDrivenLayer);
    } else {
      removeLayerAndSource(mapInstance, DATADRIVEN_LAYER_ID, ETHNICITY_SOURCE_ID);
    }

    return () => {
      if (mapInstance) {
        removeLayerAndSource(mapInstance, DATADRIVEN_LAYER_ID, ETHNICITY_SOURCE_ID);
      }
    };
  }, [mapInstance, showDataDriven, ethnicitySourceUrl]);

  // Dotted Line Effect
  useEffect(() => {
    if (!mapInstance) return;
    let isImageLoaded = false;

    const addDottedLineLayer = () => {
      if (!isImageLoaded) return;

      if (!mapInstance.getSource(DOTTED_SOURCE_ID)) {
        mapInstance.addSource(DOTTED_SOURCE_ID, {
          type: 'geojson',
          lineMetrics: true,
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [
                [-122.42, 37.78],
                [-122.41, 37.77],
                [-122.40, 37.76],
                [-122.39, 37.75],
                [-122.38, 37.74]
              ]
            }
          }
        });
      }

      if (!mapInstance.getLayer(DOTTED_LAYER_ID)) {
        mapInstance.addLayer({
          id: DOTTED_LAYER_ID,
          type: 'line',
          source: DOTTED_SOURCE_ID,
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-pattern': DOTTED_IMAGE_ID,
            'line-width': 8
          }
        });
      }
    };

    if (showDottedLine) {
      if (mapInstance.hasImage(DOTTED_IMAGE_ID)) {
        isImageLoaded = true;
        addDottedLineLayer();
      } else {
        mapInstance.loadImage(
          'https://docs.mapbox.com/mapbox-gl-js/assets/pattern-dot.png',
          (error, image) => {
            if (error) {
              console.error('Error loading dotted pattern image:', error);
              return;
            }
            if (image && !mapInstance.hasImage(DOTTED_IMAGE_ID)) {
              mapInstance.addImage(DOTTED_IMAGE_ID, image);
              isImageLoaded = true;
              addDottedLineLayer();
            }
          }
        );
      }
    } else {
      removeLayerAndSource(mapInstance, DOTTED_LAYER_ID, DOTTED_SOURCE_ID);
    }

    return () => {
      if (mapInstance) {
        removeLayerAndSource(mapInstance, DOTTED_LAYER_ID, DOTTED_SOURCE_ID);
      }
    };
  }, [mapInstance, showDottedLine]);

  // Custom Icons Effect
  useEffect(() => {
    if (!mapInstance) return;

    const iconGeoJson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { message: 'Safety Concern', iconSize: [40, 40] },
          geometry: { type: 'Point', coordinates: [-122.414, 37.776] }
        },
        {
          type: 'Feature',
          properties: { message: 'Police Station', iconSize: [40, 40] },
          geometry: { type: 'Point', coordinates: [-122.407, 37.784] }
        },
        {
          type: 'Feature',
          properties: { message: 'Safe Zone', iconSize: [40, 40] },
          geometry: { type: 'Point', coordinates: [-122.400, 37.778] }
        }
      ]
    };

    const addIconMarkers = () => {
      iconMarkersRef.current.forEach(marker => marker.remove());
      iconMarkersRef.current = [];

      for (const feature of iconGeoJson.features) {
        const el = document.createElement('div');
        const { iconSize, message } = feature.properties;
        const [width, height] = iconSize;
        
        el.className = 'custom-marker';
        el.style.backgroundImage = `url(https://placekitten.com/${width}/${height})`;
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
        el.style.backgroundSize = 'cover';
        el.style.borderRadius = '50%';
        el.style.border = '2px solid white';
        el.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';

        el.addEventListener('click', () => {
          new mapboxgl.Popup({ offset: 25 })
            .setLngLat(feature.geometry.coordinates as [number, number])
            .setHTML(`<p>${message}</p>`)
            .addTo(mapInstance);
        });

        const marker = new mapboxgl.Marker(el)
          .setLngLat(feature.geometry.coordinates as [number, number])
          .addTo(mapInstance);
          
        iconMarkersRef.current.push(marker);
      }
    };

    const removeIconMarkers = () => {
      iconMarkersRef.current.forEach(marker => marker.remove());
      iconMarkersRef.current = [];
    };

    if (showCustomIcons) {
      addIconMarkers();
    } else {
      removeIconMarkers();
    }

    return () => {
      removeIconMarkers();
    };
  }, [mapInstance, showCustomIcons]);

  return <div id={mapId} className="absolute inset-0" />;
};

export default MapComponent;
