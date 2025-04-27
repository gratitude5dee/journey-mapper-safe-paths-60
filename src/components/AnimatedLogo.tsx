import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
interface AnimatedLogoProps {
  className?: string;
  logoSize?: number;
  disableLink?: boolean;
}
export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  className = "",
  logoSize = 40,
  disableLink = false
}) => {
  const lightPathRef = useRef<SVGPathElement>(null);
  const darkPathRef = useRef<SVGPathElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  useEffect(() => {
    // Only run animation if SVG elements are available
    if (!lightPathRef.current || !darkPathRef.current || !textRef.current) return;

    // Animate light blue path
    const lightPath = lightPathRef.current;
    const darkPath = darkPathRef.current;
    const text = textRef.current;

    // Reset initial state
    lightPath.style.strokeDasharray = lightPath.getTotalLength().toString();
    lightPath.style.strokeDashoffset = lightPath.getTotalLength().toString();
    lightPath.style.fillOpacity = '0';
    darkPath.style.strokeDasharray = darkPath.getTotalLength().toString();
    darkPath.style.strokeDashoffset = darkPath.getTotalLength().toString();
    darkPath.style.fillOpacity = '0';
    text.style.opacity = '0';

    // Animate light path
    lightPath.animate([{
      strokeDashoffset: lightPath.getTotalLength(),
      fillOpacity: 0
    }, {
      strokeDashoffset: 0,
      fillOpacity: 0,
      offset: 0.7
    }, {
      strokeDashoffset: 0,
      fillOpacity: 1
    }], {
      duration: 1500,
      fill: 'forwards',
      easing: 'ease-out'
    });

    // Animate dark path with slight delay
    setTimeout(() => {
      darkPath.animate([{
        strokeDashoffset: darkPath.getTotalLength(),
        fillOpacity: 0
      }, {
        strokeDashoffset: 0,
        fillOpacity: 0,
        offset: 0.7
      }, {
        strokeDashoffset: 0,
        fillOpacity: 1
      }], {
        duration: 1300,
        fill: 'forwards',
        easing: 'ease-out'
      });
    }, 200);

    // Fade in text
    setTimeout(() => {
      text.animate([{
        opacity: 0,
        transform: 'translateY(5px)'
      }, {
        opacity: 1,
        transform: 'translateY(0)'
      }], {
        duration: 800,
        fill: 'forwards',
        easing: 'ease-out'
      });
    }, 700);
  }, []);
  const LogoContent = <svg width={logoSize * 3.5} height={logoSize} viewBox="0 0 350 100" xmlns="http://www.w3.org/2000/svg" className="overflow-visible bg-slate-800">
      {/* Light blue path */}
      <path ref={lightPathRef} d="M60,40 C70,20 100,15 125,35 C145,50 125,70 85,70 C65,70 50,60 60,40" fill="#67a9ff" stroke="#67a9ff" strokeWidth="4" className="origin-center" />
      
      {/* Dark blue path */}
      <path ref={darkPathRef} d="M85,70 C125,70 155,60 155,40 C155,20 135,20 115,35 C95,50 75,65 85,70" fill="#1e4086" stroke="#1e4086" strokeWidth="4" className="origin-center" />
      
      {/* StreetSmart text */}
      <text ref={textRef} x="175" y="80" fontSize="36" fontFamily="sans-serif" fontWeight="bold" fill="#1e4086" textAnchor="middle">
        StreetSmart
      </text>
    </svg>;
  if (disableLink) {
    return <div className={`block ${className}`}>{LogoContent}</div>;
  }
  return <Link to="/" className={`block ${className}`}>
      {LogoContent}
    </Link>;
};