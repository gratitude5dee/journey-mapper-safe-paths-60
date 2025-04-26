import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
interface MapControlsProps {
  showHeatmap: boolean;
  setShowHeatmap: (show: boolean) => void;
  showCluster: boolean;
  setShowCluster: (show: boolean) => void;
  showDottedLine: boolean;
  setShowDottedLine: (show: boolean) => void;
  showCustomIcons: boolean;
  setShowCustomIcons: (show: boolean) => void;
  showDataDriven: boolean;
  setShowDataDriven: (show: boolean) => void;
  currentMonth: number;
  setCurrentMonth: (month: number) => void;
  isLoading: boolean;
}
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MapControls: React.FC<MapControlsProps> = ({
  showHeatmap,
  setShowHeatmap,
  showCluster,
  setShowCluster,
  showDottedLine,
  setShowDottedLine,
  showCustomIcons,
  setShowCustomIcons,
  showDataDriven,
  setShowDataDriven,
  currentMonth,
  setCurrentMonth,
  isLoading
}) => {
  const handleSliderChange = (value: number[]) => {
    setCurrentMonth(value[0]);
  };
  return <Card className="absolute top-4 left-4 z-10 w-64 shadow-lg backdrop-blur-sm bg-slate-50">
      <CardHeader className="p-4">
        <CardTitle className="text-base">Map Layers & Features</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="heatmap-toggle" checked={showHeatmap} onCheckedChange={checked => setShowHeatmap(!!checked)} disabled={isLoading} />
          <Label htmlFor="heatmap-toggle" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Show Heatmap (Earthquakes)
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox id="cluster-toggle" checked={showCluster} onCheckedChange={checked => setShowCluster(!!checked)} disabled={isLoading} />
          <Label htmlFor="cluster-toggle" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Show Clusters (Earthquakes)
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox id="datadriven-toggle" checked={showDataDriven} onCheckedChange={checked => setShowDataDriven(!!checked)} />
          <Label htmlFor="datadriven-toggle" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Show Data-Driven Circles (Ethnicity)
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox id="dottedline-toggle" checked={showDottedLine} onCheckedChange={checked => setShowDottedLine(!!checked)} />
          <Label htmlFor="dottedline-toggle" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Show Dotted Line Route
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox id="icons-toggle" checked={showCustomIcons} onCheckedChange={checked => setShowCustomIcons(!!checked)} />
          <Label htmlFor="icons-toggle" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Show Custom Icons
          </Label>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="time-slider" className="text-sm font-medium">
            Earthquake Month: {months[currentMonth]}
          </Label>
          <Slider id="time-slider" min={0} max={11} step={1} value={[currentMonth]} onValueChange={handleSliderChange} disabled={isLoading || !showCluster && !showHeatmap} className="w-full" />
          <p className="text-xs text-muted-foreground">
            Note: Slider filters Cluster/Heatmap layers if active.
          </p>
        </div>
      </CardContent>
    </Card>;
};
export default MapControls;