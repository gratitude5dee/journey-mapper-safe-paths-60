
import React, { useEffect, useState, useRef } from 'react';
import { AnimatedLogo } from './AnimatedLogo';

interface AnimatedLogoIntroProps {
  onComplete?: () => void;
}

export const AnimatedLogoIntro: React.FC<AnimatedLogoIntroProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Show intro for 3 seconds then fade out
    timeoutRef.current = window.setTimeout(() => {
      setVisible(false);
      // Wait for fade out animation to complete before calling onComplete
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 500);
    }, 3000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-900 transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="scale-150">
        <AnimatedLogo logoSize={100} />
      </div>
    </div>
  );
};
