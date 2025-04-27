
import { useState, useCallback, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

const useVapi = () => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize Vapi when the hook is first used
  useEffect(() => {
    const initVapi = async () => {
      try {
        const { data: { VAPI_PUBLIC_KEY, VAPI_ASSISTANT_ID } } = await supabase.functions.invoke('get-vapi-config');
        
        // Initialize Vapi here with the retrieved keys
        console.log('Vapi initialized with keys:', { VAPI_PUBLIC_KEY, VAPI_ASSISTANT_ID });
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Vapi:', error);
      }
    };

    initVapi();
  }, []);

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
    if (!isInitialized) {
      console.warn('Vapi not yet initialized');
      return;
    }
    console.log("Toggling Vapi call...");
    setIsSessionActive(prev => !prev);
  }, [isInitialized]);

  return {
    volumeLevel,
    isSessionActive,
    toggleCall,
    isInitialized,
  };
};

export default useVapi;
