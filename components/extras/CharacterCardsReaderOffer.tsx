'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCMS } from '@/lib/cms-context';
import { Download, CheckCircle, Mail, Sparkles, Eye } from 'lucide-react';

export function CharacterCardsReaderOffer() {
  const { data } = useCMS();
  const extra = data.extras.find(e => e.id === 'jack-character-cards') || data.extras[0];

  const [email, setEmail] = useState('');
  const [selectedCardIdx, setSelectedCardIdx] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [downloadTriggered, setDownloadTriggered] = useState(false);

  if (!extra || !extra.visibility) {
    return null;
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;

    setIsSubmitting(true);
    // Simulate integration with established delivery service (e.g. BookFunnel / Mailchimp)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsUnlocked(true);
    }, 600);
  };

  const handleDownload = () => {
    setDownloadTriggered(true);
    // Create simulated file download
    const dummyBlob = new Blob([
      `SOUND VOLUMES COMPANION\n\nJack Comes Back: Character Cards Archive Pack\n5 x 8 Inch High-Resolution Art & Author Texts\n\nIncludes:\n1. Jack in the Pleistocene (Stone Dog)\n2. Jack at the Hillfort (Iron Dog)\n3. Jack on the Silk Route (Gold Dog)\n4. Jack in the Sonoran Basin (Steel Dog)\n\n© Sound Volumes & Alec Rowell.`
    ], { type: 'text/plain' });
    const url = URL.createObjectURL(dummyBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Jack-Comes-Back-Character-Cards-SoundVolumes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Priority: Use the managed CMS artwork records for all supplied Jack Comes Back illustrations
  const suppliedArtworks = (data.artworks || [])
    .filter((a) => a.visibility && !a.archived)
    .sort((a, b) => a.ordering - b.ordering);

  const cardsToDisplay = suppliedArtworks.length > 0
    ? suppliedArtworks.map((art) => ({
        id: art.id,
        name: art.name,
        image: art.imageUrl || '/images/character-card.jpg',
        description: art.description,
        additionalInfo: art.additionalInfo,
        associatedBookId: art.associatedBookId,
        associatedBookTitle: art.associatedBookTitle,
        ordering: art.ordering
      }))
    : (extra.details?.previewCards || []).map((c, i) => ({
        id: `card-${i}`,
        name: c.characterName,
        image: c.image || '/images/character-card.jpg',
        description: c.previewExcerpt,
        additionalInfo: '',
        associatedBookId: '',
        associatedBookTitle: '',
        ordering: i + 1
      }));

  return (
    <section className="bg-[#eee7dc] border border-[#ddd4c4] p-4 sm:p-8 lg:p-10 my-8 sm:my-12 max-w-5xl mx-auto shadow-xs">
      <div className="max-w-3xl mb-6 sm:mb-8">
        <div className="text-[11px] uppercase tracking-widest text-[#736b62] font-sans mb-1.5">
          Special Companion Offer · {extra.associatedProperty}
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1917] font-medium tracking-tight mb-3">
          {extra.title}
        </h2>
        <p className="text-[#453f38] text-xs sm:text-sm leading-relaxed font-sans mb-4">
          {extra.description}
        </p>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-[#736b62] font-sans">
          <span>Format: 5 × 8 inch archival print scale</span>
          <span aria-hidden="true" className="hidden sm:inline">·</span>
          <span>Graphic illustration & historical narrative excerpt</span>
        </div>
      </div>

      {/* Miniature Preview Cards Gallery */}
      <div className="mb-6 sm:mb-10">
        <div className="text-xs uppercase tracking-wider text-[#524b43] font-sans mb-3 flex flex-wrap items-center justify-between gap-1">
          <span>Supplied Character Illustrations ({cardsToDisplay.length} Cards)</span>
          <span className="text-[11px] text-[#8c847a] font-normal">Click any card to inspect</span>
        </div>

        <div className="grid grid-cols-2 min-[540px]:grid-cols-4 gap-2.5 sm:gap-4">
          {cardsToDisplay.map((card, idx) => (
            <div
              key={card.id}
              onClick={() => setSelectedCardIdx(idx)}
              className={`cursor-pointer transition-all border p-2.5 sm:p-3 bg-[#fcfbf8] flex flex-col justify-between ${
                selectedCardIdx === idx
                  ? 'border-[#1c1917] ring-1 ring-[#1c1917] shadow-xs'
                  : 'border-[#ded5c5] hover:border-[#b8ad9c]'
              }`}
            >
              <div className="relative aspect-[5/8] w-full bg-[#eee7da] overflow-hidden mb-2 border border-[#ded5c5]">
                <Image
                  src={card.image || '/images/character-card.jpg'}
                  alt={card.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
              </div>
              <div className="text-[11px] font-serif font-medium text-[#1c1917] line-clamp-1">
                {card.name}
              </div>
              {card.description ? (
                <div className="text-[10px] text-[#736b62] font-sans line-clamp-2 mt-1">
                  {card.description}
                </div>
              ) : (
                <div className="text-[10px] text-[#8c847a] font-sans mt-0.5">
                  Card #{card.ordering}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Inspecting Selected Card */}
      {selectedCardIdx !== null && cardsToDisplay[selectedCardIdx] && (
        <div className="bg-[#fcfbf8] border border-[#d8cfbe] p-4 sm:p-6 mb-8 flex flex-col sm:flex-row gap-5 sm:gap-6 items-center shadow-xs">
          <div className="relative w-32 sm:w-36 aspect-[5/8] shrink-0 border border-[#ded5c5] bg-[#eee7da]">
            <Image
              src={cardsToDisplay[selectedCardIdx].image || '/images/character-card.jpg'}
              alt={cardsToDisplay[selectedCardIdx].name}
              fill
              referrerPolicy="no-referrer"
              className="object-cover"
            />
          </div>
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="text-[10px] uppercase tracking-widest text-[#736b62] font-sans">
              Selected 5 × 8 Card Specimen · Card #{cardsToDisplay[selectedCardIdx].ordering}
            </div>
            <h4 className="font-serif text-xl text-[#1c1917] font-medium">
              {cardsToDisplay[selectedCardIdx].name}
            </h4>
            {cardsToDisplay[selectedCardIdx].description && (
              <p className="text-xs sm:text-sm text-[#453f38] italic font-serif leading-relaxed">
                &ldquo;{cardsToDisplay[selectedCardIdx].description}&rdquo;
              </p>
            )}
            {cardsToDisplay[selectedCardIdx].additionalInfo && (
              <p className="text-xs text-[#524b43] font-sans leading-relaxed">
                {cardsToDisplay[selectedCardIdx].additionalInfo}
              </p>
            )}
            <div className="text-xs text-[#736b62] pt-1">
              Included in the high-resolution downloadable companion archive package.
            </div>
          </div>
        </div>
      )}

      {/* Signup and Delivery Access Box */}
      <div className="bg-[#fcfbf8] border border-[#d8cfbe] p-5 sm:p-8 shadow-xs">
        {!isUnlocked ? (
          <div>
            <h3 className="font-serif text-lg sm:text-xl text-[#1c1917] font-medium mb-1">
              Receive the Complete 5 × 8 Print Package
            </h3>
            <p className="text-xs text-[#524b43] font-sans mb-4 max-w-xl">
              Enter your email address to receive immediate download access to the complete high-resolution companion set, plus periodic dispatch notes from Sound Volumes.
            </p>

            <form onSubmit={handleSignup} className="flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="reader@example.com"
                className="flex-1 bg-[#fbf9f4] border border-[#d8cfbe] px-3.5 py-2.5 text-base sm:text-sm text-[#1c1917] focus:outline-none focus:ring-1 focus:ring-[#1c1917] focus:border-[#1c1917] font-sans rounded-xs min-h-[44px]"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-[#1c1917] hover:bg-[#2c2824] text-[#fbf9f5] text-xs uppercase tracking-widest font-sans font-medium whitespace-nowrap transition-colors disabled:opacity-50 min-h-[44px] inline-flex items-center justify-center"
              >
                {isSubmitting ? 'Accessing...' : 'Get Companion Set'}
              </button>
            </form>
            <div className="text-[11px] text-[#8c847a] font-sans mt-2">
              Instant delivery. Privacy respected. Unsubscribe at any time.
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#1c1917]">
              <CheckCircle className="w-5 h-5 text-[#944222] stroke-[1.75]" />
              <h3 className="font-serif text-lg sm:text-xl font-medium">
                Access Granted: Jack Comes Back Character Cards
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#453f38] font-sans max-w-xl">
              Thank you for subscribing. The complete 5 × 8 inch printable folio is prepared for you. You can download the package directly below.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                onClick={handleDownload}
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 bg-[#1c1917] hover:bg-[#2c2824] text-[#fbf9f5] text-xs uppercase tracking-widest font-sans font-medium transition-colors min-h-[44px] w-full sm:w-auto"
              >
                <Download className="w-4 h-4" />
                <span>Download Print Folio (Complete Set)</span>
              </button>
              {downloadTriggered && (
                <span className="text-xs text-[#524b43] font-sans">
                  ✓ File download initiated.
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
