'use client';

import React, { useState, useEffect } from 'react';
import { useCMS } from '@/lib/cms-context';
import { Logo } from './Logo';
import { SearchModal } from './SearchModal';
import { Menu, X, ArrowUpRight, Search } from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function Header({ currentPath, onNavigate }: HeaderProps) {
  const { data, activeSite, setActiveSite } = useCMS();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Hydration-safe scroll detection for subtle header transition
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile navigation is open from any scroll position
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Global hotkey to open search (cmd+k or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLinkClick = (path: string) => {
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  // Define nav links depending on active site
  const getNavLinks = () => {
    if (activeSite === 'soundvolumes') {
      return [
        { label: 'Books', path: '/books' },
        { label: 'Authors', path: '/authors' },
        { label: 'News', path: '/news' },
        { label: 'Extras', path: '/extras' },
        { label: 'Contact', path: '/contact' }
      ];
    } else if (activeSite === 'alec') {
      return [
        { label: 'Books', path: '/books' },
        { label: 'Work', path: '/work' },
        { label: 'About', path: '/about' },
        { label: 'Reader Offer', path: '/extras' },
        { label: 'Contact', path: '/contact' }
      ];
    } else {
      // Laurie
      return [
        { label: 'Work', path: '/work' },
        { label: 'About', path: '/about' },
        { label: 'Contact', path: '/contact' }
      ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ease-out ${
          isScrolled
            ? 'bg-[#f8f5ee]/98 backdrop-blur-md border-b border-[#d8cfbe] shadow-xs'
            : 'bg-[#f8f5ee]/95 backdrop-blur-sm border-b border-[#e2dacc]'
        }`}
      >
        <div
          className={`max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-200 ease-out ${
            isScrolled ? 'h-14 sm:h-15' : 'h-16 sm:h-18'
          }`}
        >
          {/* ZONE 1: Brand Zone - Single text element / wordmark */}
          <div className="flex items-center min-w-0 flex-1 sm:flex-initial pr-2">
            {activeSite === 'soundvolumes' ? (
              <button
                onClick={() => handleLinkClick('/')}
                className="text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#1c1917] group shrink-0 py-1"
                aria-label="Sound Volumes Home"
              >
                <Logo size={isScrolled ? 'sm' : 'md'} />
              </button>
            ) : activeSite === 'alec' ? (
              <button
                onClick={() => handleLinkClick('/')}
                className="text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#1c1917] group min-w-0 py-1"
                aria-label="Alec Rowell Home"
              >
                <span className="font-serif text-lg sm:text-2xl text-[#1c1917] font-medium tracking-tight block truncate max-w-[170px] xs:max-w-[220px] sm:max-w-none">
                  {data.settings?.alecCopy?.brandName || 'Alec Rowell'}
                </span>
                <span className="block text-[9px] sm:text-[10px] uppercase tracking-widest text-[#736b62] font-sans truncate">
                  {data.settings?.alecCopy?.brandSubtitle || 'Novelist & Researcher'}
                </span>
              </button>
            ) : (
              <button
                onClick={() => handleLinkClick('/')}
                className="text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#1c1917] group min-w-0 py-1"
                aria-label="Laurie Freeman Home"
              >
                <span className="font-serif text-lg sm:text-2xl text-[#1c1917] font-medium tracking-tight block truncate max-w-[170px] xs:max-w-[220px] sm:max-w-none">
                  {data.settings?.laurieCopy?.brandName || 'Laurie Freeman'}
                </span>
                <span className="block text-[9px] sm:text-[10px] uppercase tracking-widest text-[#736b62] font-sans truncate">
                  {data.settings?.laurieCopy?.brandSubtitle || 'Fiction & Nonfiction'}
                </span>
              </button>
            )}
          </div>

          {/* ZONE 2: 4-6 Clean Text Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-7" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`text-xs uppercase tracking-widest font-sans transition-colors py-1 relative ${
                    isActive
                      ? 'text-[#1c1917] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#944222]'
                      : 'text-[#625b52] hover:text-[#1c1917]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* ZONE 3: Search, Primary Actions & Mobile Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Search Trigger Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="min-h-[40px] px-2.5 sm:px-3 text-[#625b52] hover:text-[#1c1917] hover:bg-[#ede7da]/80 rounded-xs transition-colors inline-flex items-center gap-1.5 text-xs font-sans"
              title="Search books, authors, works, or news (Press /)"
              aria-label="Search site"
            >
              <Search className="w-4 h-4 text-[#736b62]" />
              <span className="hidden lg:inline text-[11px] uppercase tracking-wider">Search</span>
              <kbd className="hidden xl:inline-block font-mono text-[10px] bg-[#eee7db] text-[#736b62] px-1 py-0.2 rounded border border-[#ded5c5]">
                /
              </kbd>
            </button>

            {activeSite !== 'soundvolumes' ? (
              <button
                onClick={() => {
                  setActiveSite('soundvolumes');
                  handleLinkClick('/');
                }}
                className="hidden sm:inline-flex items-center gap-1 text-xs uppercase tracking-widest font-sans text-[#524b43] hover:text-[#1c1917] transition-colors py-2 px-3 border border-[#cfc6b6] hover:border-[#1c1917] bg-[#fdfcf9] min-h-[40px]"
              >
                <span>Sound Volumes Imprint</span>
                <ArrowUpRight className="w-3 h-3 text-[#736b62]" />
              </button>
            ) : (
              <button
                onClick={() => handleLinkClick('/books')}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-sans bg-[#1c1917] text-[#fbf9f5] hover:bg-[#2c2824] transition-colors py-2 px-4 min-h-[40px]"
              >
                <span>Catalogue</span>
              </button>
            )}

            {/* Mobile Hamburger Button - Minimum 44px touch target */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-[#1c1917] hover:text-black hover:bg-[#ede7da] rounded-xs focus:outline-none focus:ring-1 focus:ring-[#1c1917]"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* SEARCH MODAL */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={handleNavigateInternal}
      />

      {/* MOBILE NAVIGATION OVERLAY (Works from any scroll position, fully accessible) */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#1c1917]/50 backdrop-blur-xs md:hidden animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed inset-y-0 right-0 w-full max-w-xs bg-[#fbf9f4] border-l border-[#e2dacc] shadow-xl p-5 sm:p-6 flex flex-col justify-between overflow-y-auto min-h-[100dvh] pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Drawer Header with Close */}
              <div className="flex items-center justify-between pb-4 border-b border-[#e2dacc]">
                <span className="font-serif text-lg font-medium text-stone-950 truncate pr-2">
                  {activeSite === 'soundvolumes' ? 'Sound Volumes' : activeSite === 'alec' ? 'Alec Rowell' : 'Laurie Freeman'}
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#736b62] hover:text-stone-950 rounded focus:outline-none"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search Button */}
              <div className="pt-4 pb-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSearchOpen(true);
                  }}
                  className="w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 bg-[#f0eae0] hover:bg-[#e7e0d3] border border-[#ded5c5] text-xs font-sans text-[#524b43] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#736b62]" />
                    <span className="uppercase tracking-wider">Search Catalogue...</span>
                  </div>
                  <kbd className="font-mono text-[10px] bg-[#fbf9f4] text-[#736b62] px-1.5 py-0.5 rounded border border-[#d8cfbe]">
                    /
                  </kbd>
                </button>
              </div>

              {/* Drawer Links with accessible 44px tap targets */}
              <nav className="flex flex-col space-y-1 py-3" aria-label="Mobile Navigation">
                <button
                  onClick={() => handleLinkClick('/')}
                  className={`w-full text-left text-xs uppercase tracking-widest font-sans min-h-[44px] px-3.5 py-2.5 rounded transition-colors flex items-center ${
                    currentPath === '/' ? 'text-stone-950 font-semibold bg-[#eee6d8]' : 'text-[#524b43] hover:bg-[#f3ede1] hover:text-stone-950'
                  }`}
                >
                  Home
                </button>
                {navLinks.map((link) => {
                  const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
                  return (
                    <button
                      key={link.path}
                      onClick={() => handleLinkClick(link.path)}
                      className={`w-full text-left text-xs uppercase tracking-widest font-sans min-h-[44px] px-3.5 py-2.5 rounded transition-colors flex items-center ${
                        isActive ? 'text-stone-950 font-semibold bg-[#eee6d8]' : 'text-[#524b43] hover:bg-[#f3ede1] hover:text-stone-950'
                      }`}
                    >
                      {link.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="pt-5 border-t border-[#e2dacc] space-y-3">
              {activeSite !== 'soundvolumes' && (
                <button
                  onClick={() => {
                    setActiveSite('soundvolumes');
                    handleLinkClick('/');
                  }}
                  className="w-full text-center text-xs uppercase tracking-widest font-sans min-h-[44px] py-2.5 px-3 border border-[#cfc6b6] bg-[#fdfcf9] text-stone-800 hover:text-stone-950 hover:border-stone-900 transition-colors"
                >
                  Visit Sound Volumes Imprint
                </button>
              )}
              <div className="text-[11px] text-[#8c847a] font-sans text-center">
                Independent Literary Publishing Imprint
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  function handleNavigateInternal(path: string) {
    onNavigate(path);
  }
}

