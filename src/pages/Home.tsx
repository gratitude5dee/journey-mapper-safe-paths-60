
import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, MessageSquare } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import type { Map } from 'mapbox-gl';

const Home = () => {
  const mapRef = useRef<Map | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Initialize Mapbox with the token
  useEffect(() => {
    try {
      // Set the Mapbox access token
      mapboxgl.accessToken = 'pk.eyJ1IjoiZ3JhdGl0dWQzIiwiYSI6ImNtOXlycGJiNjFpOGEybXEwNGRvaGo0NmwifQ.o9pk9WZT4UjsBz768aC1Zg';
      setMapInitialized(true);
    } catch (error) {
      console.error("Error initializing Mapbox:", error);
      setMapError("Could not initialize map. Please check your browser console for more information.");
    }
  }, []);

  // Initialize map only after token is set
  useEffect(() => {
    if (!mapInitialized) return;
    
    const container = document.getElementById('map');
    if (!container || mapRef.current) return;

    try {
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-122.42, 37.77],
        zoom: 13,
      });

      map.on('style.load', () => {
        const event = new CustomEvent('safe-map-ready');
        window.dispatchEvent(event);
      });

      mapRef.current = map;

      return () => {
        map.remove();
        mapRef.current = null;
      };
    } catch (error) {
      console.error('Error creating map:', error);
      setMapError("Error creating map. Please check your browser console for more information.");
    }
  }, [mapInitialized]);

  return (
    <div className="relative h-screen w-full">
      <div id="map" className="absolute inset-0" />
      
      {mapError && (
        <div className="absolute inset-x-0 top-4 flex justify-center">
          <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded shadow-lg">
            {mapError}
          </div>
        </div>
      )}
      
      <Card className="fixed bottom-0 left-0 right-0 rounded-t-xl border-t shadow-lg md:bottom-8 md:left-1/2 md:right-auto md:w-96 md:-translate-x-1/2 md:rounded-xl">
        <CardContent className="grid gap-4 p-6">
          <Button size="lg" className="w-full">
            <MapPin />
            Choose safer route
          </Button>
          <Button variant="outline" size="lg" className="w-full">
            <MessageSquare />
            Send feedback
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
