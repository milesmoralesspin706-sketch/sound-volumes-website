'use client';

import React, { useState, useEffect } from 'react';
import { CMSProvider, useCMS } from '@/lib/cms-context';
import { SiteSwitcherBar } from '@/components/common/SiteSwitcherBar';
import { Header } from '@/components/common/Header';
import { AnnouncementStrip } from '@/components/common/AnnouncementStrip';
import { Footer } from '@/components/common/Footer';
import { SoundVolumesView } from '@/components/sites/SoundVolumesView';
import { AlecRowellView } from '@/components/sites/AlecRowellView';
import { LaurieFreemanView } from '@/components/sites/LaurieFreemanView';

function MainApp() {
  const { activeSite, setActiveSite, data } = useCMS();
  const [currentPath, setCurrentPath] = useState('/');

  // Initialize and sync path from URL if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handlePopState = () => {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
          setCurrentPath(hash);
        } else {
          setCurrentPath('/');
        }
      };

      // Check initial hash
      if (window.location.hash) {
        handlePopState();
      }

      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, []);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    if (typeof window !== 'undefined') {
      window.location.hash = path;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'PublishingOrganization',
        '@id': 'https://soundvolumes.com/#organization',
        'name': 'Sound Volumes',
        'url': 'https://soundvolumes.com',
        'logo': 'https://soundvolumes.com/images/stone-dog.jpg',
        'description': data.settings.soundVolumesTagline,
        'email': 'info@soundvolumes.com'
      },
      {
        '@type': 'Person',
        '@id': 'https://alecrowell.com/#author',
        'name': 'Alec Rowell',
        'url': 'https://alecrowell.com',
        'jobTitle': 'Author & Researcher',
        'sameAs': ['https://soundvolumes.com/authors/alec-rowell'],
        'description': data.authors.find(a => a.slug === 'alec-rowell')?.shortBio
      },
      {
        '@type': 'Person',
        '@id': 'https://lauriefreeman.com/#writer',
        'name': 'Laurie Freeman',
        'url': 'https://lauriefreeman.com',
        'jobTitle': 'Writer & Instructional Designer',
        'sameAs': ['https://soundvolumes.com/authors/laurie-freeman'],
        'description': data.authors.find(a => a.slug === 'laurie-freeman')?.shortBio
      },
      ...data.books.map((book) => ({
        '@type': 'Book',
        '@id': `https://soundvolumes.com/books/${book.slug}`,
        'name': book.title,
        'author': {
          '@type': 'Person',
          'name': book.author
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'Sound Volumes'
        },
        'bookFormat': `https://schema.org/${book.format}Book`,
        'description': book.microDescription || book.shortDescription,
        'offers': {
          '@type': 'Offer',
          'url': book.buyUrl,
          'availability': 'https://schema.org/InStock'
        }
      }))
    ]
  };

  return (
    <div className="flex flex-col min-h-screen w-full max-w-full">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Global Three-Site Network Switcher Bar */}
      <SiteSwitcherBar />

      {/* Public Three-Site Presentation */}
      <AnnouncementStrip
        siteKey={(activeSite === 'admin' ? 'soundvolumes' : activeSite) as 'soundvolumes' | 'alec' | 'laurie'}
        onNavigate={handleNavigate}
      />

      {/* Top Bar Navigation Contract */}
      <Header currentPath={currentPath} onNavigate={handleNavigate} />

      {/* Active Site Content Canvas */}
      <div className="flex-1">
        {(activeSite === 'soundvolumes' || activeSite === 'admin') && (
          <SoundVolumesView currentPath={currentPath} onNavigate={handleNavigate} />
        )}
        {activeSite === 'alec' && (
          <AlecRowellView currentPath={currentPath} onNavigate={handleNavigate} />
        )}
        {activeSite === 'laurie' && (
          <LaurieFreemanView currentPath={currentPath} onNavigate={handleNavigate} />
        )}
      </div>

      {/* Literary Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function Page() {
  return (
    <CMSProvider>
      <MainApp />
    </CMSProvider>
  );
}
