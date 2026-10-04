'use client';

import React from 'react';
import { useCMS } from '@/lib/cms-context';
import { Colophon } from './Colophon';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { data, activeSite, setActiveSite } = useCMS();

  return (
    <footer className="bg-[#ede6d8] border-t border-[#ded5c5] text-[#524b43] text-xs font-sans mt-20 sm:mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-10 pb-10 sm:pb-12 border-b border-[#ded5c5]">
          {/* Col 1: Imprint & Colophon */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Colophon size={24} className="text-[#1c1917]" />
              <span className="font-serif text-lg font-medium text-[#1c1917]">Sound Volumes</span>
            </div>
            <p className="text-xs text-[#635c53] leading-relaxed font-sans">
              Independent literary publishing imprint. Dedicated to enduring fiction, speculative inquiries, and deliberate bookmaking.
            </p>
          </div>

          {/* Col 2: The Three Sites */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] uppercase tracking-widest text-[#1c1917] font-semibold">
              Three-Site Network
            </h4>
            <ul className="space-y-1 text-xs text-[#524b43]">
              <li>
                <button
                  onClick={() => {
                    setActiveSite('soundvolumes');
                    onNavigate('/');
                  }}
                  className={`hover:text-[#1c1917] transition-colors py-1 inline-flex items-center min-h-[32px] ${
                    activeSite === 'soundvolumes' ? 'text-[#1c1917] font-semibold underline underline-offset-4' : ''
                  }`}
                >
                  SoundVolumes.com (Imprint)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveSite('alec');
                    onNavigate('/');
                  }}
                  className={`hover:text-[#1c1917] transition-colors py-1 inline-flex items-center min-h-[32px] ${
                    activeSite === 'alec' ? 'text-[#1c1917] font-semibold underline underline-offset-4' : ''
                  }`}
                >
                  AlecRowell.com (Author)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveSite('laurie');
                    onNavigate('/');
                  }}
                  className={`hover:text-[#1c1917] transition-colors py-1 inline-flex items-center min-h-[32px] ${
                    activeSite === 'laurie' ? 'text-[#1c1917] font-semibold underline underline-offset-4' : ''
                  }`}
                >
                  LaurieFreeman.com (Writer)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Sound Volumes Catalogue & Resources */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] uppercase tracking-widest text-[#1c1917] font-semibold">
              Publishing House
            </h4>
            <ul className="space-y-1 text-xs text-[#524b43]">
              <li>
                <button
                  onClick={() => {
                    setActiveSite('soundvolumes');
                    onNavigate('/books');
                  }}
                  className="hover:text-[#1c1917] transition-colors py-1 inline-flex items-center min-h-[32px]"
                >
                  Books & Editions
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveSite('soundvolumes');
                    onNavigate('/authors');
                  }}
                  className="hover:text-[#1c1917] transition-colors py-1 inline-flex items-center min-h-[32px]"
                >
                  Authors
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveSite('soundvolumes');
                    onNavigate('/news');
                  }}
                  className="hover:text-[#1c1917] transition-colors py-1 inline-flex items-center min-h-[32px]"
                >
                  Notes from the Editor
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveSite('soundvolumes');
                    onNavigate('/extras');
                  }}
                  className="hover:text-[#1c1917] transition-colors py-1 inline-flex items-center min-h-[32px]"
                >
                  Character Cards Reader Offer
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Central Contact & Governance */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] uppercase tracking-widest text-[#1c1917] font-semibold">
              Central Correspondence
            </h4>
            <p className="text-xs text-[#635c53] leading-relaxed font-sans">
              All communications for Sound Volumes, Alec Rowell, and Laurie Freeman route through our central dispatch.
            </p>
            <div className="pt-1">
              <button
                onClick={() => {
                  setActiveSite('soundvolumes');
                  onNavigate('/contact');
                }}
                className="text-xs uppercase tracking-wider text-[#1c1917] border-b border-[#1c1917] pb-0.5 hover:text-[#944222] hover:border-[#944222] transition-colors min-h-[36px] inline-flex items-center"
              >
                Inquiry Dispatch Desk
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright and Imprint note */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#736b62]">
          <div>
            © {new Date().getFullYear()} {data.settings?.soundVolumesCopy?.footerCopyright || 'Sound Volumes. All rights reserved. Sites designed, not decorated.'}
          </div>
          <div className="text-[11px] text-[#8c847a] font-sans">
            {data.settings?.soundVolumesCopy?.footerImprintNote || 'Independent Publishing & Author Cycle'}
          </div>
        </div>
      </div>
    </footer>
  );
}
