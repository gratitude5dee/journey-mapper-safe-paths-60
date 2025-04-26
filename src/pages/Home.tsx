
import { useSafeMap } from '@safe-routes/map';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, MessageSquare } from 'lucide-react';
import { useEffect } from 'react';

const Home = () => {
  const mapInstance = useSafeMap({
    containerId: 'map',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [-122.42, 37.77],
    initialZoom: 13,
  });

  useEffect(() => {
    // Set Mapbox access token - you need to replace this with your own token
    if (window.mapboxgl) {
      window.mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
    }
  }, []);

  return (
    <div className="relative h-screen w-full">
      <div id="map" className="absolute inset-0" />
      
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
