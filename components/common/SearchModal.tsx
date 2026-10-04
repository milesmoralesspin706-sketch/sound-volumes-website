'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { useCMS } from '@/lib/cms-context';
import { Search, X, BookOpen, User, PenTool, Newspaper, ArrowRight, RotateCcw, Palette } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  initialQuery?: string;
}

export function SearchModal({
  isOpen,
  onClose,
  onNavigate,
  initialQuery = ''
}: SearchModalProps) {
  const { data, setActiveSite } = useCMS();
  const [query, setQuery] = useState(initialQuery);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync initial query when opened without triggering effect cascading re-renders
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setQuery(initialQuery);
    }
  }

  // Handle focus and body scroll lock
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      document.body.style.overflow = 'hidden';
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const cleanQuery = query.trim().toLowerCase();

  // Search Results
  const results = useMemo(() => {
    if (!cleanQuery) {
      return { books: [], authors: [], works: [], news: [], total: 0 };
    }

    const matchedBooks = data.books.filter((b) => {
      if (!b.visibility) return false;
      const haystack = [
        b.title,
        b.author,
        b.series || '',
        b.shortDescription,
        b.microDescription || '',
        b.longDescription,
        b.format
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(cleanQuery);
    });

    const matchedAuthors = data.authors.filter((a) => {
      if (!a.visibility) return false;
      const haystack = [a.name, a.shortBio, a.fullBio, ...(a.selectedWorks || [])]
        .join(' ')
        .toLowerCase();
      return haystack.includes(cleanQuery);
    });

    const matchedWorks = data.works.filter((w) => {
      if (!w.visibility) return false;
      const haystack = [
        w.title,
        w.author,
        w.universeSeries,
        w.typeForm,
        w.description || '',
        w.status,
        w.coAuthor || ''
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(cleanQuery);
    });

    const matchedNews = data.news.filter((n) => {
      if (!n.published || n.archived) return false;
      const haystack = [n.title, n.category, n.shortContent, n.fullContent]
        .join(' ')
        .toLowerCase();
      return haystack.includes(cleanQuery);
    });

    const matchedArtworks = (data.artworks || []).filter((art) => {
      if (!art.visibility || art.archived) return false;
      const haystack = [
        art.name,
        art.description || '',
        art.additionalInfo || '',
        art.associatedBookTitle || '',
        ...(art.tags || []),
        'jack comes back',
        'dog',
        'character cards',
        'artwork',
        'illustration'
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(cleanQuery);
    });

    const total =
      matchedBooks.length +
      matchedAuthors.length +
      matchedWorks.length +
      matchedNews.length +
      matchedArtworks.length;

    return {
      books: matchedBooks,
      authors: matchedAuthors,
      works: matchedWorks,
      news: matchedNews,
      artworks: matchedArtworks,
      total
    };
  }, [cleanQuery, data]);

  if (!isOpen) return null;

  const handleSelectBook = (slug: string) => {
    setActiveSite('soundvolumes');
    onNavigate(`/books/${slug}`);
    onClose();
  };

  const handleSelectAuthor = () => {
    setActiveSite('soundvolumes');
    onNavigate('/authors');
    onClose();
  };

  const handleSelectWork = (authorSlug: string) => {
    if (authorSlug === 'laurie-freeman') {
      setActiveSite('laurie');
    } else {
      setActiveSite('alec');
    }
    onNavigate('/work');
    onClose();
  };

  const handleSelectNews = () => {
    setActiveSite('soundvolumes');
    onNavigate('/news');
    onClose();
  };

  const handleSelectArtwork = () => {
    setActiveSite('soundvolumes');
    onNavigate('/extras');
    onClose();
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const hasSearched = cleanQuery.length > 0;
  const noResults = hasSearched && results.total === 0;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#1c1917]/60 backdrop-blur-xs flex flex-col items-center justify-start p-3 sm:p-6 sm:pt-16 overflow-y-auto animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search Catalogue and Publications"
    >
      <div
        className="w-full max-w-2xl bg-[#fbf9f4] border border-[#dcd4c4] shadow-xl overflow-hidden flex flex-col my-auto sm:my-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header / Input Bar */}
        <div className="relative border-b border-[#e2dacc] p-3 sm:p-4 bg-[#f8f5ee] flex items-center gap-3">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#736b62] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search books, authors, works, or dispatches..."
            className="flex-1 bg-transparent text-base sm:text-lg text-[#1e1b18] placeholder-[#8c847a] focus:outline-none font-serif tracking-tight"
            aria-label="Search terms"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs uppercase tracking-wider text-[#736b62] hover:text-[#1e1b18] font-sans px-2 py-1 transition-colors min-h-[36px] flex items-center gap-1"
              title="Clear search"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#736b62] hover:text-[#1e1b18] transition-colors -mr-1"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Body Content */}
        <div className="max-h-[70vh] overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Initial State / Suggestions */}
          {!hasSearched && (
            <div className="py-6 text-center space-y-4">
              <p className="text-xs sm:text-sm text-[#736b62] font-sans max-w-md mx-auto leading-relaxed">
                Search across the Sound Volumes catalogue, published books, author biographies, manuscripts in progress, and editorial dispatches.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-sans text-[#5c554c]">
                <span className="text-[#8c847a] text-[11px] uppercase tracking-wider">Suggested:</span>
                {['Jack Comes Back', 'Alec Rowell', 'Laurie Freeman', 'Robin Pike', 'Sixer Diaspora'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                      inputRef.current?.focus();
                    }}
                    className="px-2.5 py-1 bg-[#ede6d8] hover:bg-[#e2d9c8] text-[#2c2824] rounded-xs transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CUSTOM NO RESULTS EXPERIENCE (Exact specification) */}
          {noResults && (
            <div className="py-10 px-4 text-center max-w-lg mx-auto space-y-4 animate-fade-in">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#eee7db] text-[#5c554c] mb-1">
                <Search className="w-5 h-5 stroke-[1.5]" />
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-[#1e1b18] font-medium tracking-tight">
                Nothing found
              </h3>

              <p className="text-xs sm:text-sm text-[#635c53] font-sans leading-relaxed">
                What you&apos;re looking for can&apos;t be found. Please check your spelling or try using more general terms.
              </p>

              <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2 bg-[#1c1917] hover:bg-[#2e2a26] text-[#fbf9f5] text-xs uppercase tracking-widest font-sans font-medium transition-colors"
                >
                  Clear search
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveSite('soundvolumes');
                    onNavigate('/books');
                    onClose();
                  }}
                  className="px-4 py-2 border border-[#cfc6b6] hover:border-[#1c1917] text-[#2c2824] text-xs uppercase tracking-widest font-sans font-medium transition-colors"
                >
                  Browse Catalogue
                </button>
              </div>

              <div className="pt-6 border-t border-[#e5ddcf] text-left text-xs font-sans text-[#736b62] space-y-1.5">
                <span className="block font-medium text-[#2c2824] text-[11px] uppercase tracking-wider">Search suggestions:</span>
                <p>· Search by volume title: <span className="italic">Stone Dog, Iron Dog, Gold Dog, Steel Dog</span></p>
                <p>· Search by author or creator: <span className="italic">Alec Rowell, Laurie Freeman</span></p>
                <p>· Search by series universe: <span className="italic">Jack Comes Back, Robin Pike, Sixer Diaspora</span></p>
              </div>
            </div>
          )}

          {/* Results Display */}
          {hasSearched && results.total > 0 && (
            <div className="space-y-6">
              <div className="text-xs uppercase tracking-widest text-[#736b62] font-sans pb-2 border-b border-[#e2dacc] flex items-center justify-between">
                <span>Matching Results ({results.total})</span>
                <span className="text-[11px] text-[#8c847a]">for &ldquo;{query}&rdquo;</span>
              </div>

              {/* Books */}
              {results.books.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#8c847a] font-sans font-semibold">
                    <BookOpen className="w-3.5 h-3.5 text-[#944222]" />
                    <span>Books & Editions ({results.books.length})</span>
                  </div>
                  <div className="divide-y divide-[#eae2d5] border border-[#ded5c5] bg-[#fdfcf9]">
                    {results.books.map((book) => (
                      <button
                        key={book.id}
                        onClick={() => handleSelectBook(book.slug)}
                        className="w-full text-left p-3 sm:p-4 hover:bg-[#f6f2e8] transition-colors flex items-center justify-between group"
                      >
                        <div className="pr-4">
                          <h4 className="font-serif text-base sm:text-lg text-[#1e1b18] group-hover:text-[#944222] transition-colors">
                            {book.title}
                          </h4>
                          <p className="text-xs text-[#736b62] font-sans mt-0.5 line-clamp-1">
                            By {book.author} {book.series ? `· ${book.series}` : ''} · {book.format}
                          </p>
                          <p className="text-xs text-[#524b43] font-sans mt-1 line-clamp-2">
                            {book.shortDescription || book.microDescription}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#8c847a] group-hover:text-[#1e1b18] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Authors */}
              {results.authors.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#8c847a] font-sans font-semibold">
                    <User className="w-3.5 h-3.5 text-[#944222]" />
                    <span>Authors & Profiles ({results.authors.length})</span>
                  </div>
                  <div className="divide-y divide-[#eae2d5] border border-[#ded5c5] bg-[#fdfcf9]">
                    {results.authors.map((author) => (
                      <button
                        key={author.id}
                        onClick={handleSelectAuthor}
                        className="w-full text-left p-3 sm:p-4 hover:bg-[#f6f2e8] transition-colors flex items-center justify-between group"
                      >
                        <div className="pr-4">
                          <h4 className="font-serif text-base sm:text-lg text-[#1e1b18] group-hover:text-[#944222] transition-colors">
                            {author.name}
                          </h4>
                          <p className="text-xs text-[#524b43] font-sans mt-0.5 line-clamp-2">
                            {author.shortBio}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#8c847a] group-hover:text-[#1e1b18] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Works */}
              {results.works.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#8c847a] font-sans font-semibold">
                    <PenTool className="w-3.5 h-3.5 text-[#944222]" />
                    <span>Selected Works & In Progress ({results.works.length})</span>
                  </div>
                  <div className="divide-y divide-[#eae2d5] border border-[#ded5c5] bg-[#fdfcf9]">
                    {results.works.map((work) => (
                      <button
                        key={work.id}
                        onClick={() => handleSelectWork(work.authorSlug)}
                        className="w-full text-left p-3 sm:p-4 hover:bg-[#f6f2e8] transition-colors flex items-center justify-between group"
                      >
                        <div className="pr-4">
                          <div className="flex items-center gap-2 text-[11px] text-[#736b62] font-sans uppercase tracking-wider">
                            <span>{work.universeSeries}</span>
                            <span>·</span>
                            <span>{work.typeForm}</span>
                          </div>
                          <h4 className="font-serif text-base sm:text-lg text-[#1e1b18] group-hover:text-[#944222] transition-colors">
                            {work.title}
                          </h4>
                          <p className="text-xs text-[#524b43] font-sans mt-0.5 line-clamp-1">
                            {work.description}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#8c847a] group-hover:text-[#1e1b18] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* News */}
              {results.news.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#8c847a] font-sans font-semibold">
                    <Newspaper className="w-3.5 h-3.5 text-[#944222]" />
                    <span>Dispatches & News ({results.news.length})</span>
                  </div>
                  <div className="divide-y divide-[#eae2d5] border border-[#ded5c5] bg-[#fdfcf9]">
                    {results.news.map((item) => (
                      <button
                        key={item.id}
                        onClick={handleSelectNews}
                        className="w-full text-left p-3 sm:p-4 hover:bg-[#f6f2e8] transition-colors flex items-center justify-between group"
                      >
                        <div className="pr-4">
                          <div className="text-[11px] text-[#736b62] font-sans mb-0.5">
                            {item.category} · {item.date}
                          </div>
                          <h4 className="font-serif text-base sm:text-lg text-[#1e1b18] group-hover:text-[#944222] transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-xs text-[#524b43] font-sans mt-0.5 line-clamp-1">
                            {item.shortContent}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#8c847a] group-hover:text-[#1e1b18] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Jack Comes Back Artwork & Illustrations */}
              {results.artworks && results.artworks.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#8c847a] font-sans font-semibold">
                    <Palette className="w-3.5 h-3.5 text-[#944222]" />
                    <span>Jack Comes Back Artwork & Illustrations ({results.artworks.length})</span>
                  </div>
                  <div className="divide-y divide-[#eae2d5] border border-[#ded5c5] bg-[#fdfcf9]">
                    {results.artworks.map((art) => (
                      <button
                        key={art.id}
                        onClick={handleSelectArtwork}
                        className="w-full text-left p-3 sm:p-4 hover:bg-[#f6f2e8] transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3 pr-4">
                          <div className="relative w-10 h-14 bg-[#eee7da] shrink-0 border border-[#ded5c5] overflow-hidden">
                            <Image
                              src={art.imageUrl || '/images/character-card.jpg'}
                              alt={art.name}
                              fill
                              sizes="40px"
                              referrerPolicy="no-referrer"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="text-[11px] text-[#944222] font-sans font-semibold uppercase tracking-wider mb-0.5">
                              Supplied Artwork · Card #{art.ordering}
                            </div>
                            <h4 className="font-serif text-base sm:text-lg text-[#1e1b18] group-hover:text-[#944222] transition-colors">
                              {art.name}
                            </h4>
                            {art.description ? (
                              <p className="text-xs text-[#524b43] font-sans mt-0.5 line-clamp-1">
                                {art.description}
                              </p>
                            ) : (
                              <p className="text-xs text-[#736b62] font-sans mt-0.5">
                                View companion illustration folio in Extras
                              </p>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#8c847a] group-hover:text-[#1e1b18] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-[#f4efe5] border-t border-[#e2dacc] flex items-center justify-between text-xs text-[#736b62] font-sans">
          <span>Press ESC or click outside to dismiss</span>
          <span className="hidden sm:inline">Sound Volumes Literary Imprint Search</span>
        </div>
      </div>
    </div>
  );
}
