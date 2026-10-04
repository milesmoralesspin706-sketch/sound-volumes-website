'use client';

import React from 'react';
import { useCMS } from '@/lib/cms-context';
import { SiteId } from '@/lib/types';
import { Globe } from 'lucide-react';

export function SiteSwitcherBar() {
  const { activeSite, setActiveSite } = useCMS();

  const sites: { id: SiteId; label: string; domain: string; type: string }[] = [
    {
      id: 'soundvolumes',
      label: 'Sound Volumes',
      domain: 'soundvolumes.com',
      type: 'Publishing Imprint'
    },
    {
      id: 'alec',
      label: 'Alec Rowell',
      domain: 'alecrowell.com',
      type: 'Author Site'
    },
    {
      id: 'laurie',
      label: 'Laurie Freeman',
      domain: 'lauriefreeman.com',
      type: 'Writer Site'
    }
  ];

  return (
    <div className="bg-[#191614] text-[#d4ccc0] text-xs py-1.5 px-3 sm:px-4 border-b border-[#282420] transition-colors w-full overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
        {/* Left: Domain Switcher with smooth horizontal scroll on mobile */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 w-full sm:w-auto -mx-1 px-1">
          <Globe className="w-3.5 h-3.5 text-[#9e9589] shrink-0" />
          <span className="text-[#9e9589] font-sans text-[11px] shrink-0 hidden md:inline">
            Network:
          </span>
          <div className="flex items-center gap-1 font-mono text-[11px] shrink-0">
            {sites.map((site) => {
              const isActive = activeSite === site.id;
              return (
                <button
                  key={site.id}
                  onClick={() => setActiveSite(site.id)}
                  className={`px-2.5 py-1.5 rounded transition-all flex items-center gap-1 whitespace-nowrap text-[11px] min-h-[36px] ${
                    isActive
                      ? 'bg-[#f6f3eb] text-[#191614] font-medium shadow-xs'
                      : 'text-[#d4ccc0] hover:text-white hover:bg-[#282420]'
                  }`}
                  title={`Switch to ${site.domain}`}
                  aria-pressed={isActive}
                >
                  <span>{site.domain}</span>
                  <span className="text-[9px] opacity-60 hidden lg:inline">({site.type})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Network Subtext (Desktop only) */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] text-[#857d72] font-sans shrink-0">
          <span>Sound Volumes Imprint Network</span>
        </div>
      </div>
    </div>
  );
}

