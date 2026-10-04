import React from 'react';
import Image from 'next/image';
import { Book } from '@/lib/types';
import { ExternalLink, ArrowRight } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onMoreInfo: (slug: string) => void;
  priority?: boolean;
}

export function BookCard({ book, onMoreInfo, priority = false }: BookCardProps) {
  return (
    <article className="group flex flex-col bg-[#fcfbf8] border border-[#ddd5c7] hover:border-[#baa794] transition-all p-4 sm:p-5 lg:p-6 h-full justify-between shadow-2xs">
      <div>
        {/* Book Jacket Cover */}
        <div className="relative aspect-[3/4] w-full bg-[#eee7da] overflow-hidden mb-4 sm:mb-5 border border-[#ddd5c7] shadow-xs">
          {book.cover ? (
            <Image
              src={book.cover}
              alt={`Cover jacket for ${book.title}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority={priority}
              referrerPolicy="no-referrer"
              className="object-cover group-hover:scale-[1.015] transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[#eee7da] text-[#736b62]">
              <span className="font-serif text-lg text-[#2c2824] italic">{book.title}</span>
              <span className="text-xs uppercase tracking-widest mt-2">{book.author}</span>
            </div>
          )}
        </div>

        {/* Series Metadata & Volume */}
        {book.series && (
          <div className="text-[11px] uppercase tracking-widest text-[#736b62] font-sans mb-1">
            {book.series} {book.seriesOrder ? `· Vol. ${book.seriesOrder}` : ''}
          </div>
        )}

        {/* Title */}
        <h3 className="font-serif text-xl sm:text-2xl text-[#1c1917] font-medium tracking-tight mb-1 break-words">
          {book.title}
        </h3>

        {/* Author */}
        <p className="text-xs text-[#736b62] font-sans uppercase tracking-wider mb-2.5">
          By {book.author}
        </p>

        {/* Concise Description */}
        <p className="text-[#453f38] text-xs sm:text-sm leading-relaxed font-sans mb-5 line-clamp-3">
          {book.shortDescription || book.microDescription}
        </p>
      </div>

      {/* Action Buttons: Direct BUY + Canonical MORE INFO */}
      <div className="pt-3.5 border-t border-[#eae3d5] flex items-center justify-between gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
        {/* Direct Universal BUY Link (Must NOT force buyer through detail page first) */}
        <a
          href={book.buyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#1c1917] hover:bg-[#2c2824] text-[#fbf9f5] text-xs uppercase tracking-widest font-sans font-medium transition-colors min-h-[44px] shrink-0"
          title={`Purchase ${book.title} across universal retailers`}
        >
          <span>BUY</span>
          <ExternalLink className="w-3 h-3 text-[#d6cec2]" />
        </a>

        {/* More Info Canonical Route */}
        <button
          onClick={() => onMoreInfo(book.slug)}
          className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-[#453f38] hover:text-[#1c1917] font-sans py-2 px-2 transition-colors group/link min-h-[44px] shrink-0"
        >
          <span>More Info</span>
          <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </article>
  );
}
