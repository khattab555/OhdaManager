import React from 'react';

export const DirhamSign: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Letter D */}
    <path d="M6 4h6a6 6 0 0 1 0 12H6z" />
    <path d="M6 16h0" /> {/* Just to keep the base line if needed, but D usually covers it. */}
    <line x1="6" y1="4" x2="6" y2="16" />
    
    {/* Two vertical lines crossing the D */}
    <line x1="9" y1="2" x2="9" y2="18" />
    <line x1="13" y1="2" x2="13" y2="18" />
  </svg>
);
