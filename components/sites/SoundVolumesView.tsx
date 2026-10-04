'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCMS } from '@/lib/cms-context';
import { Colophon } from '../common/Colophon';
import { BookCard } from '../books/BookCard';
import { CharacterCardsReaderOffer } from '../extras/CharacterCardsReaderOffer';
import { CharacterGrid } from '../artworks/CharacterGrid';
import { ContactForm } from '../common/ContactForm';
import { ExternalLink, ArrowRight, Calendar, MapPin, Search, RotateCcw } from 'lucide-react';

interface SoundVolumesViewProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function SoundVolumesView({ currentPath, onNavigate }: SoundVolumesViewProps) {
  const { data } = useCMS();
  const [catalogueSearch, setCatalogueSearch] = useState('');

  const copy = data.settings?.soundVolumesCopy || {
    heroTitle: 'Sound Volumes',
    heroSubtitle: 'Publishing Imprint',
    heroQuote: 'Dedicated to books designed rather than decorated. Enduring fiction, speculative architecture, and disciplined inquiry.',
    heroPrimaryBtnText: 'Browse Catalogue',
    heroSecondaryBtnText: 'Authors & Voices',
    heroLogoImage: '',
    catalogueSectionTag: 'Primary Catalogue',
    catalogueSectionTitle: 'Jack Comes Back Series',
    catalogueSectionDescription: 'By Alec Rowell. Ten thousand years of canine reincarnation across human history.',
    authorsSectionTag: 'Imprint Authors',
    authorsSectionTitle: 'Independent Voices',
    authorsSectionDescription: 'Sound Volumes supports focused standalone authors and collaborative literary universes.',
    cataloguePageTitle: 'Published Volumes & Editions',
    cataloguePageDescription: 'All Sound Volumes publications are distributed universally. Choose direct purchase through books2read to order via your preferred bookseller, or select More Info for complete editorial details.',
    authorsPageTitle: 'Editorial Voices',
    authorsPageDescription: 'Sound Volumes publishes deliberate work across speculative fiction, regional mystery, narrative nonfiction, and collaborative universe architecture.',
    eventsPageTitle: 'Imprint Events',
    eventsPageDescription: 'Public symposiums, independent publishing conferences, and discussions regarding Sound Volumes publications.',
    extrasPageTitle: 'Sound Volumes Extras',
    extrasPageDescription: 'Curated printables, character cards, and companion documents produced for readers of Sound Volumes publications.',
    contactPageTitle: 'Contact Sound Volumes',
    contactPageDescription: 'Communications for Sound Volumes, author Alec Rowell, and writer Laurie Freeman are received and routed via this central dispatch.',
    footerTagline: 'Independent literary publishing. Fiction, speculative worlds, and durable inquiry.',
    footerCopyright: 'Sound Volumes. All rights reserved. Sites designed, not decorated.',
    footerImprintNote: 'Independent Publishing & Author Cycle'
  };

  // Books (visible ones, sorted by ordering)
  const books = [...data.books].filter((b) => b.visibility).sort((a, b) => a.ordering - b.ordering);
  const featuredBooks = books.slice(0, 4);

  // Filtered books on catalogue page
  const filteredBooks = books.filter((b) => {
    if (!catalogueSearch.trim()) return true;
    const term = catalogueSearch.trim().toLowerCase();
    return (
      b.title.toLowerCase().includes(term) ||
      b.author.toLowerCase().includes(term) ||
      (b.series && b.series.toLowerCase().includes(term)) ||
      (b.shortDescription && b.shortDescription.toLowerCase().includes(term)) ||
      (b.microDescription && b.microDescription.toLowerCase().includes(term))
    );
  });

  // Authors
  const authors = [...data.authors].filter((a) => a.visibility).sort((a, b) => a.ordering - b.ordering);

  // News (published, not archived, reverse chronological)
  const newsItems = [...data.news]
    .filter((n) => n.published && !n.archived)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const homeNews = newsItems.filter((n) => n.featureOnHome);

  // Events (published, not archived)
  const upcomingEvents = data.events.filter((e) => e.published && !e.archived && e.isUpcoming);
  const pastEvents = data.events.filter((e) => e.published && !e.isUpcoming);

  // Handle Book Detail Route
  if (currentPath.startsWith('/books/') && currentPath !== '/books') {
    const slug = currentPath.replace('/books/', '');
    const book = data.books.find((b) => b.slug === slug) || data.books[0];

    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <button
          onClick={() => onNavigate('/books')}
          className="text-xs uppercase tracking-widest text-[#736b62] hover:text-[#1c1917] transition-colors mb-6 sm:mb-8 inline-flex items-center gap-1.5 font-sans min-h-[44px] py-1"
        >
          <span>← Return to Catalogue</span>
        </button>

        <article className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 bg-[#fcfbf8] border border-[#ddd5c7] p-4 sm:p-8 lg:p-10 shadow-xs">
          {/* Cover & Purchase Column */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="relative aspect-[3/4] w-full max-w-[280px] sm:max-w-sm mx-auto md:max-w-none bg-[#eee7da] border border-[#ddd5c7] shadow-xs overflow-hidden">
                {book.cover ? (
                  <Image
                    src={book.cover}
                    alt={`Cover of ${book.title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    priority
                    referrerPolicy="no-referrer"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                    <span className="font-serif text-2xl text-[#1c1917]">{book.title}</span>
                    <span className="text-xs uppercase tracking-widest text-[#736b62] mt-2">{book.author}</span>
                  </div>
                )}
              </div>

              {/* Desktop BUY Button & Specifications */}
              <div className="hidden md:block">
                <div className="mt-6">
                  <a
                    href={book.buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1c1917] hover:bg-[#2c2824] text-[#fbf9f5] text-xs uppercase tracking-widest font-sans font-medium transition-colors min-h-[44px]"
                  >
                    <span>Purchase Volume (Universal Retailer Link)</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#d6cec2]" />
                  </a>
                  <div className="text-[11px] text-[#736b62] text-center font-sans mt-2">
                    Available through preferred digital and independent booksellers.
                  </div>
                </div>

                {/* Publication Specifications */}
                <div className="mt-8 pt-6 border-t border-[#eae3d5] space-y-2.5 text-xs font-sans text-[#524b43]">
                  <div className="flex justify-between">
                    <span className="text-[#8c847a]">Imprint:</span>
                    <span className="text-[#1c1917] font-medium">Sound Volumes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8c847a]">Format:</span>
                    <span className="text-[#1c1917] font-medium">{book.format}</span>
                  </div>
                  {book.series && (
                    <div className="flex justify-between">
                      <span className="text-[#8c847a]">Series:</span>
                      <span className="text-[#1c1917] font-medium">{book.series}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Book Editorial Content */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div>
              {book.series && (
                <div className="text-xs uppercase tracking-widest text-[#944222] font-sans font-semibold mb-2">
                  {book.series} {book.seriesOrder ? `· Book ${book.seriesOrder}` : ''}
                </div>
              )}

              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1c1917] font-medium tracking-tight mb-2 break-words">
                {book.title}
              </h1>

              <div className="text-sm font-sans text-[#524b43] mb-5 sm:mb-6">
                By{' '}
                <button
                  onClick={() => onNavigate('/authors')}
                  className="text-[#1c1917] font-medium underline underline-offset-4 hover:text-[#944222] transition-colors"
                >
                  {book.author}
                </button>
              </div>

              {/* Micro / Opening Quote */}
              {book.microDescription && (
                <blockquote className="border-l-2 border-[#944222] pl-3.5 sm:pl-4 py-2 text-sm sm:text-base font-serif italic text-[#2c2824] mb-6 bg-[#f5ede1]/60">
                  &ldquo;{book.microDescription}&rdquo;
                </blockquote>
              )}

              {/* Long Description (Exact client-supplied text) */}
              <div className="prose prose-stone text-xs sm:text-sm leading-relaxed text-[#3d3730] font-sans space-y-4 mb-6 sm:mb-8">
                <p className="leading-relaxed">{book.longDescription}</p>
              </div>

              {/* Mobile-only BUY + Specs (Directly follows description per mobile priority requirement) */}
              <div className="block md:hidden pt-4 pb-2 border-t border-[#eae3d5]">
                <a
                  href={book.buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#1c1917] hover:bg-[#2c2824] text-[#fbf9f5] text-xs uppercase tracking-widest font-sans font-medium transition-colors min-h-[44px]"
                >
                  <span>Purchase Volume (Universal Link)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#d6cec2]" />
                </a>
                <div className="text-[11px] text-[#736b62] text-center font-sans mt-2 mb-4">
                  Available through preferred digital and independent booksellers.
                </div>

                <div className="pt-4 border-t border-[#eae3d5] space-y-2 text-xs font-sans text-[#524b43]">
                  <div className="flex justify-between">
                    <span className="text-[#8c847a]">Imprint:</span>
                    <span className="text-[#1c1917] font-medium">Sound Volumes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8c847a]">Format:</span>
                    <span className="text-[#1c1917] font-medium">{book.format}</span>
                  </div>
                  {book.series && (
                    <div className="flex justify-between">
                      <span className="text-[#8c847a]">Series:</span>
                      <span className="text-[#1c1917] font-medium">{book.series}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Author Imprint Profile Link (REMOVED external website reference per specification) */}
            <div className="pt-6 border-t border-[#eae3d5] flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
              <span className="text-[#736b62]">Editorial Author Profile:</span>
              <button
                onClick={() => onNavigate('/authors')}
                className="text-[#1c1917] font-medium hover:text-[#944222] inline-flex items-center gap-1.5 py-1 min-h-[44px]"
              >
                <span>View {book.author} at Sound Volumes</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#944222]" />
              </button>
            </div>
          </div>
        </article>
      </main>
    );
  }

  // Handle Books Catalogue Route (/books)
  if (currentPath === '/books') {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <header className="max-w-3xl mb-8 sm:mb-12">
          <div className="text-xs uppercase tracking-widest text-[#944222] font-semibold font-sans mb-2">
            Sound Volumes Catalogue
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1c1917] font-medium tracking-tight mb-3">
            {copy.cataloguePageTitle}
          </h1>
          <p className="text-[#524b43] text-xs sm:text-sm font-sans leading-relaxed mb-6">
            {copy.cataloguePageDescription}
          </p>

          {/* Integrated Search & Filter for Catalogue */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-[#736b62] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={catalogueSearch}
              onChange={(e) => setCatalogueSearch(e.target.value)}
              placeholder="Filter volumes by title, series, or author..."
              className="w-full bg-[#fcfbf8] border border-[#d8cfbe] pl-10 pr-9 py-2.5 text-base sm:text-sm text-[#1c1917] placeholder-[#8c847a] focus:outline-none focus:ring-1 focus:ring-[#1c1917] focus:border-[#1c1917] font-sans rounded-xs min-h-[44px]"
            />
            {catalogueSearch && (
              <button
                type="button"
                onClick={() => setCatalogueSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#736b62] hover:text-[#1c1917] p-1.5"
                title="Clear filter"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </header>

        {/* CUSTOM NO RESULTS EXPERIENCE when filtering produce zero books */}
        {filteredBooks.length === 0 ? (
          <div className="py-12 px-4 text-center max-w-lg mx-auto space-y-4 bg-[#fcfbf8] border border-[#ddd5c7] p-8 shadow-xs">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#eee7db] text-[#5c554c] mb-1">
              <Search className="w-5 h-5 stroke-[1.5]" />
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl text-[#1e1b18] font-medium tracking-tight">
              Nothing found
            </h3>

            <p className="text-xs sm:text-sm text-[#635c53] font-sans leading-relaxed">
              What you&apos;re looking for can&apos;t be found. Please check your spelling or try using more general terms.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCatalogueSearch('')}
                className="px-4 py-2 bg-[#1c1917] hover:bg-[#2c2824] text-[#fbf9f5] text-xs uppercase tracking-widest font-sans font-medium transition-colors min-h-[44px]"
              >
                Clear search
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {filteredBooks.map((book, idx) => (
              <BookCard
                key={book.id}
                book={book}
                onMoreInfo={(slug) => onNavigate(`/books/${slug}`)}
                priority={idx === 0}
              />
            ))}
          </div>
        )}

        {/* Reader Offer Banner in Catalogue */}
        <div className="mt-14 sm:mt-16">
          <CharacterCardsReaderOffer />
        </div>
      </main>
    );
  }

  // Handle Authors Page (/authors)
  if (currentPath === '/authors') {
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <header className="max-w-2xl mb-10 sm:mb-12">
          <div className="text-xs uppercase tracking-widest text-[#944222] font-semibold font-sans mb-2">
            Sound Volumes Authors
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1c1917] font-medium tracking-tight mb-3">
            {copy.authorsPageTitle}
          </h1>
          <p className="text-[#524b43] text-xs sm:text-sm font-sans leading-relaxed">
            {copy.authorsPageDescription}
          </p>
        </header>

        <div className="space-y-10 sm:space-y-12">
          {authors.map((author) => (
            <article
              key={author.id}
              className="bg-[#fcfbf8] border border-[#ddd5c7] p-5 sm:p-8 lg:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-xs"
            >
              <div className="md:col-span-4">
                <div className="relative aspect-[3/4] w-full max-w-[280px] mx-auto md:max-w-none bg-[#eee7da] border border-[#ddd5c7] overflow-hidden">
                  <Image
                    src={author.photographPrimary}
                    alt={author.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    referrerPolicy="no-referrer"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="md:col-span-8 flex flex-col justify-between">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1917] font-medium tracking-tight mb-3">
                    {author.name}
                  </h2>
                  <p className="text-[#453f38] text-xs sm:text-sm font-sans leading-relaxed mb-6">
                    {author.fullBio}
                  </p>
                  <div className="mb-6">
                    <span className="text-[11px] uppercase tracking-widest text-[#736b62] font-sans block mb-2">
                      Selected Imprint Works:
                    </span>
                    <div className="flex flex-wrap gap-2 text-xs text-[#2c2824] font-sans">
                      {author.selectedWorks.map((work, idx) => (
                        <span key={idx} className="bg-[#ede6d8] px-2.5 py-1 text-[#2c2824] border border-[#ddd5c7] rounded-xs">
                          {work}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* NO EXTERNAL AUTHOR DOMAINS DISPLAYED (Preserves author biography and titles) */}
                <div className="pt-4 border-t border-[#eae3d5] flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-[#736b62] font-sans">
                    Imprint Author Focus: <span className="text-[#1c1917] font-medium">{author.slug === 'alec-rowell' ? 'Speculative Cycles & Regional topographies' : 'Fiction, Nonfiction & Collaborative Universes'}</span>
                  </span>
                  <button
                    onClick={() => onNavigate('/books')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1c1917] hover:bg-[#2c2824] text-[#fbf9f5] text-xs uppercase tracking-widest font-sans font-medium transition-colors min-h-[44px]"
                  >
                    <span>View Imprint Titles</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#d6cec2]" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    );
  }

  // Handle News Page (/news)
  if (currentPath.startsWith('/news')) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <header className="mb-10 sm:mb-12">
          <div className="text-xs uppercase tracking-widest text-[#944222] font-semibold font-sans mb-2">
            Dispatches & Announcements
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1c1917] font-medium tracking-tight mb-3">
            Notes from the Editor & News
          </h1>
          <p className="text-[#524b43] text-xs sm:text-sm font-sans leading-relaxed">
            Official announcements, publication notes, and editorial commentary from Sound Volumes.
          </p>
        </header>

        {newsItems.length === 0 ? (
          <div className="p-8 text-center text-[#736b62] text-xs font-sans bg-[#fcfbf8] border border-[#ddd5c7]">
            No public news announcements at this time.
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {newsItems.map((item) => (
              <article key={item.id} className="bg-[#fcfbf8] border border-[#ddd5c7] p-5 sm:p-8 shadow-xs">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#736b62] font-sans mb-2">
                  <span className="font-medium text-[#1c1917]">{item.category}</span>
                  <span aria-hidden="true">·</span>
                  <time dateTime={item.date}>{item.date}</time>
                </div>
                <h2 className="font-serif text-2xl text-[#1c1917] font-medium tracking-tight mb-3">
                  {item.title}
                </h2>
                <div className="text-xs sm:text-sm text-[#453f38] leading-relaxed font-sans space-y-3">
                  <p>{item.fullContent}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    );
  }

  // Handle Events Page (/events)
  if (currentPath === '/events') {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <header className="mb-10 sm:mb-12">
          <div className="text-xs uppercase tracking-widest text-[#944222] font-semibold font-sans mb-2">
            Colloquia & Readings
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1c1917] font-medium tracking-tight mb-3">
            {copy.eventsPageTitle}
          </h1>
          <p className="text-[#524b43] text-xs sm:text-sm font-sans leading-relaxed">
            {copy.eventsPageDescription}
          </p>
        </header>

        {/* Upcoming */}
        <section className="mb-12">
          <h2 className="text-xs uppercase tracking-widest text-[#736b62] font-sans mb-4">
            Upcoming Events
          </h2>
          {upcomingEvents.length === 0 ? (
            <p className="text-xs text-[#736b62] font-sans italic">No upcoming events currently scheduled.</p>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map((evt) => (
                <div key={evt.id} className="bg-[#fcfbf8] border border-[#ddd5c7] p-5 sm:p-6 shadow-xs">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#736b62] font-sans mb-2">
                    <span className="flex items-center gap-1 font-medium text-[#1c1917]">
                      <Calendar className="w-3.5 h-3.5 text-[#944222]" />
                      {evt.date} {evt.time ? `· ${evt.time}` : ''}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#8c847a]" />
                      {evt.location}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl text-[#1c1917] font-medium mb-2">{evt.title}</h3>
                  <p className="text-xs sm:text-sm text-[#453f38] font-sans leading-relaxed">{evt.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past / Archive */}
        {pastEvents.length > 0 && (
          <section>
            <h2 className="text-xs uppercase tracking-widest text-[#736b62] font-sans mb-4">
              Past Colloquia & Archive
            </h2>
            <div className="space-y-4">
              {pastEvents.map((evt) => (
                <div key={evt.id} className="bg-[#f7f4ed] border border-[#ded5c5] p-5">
                  <div className="flex items-center gap-2 text-xs text-[#736b62] font-sans mb-1">
                    <span>{evt.date}</span>
                    <span aria-hidden="true">·</span>
                    <span>{evt.location}</span>
                  </div>
                  <h3 className="font-serif text-lg text-[#2c2824] font-medium mb-1">{evt.title}</h3>
                  <p className="text-xs text-[#524b43] font-sans">{evt.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    );
  }

  // Handle Extras Page (/extras)
  if (currentPath === '/extras') {
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <header className="max-w-2xl mb-8">
          <div className="text-xs uppercase tracking-widest text-[#944222] font-semibold font-sans mb-2">
            Reader Companions & Collectibles
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1c1917] font-medium tracking-tight mb-3">
            {copy.extrasPageTitle}
          </h1>
          <p className="text-[#524b43] text-xs sm:text-sm font-sans leading-relaxed">
            {copy.extrasPageDescription}
          </p>
        </header>

        <CharacterCardsReaderOffer />

        <div className="mt-14 pt-12 border-t border-[#ded5c5]">
          <CharacterGrid onNavigate={onNavigate} />
        </div>
      </main>
    );
  }

  // Handle Central Contact Page (/contact)
  if (currentPath === '/contact') {
    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <header className="text-center mb-8 sm:mb-10">
          <div className="text-xs uppercase tracking-widest text-[#944222] font-semibold font-sans mb-2">
            Central Correspondence
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1c1917] font-medium tracking-tight mb-3">
            {copy.contactPageTitle}
          </h1>
          <p className="text-[#524b43] text-xs sm:text-sm font-sans leading-relaxed max-w-lg mx-auto">
            {copy.contactPageDescription}
          </p>
        </header>

        <ContactForm sourceSiteName="Sound Volumes" />
      </main>
    );
  }

  // Default: SOUND VOLUMES HOME (Warm, restrained publishing-imprint homepage)
  return (
    <main>
      {/* 1. Hero Section: Sound Volumes Identity & Colophon */}
      <section className="border-b border-[#ded5c5] py-14 sm:py-20 lg:py-24 bg-[#ede6d8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center mb-5 sm:mb-6">
            {copy.heroLogoImage ? (
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border border-[#c8bfae] shadow-xs">
                <Image
                  src={copy.heroLogoImage}
                  alt={copy.heroTitle}
                  fill
                  sizes="80px"
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
              </div>
            ) : (
              <Colophon size={52} className="text-[#1c1917]" />
            )}
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1c1917] font-medium tracking-tight mb-3 sm:mb-4">
            {copy.heroTitle}
          </h1>
          <p className="text-[#736b62] text-xs uppercase tracking-widest font-sans mb-5 sm:mb-6">
            {copy.heroSubtitle}
          </p>
          <p className="max-w-2xl mx-auto text-[#3d3730] text-sm sm:text-base font-serif italic leading-relaxed mb-8 sm:mb-10">
            &ldquo;{copy.heroQuote}&rdquo;
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto sm:max-w-none">
            <button
              onClick={() => onNavigate('/books')}
              className="w-full sm:w-auto px-6 py-3 bg-[#1c1917] hover:bg-[#2c2824] text-[#fbf9f5] text-xs uppercase tracking-widest font-sans font-medium transition-colors min-h-[44px]"
            >
              {copy.heroPrimaryBtnText}
            </button>
            <button
              onClick={() => onNavigate('/authors')}
              className="w-full sm:w-auto px-6 py-3 border border-[#baa794] hover:border-[#1c1917] bg-[#fbf9f4] text-[#2c2824] text-xs uppercase tracking-widest font-sans font-medium transition-colors min-h-[44px]"
            >
              {copy.heroSecondaryBtnText}
            </button>
          </div>
        </div>
      </section>

      {/* 2. Available Books Section */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#ded5c5]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#944222] font-semibold font-sans block mb-1">
              {copy.catalogueSectionTag}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1917] font-medium tracking-tight">
              {copy.catalogueSectionTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#524b43] font-sans mt-1 max-w-xl">
              {copy.catalogueSectionDescription}
            </p>
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
          {featuredBooks.map((book, idx) => (
            <BookCard
              key={book.id}
              book={book}
              onMoreInfo={(slug) => onNavigate(`/books/${slug}`)}
              priority={idx === 0}
            />
          ))}
        </div>
      </section>

      {/* 3. Featured Reader Offer: Character Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CharacterCardsReaderOffer />
      </section>

      {/* 4. Authors Teaser */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#ded5c5]">
        <div className="mb-8 sm:mb-10 text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#944222] font-semibold font-sans block mb-1">
            {copy.authorsSectionTag}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1917] font-medium tracking-tight">
            {copy.authorsSectionTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#524b43] font-sans mt-1">
            {copy.authorsSectionDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {authors.map((author) => (
            <div key={author.id} className="bg-[#fcfbf8] border border-[#ddd5c7] p-5 sm:p-6 flex flex-col justify-between shadow-xs">
              <div>
                <div className="relative aspect-[4/3] w-full bg-[#eee7da] overflow-hidden mb-4 border border-[#ddd5c7]">
                  <Image
                    src={author.photographPrimary}
                    alt={author.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    referrerPolicy="no-referrer"
                    className="object-cover"
                  />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl text-[#1c1917] font-medium mb-2">
                  {author.name}
                </h3>
                <p className="text-[#524b43] text-xs sm:text-sm leading-relaxed font-sans mb-4">
                  {author.shortBio}
                </p>
              </div>

              {/* REFINED: NO EXTERNAL AUTHOR DOMAINS DISPLAYED IN PROFILE/TEASER */}
              <div className="pt-4 border-t border-[#eae3d5] flex items-center justify-between">
                <span className="text-xs text-[#736b62] font-sans">
                  Sound Volumes Author
                </span>
                <button
                  onClick={() => onNavigate('/authors')}
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-sans font-medium text-[#1c1917] hover:text-[#944222] min-h-[44px]"
                >
                  <span>Author Profile</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#944222]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Notes from the Editor / Current News */}
      {homeNews.length > 0 && (
        <section className="py-14 sm:py-16 bg-[#eee7dc]/70 border-t border-[#ded5c5]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-3">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#944222] font-semibold font-sans block mb-1">
                  Editorial Dispatch
                </span>
                <h2 className="font-serif text-2xl text-[#1c1917] font-medium">
                  Notes from the Editor
                </h2>
              </div>
              <button
                onClick={() => onNavigate('/news')}
                className="text-xs uppercase tracking-wider text-[#1c1917] font-medium hover:text-[#944222] hover:underline inline-flex items-center gap-1 self-start sm:self-auto min-h-[44px]"
              >
                <span>Read All Dispatches</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#944222]" />
              </button>
            </div>

            <div className="space-y-5 sm:space-y-6">
              {homeNews.map((news) => (
                <div key={news.id} className="bg-[#fcfbf8] border border-[#ddd5c7] p-5 sm:p-8 shadow-xs">
                  <div className="flex items-center gap-2 text-xs text-[#736b62] font-sans mb-2">
                    <span className="font-medium text-[#1c1917]">{news.category}</span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={news.date}>{news.date}</time>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#1c1917] font-medium mb-3">
                    {news.title}
                  </h3>
                  <p className="text-[#453f38] text-xs sm:text-sm font-sans leading-relaxed mb-4">
                    {news.shortContent}
                  </p>
                  <button
                    onClick={() => onNavigate('/news')}
                    className="text-xs uppercase tracking-wider text-[#1c1917] underline underline-offset-4 hover:text-[#944222] min-h-[36px]"
                  >
                    Read Complete Statement
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
