import React from 'react';
import fluxoLogo from '@/assets/fluxo.png';

interface LogoProps {
  className?: string;
  alt?: string;
  showText?: boolean;
}

export function Logo({ className = '', alt = 'Fluxo Logo', showText = true }: LogoProps) {
  return (
    <div className={`logo-container ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <img 
        src={fluxoLogo} 
        alt={alt} 
        className="logo" 
        style={{ width: '40px', height: '40px', objectFit: 'contain' }}
      />
      {showText && (
        <h1 className="brand-name" style={{ 
          color: '#162456', 
          fontSize: '2rem', 
          fontWeight: '700', 
          margin: 0 
        }}>
          Fluxo
        </h1>
      )}
    </div>
  );
}
