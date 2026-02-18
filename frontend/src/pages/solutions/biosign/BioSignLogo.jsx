import React from 'react';

/**
 * BioSign Logo Component
 * A fingerprint-based logo with cyan/teal gradient styling
 */
const BioSignLogo = ({ size = 48, className = "" }) => {
  return (
    <div 
      className={`biosign-logo-glow rounded-xl overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Gradient Background */}
        <defs>
          <linearGradient id="biosign-bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0891B2" />
            <stop offset="50%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="biosign-fg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#E0F2FE" stopOpacity="0.85" />
          </linearGradient>
        </defs>
        
        {/* Background */}
        <rect width="48" height="48" rx="10" fill="url(#biosign-bg-gradient)" />
        
        {/* Fingerprint Icon */}
        <g transform="translate(10, 10)">
          {/* Fingerprint arcs - stylized */}
          <path
            d="M14 2C8.48 2 4 6.48 4 12c0 3.8 2.1 7.1 5.2 8.8"
            stroke="url(#biosign-fg-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M14 5c-3.87 0-7 3.13-7 12 0 3.5 1.5 6.5 3.8 8.5"
            stroke="url(#biosign-fg-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M14 8c-2.21 0-4 1.79-4 4 0 3 0.8 5.5 2.2 7.5"
            stroke="url(#biosign-fg-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M14 11c-.55 0-1 .45-1 1v8"
            stroke="url(#biosign-fg-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M14 2c5.52 0 10 4.48 10 12 0 3.8-2.1 7.1-5.2 8.8"
            stroke="url(#biosign-fg-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M14 5c3.87 0 7 3.13 7 12 0 3.5-1.5 6.5-3.8 8.5"
            stroke="url(#biosign-fg-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M14 8c2.21 0 4 1.79 4 4 0 3-0.8 5.5-2.2 7.5"
            stroke="url(#biosign-fg-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M14 11c.55 0 1 .45 1 1v8"
            stroke="url(#biosign-fg-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
};

export default BioSignLogo;
