import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * AfricaMap - Interactive SVG map of Africa showing project presence
 * Highlights countries with active DataVision projects
 */
const AfricaMap = ({ onCountryClick }) => {
  const [hoveredCountry, setHoveredCountry] = useState(null);
  
  // Countries with donor-funded projects
  const projectCountries = [
    'Tanzania', 'Kenya', 'Uganda', 'Rwanda', 'Ethiopia', 'Malawi', 
    'Mozambique', 'Zambia', 'Zimbabwe', 'South Africa', 'Ghana', 
    'Nigeria', 'Senegal', 'Mali', 'Niger'
  ];

  // Simplified Africa SVG paths
  const africaCountries = [
    { id: 'TZ', name: 'Tanzania', path: 'M540,340 L560,330 L580,345 L575,370 L555,385 L530,375 L525,355 Z' },
    { id: 'KE', name: 'Kenya', path: 'M540,290 L570,285 L580,310 L560,330 L540,340 L525,320 Z' },
    { id: 'UG', name: 'Uganda', path: 'M510,285 L540,280 L540,310 L520,320 L505,305 Z' },
    { id: 'RW', name: 'Rwanda', path: 'M515,320 L530,318 L532,332 L518,334 Z' },
    { id: 'ET', name: 'Ethiopia', path: 'M540,240 L590,230 L610,260 L580,290 L540,280 Z' },
    { id: 'MW', name: 'Malawi', path: 'M555,385 L565,375 L570,400 L560,420 L550,405 Z' },
    { id: 'MZ', name: 'Mozambique', path: 'M560,420 L580,400 L590,440 L570,480 L545,460 L555,430 Z' },
    { id: 'ZM', name: 'Zambia', path: 'M490,380 L530,375 L545,400 L520,430 L480,415 Z' },
    { id: 'ZW', name: 'Zimbabwe', path: 'M510,430 L545,420 L550,450 L520,460 L505,445 Z' },
    { id: 'ZA', name: 'South Africa', path: 'M460,500 L540,490 L560,530 L520,570 L470,560 L450,520 Z' },
    { id: 'GH', name: 'Ghana', path: 'M370,280 L390,275 L395,310 L375,320 L365,300 Z' },
    { id: 'NG', name: 'Nigeria', path: 'M400,270 L450,265 L460,300 L440,330 L395,320 Z' },
    { id: 'SN', name: 'Senegal', path: 'M310,250 L340,245 L345,265 L320,275 Z' },
    { id: 'ML', name: 'Mali', path: 'M340,200 L400,195 L410,250 L350,260 Z' },
    { id: 'NE', name: 'Niger', path: 'M410,200 L470,195 L475,245 L420,255 Z' },
    // Non-project countries (shown in grey)
    { id: 'EG', name: 'Egypt', path: 'M500,120 L550,110 L560,160 L520,180 L495,155 Z', noProject: true },
    { id: 'LY', name: 'Libya', path: 'M430,120 L500,115 L505,170 L450,185 L420,160 Z', noProject: true },
    { id: 'DZ', name: 'Algeria', path: 'M360,100 L430,95 L440,170 L380,190 L350,150 Z', noProject: true },
    { id: 'MA', name: 'Morocco', path: 'M320,100 L360,95 L365,140 L330,155 Z', noProject: true },
    { id: 'SD', name: 'Sudan', path: 'M500,180 L560,175 L570,230 L520,245 L490,220 Z', noProject: true },
    { id: 'CD', name: 'DR Congo', path: 'M460,310 L510,300 L520,360 L490,390 L450,370 Z', noProject: true },
    { id: 'AO', name: 'Angola', path: 'M420,380 L470,370 L480,430 L440,450 L410,420 Z', noProject: true },
    { id: 'NA', name: 'Namibia', path: 'M420,450 L460,440 L470,510 L430,530 L410,490 Z', noProject: true },
    { id: 'BW', name: 'Botswana', path: 'M470,450 L510,445 L515,500 L475,510 Z', noProject: true },
  ];

  return (
    <div className="relative">
      <svg viewBox="280 80 350 520" className="w-full h-auto africa-map">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {africaCountries.map((country) => {
          const hasProject = projectCountries.includes(country.name);
          const isHovered = hoveredCountry === country.name;
          return (
            <motion.path
              key={country.id}
              d={country.path}
              fill={hasProject ? (isHovered ? '#e63946' : '#2a9d8f') : '#e2e8f0'}
              stroke="#ffffff"
              strokeWidth="1.5"
              className="cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onMouseEnter={() => setHoveredCountry(country.name)}
              onMouseLeave={() => setHoveredCountry(null)}
              onClick={() => hasProject && onCountryClick?.(country.name)}
              filter={isHovered && hasProject ? 'url(#glow)' : undefined}
            />
          );
        })}
      </svg>
      {hoveredCountry && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-4 bg-[#0a1628] text-white px-4 py-2 text-sm font-medium"
        >
          {hoveredCountry}
          {projectCountries.includes(hoveredCountry) && (
            <span className="ml-2 text-[#2a9d8f]">• Active Projects</span>
          )}
        </motion.div>
      )}
      <div className="mt-4 flex items-center gap-6 text-sm text-[#64748b]">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#2a9d8f]"></div>
          <span>Active Presence</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#e2e8f0]"></div>
          <span>Expansion Target</span>
        </div>
      </div>
    </div>
  );
};

export default AfricaMap;
