import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AppLogoProps {
  size?: number;
  className?: string;
  useCustomLogo?: boolean;
}

export function AppLogo({ 
  size = 40, 
  className = '',
  useCustomLogo = false
}: AppLogoProps) {
  const [customLogoError, setCustomLogoError] = useState(false);
  
  // If custom logo is enabled and no error occurred, use the custom logo
  const logoUrl = useCustomLogo && !customLogoError 
    ? '/icons/app/custom-logo.png' 
    : null;

  // Handle error loading the custom logo
  const handleLogoError = () => {
    console.error('Error loading custom logo');
    setCustomLogoError(true);
  };
  
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* If custom logo is available, use it */}
      {logoUrl ? (
        <motion.img
          src={logoUrl}
          alt="App Logo"
          width={size}
          height={size}
          className="rounded-full"
          onError={handleLogoError}
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.9, 1, 0.9] 
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ) : (
        // Otherwise use the default glowing compass
        <div className="relative">
          {/* Outer glow */}
          <motion.div
            className="absolute rounded-full"
            style={{ 
              width: size, 
              height: size,
              backgroundColor: '#5eead4',
              filter: `blur(${size * 0.2}px)`,
              opacity: 0.4
            }}
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.6, 0.4] 
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Inner circle */}
          <div 
            className="absolute rounded-full flex items-center justify-center"
            style={{ 
              width: size * 0.9, 
              height: size * 0.9,
              backgroundColor: '#5eead4',
              boxShadow: `0 0 ${size * 0.1}px #5eead4`,
            }}
          />
          
          {/* Main circle with icon */}
          <div 
            className="z-10 relative rounded-full flex items-center justify-center"
            style={{ 
              width: size * 0.8, 
              height: size * 0.8,
              backgroundColor: 'rgba(0,0,0,0.9)',
              color: '#ffffff',
              borderWidth: 2,
              borderStyle: 'solid',
              borderColor: '#ffffff',
              boxShadow: `inset 0 0 ${size * 0.05}px #5eead4`,
            }}
          >
            {/* Compass Icon */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width={size * 0.5} 
              height={size * 0.5} 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
} 