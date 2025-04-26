
import React, { useState, useEffect } from 'react';
import { useSafeMap } from '@/hooks/useSafeMap';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, MessageSquare } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import 'mapbox-gl/dist/mapbox-gl.css';

const Home = () => {
  const [mapboxToken, setMapboxToken] = useState('');
  const [tokenSubmitted, setTokenSubmitted] = useState(false);

  // Initialize map only after token is submitted
  const mapInstance = tokenSubmitted ? useSafeMap({
    containerId: 'map',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [-122.42, 37.77],
    initialZoom: 13,
  }) : undefined;

  const handleSubmitToken = () => {
    if (!mapboxToken.trim()) {
      toast({
        title: "Token required",
        description: "Please enter your Mapbox token",
        variant: "destructive"
      });
      return;
    }
    
    try {
      window.mapboxgl.accessToken = mapboxToken.trim();
      setTokenSubmitted(true);
      toast({
        title: "Success",
        description: "Map token set successfully",
      });
    } catch (error) {
      console.error("Error setting mapbox token:", error);
      toast({
        title: "Error",
        description: "Could not initialize map with provided token",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    return () => {
      // Clean up map instance on component unmount
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [mapInstance]);

  return (
    <div className="relative h-screen w-full">
      <div id="map" className="absolute inset-0" />
      
      <Card className="fixed bottom-0 left-0 right-0 rounded-t-xl border-t shadow-lg md:bottom-8 md:left-1/2 md:right-auto md:w-96 md:-translate-x-1/2 md:rounded-xl">
        <CardContent className="grid gap-4 p-6">
          {!tokenSubmitted ? (
            <div className="space-y-2">
              <Input 
                placeholder="Enter Mapbox Public Token" 
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Get your token at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>
              </p>
              <Button className="w-full" onClick={handleSubmitToken}>
                Set Token
              </Button>
            </div>
          ) : (
            <>
              <Button size="lg" className="w-full">
                <MapPin />
                Choose safer route
              </Button>
              <Button variant="outline" size="lg" className="w-full">
                <MessageSquare />
                Send feedback
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;

