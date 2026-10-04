'use client';

import React from 'react';
import Image from 'next/image';
import { useCMS } from '@/lib/cms-context';
import { BookCard } from '../books/BookCard';
import { WorkCard } from '../works/WorkCard';
import { CharacterCardsReaderOffer } from '../extras/CharacterCardsReaderOffer';
import { ContactForm } from '../common/ContactForm';
import { ArrowRight } from 'lucide-react';

interface AlecRowellViewProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function AlecRowellView({ currentPath, onNavigate }: AlecRowellViewProps) {
  const { data, setActiveSite } = useCMS();
  const copy = data.settings?.alecCopy || {
    brandName: 'Alec Rowell',
    brandSubtitle: 'Novelist & Researcher',
    heroTitle: 'Alec Rowell',
    heroSubtitle: 'Novelist & Narrative Researcher',
    heroQuote: 'Investigating memory, regional topography, and deep-time consciousness across speculative cycles and Texan landscapes.',
    heroPhoto: '/images/alec-cowled.jpg',
    heroPrimaryBtnText: 'Explore Jack Comes Back',
    heroSecondaryBtnText: 'Forthcoming Work',
    booksSectionTitle: 'Jack Comes Back Series',
    booksSectionDescription: 'The complete cycle of an immortal canine consciousness reincarnating across ten thousand years of human civilization. Published by Sound Volumes.',
    workSectionTitle: 'Current Writing & Future Volumes',
    workSectionDescription: 'Current manuscripts in development across regional crime fiction, collaborative science fiction, and personal narrative.',
    robinPikeTitle: 'Robin Pike / Hyde, Texas Mysteries',
    robinPikeDescription: 'Regional investigations exploring historical tensions and community topography in Hyde, Texas.',
    sduTitle: 'Sixer Diaspora Universe (SDU)',
    sduDescription: 'Deep space settlement and social dispersion. Co-created with Laurie Freeman.',
    memoirTitle: 'Memoir & Narrative Essays',
    memoirDescription: 'Personal essays exploring childhood landscape, natural history, and literary practice.',
    aboutTitle: 'About Alec Rowell',
    aboutBio: 'Alec Rowell writes speculative fiction, regional mystery, and historical narrative. Author of the Jack Comes Back series published by Sound Volumes, Rowell conducts archival research into deep-time ecology and Texas Hill Country historical topography.',
    aboutPhoto: '/images/alec-forest.jpg',
    aboutResearchStatement: 'Areas of active inquiry include late Pleistocene domestication, Iron Age fortifications, the Trans-Pecos borderlands, and multi-generational stellar migrations.',
    contactTitle: 'Direct Correspondence to Alec Rowell',
    contactDescription: 'Author inquiries, reader correspondence, and rights queries are received through the central Sound Volumes dispatch desk.'
  };

  // Find Alec's Author record
  const alec = data.authors.find((a) => a.slug === 'alec-rowell') || data.authors[0];

  // Alec's books (Jack Comes Back)
  const alecBooks = data.books.filter((b) => b.authorSlug === 'alec-rowell' && b.visibility);

  // Alec's works
  const alecWorks = data.works
    .filter((w) => w.authorSlug === 'alec-rowell' && w.siteVisibility.alec && w.visibility)
    .sort((a, b) => a.ordering - b.ordering);

  // Group works by universe/type
  const robinPikeWorks = alecWorks.filter((w) => w.universeSeries.includes('Robin Pike'));
  const sduWorks = alecWorks.filter((w) => w.universeSeries.includes('Sixer Diaspora'));
  const memoirWorks = alecWorks.filter((w) => w.universeSeries.includes('Memoir') || w.typeForm.includes('Memoir'));

  // Handle /books route
  if (currentPath === '/books') {
    return (
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <header className="max-w-2xl mb-8 sm:mb-12">
          <div className="text-xs uppercase tracking-widest text-[#944222] font-semibold font-sans mb-2">
            Published Series
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1c1917] font-medium tracking-tight mb-3">
            {copy.booksSectionTitle}
          </h1>
          <p className="text-[#524b43] text-xs sm:text-sm font-sans leading-relaxed">
            {copy.booksSectionDescription}
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {alecBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onMoreInfo={() => {
                setActiveSite('soundvolumes');
                onNavigate(`/books/${book.slug}`);
              }}
            />
          ))}
        </div>

        <div className="mt-14 sm:mt-16">
          <CharacterCardsReaderOffer />
        </div>
      </main>
    );
  }

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
          {/* Robin Pike / Hyde, Texas Mysteries */}
          <section>
            <div className="border-b border-[#ded5c5] pb-3 mb-6">
              <h2 className="font-serif text-2xl text-[#1c1917] font-medium">
                {copy.robinPikeTitle}
              </h2>
              <p className="text-xs text-[#736b62] font-sans mt-1">
                {copy.robinPikeDescription}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {robinPikeWorks.map((work) => (
                <WorkCard key={work.id} work={work} />
              ))}
            </div>
          </section>

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

          {/* Memoirs / Personal Essays */}
          <section>
            <div className="border-b border-[#ded5c5] pb-3 mb-6">
              <h2 className="font-serif text-2xl text-[#1c1917] font-medium">
                {copy.memoirTitle}
              </h2>
              <p className="text-xs text-[#736b62] font-sans mt-1">
                {copy.memoirDescription}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {memoirWorks.map((work) => (
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
            Biographical Note
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1c1917] font-medium tracking-tight mb-2">
            {copy.aboutTitle}
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#736b62] font-sans">
            {copy.heroSubtitle}
          </p>
        </header>

        {/* 1. Primary Cowled Portrait in Clean Contemporary Setting */}
        <section className="bg-[#fcfbf8] border border-[#ddd5c7] p-5 sm:p-8 lg:p-10 mb-8 sm:mb-12 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
            <div className="md:col-span-5">
              <div className="relative aspect-[3/4] w-full max-w-[280px] mx-auto md:max-w-none bg-[#eee7da] border border-[#ddd5c7] overflow-hidden shadow-xs">
                <Image
                  src={copy.aboutPhoto || copy.heroPhoto || alec.photographPrimary}
                  alt="Alec Rowell author portrait"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
              </div>
              <div className="text-[11px] text-[#736b62] font-sans mt-2 italic text-center">
                Alec Rowell, author portrait.
              </div>
            </div>

            <div className="md:col-span-7">
              <h2 className="font-serif text-2xl text-[#1c1917] font-medium mb-3">
                Research & Creative Scope
              </h2>
              <div className="prose prose-stone text-xs sm:text-sm text-[#453f38] leading-relaxed font-sans space-y-4">
                <p>{copy.aboutBio}</p>
                <p>{copy.aboutResearchStatement}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Secondary Portrait: Alec with Hen */}
        <section className="bg-[#f7f4ed] border border-[#ddd5c7] p-5 sm:p-8 mb-8 sm:mb-12 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
            <div className="md:col-span-7 order-2 md:order-1">
              <h3 className="font-serif text-xl sm:text-2xl text-[#1c1917] font-medium mb-2">
                Gardens, Animals & Observation
              </h3>
              <p className="text-xs sm:text-sm text-[#453f38] font-sans leading-relaxed">
                Rowell’s daily routine is closely linked to outdoor observation and animal stewardship. His work in the <em>Jack Comes Back</em> cycle draws directly from years of close companionship with domestic dogs and working animals, investigating how interspecies bonds shape human culture and moral memory across eras.
              </p>
            </div>
            <div className="md:col-span-5 order-1 md:order-2">
              <div className="relative aspect-[4/3] w-full max-w-[280px] mx-auto md:max-w-none bg-[#eee7da] border border-[#ddd5c7] overflow-hidden">
                <Image
                  src={alec.photographSecondary || '/images/alec-hen.jpg'}
                  alt="Alec Rowell with hen"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
              </div>
              <div className="text-[11px] text-[#736b62] font-sans mt-2 italic text-center">
                Alec Rowell outdoors with heritage hen.
              </div>
            </div>
          </div>
        </section>

        {/* 3. Third Portrait: Forest Portrait */}
        <section className="border-t border-[#ded5c5] pt-8 sm:pt-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
            <div className="md:col-span-4">
              <div className="relative aspect-[3/4] w-full max-w-[240px] mx-auto md:max-w-none bg-[#eee7da] border border-[#ddd5c7] overflow-hidden">
                <Image
                  src={alec.photographThird || '/images/alec-forest.jpg'}
                  alt="Alec Rowell forest portrait"
                  fill
                  sizes="(max-width: 768px) 100vw, 30vw"
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
              </div>
              <div className="text-[11px] text-[#736b62] font-sans mt-2 italic text-center">
                Author portrait, press archive.
              </div>
            </div>
            <div className="md:col-span-8">
              <h3 className="font-serif text-xl text-[#1c1917] font-medium mb-2">
                Publishing Imprint Relationship
              </h3>
              <p className="text-xs sm:text-sm text-[#453f38] font-sans leading-relaxed mb-4">
                Alec Rowell publishes his primary series and collaborative fiction through <strong>Sound Volumes</strong>. All translation inquiries, library procurement, and wholesale editions are managed via the imprint’s central distribution desk.
              </p>
              <button
                onClick={() => {
                  setActiveSite('soundvolumes');
                  onNavigate('/');
                }}
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-sans font-medium text-[#1c1917] hover:text-[#944222] underline underline-offset-4 min-h-[44px] py-1"
              >
                <span>Visit Sound Volumes Imprint</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#944222]" />
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Handle /extras route
  if (currentPath === '/extras') {
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <CharacterCardsReaderOffer />
      </main>
    );
  }

  // Handle /contact route
  if (currentPath === '/contact') {
    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <header className="text-center mb-8 sm:mb-10">
          <div className="text-xs uppercase tracking-widest text-[#944222] font-semibold font-sans mb-2">
            Author Correspondence
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1c1917] font-medium tracking-tight mb-3">
            {copy.contactTitle}
          </h1>
          <p className="text-[#524b43] text-xs sm:text-sm font-sans leading-relaxed max-w-lg mx-auto">
            {copy.contactDescription}
          </p>
        </header>

        <ContactForm initialRoutingKey="alec" sourceSiteName="AlecRowell.com" />
      </main>
    );
  }

  // DEFAULT: ALEC ROWELL HOME
  return (
    <main>
      {/* Editorial Hero: Cowled Portrait in clean contemporary layout */}
      <section className="py-12 sm:py-18 lg:py-20 border-b border-[#ded5c5] bg-[#ede6d8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Primary Cowled Photograph */}
            <div className="md:col-span-5">
              <div className="relative aspect-[3/4] w-full max-w-[280px] sm:max-w-sm mx-auto bg-[#eee7da] border border-[#cfc6b6] shadow-xs overflow-hidden">
                <Image
                  src={copy.heroPhoto || alec.photographPrimary}
                  alt="Alec Rowell author portrait"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Typography & Identity */}
            <div className="md:col-span-7">
              <div className="text-xs uppercase tracking-widest text-[#944222] font-semibold font-sans mb-2">
                {copy.brandSubtitle}
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1c1917] font-medium tracking-tight mb-3 sm:mb-4">
                {copy.heroTitle}
              </h1>
              <p className="text-xs uppercase tracking-widest text-[#736b62] font-sans mb-5 sm:mb-6">
                {copy.heroSubtitle}
              </p>

              <p className="text-[#3d3730] text-sm sm:text-base leading-relaxed font-sans mb-6 sm:mb-8">
                {copy.heroQuote || alec.shortBio}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1">
                <button
                  onClick={() => onNavigate('/books')}
                  className="px-6 py-3 bg-[#1c1917] hover:bg-[#2c2824] text-[#fbf9f5] text-xs uppercase tracking-widest font-sans font-medium transition-colors text-center min-h-[44px] inline-flex items-center justify-center"
                >
                  {copy.heroPrimaryBtnText}
                </button>
                <button
                  onClick={() => onNavigate('/work')}
                  className="px-6 py-3 border border-[#baa794] hover:border-[#1c1917] bg-[#fbf9f4] text-[#2c2824] text-xs uppercase tracking-widest font-sans font-medium transition-colors text-center min-h-[44px] inline-flex items-center justify-center"
                >
                  {copy.heroSecondaryBtnText}
                </button>
                <button
                  onClick={() => onNavigate('/about')}
                  className="text-xs uppercase tracking-wider text-[#453f38] hover:text-[#1c1917] underline underline-offset-4 py-2 px-2 text-center min-h-[44px] inline-flex items-center justify-center"
                >
                  Full Biography
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Series: Jack Comes Back */}
      <section className="py-14 sm:py-18 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#ded5c5]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#944222] font-semibold font-sans block mb-1">
              Published Cycle
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1917] font-medium">
              Jack Comes Back
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/books')}
            className="text-xs uppercase tracking-wider text-[#1c1917] hover:text-[#944222] font-medium hover:underline inline-flex items-center gap-1 self-start sm:self-auto min-h-[44px]"
          >
            <span>View All Volumes</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#944222]" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {alecBooks.slice(0, 4).map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onMoreInfo={() => {
                setActiveSite('soundvolumes');
                onNavigate(`/books/${book.slug}`);
              }}
            />
          ))}
        </div>
      </section>

      {/* Selected Current Work Preview */}
      <section className="py-14 sm:py-18 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#ded5c5]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#944222] font-semibold font-sans block mb-1">
              Forthcoming & In Progress
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1917] font-medium">
              Selected Current Work
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/work')}
            className="text-xs uppercase tracking-wider text-[#1c1917] hover:text-[#944222] font-medium hover:underline inline-flex items-center gap-1 self-start sm:self-auto min-h-[44px]"
          >
            <span>Explore All Work</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#944222]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {alecWorks.slice(0, 3).map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      </section>

      {/* Reader Offer */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <CharacterCardsReaderOffer />
      </section>

      {/* Route to Sound Volumes Imprint */}
      <section className="py-12 bg-[#ede6d8] border-t border-[#ded5c5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="font-serif text-xl text-[#1c1917] font-medium">
              Published by Sound Volumes Imprint
            </h3>
            <p className="text-xs text-[#524b43] font-sans mt-1">
              Learn more about the publishing house, editorial policies, and catalogue.
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
