import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Toggle } from '@/components/ui/toggle';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
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
  currentMonth?: number;
  setCurrentMonth?: (month: number) => void;
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
  currentMonth = 0,
  setCurrentMonth,
  isLoading
}) => {
  const [isOpen, setIsOpen] = React.useState(true);
  return <Card className="absolute top-4 left-4 z-10 w-[300px] rounded-xl overflow-hidden bg-background/30 backdrop-blur-md backdrop-saturate-150 border border-white/20 shadow-lg before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1Ii8+PC9zdmc+')] before:opacity-30 before:pointer-events-none">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-white/5 transition-colors">
          <h2 className="text-lg font-semibold text-white/90">StreetSmart Controls
        </h2>
          {isOpen ? <ChevronUp className="h-5 w-5 text-white/70" /> : <ChevronDown className="h-5 w-5 text-white/70" />}
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="heatmap" className="text-white/90">Show Heatmap</Label>
                <Toggle id="heatmap" pressed={showHeatmap} onPressedChange={setShowHeatmap} disabled={isLoading} className="data-[state=on]:bg-white/20" />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="cluster" className="text-white/90">Show Cluster</Label>
                <Toggle id="cluster" pressed={showCluster} onPressedChange={setShowCluster} disabled={isLoading} className="data-[state=on]:bg-white/20" />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="dotted-line" className="text-white/90">Show Dotted Line</Label>
                <Toggle id="dotted-line" pressed={showDottedLine} onPressedChange={setShowDottedLine} disabled={isLoading} className="data-[state=on]:bg-white/20" />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="custom-icons" className="text-white/90">Show Custom Icons</Label>
                <Toggle id="custom-icons" pressed={showCustomIcons} onPressedChange={setShowCustomIcons} disabled={isLoading} className="data-[state=on]:bg-white/20" />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="data-driven" className="text-white/90">Show Data Driven Styling</Label>
                <Toggle id="data-driven" pressed={showDataDriven} onPressedChange={setShowDataDriven} disabled={isLoading} className="data-[state=on]:bg-white/20" />
              </div>
            </div>

            {setCurrentMonth && <div className="space-y-2">
                <Label htmlFor="month" className="text-white/90">Month</Label>
                <Slider id="month" defaultValue={[currentMonth]} max={11} step={1} disabled={isLoading} onValueChange={value => setCurrentMonth(value[0])} className="max-w-[280px]" />
                <p className="text-sm text-white/70">Current Month: {currentMonth + 1}</p>
              </div>}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>;
};
export default MapControls;