'use client';

import React from 'react';
import { useCMS } from '@/lib/cms-context';
import { ArrowRight } from 'lucide-react';

interface AnnouncementStripProps {
  siteKey: 'soundvolumes' | 'alec' | 'laurie';
  onNavigate?: (destination: string) => void;
}

export function AnnouncementStrip({ siteKey, onNavigate }: AnnouncementStripProps) {
  const { data } = useCMS();
  const announcement = data.settings.announcements[siteKey];

  if (!announcement || !announcement.visibility || !announcement.text) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    if (onNavigate && announcement.destination) {
      e.preventDefault();
      onNavigate(announcement.destination);
    }
  };

  return (
    <aside aria-label="Announcement" className="w-full bg-[#eee7db] border-b border-[#ddd4c4] text-[#2c2824] text-xs py-2 px-3 sm:px-4 text-center">
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        <span className="font-sans tracking-wide text-[#3d3730]">{announcement.text}</span>
        {announcement.destination && (
          <a
            href={announcement.destination}
            onClick={handleClick}
            className="inline-flex items-center gap-1 font-medium text-[#1c1917] underline underline-offset-4 hover:text-[#944222] transition-colors py-0.5"
          >
            <span>Learn more</span>
            <ArrowRight className="w-3 h-3 text-[#944222]" />
          </a>
        )}
      </div>
    </aside>
  );
}
