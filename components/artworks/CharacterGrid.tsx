'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCMS } from '@/lib/cms-context';
import { ArtworkRecord } from '@/lib/types';
import { X, BookOpen, Sparkles, ZoomIn, ArrowRight } from 'lucide-react';

interface CharacterGridProps {
  title?: string;
  subtitle?: string;
  onNavigate?: (path: string) => void;
  className?: string;
  limit?: number;
}

export function CharacterGrid({
  title = 'Jack Comes Back · Character Illustrations',
  subtitle = 'Archival companion illustrations documenting the eternal canine consciousness across history.',
  onNavigate,
  className = '',
  limit
}: CharacterGridProps) {
  const { data } = useCMS();
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkRecord | null>(null);

  // Filter visible artworks, sorted by ordering
  const rawArtworks = data.artworks || [];
  const visibleArtworks = [...rawArtworks]
    .filter((art) => art.visibility && !art.archived)
    .sort((a, b) => a.ordering - b.ordering);

  const displayedArtworks = limit ? visibleArtworks.slice(0, limit) : visibleArtworks;

  if (displayedArtworks.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Grid Header */}
      {(title || subtitle) && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-[#944222] font-sans font-semibold mb-1">
              Supplied Client Artwork Portfolio
            </div>
            {title && (
              <h3 className="font-serif text-2xl sm:text-3xl text-[#1c1917] font-medium tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs sm:text-sm text-[#524b43] font-sans mt-1 max-w-2xl leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          <div className="text-xs text-[#736b62] font-sans whitespace-nowrap">
            <span>{displayedArtworks.length} Illustrations Available</span>
          </div>
        </div>
      )}

      {/* Reusable Character Artwork Grid */}
      <div className="grid grid-cols-1 min-[380px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {displayedArtworks.map((art) => {
          const associatedBook = art.associatedBookId
            ? data.books.find((b) => b.id === art.associatedBookId || b.slug === art.associatedBookId)
            : null;

          return (
            <article
              key={art.id}
              onClick={() => setSelectedArtwork(art)}
              className="group cursor-pointer bg-[#fcfbf8] border border-[#ddd5c7] hover:border-[#944222] transition-all p-3 sm:p-4 flex flex-col justify-between shadow-xs hover:shadow-sm"
              tabIndex={0}
              role="button"
              aria-label={`Inspect artwork: ${art.name}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedArtwork(art);
                }
              }}
            >
              <div>
                {/* 5:8 Aspect Ratio Card Artwork Container */}
                <div className="relative aspect-[5/8] w-full max-w-[260px] mx-auto min-[380px]:max-w-none bg-[#eee7da] overflow-hidden mb-3 border border-[#ded5c5] group-hover:border-[#b8ad9c] transition-colors">
                  <Image
                    src={art.imageUrl || '/images/character-card.jpg'}
                    alt={art.name}
                    fill
                    sizes="(max-width: 380px) 100vw, (max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    referrerPolicy="no-referrer"
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-[#1c1917]/0 group-hover:bg-[#1c1917]/10 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#1c1917]/85 text-[#fbf9f5] text-[11px] uppercase tracking-wider font-sans px-2.5 py-1 flex items-center gap-1 rounded-xs">
                      <ZoomIn className="w-3 h-3" />
                      <span>Inspect</span>
                    </span>
                  </div>
                </div>

                {/* Artwork Name */}
                <h4 className="font-serif text-lg text-[#1c1917] font-medium tracking-tight group-hover:text-[#944222] transition-colors break-words">
                  {art.name}
                </h4>

                {/* Optional Description (only shown if provided by client/admin) */}
                {art.description ? (
                  <p className="text-xs text-[#524b43] font-sans mt-1.5 leading-relaxed line-clamp-3">
                    {art.description}
                  </p>
                ) : null}

                {/* Optional Additional Info (only shown if provided) */}
                {art.additionalInfo ? (
                  <div className="text-[11px] text-[#736b62] font-sans mt-1 italic line-clamp-2">
                    {art.additionalInfo}
                  </div>
                ) : null}
              </div>

              {/* Card Footer: Book Association or Imprint Badge */}
              <div className="pt-3 mt-3 border-t border-[#eae2d4] flex items-center justify-between text-[11px] font-sans gap-2">
                {associatedBook ? (
                  <span className="text-[#944222] font-medium flex items-center gap-1 truncate">
                    <BookOpen className="w-3 h-3 shrink-0" />
                    <span className="truncate">{associatedBook.title}</span>
                  </span>
                ) : art.associatedBookTitle ? (
                  <span className="text-[#944222] font-medium flex items-center gap-1 truncate">
                    <BookOpen className="w-3 h-3 shrink-0" />
                    <span className="truncate">{art.associatedBookTitle}</span>
                  </span>
                ) : (
                  <span className="text-[#8c847a] truncate">Jack Comes Back</span>
                )}
                <span className="text-[#736b62] group-hover:text-[#1c1917] transition-colors shrink-0">
                  Card #{art.ordering}
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {/* INSPECTION MODAL */}
      {selectedArtwork && (
        <div
          className="fixed inset-0 z-50 bg-[#1c1917]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in"
          onClick={() => setSelectedArtwork(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Detailed Artwork: ${selectedArtwork.name}`}
        >
          <div
            className="w-full max-w-3xl bg-[#fbf9f4] border border-[#dcd4c4] shadow-2xl p-4 sm:p-8 relative my-auto max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              onClick={() => setSelectedArtwork(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#736b62] hover:text-[#1c1917] p-2 transition-colors rounded-xs z-10"
              aria-label="Close artwork inspection modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
              {/* High-Resolution Artwork Display */}
              <div className="md:col-span-6">
                <div className="relative aspect-[5/8] w-full max-w-[320px] mx-auto bg-[#eee7da] border border-[#cfc6b6] shadow-md overflow-hidden">
                  <Image
                    src={selectedArtwork.imageUrl || '/images/character-card.jpg'}
                    alt={selectedArtwork.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    referrerPolicy="no-referrer"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Artwork Metadata Details */}
              <div className="md:col-span-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-[#944222] font-semibold font-sans mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Jack Comes Back · Card #{selectedArtwork.ordering}</span>
                  </div>

                  <h3 className="font-serif text-3xl sm:text-4xl text-[#1c1917] font-medium tracking-tight mb-3">
                    {selectedArtwork.name}
                  </h3>

                  {/* Clean presentation: only show description if defined in CMS */}
                  {selectedArtwork.description ? (
                    <div className="prose prose-stone text-xs sm:text-sm text-[#453f38] leading-relaxed font-sans mb-4">
                      <p>{selectedArtwork.description}</p>
                    </div>
                  ) : null}

                  {/* Clean presentation: only show additionalInfo if defined in CMS */}
                  {selectedArtwork.additionalInfo ? (
                    <div className="p-3 bg-[#f6f2e8] border border-[#ded5c5] text-xs text-[#524b43] font-sans leading-relaxed mb-4">
                      <span className="font-semibold text-[#1c1917] block mb-1">Additional Information:</span>
                      {selectedArtwork.additionalInfo}
                    </div>
                  ) : null}

                  <div className="space-y-1.5 text-xs text-[#736b62] font-sans pt-2 border-t border-[#eae2d4]">
                    <div>
                      <span className="text-[#1c1917] font-medium">Artwork Format:</span>{' '}
                      <span>5 × 8 inch archival card specification</span>
                    </div>
                    <div>
                      <span className="text-[#1c1917] font-medium">Associated Property:</span>{' '}
                      <span>Jack Comes Back Series</span>
                    </div>
                    {selectedArtwork.associatedBookId && (
                      <div>
                        <span className="text-[#1c1917] font-medium">Associated Volume:</span>{' '}
                        <span>{selectedArtwork.associatedBookTitle || selectedArtwork.associatedBookId}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 flex flex-wrap gap-3">
                  {onNavigate && selectedArtwork.associatedBookId && (
                    <button
                      onClick={() => {
                        setSelectedArtwork(null);
                        onNavigate(`/books/${selectedArtwork.associatedBookId}`);
                      }}
                      className="px-4 py-2.5 bg-[#1c1917] hover:bg-[#2c2824] text-[#fbf9f5] text-xs uppercase tracking-widest font-sans font-medium transition-colors inline-flex items-center gap-1.5 min-h-[44px]"
                    >
                      <span>View Associated Book</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#d6cec2]" />
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedArtwork(null)}
                    className="px-4 py-2.5 border border-[#cfc6b6] hover:border-[#1c1917] bg-[#fdfcf9] text-[#2c2824] text-xs uppercase tracking-widest font-sans font-medium transition-colors min-h-[44px]"
                  >
                    Close Inspection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
