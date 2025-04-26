
import React, { useEffect, useState } from 'react';
import { useSafeMap } from '@/hooks/useSafeMap';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, MessageSquare } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

const Home = () => {
  const [mapInitialized, setMapInitialized] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Initialize Mapbox with the token from Supabase
  useEffect(() => {
    try {
      // Use the token you've stored in Supabase
      window.mapboxgl.accessToken = 'pk.eyJ1IjoiZ3JhdGl0dWQzIiwiYSI6ImNtOXlycGJiNjFpOGEybXEwNGRvaGo0NmwifQ.o9pk9WZT4UjsBz768aC1Zg';
      setMapInitialized(true);
    } catch (error) {
      console.error("Error initializing Mapbox:", error);
      setMapError("Could not initialize map. Please check your browser console for more information.");
    }
  }, []);

  // Initialize map only after token is set
  const mapInstance = mapInitialized ? useSafeMap({
    containerId: 'map',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [-122.42, 37.77],
    initialZoom: 13,
  }) : undefined;

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
