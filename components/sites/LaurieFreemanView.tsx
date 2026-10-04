'use client';

import React from 'react';
import Image from 'next/image';
import { useCMS } from '@/lib/cms-context';
import { WorkCard } from '../works/WorkCard';
import { ContactForm } from '../common/ContactForm';
import { ArrowRight, BookOpen } from 'lucide-react';

interface LaurieFreemanViewProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function LaurieFreemanView({ currentPath, onNavigate }: LaurieFreemanViewProps) {
  const { data, setActiveSite } = useCMS();
  const copy = data.settings?.laurieCopy || {
    brandName: 'Laurie Freeman',
    brandSubtitle: 'Fiction & Nonfiction',
    heroTitle: 'Laurie Freeman',
    heroSubtitle: 'Fiction & Nonfiction',
    heroQuote: 'Speculative universes, historical narrative, and container orchard cultivation.',
    heroPhoto: '/images/laurie-portrait.jpg',
    heroPrimaryBtnText: 'Selected Works',
    heroSecondaryBtnText: 'About & Background',
    workSectionTitle: 'Fiction & Nonfiction',
    workSectionDescription: 'Speculative universes, young adult narratives, and container orchard horticulture.',
    sduTitle: 'Sixer Diaspora Universe (SDU)',
    sduDescription: 'Deep space settlement, dispersed human communities, and changing social structures. Co-created with Alec Rowell.',
    fictionTitle: 'Other Fiction & Young Adult',
    fictionDescription: 'Explorations of personal agency, ancient memory, and historical romance.',
    nonfictionTitle: 'Botanical & Horticultural Nonfiction',
    nonfictionDescription: 'Illustrated practical guides on compact container-grown fruit trees and orchard cultivation.',
    aboutTitle: 'About Laurie Freeman',
    aboutBio: 'Laurie Freeman writes speculative fiction and practical botanical guides. Co-creator of the Sixer Diaspora Universe, Freeman combines deep interest in social anthropology with two decades of practical experience cultivating micro-orchards.',
    aboutPhoto: '/images/laurie-portrait.jpg',
    aboutOrchardStatement: 'Laurie maintains research plantings of containerized stone fruit and heirloom pomes, investigating microclimate adaptation in urban settings.',
    contactTitle: 'Contact Laurie Freeman',
    contactDescription: 'Reader notes, horticultural inquiries, and universe development queries are routed through Sound Volumes central correspondence.'
  };

  // Find Laurie's Author record
  const laurie = data.authors.find((a) => a.slug === 'laurie-freeman') || data.authors[1];

  // Laurie's works
  const laurieWorks = data.works
    .filter((w) => (w.authorSlug === 'laurie-freeman' || w.coAuthor?.includes('Laurie Freeman')) && w.siteVisibility.laurie && w.visibility)
    .sort((a, b) => a.ordering - b.ordering);

  // Group works by category
  const sduWorks = laurieWorks.filter((w) => w.universeSeries.includes('Sixer Diaspora'));
  const fictionWorks = laurieWorks.filter(
    (w) => !w.universeSeries.includes('Sixer Diaspora') && !w.universeSeries.includes('Botanical')
  );
  const nonfictionWorks = laurieWorks.filter((w) => w.universeSeries.includes('Botanical'));

  // Handle /work route
  if (currentPath === '/work') {
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <header className="max-w-2xl mb-8 sm:mb-12">
          <div className="text-xs uppercase tracking-widest text-[#944222] font-semibold font-sans mb-2">
            Selected Work
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1c1917] font-medium tracking-tight mb-3">
            {copy.workSectionTitle}
          </h1>
          <p className="text-[#524b43] text-xs sm:text-sm font-sans leading-relaxed">
            {copy.workSectionDescription}
          </p>
        </header>

        <div className="space-y-10 sm:space-y-12">
          {/* Sixer Diaspora Universe */}
          <section>
            <div className="border-b border-[#ded5c5] pb-3 mb-6">
              <h2 className="font-serif text-2xl text-[#1c1917] font-medium">
                {copy.sduTitle}
              </h2>
              <p className="text-xs text-[#736b62] font-sans mt-1">
                {copy.sduDescription}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {sduWorks.map((work) => (
                <WorkCard key={work.id} work={work} />
              ))}
            </div>
          </section>

          {/* Other Fiction */}
          <section>
            <div className="border-b border-[#ded5c5] pb-3 mb-6">
              <h2 className="font-serif text-2xl text-[#1c1917] font-medium">
                {copy.fictionTitle}
              </h2>
              <p className="text-xs text-[#736b62] font-sans mt-1">
                {copy.fictionDescription}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {fictionWorks.map((work) => (
                <WorkCard key={work.id} work={work} />
              ))}
            </div>
          </section>

          {/* Nonfiction */}
          <section>
            <div className="border-b border-[#ded5c5] pb-3 mb-6">
              <h2 className="font-serif text-2xl text-[#1c1917] font-medium">
                {copy.nonfictionTitle}
              </h2>
              <p className="text-xs text-[#736b62] font-sans mt-1">
                {copy.nonfictionDescription}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {nonfictionWorks.map((work) => (
                <WorkCard key={work.id} work={work} />
              ))}
            </div>
          </section>
        </div>
      </main>
    );
  }

  // Handle /about route
  if (currentPath === '/about') {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <header className="mb-8 sm:mb-10">
          <div className="text-xs uppercase tracking-widest text-[#944222] font-semibold font-sans mb-2">
            Writer Profile
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1c1917] font-medium tracking-tight mb-2">
            {copy.aboutTitle}
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#736b62] font-sans">
            {copy.heroSubtitle}
          </p>
        </header>

        <section className="bg-[#fcfbf8] border border-[#ddd5c7] p-5 sm:p-8 lg:p-10 mb-8 sm:mb-12 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
            <div className="md:col-span-5">
              <div className="relative aspect-[3/4] w-full max-w-[280px] mx-auto md:max-w-none bg-[#eee7da] border border-[#ddd5c7] overflow-hidden shadow-xs">
                <Image
                  src={copy.aboutPhoto || copy.heroPhoto || laurie.photographPrimary}
                  alt="Laurie Freeman portrait"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
              </div>
              <div className="text-[11px] text-[#736b62] font-sans mt-2 italic text-center">
                Laurie Freeman, writer portrait.
              </div>
            </div>

            <div className="md:col-span-7">
              <h2 className="font-serif text-2xl text-[#1c1917] font-medium mb-3">
                Background & Narrative Philosophy
              </h2>
              <div className="prose prose-stone text-xs sm:text-sm text-[#453f38] leading-relaxed font-sans space-y-4">
                <p>{copy.aboutBio}</p>
                <p>{copy.aboutOrchardStatement}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Built-in but Dormant "Read Free" provisions */}
        <section className="bg-[#f7f4ed] border border-dashed border-[#cfc6b6] p-5 sm:p-8 mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-2 text-[#1c1917]">
            <BookOpen className="w-4 h-4 text-[#944222]" />
            <h3 className="font-serif text-lg font-medium">
              Read Free (Built-in Provision / Currently Inactive)
            </h3>
          </div>
          <p className="text-xs text-[#524b43] font-sans leading-relaxed mb-3">
            An architectural provision is established to host open-access short fiction, essays, and preview excerpts directly on this domain. This section remains dormant until launch materials are scheduled.
          </p>
          <span className="text-[11px] uppercase tracking-wider text-[#8c847a] font-mono">
            Status: Built-in / Dormant
          </span>
        </section>

        {/* Imprint Connection */}
        <section className="border-t border-[#ded5c5] pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-serif text-lg text-[#1c1917] font-medium">
              Sound Volumes Imprint
            </h4>
            <p className="text-xs text-[#736b62] font-sans">
              Laurie Freeman’s manuscripts and collaborative works are represented by Sound Volumes.
            </p>
          </div>
          <button
            onClick={() => {
              setActiveSite('soundvolumes');
              onNavigate('/');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#baa794] hover:border-[#1c1917] bg-[#fbf9f4] text-[#1c1917] text-xs uppercase tracking-widest font-sans transition-colors min-h-[44px]"
          >
            <span>Imprint Portal</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#944222]" />
          </button>
        </section>
      </main>
    );
  }

  // Handle /contact route
  if (currentPath === '/contact') {
    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <header className="text-center mb-8 sm:mb-10">
          <div className="text-xs uppercase tracking-widest text-[#944222] font-semibold font-sans mb-2">
            Writer Correspondence
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1c1917] font-medium tracking-tight mb-3">
            {copy.contactTitle}
          </h1>
          <p className="text-[#524b43] text-xs sm:text-sm font-sans leading-relaxed max-w-lg mx-auto">
            {copy.contactDescription}
          </p>
        </header>

        <ContactForm initialRoutingKey="laurie" sourceSiteName="LaurieFreeman.com" />
      </main>
    );
  }

  // DEFAULT: LAURIE FREEMAN HOME
  return (
    <main>
      {/* Editorial Profile Header */}
      <section className="py-12 sm:py-18 lg:py-20 border-b border-[#ded5c5] bg-[#ede6d8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Author Portrait */}
            <div className="md:col-span-4">
              <div className="relative aspect-[3/4] w-full max-w-[260px] sm:max-w-xs mx-auto bg-[#eee7da] border border-[#cfc6b6] shadow-xs overflow-hidden">
                <Image
                  src={copy.heroPhoto || laurie.photographPrimary}
                  alt="Laurie Freeman writer portrait"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Typography & Identity */}
            <div className="md:col-span-8">
              <div className="text-xs uppercase tracking-widest text-[#944222] font-semibold font-sans mb-2">
                {copy.brandSubtitle}
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1c1917] font-medium tracking-tight mb-3 sm:mb-4">
                {copy.heroTitle}
              </h1>
              <p className="text-[#3d3730] text-sm sm:text-base font-serif italic leading-relaxed mb-6 sm:mb-8">
                &ldquo;{copy.heroQuote}&rdquo;
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1">
                <button
                  onClick={() => onNavigate('/work')}
                  className="px-6 py-3 bg-[#1c1917] hover:bg-[#2c2824] text-[#fbf9f5] text-xs uppercase tracking-widest font-sans font-medium transition-colors text-center min-h-[44px] inline-flex items-center justify-center"
                >
                  {copy.heroPrimaryBtnText}
                </button>
                <button
                  onClick={() => onNavigate('/about')}
                  className="px-6 py-3 border border-[#baa794] hover:border-[#1c1917] bg-[#fbf9f4] text-[#2c2824] text-xs uppercase tracking-widest font-sans font-medium transition-colors text-center min-h-[44px] inline-flex items-center justify-center"
                >
                  {copy.heroSecondaryBtnText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Work Showcase */}
      <section className="py-14 sm:py-18 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#ded5c5]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#944222] font-semibold font-sans block mb-1">
              Active Projects
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1917] font-medium">
              Selected Fiction & Inquiries
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/work')}
            className="text-xs uppercase tracking-wider text-[#1c1917] hover:text-[#944222] font-medium hover:underline inline-flex items-center gap-1 self-start sm:self-auto min-h-[44px]"
          >
            <span>View All Works</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#944222]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {laurieWorks.slice(0, 4).map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      </section>

      {/* Route to Central Sound Volumes Imprint */}
      <section className="py-12 bg-[#ede6d8] border-t border-[#ded5c5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="font-serif text-xl text-[#1c1917] font-medium">
              Published with Sound Volumes
            </h3>
            <p className="text-xs text-[#524b43] font-sans mt-1">
              Explore the central Sound Volumes publishing catalogue and collaborative works.
            </p>
          </div>
          <button
            onClick={() => {
              setActiveSite('soundvolumes');
              onNavigate('/');
            }}
            className="px-5 py-3 bg-[#1c1917] hover:bg-[#2c2824] text-[#fbf9f5] text-xs uppercase tracking-widest font-sans font-medium whitespace-nowrap transition-colors min-h-[44px] inline-flex items-center justify-center"
          >
            Visit SoundVolumes.com
          </button>
        </div>
      </section>
    </main>
  );
}
