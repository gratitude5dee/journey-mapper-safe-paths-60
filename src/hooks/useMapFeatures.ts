
import { useState } from 'react';

export interface MapFeatureState {
  showCrimeHeatmap: boolean;
  showCrimeCluster: boolean;
  showDottedLine: boolean;
  showCustomIcons: boolean;
  showDataDriven: boolean;
  isLoading: boolean;
}

export const useMapFeatures = (initialLoading = false) => {
  const [showCrimeHeatmap, setShowCrimeHeatmap] = useState(false);
  const [showCrimeCluster, setShowCrimeCluster] = useState(false);
  const [showDottedLine, setShowDottedLine] = useState(false);
  const [showCustomIcons, setShowCustomIcons] = useState(false);
  const [showDataDriven, setShowDataDriven] = useState(false);
  const [isLoading, setIsLoading] = useState(initialLoading);

  return {
    // Feature flags
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
    // Loading state
    isLoading,
    setIsLoading,
  };
};
