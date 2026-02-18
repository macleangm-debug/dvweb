import React from 'react';

/**
 * BioSign Logo Component
 * Exact recreation of the original BioSign SDK logo from the GitHub repository
 * - Rounded square container with blue-to-teal diagonal gradient
 * - Stylized fingerprint icon in light blue
 */
const BioSignLogo = ({ size = 48, className = "" }) => {
  return (
    <div 
      className={`biosign-logo-glow ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Gradient Definitions */}
        <defs>
          {/* Blue to Teal diagonal gradient (top-left to bottom-right) */}
          <linearGradient id="biosign-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00BFFF" />
            <stop offset="100%" stopColor="#00CED1" />
          </linearGradient>
        </defs>
        
        {/* Rounded Square Background */}
        <rect 
          width="48" 
          height="48" 
          rx="12" 
          fill="url(#biosign-bg)" 
        />
        
        {/* Stylized Fingerprint Icon - Light Blue */}
        <g transform="translate(12, 10)">
          {/* Outer curved lines */}
          <path
            d="M12 4C7.58 4 4 8.5 4 14c0 4.5 2.2 8.5 5.5 10.5"
            stroke="#87CEEB"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.95"
          />
          <path
            d="M12 4c4.42 0 8 4.5 8 14 0 4.5-2.2 8.5-5.5 10.5"
            stroke="#87CEEB"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.95"
          />
          
          {/* Middle curved lines */}
          <path
            d="M12 8C9.24 8 7 11.5 7 16c0 3.5 1.5 6.5 3.8 8"
            stroke="#87CEEB"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.95"
          />
          <path
            d="M12 8c2.76 0 5 3.5 5 8 0 3.5-1.5 6.5-3.8 8"
            stroke="#87CEEB"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.95"
          />
          
          {/* Inner curved lines */}
          <path
            d="M12 12c-1.66 0-3 2-3 5 0 2.5 1 4.5 2.5 5.5"
            stroke="#87CEEB"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.95"
          />
          <path
            d="M12 12c1.66 0 3 2 3 5 0 2.5-1 4.5-2.5 5.5"
            stroke="#87CEEB"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.95"
          />
          
          {/* Center line */}
          <path
            d="M12 16v8"
            stroke="#87CEEB"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.95"
          />
        </g>
      </svg>
    </div>
  );
};

export default BioSignLogo;
