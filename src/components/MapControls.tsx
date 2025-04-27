import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Toggle } from '@/components/ui/toggle';
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

export interface MapControlsProps {
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
  isLoading,
}) => {
  return (
    <Card className="absolute bottom-4 left-4 z-10 w-[400px] bg-white/95 backdrop-blur-sm">
      <CardContent className="p-4 space-y-4">
        <h2 className="text-lg font-semibold">Map Controls</h2>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="heatmap">Show Heatmap</Label>
            <Toggle id="heatmap" pressed={showHeatmap} onPressedChange={setShowHeatmap} disabled={isLoading} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="cluster">Show Cluster</Label>
            <Toggle id="cluster" pressed={showCluster} onPressedChange={setShowCluster} disabled={isLoading} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="dotted-line">Show Dotted Line</Label>
            <Toggle id="dotted-line" pressed={showDottedLine} onPressedChange={setShowDottedLine} disabled={isLoading} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="custom-icons">Show Custom Icons</Label>
            <Toggle id="custom-icons" pressed={showCustomIcons} onPressedChange={setShowCustomIcons} disabled={isLoading} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="data-driven">Show Data Driven Styling</Label>
            <Toggle id="data-driven" pressed={showDataDriven} onPressedChange={setShowDataDriven} disabled={isLoading} />
          </div>
        </div>

        <div>
          <Label htmlFor="month">Month</Label>
          <Slider
            id="month"
            defaultValue={[currentMonth]}
            max={11}
            step={1}
            disabled={isLoading}
            onValueChange={(value) => setCurrentMonth(value[0])}
            className="max-w-[380px]"
          />
          <p className="text-sm text-muted-foreground">Current Month: {currentMonth + 1}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapControls;
