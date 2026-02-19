import React from 'react';

/**
 * BioSign Logo Component
 * Dark rounded rectangle with green outline shield icon
 */
const BioSignLogo = ({ size = 48, className = "" }) => {
  return (
    <div 
      className={`biosign-logo-glow ${className}`}
      style={{ 
        width: size, 
        height: size * 1.2,
        background: 'linear-gradient(135deg, rgba(0, 255, 148, 0.1) 0%, rgba(0, 80, 50, 0.3) 100%)',
        borderRadius: '12px',
        border: '1px solid rgba(0, 255, 148, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <svg
        viewBox="0 0 24 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '60%', height: '60%' }}
      >
        {/* Shield outline - matching the original green stroke style */}
        <path
          d="M12 2L3 6v6c0 7.5 3.8 12.5 9 14.5 5.2-2 9-7 9-14.5V6L12 2z"
          stroke="#00FF94"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Inner shield accent */}
        <path
          d="M12 6L6 9v4c0 5.5 2.5 9 6 10.5 3.5-1.5 6-5 6-10.5V9L12 6z"
          stroke="#00FF94"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.5"
        />
      </svg>
    </div>
  );
};

export default BioSignLogo;
