
declare module '@safe-routes/directions' {
  import { Map } from 'mapbox-gl';

  export default class MapboxDirections {
    constructor(options: {
      accessToken: string;
      unit: string;
      profile: string;
      controls: {
        inputs: boolean;
        instructions: boolean;
        profileSwitcher: boolean;
      };
    });

    onAdd(map: Map): HTMLElement;
    onRemove(map: Map): void;
    setOrigin(origin: string | [number, number]): this;
    setDestination(destination: string | [number, number]): this;
    setProfile(profile: string): this;
    reverse(): this;
  }
}
