import React from 'react';

interface ColophonProps {
  className?: string;
  size?: number;
}

export function Colophon({ className = 'text-stone-700', size = 28 }: ColophonProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Sound Volumes Colophon"
    >
      {/* Refined editorial geometric colophon mark: an open folio flanked by resonance waves */}
      <circle cx="20" cy="20" r="18.5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
      <path
        d="M13 14V26C16.5 26 18.5 24 20 23C21.5 24 23.5 26 27 26V14C23.5 14 21.5 16 20 17C18.5 16 16.5 14 13 14Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <line x1="20" y1="17" x2="20" y2="23" stroke="currentColor" strokeWidth="1" />
      <circle cx="20" cy="11.5" r="1.5" fill="currentColor" />
    </svg>
  );
}
