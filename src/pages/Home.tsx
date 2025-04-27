
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, MessageSquare } from 'lucide-react';
import { MapContainer } from '@/components/MapContainer';
import { useMapFeatures } from '@/hooks/useMapFeatures';
import { AnimatedLogo } from '@/components/AnimatedLogo';
import { SafeRouteOptions } from '@/components/SafeRouteOptions';
import { useState } from 'react';
import Siri from '@/components/vapi/siri';
import 'mapbox-gl/dist/mapbox-gl.css';
import { TooltipProvider } from '@/components/ui/tooltip';

const mockRouteOptions = [{
  id: '1',
  safetyScore: 9,
  duration: 17,
  distance: 2.5,
  description: 'Recommended safest option, avoids high-incident areas',
  via: 'Market Street'
}, {
  id: '2',
  safetyScore: 7,
  duration: 15,
  distance: 2.2,
  description: 'Balanced option with moderate safety',
  via: 'Mission Street'
}, {
  id: '3',
  safetyScore: 5,
  duration: 12,
  distance: 1.8,
  description: 'Most direct, passes through areas with higher reported incidents',
  via: 'Valencia Street'
}];

const Home = () => {
  const mapFeatures = useMapFeatures();
  const [selectedRoute, setSelectedRoute] = useState(mockRouteOptions[0]);
  
  return (
    <div className="bg-transparent">
      <TooltipProvider>
        <MapContainer 
          showCrimeHeatmap={mapFeatures.showCrimeHeatmap} 
          setShowCrimeHeatmap={mapFeatures.setShowCrimeHeatmap} 
          showCrimeCluster={mapFeatures.showCrimeCluster} 
          setShowCrimeCluster={mapFeatures.setShowCrimeCluster} 
          showDottedLine={mapFeatures.showDottedLine} 
          setShowDottedLine={mapFeatures.setShowDottedLine} 
          showCustomIcons={mapFeatures.showCustomIcons} 
          setShowCustomIcons={mapFeatures.setShowCustomIcons} 
          showDataDriven={mapFeatures.showDataDriven} 
          setShowDataDriven={mapFeatures.setShowDataDriven} 
          isLoading={false}
        >
          <div className="absolute top-4 left-4 z-10 bg-transparent">
            <AnimatedLogo className="bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-lg" />
          </div>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
            <Siri theme="ios9" />
          </div>

          <Card className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md rounded-xl border shadow-lg">
            <CardContent className="grid gap-4 p-6">
              <Button size="lg" className="w-full">
                <MapPin className="mr-2 h-4 w-4" />
                Choose safer route
              </Button>
              <Button variant="outline" size="lg" className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                Send feedback
              </Button>
            </CardContent>
          </Card>

          <SafeRouteOptions options={mockRouteOptions} onSelectRoute={setSelectedRoute} />
        </MapContainer>
      </TooltipProvider>
    </div>
  );
};

export default Home;
