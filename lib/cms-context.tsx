'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CMSData, Book, Author, Work, NewsItem, EventItem, ExtraItem, ArtworkRecord, SiteSettings, SiteId } from './types';
import { INITIAL_CMS_DATA } from './initial-data';

interface CMSContextType {
  data: CMSData;
  activeSite: SiteId;
  setActiveSite: (site: SiteId) => void;
  // Books
  addBook: (book: Omit<Book, 'id'>) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  // Authors
  updateAuthor: (id: string, updates: Partial<Author>) => void;
  addAuthor: (author: Omit<Author, 'id'>) => void;
  // Works
  addWork: (work: Omit<Work, 'id'>) => void;
  updateWork: (id: string, updates: Partial<Work>) => void;
  deleteWork: (id: string) => void;
  // News
  addNews: (item: Omit<NewsItem, 'id'>) => void;
  updateNews: (id: string, updates: Partial<NewsItem>) => void;
  deleteNews: (id: string) => void;
  // Events
  addEvent: (item: Omit<EventItem, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;
  // Extras
  addExtra: (item: Omit<ExtraItem, 'id'>) => void;
  updateExtra: (id: string, updates: Partial<ExtraItem>) => void;
  deleteExtra: (id: string) => void;
  // Artworks (Jack Comes Back supplied artwork & character illustrations)
  addArtwork: (artwork: Omit<ArtworkRecord, 'id'>) => void;
  updateArtwork: (id: string, updates: Partial<ArtworkRecord>) => void;
  deleteArtwork: (id: string) => void;
  reorderArtworks: (reordered: ArtworkRecord[]) => void;
  // Settings & Announcements
  updateSettings: (updates: Partial<SiteSettings>) => void;
  updateAnnouncement: (siteId: 'soundvolumes' | 'alec' | 'laurie', updates: { text?: string; destination?: string; visibility?: boolean }) => void;
  // System actions
  resetToDefaults: () => void;
  exportJSON: () => string;
  importJSON: (jsonStr: string) => boolean;
}

const STORAGE_KEY = 'soundvolumes_cms_data_v1';
const ACTIVE_SITE_KEY = 'soundvolumes_active_site_v1';

const CMSContext = createContext<CMSContextType | null>(null);

export function CMSProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<CMSData>(INITIAL_CMS_DATA);
  const [activeSite, setActiveSiteState] = useState<SiteId>('soundvolumes');

  useEffect(() => {
    // Safely synchronize persisted state from browser localStorage AFTER hydration
    queueMicrotask(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.books && parsed.authors) {
            // Strip any legacy editorial notes / supplementaryText from cached books
            if (Array.isArray(parsed.books)) {
              parsed.books = parsed.books.map((b: Book) => {
                const rest = b;
                return rest;
              });
            }
            // Ensure artworks array exists and contains all 8 initial supplied assets if not already populated
            if (!parsed.artworks || parsed.artworks.length === 0) {
              parsed.artworks = INITIAL_CMS_DATA.artworks;
            }
            setData(parsed);
          }
        }
        const storedSite = localStorage.getItem(ACTIVE_SITE_KEY);
        if (storedSite && ['soundvolumes', 'alec', 'laurie', 'admin'].includes(storedSite)) {
          setActiveSiteState(storedSite as SiteId);
        }
      } catch {
        // ignore
      }
    });

    const handleStorageChange = (e: StorageEvent) => {

      if (e.key === ACTIVE_SITE_KEY && e.newValue) {
        if (['soundvolumes', 'alec', 'laurie', 'admin'].includes(e.newValue)) {
          setActiveSiteState(e.newValue as SiteId);
        }
      }
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed.books && parsed.authors) {
            if (Array.isArray(parsed.books)) {
              parsed.books = parsed.books.map((b: Book) => {
                const rest = b;
                return rest;
              });
            }
            if (!parsed.artworks || parsed.artworks.length === 0) {
              parsed.artworks = INITIAL_CMS_DATA.artworks;
            }
            setData(parsed);
          }
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const persist = (newData: CMSData) => {
    setData(newData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch {
      // ignore
    }

    // Sync with server API (server verifies session cookie)
    if (typeof window !== 'undefined') {
      fetch('/api/admin/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_all', payload: newData })
      }).catch(() => {
        // ignore in non-admin or offline contexts
      });
    }
  };

  const setActiveSite = (site: SiteId) => {

    setActiveSiteState(site);
    try {
      localStorage.setItem(ACTIVE_SITE_KEY, site);
    } catch {
      // ignore
    }
  };

  // Books
  const addBook = (book: Omit<Book, 'id'>) => {
    const newBook: Book = {
      ...book,
      id: book.slug || `book-${Date.now()}`
    };
    persist({
      ...data,
      books: [...data.books, newBook]
    });
  };

  const updateBook = (id: string, updates: Partial<Book>) => {
    persist({
      ...data,
      books: data.books.map(b => (b.id === id ? { ...b, ...updates } : b))
    });
  };

  const deleteBook = (id: string) => {
    persist({
      ...data,
      books: data.books.filter(b => b.id !== id)
    });
  };

  // Authors
  const updateAuthor = (id: string, updates: Partial<Author>) => {
    persist({
      ...data,
      authors: data.authors.map(a => (a.id === id ? { ...a, ...updates } : a))
    });
  };

  const addAuthor = (author: Omit<Author, 'id'>) => {
    const newAuthor: Author = {
      ...author,
      id: author.slug || `author-${Date.now()}`
    };
    persist({
      ...data,
      authors: [...data.authors, newAuthor]
    });
  };

  // Works
  const addWork = (work: Omit<Work, 'id'>) => {
    const newWork: Work = {
      ...work,
      id: work.slug || `work-${Date.now()}`
    };
    persist({
      ...data,
      works: [...data.works, newWork]
    });
  };

  const updateWork = (id: string, updates: Partial<Work>) => {
    persist({
      ...data,
      works: data.works.map(w => (w.id === id ? { ...w, ...updates } : w))
    });
  };

  const deleteWork = (id: string) => {
    persist({
      ...data,
      works: data.works.filter(w => w.id !== id)
    });
  };

  // News
  const addNews = (item: Omit<NewsItem, 'id'>) => {
    const newItem: NewsItem = {
      ...item,
      id: item.slug || `news-${Date.now()}`
    };
    persist({
      ...data,
      news: [newItem, ...data.news]
    });
  };

  const updateNews = (id: string, updates: Partial<NewsItem>) => {
    persist({
      ...data,
      news: data.news.map(n => (n.id === id ? { ...n, ...updates } : n))
    });
  };

  const deleteNews = (id: string) => {
    persist({
      ...data,
      news: data.news.filter(n => n.id !== id)
    });
  };

  // Events
  const addEvent = (item: Omit<EventItem, 'id'>) => {
    const newEvent: EventItem = {
      ...item,
      id: item.slug || `event-${Date.now()}`
    };
    persist({
      ...data,
      events: [newEvent, ...data.events]
    });
  };

  const updateEvent = (id: string, updates: Partial<EventItem>) => {
    persist({
      ...data,
      events: data.events.map(e => (e.id === id ? { ...e, ...updates } : e))
    });
  };

  const deleteEvent = (id: string) => {
    persist({
      ...data,
      events: data.events.filter(e => e.id !== id)
    });
  };

  // Extras
  const addExtra = (item: Omit<ExtraItem, 'id'>) => {
    const newExtra: ExtraItem = {
      ...item,
      id: item.slug || `extra-${Date.now()}`
    };
    persist({
      ...data,
      extras: [...data.extras, newExtra]
    });
  };

  const updateExtra = (id: string, updates: Partial<ExtraItem>) => {
    persist({
      ...data,
      extras: data.extras.map(x => (x.id === id ? { ...x, ...updates } : x))
    });
  };

  const deleteExtra = (id: string) => {
    persist({
      ...data,
      extras: data.extras.filter(x => x.id !== id)
    });
  };

  // Artworks (Jack Comes Back supplied artwork & character illustrations)
  const addArtwork = (artwork: Omit<ArtworkRecord, 'id'>) => {
    const newArtwork: ArtworkRecord = {
      ...artwork,
      id: artwork.slug || `artwork-${Date.now()}`
    };
    persist({
      ...data,
      artworks: [...(data.artworks || []), newArtwork]
    });
  };

  const updateArtwork = (id: string, updates: Partial<ArtworkRecord>) => {
    persist({
      ...data,
      artworks: (data.artworks || []).map(a => (a.id === id ? { ...a, ...updates } : a))
    });
  };

  const deleteArtwork = (id: string) => {
    persist({
      ...data,
      artworks: (data.artworks || []).filter(a => a.id !== id)
    });
  };

  const reorderArtworks = (reordered: ArtworkRecord[]) => {
    persist({
      ...data,
      artworks: reordered
    });
  };

  // Settings
  const updateSettings = (updates: Partial<SiteSettings>) => {
    persist({
      ...data,
      settings: { ...data.settings, ...updates }
    });
  };

  const updateAnnouncement = (siteId: 'soundvolumes' | 'alec' | 'laurie', updates: { text?: string; destination?: string; visibility?: boolean }) => {
    persist({
      ...data,
      settings: {
        ...data.settings,
        announcements: {
          ...data.settings.announcements,
          [siteId]: {
            ...data.settings.announcements[siteId],
            ...updates
          }
        }
      }
    });
  };

  const resetToDefaults = () => {
    persist(INITIAL_CMS_DATA);
  };

  const exportJSON = () => {
    return JSON.stringify(data, null, 2);
  };

  const importJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.books && parsed.authors) {
        if (!parsed.artworks || parsed.artworks.length === 0) {
          parsed.artworks = INITIAL_CMS_DATA.artworks;
        }
        persist(parsed);
        return true;
      }
    } catch {
      // error
    }
    return false;
  };

  return (
    <CMSContext.Provider
      value={{
        data,
        activeSite,
        setActiveSite,
        addBook,
        updateBook,
        deleteBook,
        updateAuthor,
        addAuthor,
        addWork,
        updateWork,
        deleteWork,
        addNews,
        updateNews,
        deleteNews,
        addEvent,
        updateEvent,
        deleteEvent,
        addExtra,
        updateExtra,
        deleteExtra,
        addArtwork,
        updateArtwork,
        deleteArtwork,
        reorderArtworks,
        updateSettings,
        updateAnnouncement,
        resetToDefaults,
        exportJSON,
        importJSON
      }}
    >
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
}

