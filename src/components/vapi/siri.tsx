
"use client";

import React, { useState, useEffect } from 'react';
import { Mic, PhoneCall } from 'lucide-react';
import ReactSiriwave from 'react-siriwave';
import { motion, AnimatePresence } from 'framer-motion';
import useVapi from '@/hooks/use-vapi';
import { Button } from "@/components/ui/button";

type CurveStyle = "ios" | "ios9";

interface SiriProps {
  theme?: CurveStyle;
}

const Siri: React.FC<SiriProps> = ({ theme = "ios9" }) => {
  const { volumeLevel, isSessionActive, toggleCall, isInitialized } = useVapi();
  const [siriWaveConfig, setSiriWaveConfig] = useState({
    theme: theme,
    ratio: 1,
    speed: 0.2,
    amplitude: 1,
    frequency: 6,
    color: '#fff',
    cover: false,
    width: 300,
    height: 100,
    autostart: true,
    pixelDepth: 1,
    lerpSpeed: 0.1,
  });

  useEffect(() => {
    setSiriWaveConfig(prevConfig => ({
      ...prevConfig,
      amplitude: isSessionActive ? (volumeLevel > 0.01 ? volumeLevel * 7.5 : 0) : 0,
      speed: isSessionActive ? (volumeLevel > 0.5 ? volumeLevel * 10 : 0) : 0,
      frequency: isSessionActive ? (volumeLevel > 0.01 ? volumeLevel * 5 : 0) : (volumeLevel > 0.5 ? volumeLevel * 10 : 0),
    }));
  }, [volumeLevel, isSessionActive]);

  const handleToggleCall = () => {
    if (!isInitialized) {
      console.warn('Vapi not fully initialized yet');
      return;
    }
    toggleCall();
  };

  return (
    <div className="flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm rounded-full p-2 shadow-lg">
      <div className="flex items-center justify-center">
        <motion.button
          key="callButton"
          onClick={handleToggleCall}
          className="p-3 rounded-full bg-secondary shadow-md hover:bg-secondary/80"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          initial={{ x: 0 }}
          animate={{ x: isSessionActive ? -40 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ zIndex: 10, position: 'relative' }}
        >
          <AnimatePresence mode="wait">
            {!isSessionActive ? (
              <motion.div
                key="micIcon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Mic size={24} className="text-primary-foreground" />
              </motion.div>
            ) : (
              <motion.div
                key="phoneIcon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <PhoneCall size={24} className="text-primary-foreground" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
        <motion.div
          className="rounded-full p-4 overflow-hidden"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: isSessionActive ? '240px' : '0', opacity: isSessionActive ? 1 : 0 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ marginLeft: '10px' }}
        >
          <ReactSiriwave {...siriWaveConfig} />
        </motion.div>
      </div>
    </div>
  );
};

export default Siri;
