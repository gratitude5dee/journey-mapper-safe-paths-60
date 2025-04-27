
import { decode } from '@mapbox/polyline';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import template from 'lodash.template';
import debounce from 'lodash.debounce';
import Suggestions from 'suggestions';

import reducers from './reducers';
import directionsStyle from './directions_style';
import * as Constants from './constants';
import utils from './utils';

// Define templates as strings since we can't use fs.readFileSync in the browser
const originTemplate = `
<div class='mapbox-directions-origin'>
  <label class='mapbox-form-label'>
    <span class='directions-icon directions-icon-depart'></span>
  </label>
  <div class='mapbox-directions-relative'>
    <input
      id='mapbox-directions-origin-input'
      class='mapbox-directions-input'
      type='text'
      placeholder='Choose starting point'
    />
    <div class='mapbox-directions-loading'></div>
  </div>
</div>
`;

const destinationTemplate = `
<div class='mapbox-directions-destination'>
  <label class='mapbox-form-label'>
    <span class='directions-icon directions-icon-arrive'></span>
  </label>
  <div class='mapbox-directions-relative'>
    <input
      id='mapbox-directions-destination-input'
      class='mapbox-directions-input'
      type='text'
      placeholder='Choose destination'
    />
    <div class='mapbox-directions-loading'></div>
  </div>
</div>
`;

export default class MapboxDirections {
  constructor(options) {
    this.options = {...options};
    this.store = createStore(reducers, {}, applyMiddleware(thunk));
    
    this.actions = require('./actions').default;
    this.container = null;
    this.map = null;
    this.mapState = null;

    this.onDragEnd = this._onDragEnd.bind(this);
    this.move = debounce(this._move, 100);
    this.render = this._render.bind(this);
  }

  onAdd(map) {
    this.map = map;

    const { container, controlContainer } = this._setup();
    this.container = container;
    map.on('moveend', () => this.move());

    this._setupAPI();
    this.mapState = map.getState();

    return controlContainer;
  }

  onRemove(map) {
    this.container.parentNode.removeChild(this.container);
    
    if (this.map.getLayer('directions-route-line')) {
      map.removeLayer('directions-route-line');
    }

    if (this.map.getSource('directions')) {
      map.removeSource('directions');
    }

    this.map = null;
  }

  _setup() {
    const container = document.createElement('div');
    container.className = 'mapboxgl-ctrl-directions mapboxgl-ctrl';

    const controlContainer = document.createElement('div');
    controlContainer.className = 'directions-control directions-control-inputs';

    container.appendChild(controlContainer);

    // Set up origin input
    const originEl = document.createElement('div');
    originEl.innerHTML = template(originTemplate)();
    controlContainer.appendChild(originEl.firstChild);

    // Set up destination input
    const destinationEl = document.createElement('div');
    destinationEl.innerHTML = template(destinationTemplate)();
    controlContainer.appendChild(destinationEl.firstChild);

    // Set up suggestions for origin and destination
    this._setupGeocoder('origin');
    this._setupGeocoder('destination');

    return { container, controlContainer };
  }

  _setupGeocoder(type) {
    const input = this.container.querySelector(`#mapbox-directions-${type}-input`);
    const geocoder = new Suggestions(input, {
      filter: () => true,
      limit: 5
    });

    geocoder.getItemValue = (item) => item.place_name;

    input.addEventListener('change', (e) => {
      const { value } = e.target;
      if (!value.length) return;

      // Geocoding logic would go here
      console.log(`Geocoding ${type}: ${value}`);
    });

    return geocoder;
  }

  _setupAPI() {
    if (!this.map.getSource('directions')) {
      this.map.addSource('directions', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });
    }

    // Add and style the directions layer
    directionsStyle.forEach(style => {
      if (!this.map.getLayer(style.id)) {
        this.map.addLayer(style);
      }
    });
  }

  _move() {
    if (!this.map) return;
    
    const newState = this.map.getState();
    if (this.mapState.zoom !== newState.zoom) {
      this.mapState = newState;
      this.render();
    }
  }

  _onDragEnd() {
    if (!this.map) return;
    this.render();
  }

  _render() {
    if (!this.map) return;
    const state = this.store.getState();
    this._updateRoutes(state);
  }

  _updateRoutes(state) {
    const geojson = {
      type: 'FeatureCollection',
      features: []
    };

    if (state.origin) geojson.features.push(state.origin);
    if (state.destination) geojson.features.push(state.destination);

    if (this.map.getSource('directions')) {
      this.map.getSource('directions').setData(geojson);
    }
  }

  // Public methods
  setOrigin(origin) {
    if (typeof origin === 'string') {
      // Geocoding logic would go here
      console.log('Geocoding origin:', origin);
    } else {
      this.store.dispatch(this.actions.setOriginFromCoordinates(origin));
    }
    return this;
  }

  setDestination(destination) {
    if (typeof destination === 'string') {
      // Geocoding logic would go here
      console.log('Geocoding destination:', destination);
    } else {
      this.store.dispatch(this.actions.setDestinationFromCoordinates(destination));
    }
    return this;
  }

  removeRoutes() {
    const geojson = {
      type: 'FeatureCollection',
      features: []
    };
    
    if (this.map.getSource('directions')) {
      this.map.getSource('directions').setData(geojson);
    }
    return this;
  }
}
