
import { useState } from 'react';

export interface MapFeatureState {
  showHeatmap: boolean;
  showCluster: boolean;
  showDottedLine: boolean;
  showCustomIcons: boolean;
  showDataDriven: boolean;
  currentMonth: number;
  isLoading?: boolean;
}

export const useMapFeatures = (initialState?: Partial<MapFeatureState>) => {
  const [showHeatmap, setShowHeatmap] = useState(initialState?.showHeatmap ?? false);
  const [showCluster, setShowCluster] = useState(initialState?.showCluster ?? false);
  const [showDottedLine, setShowDottedLine] = useState(initialState?.showDottedLine ?? false);
  const [showCustomIcons, setShowCustomIcons] = useState(initialState?.showCustomIcons ?? false);
  const [showDataDriven, setShowDataDriven] = useState(initialState?.showDataDriven ?? false);
  const [currentMonth, setCurrentMonth] = useState<number>(initialState?.currentMonth ?? 0);

  return {
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
  };
};
