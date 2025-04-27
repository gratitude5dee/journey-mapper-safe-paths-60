
import React, { useState, useEffect } from 'react';
import { Mic, PhoneCall } from 'lucide-react';
import ReactSiriwave from 'react-siriwave';
import { motion, AnimatePresence } from 'framer-motion';
import useVapi from '@/hooks/use-vapi';

type CurveStyle = "ios" | "ios9";

interface SiriProps {
  theme: CurveStyle;
}

const Siri: React.FC<SiriProps> = ({ theme }) => {
  const { volumeLevel, isSessionActive, toggleCall } = useVapi();
  const [siriWaveConfig, setSiriWaveConfig] = useState({
    theme: theme || "ios9",
    ratio: 1,
    speed: 0.1,
    amplitude: 0.1,
    frequency: 2,
    color: '#fff',
    cover: false,
    width: 200,
    height: 50,
    autostart: true,
    pixelDepth: 0.02,
    lerpSpeed: 0.1,
  });

  useEffect(() => {
    const calculatedAmplitude = isSessionActive ? Math.min(0.1 + volumeLevel * 5, 0.8) : 0.05;
    const calculatedSpeed = isSessionActive ? Math.max(0.05, volumeLevel * 0.3) : 0.02;
    const calculatedFrequency = isSessionActive ? Math.max(2, Math.min(volumeLevel * 10, 8)) : 2;

    setSiriWaveConfig(prev => ({
      ...prev,
      amplitude: calculatedAmplitude,
      speed: calculatedSpeed,
      frequency: calculatedFrequency,
    }));
  }, [volumeLevel, isSessionActive]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-full p-1 shadow-lg">
        <motion.button
          onClick={toggleCall}
          className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 flex items-center justify-center w-10 h-10"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          style={{ zIndex: 10, position: 'relative' }}
        >
          <AnimatePresence mode="wait">
            {!isSessionActive ? (
              <motion.div
                key="micIcon"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <Mic size={20} />
              </motion.div>
            ) : (
              <motion.div
                key="phoneIcon"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <PhoneCall size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
        <motion.div
          className="overflow-hidden flex items-center justify-center ml-1"
          initial={{ width: 0, opacity: 0 }}
          animate={{
            width: isSessionActive ? siriWaveConfig.width : 0,
            opacity: isSessionActive ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          {isSessionActive && <ReactSiriwave {...siriWaveConfig} />}
        </motion.div>
      </div>
    </div>
  );
};

export default Siri;
