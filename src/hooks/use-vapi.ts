
import { useState, useCallback, useEffect } from 'react';

const useVapi = () => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);

  // Simulate volume changes when active
  useEffect(() => {
    let intervalId: number | undefined;
    if (isSessionActive) {
      intervalId = window.setInterval(() => {
        // Simulate fluctuating volume
        setVolumeLevel(Math.random() * 0.6 + 0.1);
      }, 150);
    } else {
      setVolumeLevel(0);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isSessionActive]);

  const toggleCall = useCallback(() => {
    console.log("Toggling Vapi call...");
    setIsSessionActive(prev => !prev);
  }, []);

  return {
    volumeLevel,
    isSessionActive,
    toggleCall,
  };
};

export default useVapi;
