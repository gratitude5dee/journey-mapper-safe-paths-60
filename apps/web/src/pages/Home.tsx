
import { useSafeMap } from '@/hooks/useSafeMap';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, MessageSquare } from 'lucide-react';
import MapControls from '@/components/MapControls';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState } from 'react';

const Home = () => {
  // State for layer visibility and controls
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showCluster, setShowCluster] = useState(false);
  const [showDottedLine, setShowDottedLine] = useState(false);
  const [showCustomIcons, setShowCustomIcons] = useState(false);
  const [showDataDriven, setShowDataDriven] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<number>(0);

  const mapInstance = useSafeMap({
    containerId: 'map',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [-122.42, 37.77],
    initialZoom: 13,
  });

  return (
    <div className="relative h-screen w-full">
      <div id="map" className="absolute inset-0" />
      
      <MapControls
        showHeatmap={showHeatmap}
        setShowHeatmap={setShowHeatmap}
        showCluster={showCluster}
        setShowCluster={setShowCluster}
        showDottedLine={showDottedLine}
        setShowDottedLine={setShowDottedLine}
        showCustomIcons={showCustomIcons}
        setShowCustomIcons={setShowCustomIcons}
        showDataDriven={showDataDriven}
        setShowDataDriven={setShowDataDriven}
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        isLoading={false}
      />
      
      <Card className="fixed bottom-0 left-0 right-0 rounded-t-xl border-t shadow-lg md:bottom-8 md:left-1/2 md:right-auto md:w-96 md:-translate-x-1/2 md:rounded-xl">
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
    </div>
  );
};

export default Home;
