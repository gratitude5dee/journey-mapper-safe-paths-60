
// Ensure comprehensive type declarations
declare module '@safe-routes/directions' {
  import { Control } from 'mapbox-gl';

  export default class MapboxDirections extends Control {
    constructor(options?: MapboxDirectionsOptions);
    
    setOrigin(origin: string | [number, number]): this;
    setDestination(destination: string | [number, number]): this;
    setProfile(profile: string): this;
    reverse(): this;
    on(type: 'route' | 'error' | 'clear', listener: (event: any) => void): this;
    removeRoutes(): this;
  }

  export interface MapboxDirectionsOptions {
    accessToken?: string;
    unit?: 'imperial' | 'metric';
    profile?: string;
    controls?: {
      inputs?: boolean;
      instructions?: boolean;
      profileSwitcher?: boolean;
    };
    styles?: any[];
    interactive?: boolean;
    flyTo?: boolean;
    exclude?: string;
    alternatives?: boolean;
    routePadding?: number | number[] | { top: number; bottom: number; left: number; right: number };
  }
}
