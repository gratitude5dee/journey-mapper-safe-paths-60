
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface MapControlsProps {
  showCrimeHeatmap: boolean;
  setShowCrimeHeatmap: (show: boolean) => void;
  showCrimeCluster: boolean;
  setShowCrimeCluster: (show: boolean) => void;
  showDottedLine: boolean;
  setShowDottedLine: (show: boolean) => void;
  showCustomIcons: boolean;
  setShowCustomIcons: (show: boolean) => void;
  showDataDriven: boolean;
  setShowDataDriven: (show: boolean) => void;
  isLoading: boolean;
}

const MapControls: React.FC<MapControlsProps> = ({
  showCrimeHeatmap,
  setShowCrimeHeatmap,
  showCrimeCluster,
  setShowCrimeCluster,
  showDottedLine,
  setShowDottedLine,
  showCustomIcons,
  setShowCustomIcons,
  showDataDriven,
  setShowDataDriven,
  isLoading
}) => {
  return (
    <Card className="absolute top-4 left-4 z-10 w-64 shadow-lg backdrop-blur-sm bg-slate-50">
      <CardHeader className="p-4">
        <CardTitle className="text-base">Map Layers & Features</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="heatmap-toggle" 
            checked={showCrimeHeatmap} 
            onCheckedChange={checked => setShowCrimeHeatmap(!!checked)} 
            disabled={isLoading} 
          />
          <Label htmlFor="heatmap-toggle" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Show Crime Heatmap
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="cluster-toggle" 
            checked={showCrimeCluster} 
            onCheckedChange={checked => setShowCrimeCluster(!!checked)} 
            disabled={isLoading} 
          />
          <Label htmlFor="cluster-toggle" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Show Crime Clusters
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="datadriven-toggle" 
            checked={showDataDriven} 
            onCheckedChange={checked => setShowDataDriven(!!checked)}
          />
          <Label htmlFor="datadriven-toggle" className="text-sm font-medium leading-none">
            Show Data-Driven Circles
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="dottedline-toggle" 
            checked={showDottedLine} 
            onCheckedChange={checked => setShowDottedLine(!!checked)}
          />
          <Label htmlFor="dottedline-toggle" className="text-sm font-medium leading-none">
            Show Dotted Line Route
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="icons-toggle" 
            checked={showCustomIcons} 
            onCheckedChange={checked => setShowCustomIcons(!!checked)}
          />
          <Label htmlFor="icons-toggle" className="text-sm font-medium leading-none">
            Show Custom Icons
          </Label>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapControls;
