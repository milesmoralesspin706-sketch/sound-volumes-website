import React from 'react';
import { WorkStatus } from '@/lib/types';

interface StatusMetadataProps {
  status: WorkStatus | string;
  timeline?: string;
  className?: string;
}

export function StatusMetadata({ status, timeline, className = '' }: StatusMetadataProps) {
  return (
    <div className={`flex flex-wrap items-center gap-1.5 text-xs text-stone-500 font-sans ${className}`}>
      <span className="font-normal text-stone-600">Status: {status}</span>
      {timeline && (
        <>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span className="text-stone-500">{timeline}</span>
        </>
      )}
    </div>
  );
}
