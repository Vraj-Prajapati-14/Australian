import React from 'react';

const CarIcon = ({ size = 'medium', className = '' }) => {
  return (
    <div className={`car-icon-container ${size} ${className}`}>
      {/* Background tabs peeking out */}
      <div className="tab tab-top-right"></div>
      <div className="tab tab-bottom-left"></div>
      
      {/* Main white card */}
      <div className="car-card">
        {/* Car icon */}
        <svg 
          className="car-svg" 
          viewBox="0 0 100 100" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Car body - main trapezoidal shape */}
          <path 
            d="M20 60 L30 40 L70 40 L80 60 L80 70 L20 70 Z" 
            fill="#2563eb"
            className="car-body"
          />
          
          {/* Car hood/bumper - wider rectangular base */}
          <rect 
            x="15" 
            y="65" 
            width="70" 
            height="8" 
            fill="#2563eb"
            rx="2"
            className="car-hood"
          />
          
          {/* Headlights */}
          <circle cx="25" cy="68" r="3" fill="#2563eb" className="headlight left" />
          <circle cx="75" cy="68" r="3" fill="#2563eb" className="headlight right" />
          
          {/* Grille/mouth */}
          <rect 
            x="35" 
            y="55" 
            width="30" 
            height="4" 
            fill="#2563eb"
            rx="2"
            className="car-grille"
          />
          
          {/* Side mirrors/wings */}
          <path 
            d="M20 45 L15 40 L18 35 L23 40 Z" 
            fill="#2563eb"
            className="side-mirror left"
          />
          <path 
            d="M80 45 L85 40 L82 35 L77 40 Z" 
            fill="#2563eb"
            className="side-mirror right"
          />
        </svg>
      </div>
    </div>
  );
};

export default CarIcon;
