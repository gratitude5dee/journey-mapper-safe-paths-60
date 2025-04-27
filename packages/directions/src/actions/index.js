
import * as types from '../constants';
import utils from '../utils';

function setOptions(options) {
  return { type: types.SET_OPTIONS, options };
}

function setProfile(profile) {
  return { type: types.DIRECTIONS_PROFILE, profile };
}

function setOriginFromCoordinates(coords) {
  return (dispatch) => {
    const origin = utils.createPoint(coords);
    dispatch(originPoint(origin));
    return origin;
  };
}

function setDestinationFromCoordinates(coords) {
  return (dispatch) => {
    const destination = utils.createPoint(coords);
    dispatch(destinationPoint(destination));
    return destination;
  };
}

function originPoint(origin) {
  return { type: types.ORIGIN, origin };
}

function destinationPoint(destination) {
  return { type: types.DESTINATION, destination };
}

function setRouteIndex(routeIndex) {
  return { type: types.ROUTE_INDEX, routeIndex };
}

function hoverMarker(coordinates) {
  return {
    type: types.HOVER_MARKER,
    coordinates
  };
}

export default {
  setOptions,
  setProfile,
  setOriginFromCoordinates,
  setDestinationFromCoordinates,
  setRouteIndex,
  hoverMarker,
  originPoint,
  destinationPoint
};
