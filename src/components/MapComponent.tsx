
import React, { useEffect, useRef } from 'react';
import { useSafeMap } from '@/hooks/useSafeMap';
import mapboxgl from 'mapbox-gl';

interface MapComponentProps {
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
}

// Define source and layer IDs
const CRIME_SOURCE_ID = 'crime-data';
const CRIME_HEATMAP_LAYER_ID = 'crime-heatmap';
const CRIME_CLUSTER_LAYER_ID = 'crime-clusters';
const CRIME_COUNT_LAYER_ID = 'crime-count';
const CRIME_POINT_LAYER_ID = 'crime-points';

const MapComponent: React.FC<MapComponentProps> = ({
  mapId,
  options,
  showHeatmap,
  showCluster,
  showDottedLine,
  showCustomIcons,
  showDataDriven,
  currentMonth,
  earthquakeData,
  ethnicitySourceUrl
}) => {
  const mapInstance = useSafeMap({ containerId: mapId, ...options });
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Initialize or update crime data source
  useEffect(() => {
    if (!mapInstance || !earthquakeData) return;

    const source = mapInstance.getSource(CRIME_SOURCE_ID);
    if (source && 'setData' in source) {
      (source as mapboxgl.GeoJSONSource).setData(earthquakeData);
    } else if (!source) {
      mapInstance.addSource(CRIME_SOURCE_ID, {
        type: 'geojson',
        data: earthquakeData,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      });
    }

    return () => {
      // Cleanup will be handled by individual layer effects
    };
  }, [mapInstance, earthquakeData]);

  // Crime heatmap layer
  useEffect(() => {
    if (!mapInstance) return;

    if (showHeatmap) {
      if (!mapInstance.getLayer(CRIME_HEATMAP_LAYER_ID)) {
        mapInstance.addLayer({
          id: CRIME_HEATMAP_LAYER_ID,
          type: 'heatmap',
          source: CRIME_SOURCE_ID,
          paint: {
            'heatmap-weight': [
              'interpolate', ['linear'], ['get', 'frequency'],
              0, 0,
              50, 1
            ],
            'heatmap-intensity': [
              'interpolate', ['linear'], ['zoom'],
              0, 1,
              9, 3
            ],
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
    } else if (mapInstance.getLayer(CRIME_HEATMAP_LAYER_ID)) {
      mapInstance.removeLayer(CRIME_HEATMAP_LAYER_ID);
    }

    return () => {
      if (mapInstance.getLayer(CRIME_HEATMAP_LAYER_ID)) {
        mapInstance.removeLayer(CRIME_HEATMAP_LAYER_ID);
      }
    };
  }, [mapInstance, showHeatmap]);

  // Crime clusters layer
  useEffect(() => {
    if (!mapInstance) return;

    if (showCluster) {
      // Cluster circles
      if (!mapInstance.getLayer(CRIME_CLUSTER_LAYER_ID)) {
        mapInstance.addLayer({
          id: CRIME_CLUSTER_LAYER_ID,
          type: 'circle',
          source: CRIME_SOURCE_ID,
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': [
              'step', ['get', 'point_count'],
              '#51bbd6', 100,
              '#f1f075', 750,
              '#f28cb1'
            ],
            'circle-radius': [
              'step', ['get', 'point_count'],
              20, 100, 30, 750, 40
            ]
          }
        });
      }

      // Cluster count
      if (!mapInstance.getLayer(CRIME_COUNT_LAYER_ID)) {
        mapInstance.addLayer({
          id: CRIME_COUNT_LAYER_ID,
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

      // Individual points
      if (!mapInstance.getLayer(CRIME_POINT_LAYER_ID)) {
        mapInstance.addLayer({
          id: CRIME_POINT_LAYER_ID,
          type: 'circle',
          source: CRIME_SOURCE_ID,
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': [
              'interpolate', ['linear'], ['get', 'frequency'],
              0, '#11b4da',
              25, '#f7a35c',
              50, '#8b0000'
            ],
            'circle-radius': [
              'interpolate', ['linear'], ['get', 'frequency'],
              0, 5,
              50, 20
            ],
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
          }
        });
      }
    } else {
      [CRIME_CLUSTER_LAYER_ID, CRIME_COUNT_LAYER_ID, CRIME_POINT_LAYER_ID].forEach(layerId => {
        if (mapInstance.getLayer(layerId)) {
          mapInstance.removeLayer(layerId);
        }
      });
    }

    return () => {
      [CRIME_CLUSTER_LAYER_ID, CRIME_COUNT_LAYER_ID, CRIME_POINT_LAYER_ID].forEach(layerId => {
        if (mapInstance && mapInstance.getLayer(layerId)) {
          mapInstance.removeLayer(layerId);
        }
      });
    };
  }, [mapInstance, showCluster]);

  // Effect for data-driven styling (ethnicity circles)
  useEffect(() => {
    if (!mapInstance) return;

    const sourceId = 'ethnicity-data';
    const layerId = 'ethnicity-circles';

    if (showDataDriven) {
      // Add source if it doesn't exist
      if (!mapInstance.getSource(sourceId)) {
        mapInstance.addSource(sourceId, {
          type: 'vector',
          url: ethnicitySourceUrl
        });
      }

      // Add layer if it doesn't exist
      if (!mapInstance.getLayer(layerId)) {
        mapInstance.addLayer({
          id: layerId,
          type: 'circle',
          source: sourceId,
          'source-layer': 'sf2010',
          paint: {
            'circle-radius': {
              base: 1.75,
              stops: [[12, 2], [22, 180]]
            },
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
    } else {
      // Remove layer if it exists
      if (mapInstance.getLayer(layerId)) {
        mapInstance.removeLayer(layerId);
      }
      
      // Remove source if it exists and no other layers are using it
      if (mapInstance.getSource(sourceId)) {
        const layers = mapInstance.getStyle().layers;
        const isSourceUsed = layers.some(layer => 
          layer.source === sourceId && layer.id !== layerId
        );
        
        if (!isSourceUsed) {
          mapInstance.removeSource(sourceId);
        }
      }
    }

    return () => {
      if (mapInstance && mapInstance.getLayer(layerId)) {
        mapInstance.removeLayer(layerId);
      }
    };
  }, [mapInstance, showDataDriven, ethnicitySourceUrl]);

  // Effect for dotted line route
  useEffect(() => {
    if (!mapInstance) return;

    const sourceId = 'dotted-line-source';
    const layerId = 'dotted-line-layer';
    const imageId = 'dotted-pattern';

    if (showDottedLine) {
      // Load the dotted pattern image if it doesn't exist
      if (!mapInstance.hasImage(imageId)) {
        mapInstance.loadImage(
          'https://docs.mapbox.com/mapbox-gl-js/assets/dash.png',
          (error, image) => {
            if (error) {
              console.error('Error loading dotted pattern image:', error);
              return;
            }
            
            if (image && !mapInstance.hasImage(imageId)) {
              mapInstance.addImage(imageId, image);
              
              // Add source and layer after image is loaded
              if (!mapInstance.getSource(sourceId)) {
                mapInstance.addSource(sourceId, {
                  type: 'geojson',
                  data: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                      type: 'LineString',
                      coordinates: [
                        [-122.414, 37.776],
                        [-122.407, 37.784],
                        [-122.400, 37.778]
                      ]
                    }
                  }
                });
              }
              
              if (!mapInstance.getLayer(layerId)) {
                mapInstance.addLayer({
                  id: layerId,
                  type: 'line',
                  source: sourceId,
                  layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                  },
                  paint: {
                    'line-color': '#4882c5',
                    'line-width': 3,
                    'line-dasharray': [0.2, 2]
                  }
                });
              }
            }
          }
        );
      } else {
        // Image already loaded, just add source and layer
        if (!mapInstance.getSource(sourceId)) {
          mapInstance.addSource(sourceId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: [
                  [-122.414, 37.776],
                  [-122.407, 37.784],
                  [-122.400, 37.778]
                ]
              }
            }
          });
        }
        
        if (!mapInstance.getLayer(layerId)) {
          mapInstance.addLayer({
            id: layerId,
            type: 'line',
            source: sourceId,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#4882c5',
              'line-width': 3,
              'line-dasharray': [0.2, 2]
            }
          });
        }
      }
    } else {
      // Remove layer and source if they exist
      if (mapInstance.getLayer(layerId)) {
        mapInstance.removeLayer(layerId);
      }
      
      if (mapInstance.getSource(sourceId)) {
        mapInstance.removeSource(sourceId);
      }
    }

    return () => {
      if (mapInstance) {
        if (mapInstance.getLayer(layerId)) {
          mapInstance.removeLayer(layerId);
        }
        
        if (mapInstance.getSource(sourceId)) {
          mapInstance.removeSource(sourceId);
        }
      }
    };
  }, [mapInstance, showDottedLine]);

  // Effect for custom icons
  useEffect(() => {
    if (!mapInstance) return;

    const markers: mapboxgl.Marker[] = [];
    
    if (showCustomIcons) {
      // Define custom icon locations with proper type annotation
      const iconLocations: { lngLat: [number, number]; title: string; color: string }[] = [
        { lngLat: [-122.414, 37.776], title: 'Police Station', color: '#1e88e5' },
        { lngLat: [-122.407, 37.784], title: 'Hospital', color: '#d81b60' },
        { lngLat: [-122.400, 37.778], title: 'Safe Zone', color: '#43a047' }
      ];
      
      // Create and add markers
      iconLocations.forEach(location => {
        // Create custom element for marker
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.backgroundColor = location.color;
        el.style.width = '24px';
        el.style.height = '24px';
        el.style.borderRadius = '50%';
        el.style.border = '2px solid white';
        el.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';
        
        // Add click handler for popup
        el.addEventListener('click', () => {
          new mapboxgl.Popup({ offset: 25 })
            .setLngLat(location.lngLat)
            .setHTML(`<h3>${location.title}</h3>`)
            .addTo(mapInstance);
        });
        
        // Create and add marker
        const marker = new mapboxgl.Marker(el)
          .setLngLat(location.lngLat)
          .addTo(mapInstance);
          
        markers.push(marker);
      });
    }
    
    // Cleanup function to remove markers
    return () => {
      markers.forEach(marker => marker.remove());
    };
  }, [mapInstance, showCustomIcons]);

  // Add effect for Minna Street path
  useEffect(() => {
    if (!mapInstance) return;

    const sourceId = 'minna-street';
    const layerId = 'minna-street-line';
    const MINNA_STREET_PATH = [
      [-122.4006, 37.7875], // Start of Minna St
      [-122.4016, 37.7867], // Near 6th St
      [-122.4045, 37.7845], // Near 7th St
      [-122.4065, 37.7831]  // End near 8th St
    ];

    // Remove existing source and layer if they exist to prevent duplicates
    if (mapInstance.getSource(sourceId)) {
      mapInstance.removeLayer(layerId);
      mapInstance.removeSource(sourceId);
    }

    // Add the source for Minna Street path
    mapInstance.addSource(sourceId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: MINNA_STREET_PATH
        }
      }
    });

    // Add the line layer with ocean blue color
    mapInstance.addLayer({
      id: layerId,
      type: 'line',
      source: sourceId,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#0EA5E9', // Ocean blue color
        'line-width': 4,
        'line-opacity': 0.8
      }
    });

    return () => {
      if (mapInstance.getLayer(layerId)) {
        mapInstance.removeLayer(layerId);
      }
      if (mapInstance.getSource(sourceId)) {
        mapInstance.removeSource(sourceId);
      }
    };
  }, [mapInstance]);

  return <div id={mapId} className="h-full w-full" />;
};

export default MapComponent;
