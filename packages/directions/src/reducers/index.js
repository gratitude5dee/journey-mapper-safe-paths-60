
import * as types from '../constants';
import utils from '../utils';

const initialState = {
  origin: null,
  destination: null,
  waypoints: [],
  profile: types.DIRECTIONS_PROFILE,
  alternatives: true,
  routeIndex: 0,
  unit: 'imperial',
  compile: null,
  proximity: false,
  styles: [],
  zoom: null,
  language: 'en',
  placeholderOrigin: 'Choose starting point',
  placeholderDestination: 'Choose destination',
  options: {},
  routePadding: 80,
  interactive: true,
  controls: {
    inputs: true,
    instructions: false,
    profileSwitcher: true
  }
};

function data(state = initialState, action) {
  switch (action.type) {
    case types.SET_OPTIONS:
      return {...state, ...action.options};

    case types.DIRECTIONS_PROFILE:
      return {...state, profile: action.profile};

    case types.ORIGIN:
      return {...state, origin: action.origin};

    case types.DESTINATION:
      return {...state, destination: action.destination};

    case types.ROUTE_INDEX:
      return {...state, routeIndex: action.routeIndex};

    case types.SET_ORIGIN:
      return {...state, origin: utils.createPoint(action.coordinates, { name: action.name })};

    case types.SET_DESTINATION:
      return {...state, destination: utils.createPoint(action.coordinates, { name: action.name })};

    case types.HOVER_MARKER:
      const marker = action.marker;
      const features = state.hoverMarker;
      
      if (features instanceof Array) {
        features.push(marker);
      }
      
      return {...state, hoverMarker: features};

    default:
      return state;
  }
}

export default data;
