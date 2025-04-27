
import polyline from '@mapbox/polyline';

function format(waypoint) {
  const coordinates = waypoint.geometry.coordinates;
  return coordinates[0] + ',' + coordinates[1];
}

function normalizeWaypoint(waypoint) {
  if (!waypoint || !waypoint.geometry) return waypoint;

  return {
    geometry: waypoint.geometry,
    properties: { 
      name: waypoint.properties ? waypoint.properties.name : null 
    },
    type: 'Feature'
  };
}

function validateWaypoint(waypoint) {
  if (!waypoint) return false;
  
  const coordinates = waypoint.geometry && waypoint.geometry.coordinates;
  if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) return false;
  
  const [lon, lat] = coordinates;
  if (typeof lon !== 'number' || typeof lat !== 'number') return false;
  
  return true;
}

function roundWithDecimals(value, decimals) {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

function createPoint(coordinates, properties = {}) {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: coordinates
    },
    properties: properties
  };
}

export default {
  format,
  normalizeWaypoint,
  validateWaypoint,
  roundWithDecimals,
  createPoint
};
