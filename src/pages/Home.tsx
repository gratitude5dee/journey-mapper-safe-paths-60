
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, MessageSquare } from 'lucide-react';
import { MapContainer } from '@/components/MapContainer';
import { useMapFeatures } from '@/hooks/useMapFeatures';
import 'mapbox-gl/dist/mapbox-gl.css';

const Home = () => {
  const mapFeatures = useMapFeatures();
  return (
    <MapContainer 
      showCrimeHeatmap={mapFeatures.showCrimeHeatmap}
      setShowCrimeHeatmap={mapFeatures.setShowCrimeHeatmap}
      showCrimeCluster={mapFeatures.showCrimeCluster}
      setShowCrimeCluster={mapFeatures.setShowCrimeCluster}
      showHeatmap={mapFeatures.showCrimeHeatmap}
      setShowHeatmap={mapFeatures.setShowCrimeHeatmap}
      showCluster={mapFeatures.showCrimeCluster}
      setShowCluster={mapFeatures.setShowCrimeCluster}
      isLoading={false}
    >
      <Card className="fixed bottom-0 left-0 right-0 rounded-t-xl border-t shadow-lg md:bottom-8 md:left-1/2 md:right-auto md:w-96 md:-translate-x-1/2 md:rounded-xl">
        <CardContent className="grid gap-4 p-6">
          <Button size="lg" className="w-full text-slate-50">
            <MapPin className="mr-2 h-4 w-4" />
            Choose safer route
          </Button>
          <Button variant="outline" size="lg" className="w-full bg-slate-50">
            <MessageSquare className="mr-2 h-4 w-4" />
            Send feedback
          </Button>
        </CardContent>
      </Card>
    </MapContainer>
  );
};
export default Home;
