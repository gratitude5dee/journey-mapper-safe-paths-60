
# @safe-routes/map

A reusable Mapbox GL JS wrapper for Safe Routes applications.

## Installation

```bash
pnpm add @safe-routes/map
```

## Usage

```tsx
import { useSafeMap } from '@safe-routes/map';

function MapComponent() {
  const mapInstance = useSafeMap({
    containerId: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: [-74.5, 40],
    initialZoom: 9
  });

  return <div id="map" style={{ width: '100%', height: '400px' }} />;
}
```

## Events

The hook emits a `safe-map-ready` event when the map style is fully loaded:

```tsx
useEffect(() => {
  const onMapReady = () => {
    console.log('Map is ready!');
  };
  
  window.addEventListener('safe-map-ready', onMapReady);
  return () => window.removeEventListener('safe-map-ready', onMapReady);
}, []);
```
