import React from 'react';
import { Colophon } from './Colophon';

interface LogoProps {
  variant?: 'full' | 'mark' | 'text-only';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ variant = 'full', className = '', size = 'md' }: LogoProps) {
  const markSize = size === 'sm' ? 22 : size === 'lg' ? 34 : 26;

  if (variant === 'mark') {
    return <Colophon size={markSize} className={className} />;
  }

  if (variant === 'text-only') {
    return (
      <span className={`font-serif tracking-tight text-[#1c1917] font-medium whitespace-nowrap ${
        size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg'
      } ${className}`}>
        Sound Volumes
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-2 sm:gap-2.5 ${className}`}>
      <Colophon size={markSize} className="text-[#1c1917] shrink-0" />
      <div className="flex flex-col">
        <span className={`font-serif tracking-tight text-[#1c1917] font-medium leading-none whitespace-nowrap ${
          size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg'
        }`}>
          Sound Volumes
        </span>
        <span className="text-[10px] uppercase tracking-widest text-[#736b62] font-sans mt-0.5 whitespace-nowrap">
          Publishing Imprint
        </span>
      </div>
    </div>
  );
}
