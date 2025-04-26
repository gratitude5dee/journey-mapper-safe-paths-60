
import { useMapFeatures } from '@/hooks/useMapFeatures';
import { MapContainer } from '@/components/MapContainer';

const MapPage = () => {
  const mapFeatures = useMapFeatures({
    showHeatmap: false,
    showCluster: true,
    currentMonth: 0,
  });

  return (
    <MapContainer
      {...mapFeatures}
      className="h-[calc(100vh-4rem)]"
      isLoading={false}
    />
  );
};

export default MapPage;
