import React, { useEffect } from 'react';
import { useSafeMap } from '@/hooks/useSafeMap';
import mapboxgl from 'mapbox-gl';

interface MapComponentProps {
  mapId: string;
  options: {
    style: string;
    center: [number, number];
    initialZoom: number;
  };
  showCrimeHeatmap: boolean;
  showCrimeCluster: boolean;
  showDottedLine: boolean;
  showCustomIcons: boolean;
  showDataDriven: boolean;
  crimeData: GeoJSON.FeatureCollection | null;
  ethnicitySourceUrl: string;
}

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
  const mapInstance = useSafeMap({
    containerId: mapId,
    style: options.style,
    center: options.center,
    initialZoom: options.initialZoom
  });

  // Effect for adding crime data source
  useEffect(() => {
    if (!mapInstance || !crimeData) return;

    // Add or update crime data source
    const sourceId = 'crime-data';
    const source = mapInstance.getSource(sourceId);
    
    if (source && 'setData' in source) {
      (source as mapboxgl.GeoJSONSource).setData(crimeData);
    } else {
      if (!mapInstance.getSource(sourceId)) {
        mapInstance.addSource(sourceId, {
          type: 'geojson',
          data: crimeData,
          cluster: showCrimeCluster,
          clusterMaxZoom: 14,
          clusterRadius: 50
        });
      }
    }

    return () => {
      // We don't remove the source here to avoid flickering if other layers need it
    };
  }, [mapInstance, crimeData, showCrimeCluster]);

  // Effect for crime heatmap
  useEffect(() => {
    if (!mapInstance || !crimeData) return;
    
    const layerId = 'crime-heatmap';
    
    if (showCrimeHeatmap) {
      if (!mapInstance.getLayer(layerId)) {
        mapInstance.addLayer({
          id: layerId,
          type: 'heatmap',
          source: 'crime-data',
          paint: {
            // Weight by crime frequency
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
            'heatmap-radius': [
              'interpolate', ['linear'], ['zoom'],
              0, 2,
              9, 20
            ],
            'heatmap-opacity': 0.8
          }
        });
      }
    } else {
      if (mapInstance.getLayer(layerId)) {
        mapInstance.removeLayer(layerId);
      }
    }

    return () => {
      if (mapInstance && mapInstance.getLayer(layerId)) {
        mapInstance.removeLayer(layerId);
      }
    };
  }, [mapInstance, showCrimeHeatmap, crimeData]);

  // Effect for crime clusters
  useEffect(() => {
    if (!mapInstance || !crimeData) return;
    
    const circlesLayerId = 'crime-clusters';
    const countLayerId = 'crime-cluster-count';
    const unclusteredLayerId = 'crime-unclustered-point';

    if (showCrimeCluster) {
      // Update source clustering options
      const source = mapInstance.getSource('crime-data');
      if (source && typeof (source as any).setClusterOptions === 'function') {
        (source as any).setClusterOptions({
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50
        });
      }
      
      // Add cluster circles layer
      if (!mapInstance.getLayer(circlesLayerId)) {
        mapInstance.addLayer({
          id: circlesLayerId,
          type: 'circle',
          source: 'crime-data',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#51bbd6',
              100, '#f1f075',
              750, '#f28cb1'
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              20,
              100, 30,
              750, 40
            ]
          }
        });
      }
      
      // Add cluster count layer
      if (!mapInstance.getLayer(countLayerId)) {
        mapInstance.addLayer({
          id: countLayerId,
          type: 'symbol',
          source: 'crime-data',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
          }
        });
      }
      
      // Add unclustered point layer
      if (!mapInstance.getLayer(unclusteredLayerId)) {
        mapInstance.addLayer({
          id: unclusteredLayerId,
          type: 'circle',
          source: 'crime-data',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': [
              'interpolate', ['linear'], ['get', 'frequency'],
              0, '#11b4da',
              10, '#f7a35c',
              50, '#8b0000'
            ],
            'circle-radius': [
              'interpolate', ['linear'], ['get', 'frequency'],
              0, 4,
              50, 16
            ],
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
          }
        });
      }
    } else {
      // Remove cluster layers
      if (mapInstance.getLayer(circlesLayerId)) mapInstance.removeLayer(circlesLayerId);
      if (mapInstance.getLayer(countLayerId)) mapInstance.removeLayer(countLayerId);
      if (mapInstance.getLayer(unclusteredLayerId)) mapInstance.removeLayer(unclusteredLayerId);
      
      // Update source to disable clustering
      const source = mapInstance.getSource('crime-data');
      if (source && typeof (source as any).setClusterOptions === 'function') {
        (source as any).setClusterOptions({
          cluster: false
        });
      }
    }

    return () => {
      if (mapInstance) {
        if (mapInstance.getLayer(circlesLayerId)) mapInstance.removeLayer(circlesLayerId);
        if (mapInstance.getLayer(countLayerId)) mapInstance.removeLayer(countLayerId);
        if (mapInstance.getLayer(unclusteredLayerId)) mapInstance.removeLayer(unclusteredLayerId);
      }
    };
  }, [mapInstance, showCrimeCluster, crimeData]);

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
      // Define custom icon locations
      const iconLocations = [
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

  return <div id={mapId} className="h-full w-full" />;
};

export default MapComponent;
