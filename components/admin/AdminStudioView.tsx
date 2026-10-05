'use client';

import React, { useState } from 'react';
import { useCMS } from '@/lib/cms-context';
import {
  Book,
  Author,
  Work,
  NewsItem,
  EventItem,
  ExtraItem,
  ArtworkRecord,
  WorkStatus,
  BookFormat,
  SoundVolumesSiteCopy,
  AlecSiteCopy,
  LaurieSiteCopy
} from '@/lib/types';
import {
  BookOpen,
  User,
  PenTool,
  Newspaper,
  Calendar,
  Sparkles,
  Palette,
  ArrowUp,
  ArrowDown,
  Bell,
  Mail,
  RotateCcw,
  Download,
  Upload,
  Eye,
  EyeOff,
  Edit3,
  Plus,
  Trash2,
  Check,
  ArrowLeft,
  LogOut,
  Shield,
  Key,
  LayoutTemplate,
  Save,
  ExternalLink
} from 'lucide-react';
import { ImageUploadField } from './ImageUploadField';
import { AdminSecurityTab } from './AdminSecurityTab';

interface AdminStudioViewProps {
  onExit: () => void;
  adminEmail?: string;
  onLogout?: () => void;
}

export function AdminStudioView({
  onExit,
  adminEmail: propAdminEmail,
  onLogout
}: AdminStudioViewProps) {
  const {
    data,
    updateBook,
    addBook,
    deleteBook,
    updateAuthor,
    addAuthor,
    updateWork,
    addWork,
    deleteWork,
    updateNews,
    addNews,
    deleteNews,
    updateEvent,
    addEvent,
    deleteEvent,
    updateExtra,
    addExtra,
    deleteExtra,
    updateArtwork,
    addArtwork,
    deleteArtwork,
    reorderArtworks,
    updateAnnouncement,
    updateSettings,
    resetToDefaults,
    exportJSON,
    importJSON
  } = useCMS();

  type TabType =
    | 'books'
    | 'artworks'
    | 'authors'
    | 'works'
    | 'sitecopy'
    | 'news'
    | 'events'
    | 'extras'
    | 'announcements'
    | 'contact'
    | 'security'
    | 'system';

  const [activeTab, setActiveTab] = useState<TabType>('books');
  const [currentAdminEmail, setCurrentAdminEmail] = useState(
    propAdminEmail || 'alec@soundvolumes.com'
  );

  // Book Editing State
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [bookForm, setBookForm] = useState<Partial<Book>>({});

  // Artwork Editing State (Jack Comes Back supplied illustrations)
  const [editingArtworkId, setEditingArtworkId] = useState<string | null>(null);
  const [artworkForm, setArtworkForm] = useState<Partial<ArtworkRecord>>({});

  // Author Editing State
  const [editingAuthorId, setEditingAuthorId] = useState<string | null>(null);
  const [authorForm, setAuthorForm] = useState<Partial<Author>>({});

  // Work Editing State
  const [editingWorkId, setEditingWorkId] = useState<string | null>(null);
  const [workForm, setWorkForm] = useState<Partial<Work>>({});

  // Site Copy Sub-tab
  const [siteCopySubTab, setSiteCopySubTab] = useState<
    'soundvolumes' | 'alec' | 'laurie'
  >('soundvolumes');

  // News Editing State
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsForm, setNewsForm] = useState<Partial<NewsItem>>({});

  // Event Editing State
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState<Partial<EventItem>>({});

  // Extra Editing State
  const [editingExtraId, setEditingExtraId] = useState<string | null>(null);
  const [extraForm, setExtraForm] = useState<Partial<ExtraItem>>({});

  // JSON Import State
  const [jsonInput, setJsonInput] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Status feedback message
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const showSaved = (
    msg: string = 'Changes saved and synchronized to live site'
  ) => {
    setSavedMessage(msg);
    setTimeout(() => setSavedMessage(null), 3500);
  };

  // Helper for Sound Volumes site copy
  const updateSoundVolumesCopy = (
    updates: Partial<SoundVolumesSiteCopy>
  ) => {
    updateSettings({
      soundVolumesCopy: {
        ...data.settings.soundVolumesCopy,
        ...updates
      }
    });
    showSaved('Sound Volumes site copy updated');
  };

  // Helper for Alec Rowell site copy
  const updateAlecCopy = (updates: Partial<AlecSiteCopy>) => {
    updateSettings({
      alecCopy: {
        ...data.settings.alecCopy,
        ...updates
      }
    });
    showSaved('Alec Rowell site copy updated');
  };

  // Helper for Laurie Freeman site copy
  const updateLaurieCopy = (updates: Partial<LaurieSiteCopy>) => {
    updateSettings({
      laurieCopy: {
        ...data.settings.laurieCopy,
        ...updates
      }
    });
    showSaved('Laurie Freeman site copy updated');
  };

  // --- BOOK HANDLERS ---
  const startEditBook = (book: Book) => {
    setEditingBookId(book.id);
    setBookForm({ ...book });
  };

  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingBookId) {
      updateBook(editingBookId, bookForm);
      showSaved(`Updated book: ${bookForm.title || editingBookId}`);
    } else {
      addBook({
        title: bookForm.title || 'Untitled Volume',
        slug:
          bookForm.slug ||
          (bookForm.title || 'untitled')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-'),
        author: bookForm.author || 'Alec Rowell',
        authorSlug: bookForm.authorSlug || 'alec-rowell',
        cover: bookForm.cover || '/images/stone-dog.jpg',
        shortDescription: bookForm.shortDescription || '',
        microDescription: bookForm.microDescription || '',
        longDescription: bookForm.longDescription || '',
        buyUrl: bookForm.buyUrl || 'https://books2read.com/u/',
        publicationInfo:
          bookForm.publicationInfo || 'Sound Volumes First Edition',
        format: (bookForm.format as BookFormat) || 'Paperback',
        visibility:
          bookForm.visibility !== undefined ? bookForm.visibility : true,
        ordering: bookForm.ordering || data.books.length + 1,
        series: bookForm.series || 'Jack Comes Back Series',
        seriesOrder: bookForm.seriesOrder
      });

      showSaved(`Added new volume to catalogue: ${bookForm.title}`);
    }

    setEditingBookId(null);
    setBookForm({});
  };

  // --- ARTWORK HANDLERS ---
  const startEditArtwork = (art: ArtworkRecord) => {
    setEditingArtworkId(art.id);
    setArtworkForm({ ...art });
  };

  const handleSaveArtwork = (e: React.FormEvent) => {
    e.preventDefault();

    const associatedBook = artworkForm.associatedBookId
      ? data.books.find(
          (b) =>
            b.id === artworkForm.associatedBookId ||
            b.slug === artworkForm.associatedBookId
        )
      : null;

    if (editingArtworkId) {
      updateArtwork(editingArtworkId, {
        ...artworkForm,
        associatedBookTitle: associatedBook ? associatedBook.title : ''
      });

      showSaved(`Updated artwork: ${artworkForm.name || editingArtworkId}`);
    } else {
      addArtwork({
        name: artworkForm.name || 'New Artwork',
        slug:
          artworkForm.slug ||
          (artworkForm.name || 'artwork')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-'),
        imageUrl: artworkForm.imageUrl || '/images/character-card.jpg',
        description: artworkForm.description || '',
        additionalInfo: artworkForm.additionalInfo || '',
        associatedBookId: artworkForm.associatedBookId || '',
        associatedBookTitle: associatedBook ? associatedBook.title : '',
        visibility:
          artworkForm.visibility !== undefined
            ? artworkForm.visibility
            : true,
        ordering:
          artworkForm.ordering ||
          (data.artworks || []).length + 1,
        tags: artworkForm.tags || ['Jack Comes Back', 'Supplied Artwork']
      });

      showSaved(`Added artwork record: ${artworkForm.name}`);
    }

    setEditingArtworkId(null);
    setArtworkForm({});
  };

  const handleDeleteArtwork = (id: string, name: string) => {
    if (
      confirm(
        `Are you sure you want to remove "${name}" from the artwork collection?`
      )
    ) {
      deleteArtwork(id);
      showSaved(`Removed artwork: ${name}`);
    }
  };

  const handleMoveArtworkOrder = (
    id: string,
    direction: 'up' | 'down'
  ) => {
    const list = [...(data.artworks || [])].sort(
      (a, b) => a.ordering - b.ordering
    );

    const idx = list.findIndex((a) => a.id === id);

    if (idx === -1) return;

    if (direction === 'up' && idx > 0) {
      const temp = list[idx].ordering;
      list[idx].ordering = list[idx - 1].ordering;
      list[idx - 1].ordering = temp;

      reorderArtworks(list);
      showSaved('Updated artwork display order');
    } else if (
      direction === 'down' &&
      idx < list.length - 1
    ) {
      const temp = list[idx].ordering;
      list[idx].ordering = list[idx + 1].ordering;
      list[idx + 1].ordering = temp;

      reorderArtworks(list);
      showSaved('Updated artwork display order');
    }
  };

  // --- AUTHOR HANDLERS ---
  const startEditAuthor = (author: Author) => {
    setEditingAuthorId(author.id);
    setAuthorForm({ ...author });
  };

  const handleSaveAuthor = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingAuthorId) {
      updateAuthor(editingAuthorId, authorForm);
      showSaved(`Updated author profile: ${authorForm.name}`);
    } else {
      addAuthor({
        name: authorForm.name || 'New Author',
        slug:
          authorForm.slug ||
          (authorForm.name || 'author')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-'),
        shortBio: authorForm.shortBio || '',
        fullBio: authorForm.fullBio || '',
        photographPrimary:
          authorForm.photographPrimary || '/images/alec-cowled.jpg',
        photographSecondary: authorForm.photographSecondary,
        photographThird: authorForm.photographThird,
        website:
          authorForm.website || 'https://soundvolumes.com',
        selectedWorks: authorForm.selectedWorks || [],
        visibility:
          authorForm.visibility !== undefined
            ? authorForm.visibility
            : true,
        ordering: authorForm.ordering || data.authors.length + 1
      });

      showSaved(`Added author: ${authorForm.name}`);
    }

    setEditingAuthorId(null);
    setAuthorForm({});
  };

  // --- WORK HANDLERS ---
  const startEditWork = (work: Work) => {
    setEditingWorkId(work.id);
    setWorkForm({ ...work });
  };

  const handleSaveWork = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingWorkId) {
      updateWork(editingWorkId, workForm);
      showSaved(`Updated work: ${workForm.title || editingWorkId}`);
    } else {
      addWork({
        title: workForm.title || 'Untitled Work',
        slug:
          workForm.slug ||
          (workForm.title || 'work')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-'),
        author: workForm.author || 'Alec Rowell',
        authorSlug: workForm.authorSlug || 'alec-rowell',
        typeForm: workForm.typeForm || 'Novel',
        universeSeries:
          workForm.universeSeries || 'Independent Fiction',
        description:
          workForm.description || 'DESCRIPTION TO COME.',
        status: (workForm.status as WorkStatus) || 'In work',
        targetTimeline:
          workForm.targetTimeline || 'Target publication: TBD',
        coAuthor: workForm.coAuthor,
        visibility:
          workForm.visibility !== undefined
            ? workForm.visibility
            : true,
        ordering: workForm.ordering || data.works.length + 1,
        siteVisibility:
          workForm.siteVisibility || {
            soundvolumes: true,
            alec: true,
            laurie: false
          }
      });

      showSaved(`Added work: ${workForm.title}`);
    }

    setEditingWorkId(null);
    setWorkForm({});
  };

  // --- NEWS HANDLERS ---
  const startEditNews = (news: NewsItem) => {
    setEditingNewsId(news.id);
    setNewsForm({ ...news });
  };

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingNewsId) {
      updateNews(editingNewsId, newsForm);
      showSaved(`Updated dispatch: ${newsForm.title}`);
    } else {
      addNews({
        title: newsForm.title || 'New Dispatch',
        slug:
          newsForm.slug ||
          (newsForm.title || 'dispatch')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-'),
        date:
          newsForm.date ||
          new Date().toISOString().split('T')[0],
        category:
          newsForm.category || 'Notes from the Editor',
        shortContent: newsForm.shortContent || '',
        fullContent: newsForm.fullContent || '',
        featureOnHome:
          newsForm.featureOnHome !== undefined
            ? newsForm.featureOnHome
            : true,
        archived: false,
        published: true,
        images: newsForm.images
      });

      showSaved(`Composed dispatch: ${newsForm.title}`);
    }

    setEditingNewsId(null);
    setNewsForm({});
  };

  // --- EVENT HANDLERS ---
  const startEditEvent = (evt: EventItem) => {
    setEditingEventId(evt.id);
    setEventForm({ ...evt });
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingEventId) {
      updateEvent(editingEventId, eventForm);
      showSaved(`Updated event: ${eventForm.title}`);
    } else {
      addEvent({
        title: eventForm.title || 'New Imprint Event',
        slug:
          eventForm.slug ||
          (eventForm.title || 'event')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-'),
        date:
          eventForm.date ||
          new Date().toISOString().split('T')[0],
        time: eventForm.time || '7:00 PM CST',
        location:
          eventForm.location || 'Austin, Texas',
        description: eventForm.description || '',
        image: eventForm.image,
        externalLink: eventForm.externalLink,
        isUpcoming:
          eventForm.isUpcoming !== undefined
            ? eventForm.isUpcoming
            : true,
        archived: false,
        published: true
      });

      showSaved(`Scheduled event: ${eventForm.title}`);
    }

    setEditingEventId(null);
    setEventForm({});
  };

  // --- EXTRA HANDLERS ---
  const startEditExtra = (extra: ExtraItem) => {
    setEditingExtraId(extra.id);
    setExtraForm({ ...extra });
  };

  const handleSaveExtra = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingExtraId) {
      updateExtra(editingExtraId, extraForm);
      showSaved(`Updated extra: ${extraForm.title}`);
    } else {
      addExtra({
        title: extraForm.title || 'New Companion Offer',
        slug:
          extraForm.slug ||
          (extraForm.title || 'extra')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-'),
        description: extraForm.description || '',
        artwork:
          extraForm.artwork || '/images/character-card.jpg',
        associatedProperty:
          extraForm.associatedProperty || 'Jack Comes Back',
        emailGated:
          extraForm.emailGated !== undefined
            ? extraForm.emailGated
            : true,
        downloadDestination:
          extraForm.downloadDestination || '#',
        mailingListProvider:
          extraForm.mailingListProvider ||
          'Sound Volumes Central Dispatch',
        featured:
          extraForm.featured !== undefined
            ? extraForm.featured
            : true,
        visibility:
          extraForm.visibility !== undefined
            ? extraForm.visibility
            : true,
        details: extraForm.details
      });

      showSaved(`Created reader extra: ${extraForm.title}`);
    }

    setEditingExtraId(null);
    setExtraForm({});
  };

  // --- SYSTEM HANDLERS ---
  const handleExport = () => {
    const jsonStr = exportJSON();
    const blob = new Blob([jsonStr], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = `soundvolumes-cms-backup-${
      new Date().toISOString().split('T')[0]
    }.json`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showSaved('CMS snapshot exported');
  };

  const handleImport = () => {
    if (!jsonInput.trim()) return;

    const success = importJSON(jsonInput);

    if (success) {
      setImportStatus('✓ CMS state restored and updated successfully.');
      showSaved('Imported snapshot applied');

      setTimeout(() => setImportStatus(null), 4000);
      setJsonInput('');
    } else {
      setImportStatus(
        '✕ Invalid JSON snapshot format. Please check syntax.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f3eb] text-[#1c1917] pb-24 overflow-x-hidden">
      {/* Editorial Studio Header */}
      <div className="bg-[#191614] text-[#d4ccc0] border-b border-[#2a2420] sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-0 sm:h-16 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={onExit}
              className="inline-flex items-center gap-1.5 text-xs text-[#a89f91] hover:text-white transition-colors min-h-[40px] py-1"
              title="Return to the live public websites"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden xs:inline sm:inline">
                Back to Public Sites
              </span>
              <span className="xs:hidden sm:hidden">Sites</span>
            </button>

            <span className="text-[#453e35]">|</span>

            <div className="flex items-center gap-2">
              <span className="font-serif text-base sm:text-lg font-medium text-white">
                Author Admin
              </span>

              <span className="text-[10px] uppercase tracking-widest bg-[#2b241e] text-[#e0a86c] border border-[#523d2a] px-2 py-0.5 rounded-xs">
                Live CMS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {savedMessage && (
              <span className="text-xs text-emerald-400 font-sans flex items-center gap-1 animate-pulse">
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {savedMessage}
                </span>
              </span>
            )}

            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-[#231f1c] rounded-xs border border-[#3b342e] text-xs">
              <Shield className="w-3 h-3 text-[#dca266]" />
              <span className="text-[#998f82] font-sans">
                Admin:
              </span>
              <span className="font-mono text-[11px] text-[#e8cbb0]">
                {currentAdminEmail}
              </span>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#231f1c] hover:bg-[#322c27] text-xs uppercase tracking-wider font-sans rounded-xs text-[#d4ccc0] border border-[#3b342e] hover:border-[#5a5046] transition-colors min-h-[40px]"
                title="Sign out of administrative session"
              >
                <LogOut className="w-3.5 h-3.5 text-[#a89f91]" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            )}

            <button
              onClick={onExit}
              className="px-3.5 py-1.5 bg-[#944222]/20 hover:bg-[#944222]/30 text-[#f5c7b3] border border-[#944222]/50 text-xs uppercase tracking-wider font-sans rounded-xs transition-colors inline-flex items-center gap-1.5 min-h-[40px]"
            >
              <span>Public Sites</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto no-scrollbar scrollbar-none gap-1.5 border-b border-[#ded5c5] pb-2 mb-8 text-xs font-sans -mx-4 px-4 sm:mx-0 sm:px-0">
          {[
            {
              id: 'books',
              label: 'Books & BUY Links',
              icon: BookOpen,
              count: data.books.length
            },
            {
              id: 'artworks',
              label: 'Jack Comes Back Artwork',
              icon: Palette,
              count: (data.artworks || []).length
            },
            {
              id: 'authors',
              label: 'Authors & Bios',
              icon: User,
              count: data.authors.length
            },
            {
              id: 'works',
              label: 'Works & Statuses',
              icon: PenTool,
              count: data.works.length
            },
            {
              id: 'sitecopy',
              label: 'Site Copy & Branding',
              icon: LayoutTemplate
            },
            {
              id: 'news',
              label: 'News & Dispatches',
              icon: Newspaper,
              count: data.news.length
            },
            {
              id: 'events',
              label: 'Events & Colloquia',
              icon: Calendar,
              count: data.events.length
            },
            {
              id: 'extras',
              label: 'Extras & Reader Offer',
              icon: Sparkles,
              count: data.extras.length
            },
            {
              id: 'announcements',
              label: 'Announcement Strips',
              icon: Bell
            },
            {
              id: 'contact',
              label: 'Contact Routing',
              icon: Mail
            },
            {
              id: 'security',
              label: 'Admin Password & Security',
              icon: Key
            },
            {
              id: 'system',
              label: 'Backup & Restore',
              icon: RotateCcw
            }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-1.5 px-3.5 py-2 font-medium whitespace-nowrap shrink-0 transition-all min-h-[40px] ${
                  isActive
                    ? 'bg-[#1c1917] text-[#fbf9f5] shadow-xs'
                    : 'bg-[#fcfbf8] text-[#3d3730] hover:bg-[#ede6d8] border border-[#ddd5c7]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>

                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] ml-1 px-1.5 py-0.2 rounded-xs ${
                      isActive
                        ? 'bg-[#332e29] text-[#d6cec2]'
                        : 'bg-[#eee7dc] text-[#5e564d]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: BOOKS & BUY LINKS */}
        {/* ========================================================================= */}
        {activeTab === 'books' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-medium text-stone-900">
                  Manage Catalogue & BUY URLs
                </h2>

                <p className="text-xs text-stone-600 font-sans mt-0.5">
                  Update book descriptions, universal books2read URLs, cover
                  jackets, and catalog visibility.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingBookId(null);
                  setBookForm({
                    title: '',
                    author: 'Alec Rowell',
                    authorSlug: 'alec-rowell',
                    buyUrl: 'https://books2read.com/u/',
                    cover: '/images/stone-dog.jpg',
                    format: 'Paperback',
                    series: 'Jack Comes Back Series',
                    publicationInfo:
                      'Sound Volumes First Edition',
                    visibility: true
                  });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-stone-50 text-xs uppercase tracking-wider font-sans hover:bg-stone-800"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Book</span>
              </button>
            </div>

            {/* Book Edit / Create Form */}
            {(editingBookId !== null ||
              bookForm.title !== undefined) && (
              <form
                onSubmit={handleSaveBook}
                className="bg-white border border-stone-300 p-6 sm:p-8 space-y-6 shadow-sm"
              >
                <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
                  <h3 className="font-serif text-lg font-medium text-stone-900">
                    {editingBookId
                      ? `Edit Volume: ${bookForm.title}`
                      : 'Add New Book to Catalogue'}
                  </h3>

                  <span className="text-[11px] text-stone-500 font-sans">
                    Universal distribution across retailers via Books2Read
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Title
                    </label>

                    <input
                      type="text"
                      required
                      value={bookForm.title || ''}
                      onChange={(e) =>
                        setBookForm({
                          ...bookForm,
                          title: e.target.value
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900"
                      placeholder="e.g. Stone Dog: Jack in the Pleistocene"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Author
                    </label>

                    <input
                      type="text"
                      required
                      value={bookForm.author || ''}
                      onChange={(e) =>
                        setBookForm({
                          ...bookForm,
                          author: e.target.value
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900"
                      placeholder="Alec Rowell"
                    />
                  </div>
                </div>

                <ImageUploadField
                  label="Cover Jacket Image"
                  value={bookForm.cover || ''}
                  onChange={(url) =>
                    setBookForm({
                      ...bookForm,
                      cover: url
                    })
                  }
                  helperText="Upload a new cover file from your computer (JPG/PNG/WEBP), select from existing library images, or input a custom URL."
                  recommendedSize="1200 × 1600 px (3:4 ratio)"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      BUY URL (Universal Books2Read)
                    </label>

                    <input
                      type="url"
                      required
                      value={bookForm.buyUrl || ''}
                      onChange={(e) =>
                        setBookForm({
                          ...bookForm,
                          buyUrl: e.target.value
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-xs font-mono text-stone-900"
                      placeholder="https://books2read.com/u/..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Series / Cycle
                    </label>

                    <input
                      type="text"
                      value={bookForm.series || ''}
                      onChange={(e) =>
                        setBookForm({
                          ...bookForm,
                          series: e.target.value
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900"
                      placeholder="Jack Comes Back Series"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Format
                    </label>

                    <select
                      value={bookForm.format || 'Paperback'}
                      onChange={(e) =>
                        setBookForm({
                          ...bookForm,
                          format: e.target.value as BookFormat
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900"
                    >
                      <option value="Paperback">Paperback</option>
                      <option value="Hardcover">Hardcover</option>
                      <option value="E-book">E-book</option>
                      <option value="Audiobook">Audiobook</option>
                      <option value="Omnibus Edition">
                        Omnibus Edition
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                    Micro Description / Tagline (1 sentence)
                  </label>

                  <input
                    type="text"
                    value={bookForm.microDescription || ''}
                    onChange={(e) =>
                      setBookForm({
                        ...bookForm,
                        microDescription: e.target.value
                      })
                    }
                    className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                    Short Description (Used on catalogue cards)
                  </label>

                  <textarea
                    rows={2}
                    value={bookForm.shortDescription || ''}
                    onChange={(e) =>
                      setBookForm({
                        ...bookForm,
                        shortDescription: e.target.value
                      })
                    }
                    className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                    Long Editorial Description (Detail page & colophon
                    notes)
                  </label>

                  <textarea
                    rows={5}
                    value={bookForm.longDescription || ''}
                    onChange={(e) =>
                      setBookForm({
                        ...bookForm,
                        longDescription: e.target.value
                      })
                    }
                    className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900 font-sans leading-relaxed"
                  />
                </div>

                <div className="flex items-center gap-4 pt-2 border-t border-stone-200">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-stone-900 text-stone-50 text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors inline-flex items-center gap-2 font-medium"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Book to Live Catalogue</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingBookId(null);
                      setBookForm({});
                    }}
                    className="px-4 py-2.5 border border-stone-300 text-stone-700 text-xs uppercase tracking-widest hover:bg-stone-100 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Book Cards Grid in Admin */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.books.map((book) => (
                <div
                  key={book.id}
                  className="bg-white border border-stone-200 p-4 flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <div className="relative aspect-[3/4] w-full bg-stone-100 overflow-hidden mb-3 border border-stone-200">
                      {book.cover ? (
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="absolute inset-0 w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-stone-400">
                          No cover
                        </div>
                      )}
                    </div>

                    <h3 className="font-serif text-base font-medium text-stone-900">
                      {book.title}
                    </h3>

                    <p className="text-xs text-stone-500 font-sans mt-1">
                      {book.author}
                    </p>

                    <p className="text-[11px] text-stone-500 font-mono mt-1 break-all">
                      {book.buyUrl}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() =>
                        updateBook(book.id, {
                          visibility: !book.visibility
                        })
                      }
                      className="p-1 text-stone-500 hover:text-stone-900"
                      title={
                        book.visibility ? 'Published' : 'Hidden'
                      }
                    >
                      {book.visibility ? (
                        <Eye className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-stone-400" />
                      )}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => startEditBook(book)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (
                            confirm(
                              `Delete volume "${book.title}" from catalogue?`
                            )
                          ) {
                            deleteBook(book.id);
                            showSaved(
                              `Deleted volume: ${book.title}`
                            );
                          }
                        }}
                        className="p-1 text-stone-400 hover:text-rose-600 rounded"
                        title="Delete volume"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: JACK COMES BACK ARTWORK */}
        {/* ========================================================================= */}
        {activeTab === 'artworks' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-2xl font-medium text-stone-900">
                  Jack Comes Back · Supplied Dog Illustrations
                </h2>

                <p className="text-xs text-stone-600 font-sans mt-0.5 max-w-3xl leading-relaxed">
                  Individual management for all eight supplied client
                  illustrations (Bite Back, Dyak, Tekhe, Iace, Jack, Zhok,
                  Dax, Jackie). Independently replace images, edit titles, add
                  optional descriptions or book associations, adjust display
                  ordering, and control public visibility.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingArtworkId(null);
                  setArtworkForm({
                    name: '',
                    slug: '',
                    imageUrl: '/images/character-card.jpg',
                    description: '',
                    additionalInfo: '',
                    associatedBookId: '',
                    associatedBookTitle: '',
                    visibility: true,
                    ordering: (data.artworks || []).length + 1,
                    tags: ['Jack Comes Back', 'Supplied Artwork']
                  });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-stone-50 text-xs uppercase tracking-wider font-sans hover:bg-stone-800 self-start sm:self-auto shrink-0 min-h-[40px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Artwork</span>
              </button>
            </div>

            {/* Artwork Edit / Create Form */}
            {(editingArtworkId !== null ||
              artworkForm.name !== undefined) && (
              <form
                onSubmit={handleSaveArtwork}
                className="bg-white border border-stone-300 p-6 sm:p-8 space-y-6 shadow-sm"
              >
                <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
                  <h3 className="font-serif text-lg font-medium text-stone-900">
                    {editingArtworkId
                      ? `Edit Artwork: ${artworkForm.name}`
                      : 'Add New Jack Comes Back Artwork Record'}
                  </h3>

                  <span className="text-[11px] text-stone-500 font-sans">
                    Client Asset Inventory Management
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Illustration Name (Required)
                    </label>

                    <input
                      type="text"
                      required
                      value={artworkForm.name || ''}
                      onChange={(e) =>
                        setArtworkForm({
                          ...artworkForm,
                          name: e.target.value
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900"
                      placeholder="e.g. Bite Back, Dyak, Tekhe, Iace, Jack, Zhok, Dax, Jackie"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Book Association (Optional)
                    </label>

                    <select
                      value={artworkForm.associatedBookId || ''}
                      onChange={(e) => {
                        const bookId = e.target.value;

                        const book = data.books.find(
                          (b) =>
                            b.id === bookId ||
                            b.slug === bookId
                        );

                        setArtworkForm({
                          ...artworkForm,
                          associatedBookId: bookId,
                          associatedBookTitle: book
                            ? book.title
                            : ''
                        });
                      }}
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900"
                    >
                      <option value="">
                        -- Unassigned (No Book Association) --
                      </option>

                      {data.books.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.title} ({b.series || 'Sound Volumes'})
                        </option>
                      ))}
                    </select>

                    <span className="text-[10px] text-stone-500 font-sans mt-0.5 block">
                      Leave unassigned if this artwork is not linked to a
                      specific volume.
                    </span>
                  </div>
                </div>

                <ImageUploadField
                  label="Artwork Image Asset"
                  value={artworkForm.imageUrl || ''}
                  onChange={(url) =>
                    setArtworkForm({
                      ...artworkForm,
                      imageUrl: url
                    })
                  }
                  helperText="Upload an illustration file from your device, select an existing image asset, or specify an image URL."
                  recommendedSize="896 × 1200 px (5:8 archival ratio)"
                />

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium">
                      Description (Optional)
                    </label>

                    <span className="text-[10px] text-stone-500 font-sans italic">
                      Leave blank if unassigned by client
                    </span>
                  </div>

                  <textarea
                    rows={3}
                    value={artworkForm.description || ''}
                    onChange={(e) =>
                      setArtworkForm({
                        ...artworkForm,
                        description: e.target.value
                      })
                    }
                    className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900"
                    placeholder="Optional character narrative or quote. Leave empty if unassigned."
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium">
                      Additional Information (Optional)
                    </label>

                    <span className="text-[10px] text-stone-500 font-sans italic">
                      Leave blank if unassigned by client
                    </span>
                  </div>

                  <textarea
                    rows={2}
                    value={artworkForm.additionalInfo || ''}
                    onChange={(e) =>
                      setArtworkForm({
                        ...artworkForm,
                        additionalInfo: e.target.value
                      })
                    }
                    className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900"
                    placeholder="Optional archival notes, historical context, or print details. Leave empty if unassigned."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-200">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Display Order Number
                    </label>

                    <input
                      type="number"
                      min={1}
                      value={artworkForm.ordering || 1}
                      onChange={(e) =>
                        setArtworkForm({
                          ...artworkForm,
                          ordering:
                            parseInt(e.target.value) || 1
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900"
                    />

                    <span className="text-[10px] text-stone-500 font-sans mt-0.5 block">
                      Determines sequence in galleries and character grids.
                    </span>
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={
                          artworkForm.visibility !== undefined
                            ? artworkForm.visibility
                            : true
                        }
                        onChange={(e) =>
                          setArtworkForm({
                            ...artworkForm,
                            visibility: e.target.checked
                          })
                        }
                        className="w-4 h-4 text-stone-900 rounded"
                      />

                      <span className="text-xs uppercase tracking-wider font-sans font-medium text-stone-800">
                        Visible on Public Sites & Character Grid
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingArtworkId(null);
                      setArtworkForm({});
                    }}
                    className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs uppercase tracking-wider font-sans"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2 bg-stone-900 text-stone-50 text-xs uppercase tracking-wider font-sans hover:bg-stone-800"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Artwork Record</span>
                  </button>
                </div>
              </form>
            )}

            {/* Artwork Records Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(data.artworks || []).length === 0 ? (
                <div className="col-span-full bg-white border border-stone-200 p-8 text-center text-xs text-stone-500 font-sans">
                  No artwork records available. Click &ldquo;Add New
                  Artwork&rdquo; above to create records.
                </div>
              ) : (
                [...(data.artworks || [])]
                  .sort((a, b) => a.ordering - b.ordering)
                  .map((art, idx, arr) => (
                    <div
                      key={art.id}
                      className="bg-white border border-stone-200 p-4 flex flex-col justify-between space-y-3 hover:border-stone-400 transition-all shadow-xs"
                    >
                      <div>
                        {/* Artwork Preview Card */}
                        <div className="relative aspect-[5/8] w-full bg-stone-100 overflow-hidden mb-2 border border-stone-200">
                          <img
                            src={
                              art.imageUrl ||
                              '/images/character-card.jpg'
                            }
                            alt={art.name}
                            className="absolute inset-0 w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />

                          <div className="absolute top-2 left-2 bg-stone-900/80 text-stone-100 text-[10px] font-mono px-1.5 py-0.5 rounded-xs">
                            #{art.ordering}
                          </div>

                          {!art.visibility && (
                            <div className="absolute top-2 right-2 bg-rose-900/90 text-rose-100 text-[10px] uppercase tracking-wider font-sans px-1.5 py-0.5 rounded-xs">
                              Hidden
                            </div>
                          )}
                        </div>

                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-serif text-base font-medium text-stone-900">
                            {art.name}
                          </h3>
                        </div>

                        <div className="mt-1 text-[11px] font-sans">
                          {art.associatedBookId ? (
                            <span className="text-amber-800 font-medium flex items-center gap-1">
                              <BookOpen className="w-3 h-3 shrink-0" />
                              <span className="truncate">
                                {art.associatedBookTitle ||
                                  art.associatedBookId}
                              </span>
                            </span>
                          ) : (
                            <span className="text-stone-400 italic">
                              Book unassigned
                            </span>
                          )}
                        </div>

                        {art.description ? (
                          <p className="text-[11px] text-stone-600 font-sans mt-1 line-clamp-2">
                            {art.description}
                          </p>
                        ) : (
                          <p className="text-[10px] text-stone-400 font-sans mt-1 italic">
                            No description assigned
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-sans">
                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() =>
                              handleMoveArtworkOrder(
                                art.id,
                                'up'
                              )
                            }
                            className="p-1 text-stone-600 hover:text-stone-950 disabled:opacity-30 disabled:hover:text-stone-600 rounded"
                            title="Move artwork earlier in display sequence"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            disabled={idx === arr.length - 1}
                            onClick={() =>
                              handleMoveArtworkOrder(
                                art.id,
                                'down'
                              )
                            }
                            className="p-1 text-stone-600 hover:text-stone-950 disabled:opacity-30 disabled:hover:text-stone-600 rounded"
                            title="Move artwork later in display sequence"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              updateArtwork(art.id, {
                                visibility: !art.visibility
                              });

                              showSaved(
                                `Artwork ${art.name} is now ${
                                  !art.visibility
                                    ? 'visible'
                                    : 'hidden'
                                }`
                              );
                            }}
                            className={`p-1.5 rounded transition-colors ${
                              art.visibility
                                ? 'text-emerald-700 hover:bg-emerald-50'
                                : 'text-stone-400 hover:bg-stone-100'
                            }`}
                            title={
                              art.visibility
                                ? 'Hide from public site'
                                : 'Make visible on public site'
                            }
                          >
                            {art.visibility ? (
                              <Eye className="w-3.5 h-3.5" />
                            ) : (
                              <EyeOff className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => startEditArtwork(art)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded border border-stone-200"
                            title="Edit artwork record"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteArtwork(
                                art.id,
                                art.name
                              )
                            }
                            className="p-1 text-stone-400 hover:text-rose-600 rounded"
                            title="Delete artwork record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: AUTHORS */}
        {/* ========================================================================= */}
        {activeTab === 'authors' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-medium text-stone-900">
                  Author Biographies & Photography
                </h2>

                <p className="text-xs text-stone-600 font-sans mt-0.5">
                  Update author portraits, biographical introductions, and
                  full research statements.
                </p>
              </div>
            </div>

            {editingAuthorId && (
              <form
                onSubmit={handleSaveAuthor}
                className="bg-white border border-stone-300 p-6 sm:p-8 space-y-6 shadow-sm"
              >
                <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
                  <h3 className="font-serif text-lg font-medium text-stone-900">
                    Edit Profile: {authorForm.name}
                  </h3>

                  <span className="text-[11px] font-mono text-stone-400">
                    {authorForm.slug}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Author Name
                    </label>

                    <input
                      type="text"
                      required
                      value={authorForm.name || ''}
                      onChange={(e) =>
                        setAuthorForm({
                          ...authorForm,
                          name: e.target.value
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Personal Website URL
                    </label>

                    <input
                      type="text"
                      value={authorForm.website || ''}
                      onChange={(e) =>
                        setAuthorForm({
                          ...authorForm,
                          website: e.target.value
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-xs font-mono text-stone-900"
                    />
                  </div>
                </div>

                <ImageUploadField
                  label="Primary Author Photograph (Cowled / Formal Portrait)"
                  value={authorForm.photographPrimary || ''}
                  onChange={(url) =>
                    setAuthorForm({
                      ...authorForm,
                      photographPrimary: url
                    })
                  }
                  helperText="Primary author photograph displayed on author profile and homepage."
                  recommendedSize="600 × 800 px (3:4 ratio)"
                />

                <ImageUploadField
                  label="Secondary Photograph (Casual / Outdoor / Garden Setting)"
                  value={authorForm.photographSecondary || ''}
                  onChange={(url) =>
                    setAuthorForm({
                      ...authorForm,
                      photographSecondary: url
                    })
                  }
                  helperText="Secondary photograph shown in the biographical context."
                  recommendedSize="800 × 600 px (4:3 ratio)"
                />

                <ImageUploadField
                  label="Third Photograph (Forest / Archive / Press Archive)"
                  value={authorForm.photographThird || ''}
                  onChange={(url) =>
                    setAuthorForm({
                      ...authorForm,
                      photographThird: url
                    })
                  }
                  helperText="Press archive photograph for formal distribution."
                  recommendedSize="600 × 800 px (3:4 ratio)"
                />

                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                    Short Introduction Bio
                  </label>

                  <textarea
                    rows={2}
                    value={authorForm.shortBio || ''}
                    onChange={(e) =>
                      setAuthorForm({
                        ...authorForm,
                        shortBio: e.target.value
                      })
                    }
                    className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                    Full Author Biography & Research Scope
                  </label>

                  <textarea
                    rows={6}
                    value={authorForm.fullBio || ''}
                    onChange={(e) =>
                      setAuthorForm({
                        ...authorForm,
                        fullBio: e.target.value
                      })
                    }
                    className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900 font-sans leading-relaxed"
                  />
                </div>

                <div className="flex items-center gap-4 pt-2 border-t border-stone-200">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-stone-900 text-stone-50 text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors inline-flex items-center gap-2 font-medium"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Author Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingAuthorId(null)}
                    className="px-4 py-2.5 border border-stone-300 text-stone-700 text-xs uppercase tracking-widest hover:bg-stone-100 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.authors.map((author) => (
                <div
                  key={author.id}
                  className="bg-white border border-stone-200 p-6 flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-20 h-24 bg-stone-100 border border-stone-200 overflow-hidden relative shrink-0">
                        {author.photographPrimary && (
                          <img
                            src={author.photographPrimary}
                            alt={author.name}
                            className="absolute inset-0 w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        )}
                      </div>

                      <div>
                        <h3 className="font-serif text-xl font-medium text-stone-900">
                          {author.name}
                        </h3>

                        <p className="text-xs font-mono text-stone-500 mt-0.5">
                          {author.website}
                        </p>

                        <p className="text-xs text-stone-600 line-clamp-2 mt-2">
                          {author.shortBio}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-stone-700 font-sans leading-relaxed mb-4 line-clamp-3">
                      {author.fullBio}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-mono text-stone-400">
                      /{author.slug}
                    </span>

                    <button
                      onClick={() => startEditAuthor(author)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-medium rounded transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Profile & Photos</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: WORKS & STATUSES */}
        {/* ========================================================================= */}
        {activeTab === 'works' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-medium text-stone-900">
                  Manage Works & Editorial Statuses
                </h2>

                <p className="text-xs text-stone-600 font-sans mt-0.5">
                  Update statuses (e.g. &apos;Draft complete&apos;,
                  &apos;In outline&apos;, &apos;In work&apos;), timelines, and
                  descriptions.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingWorkId(null);
                  setWorkForm({
                    title: '',
                    author: 'Alec Rowell',
                    authorSlug: 'alec-rowell',
                    universeSeries:
                      'Robin Pike / Hyde, Texas Mysteries',
                    typeForm: 'Novel',
                    status: 'In work',
                    description: 'DESCRIPTION TO COME.',
                    targetTimeline:
                      'Target publication: 1st Quarter 2027',
                    visibility: true,
                    siteVisibility: {
                      soundvolumes: true,
                      alec: true,
                      laurie: false
                    }
                  });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-stone-50 text-xs uppercase tracking-wider font-sans hover:bg-stone-800"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Work</span>
              </button>
            </div>

            {(editingWorkId !== null ||
              workForm.title !== undefined) && (
              <form
                onSubmit={handleSaveWork}
                className="bg-white border border-stone-300 p-6 sm:p-8 space-y-4 shadow-sm"
              >
                <h3 className="font-serif text-lg font-medium text-stone-900">
                  {editingWorkId
                    ? `Edit Work: ${workForm.title}`
                    : 'Add New Work'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Title
                    </label>

                    <input
                      type="text"
                      required
                      value={workForm.title || ''}
                      onChange={(e) =>
                        setWorkForm({
                          ...workForm,
                          title: e.target.value
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Author
                    </label>

                    <input
                      type="text"
                      required
                      value={workForm.author || ''}
                      onChange={(e) =>
                        setWorkForm({
                          ...workForm,
                          author: e.target.value
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Series / Universe
                    </label>

                    <input
                      type="text"
                      value={workForm.universeSeries || ''}
                      onChange={(e) =>
                        setWorkForm({
                          ...workForm,
                          universeSeries: e.target.value
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Editorial Status
                    </label>

                    <input
                      type="text"
                      value={workForm.status || ''}
                      onChange={(e) =>
                        setWorkForm({
                          ...workForm,
                          status: e.target.value as WorkStatus
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900"
                      placeholder="e.g. Draft complete, In outline, In work"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Target Timeline
                    </label>

                    <input
                      type="text"
                      value={workForm.targetTimeline || ''}
                      onChange={(e) =>
                        setWorkForm({
                          ...workForm,
                          targetTimeline: e.target.value
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900"
                      placeholder="e.g. Target publication: 1st Quarter 2027"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                    Description (Preserve &apos;DESCRIPTION TO COME.&apos; if
                    not yet ready)
                  </label>

                  <textarea
                    rows={3}
                    value={workForm.description || ''}
                    onChange={(e) =>
                      setWorkForm({
                        ...workForm,
                        description: e.target.value
                      })
                    }
                    className="w-full bg-stone-50 border border-stone-300 p-2 text-sm font-sans text-stone-900"
                  />
                </div>

                <div className="flex items-center gap-4 pt-2 border-t border-stone-200">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-stone-900 text-stone-50 text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors inline-flex items-center gap-2 font-medium"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Work</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingWorkId(null);
                      setWorkForm({});
                    }}
                    className="px-4 py-2.5 border border-stone-300 text-stone-700 text-xs uppercase tracking-widest hover:bg-stone-100 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="bg-white border border-stone-200 divide-y divide-stone-200">
              {data.works.map((work) => (
                <div
                  key={work.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="text-[11px] uppercase tracking-widest text-stone-500 font-sans">
                      {work.universeSeries} · {work.author}
                    </div>

                    <h4 className="font-serif text-lg font-medium text-stone-900">
                      {work.title}
                    </h4>

                    <div className="text-xs text-stone-600 font-sans mt-0.5">
                      Status:{' '}
                      <span className="font-medium text-stone-800">
                        {work.status}
                      </span>

                      {work.targetTimeline &&
                        ` · ${work.targetTimeline}`}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() =>
                        updateWork(work.id, {
                          visibility: !work.visibility
                        })
                      }
                      className="p-1.5 border border-stone-300 text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-xs rounded"
                      title={work.visibility ? 'Hide' : 'Show'}
                    >
                      {work.visibility ? (
                        <Eye className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-stone-400" />
                      )}
                    </button>

                    <button
                      onClick={() => startEditWork(work)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-medium rounded"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `Delete work "${work.title}"?`
                          )
                        ) {
                          deleteWork(work.id);
                          showSaved(
                            `Deleted work: ${work.title}`
                          );
                        }
                      }}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded"
                      title="Delete work"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: SITE COPY & BRANDING */}
        {/* ========================================================================= */}
        {activeTab === 'sitecopy' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-medium text-stone-900">
                A to Z Site Details, Copy & Photography
              </h2>

              <p className="text-xs text-stone-600 font-sans mt-0.5">
                Edit headlines, literary quotes, hero colophons,
                photography, button labels, and section descriptions across
                all three websites.
              </p>
            </div>

            <div className="flex gap-2 border-b border-stone-300 pb-2 overflow-x-auto">
              <button
                type="button"
                onClick={() =>
                  setSiteCopySubTab('soundvolumes')
                }
                className={`px-4 py-2 text-xs font-sans font-medium transition-colors whitespace-nowrap ${
                  siteCopySubTab === 'soundvolumes'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                }`}
              >
                1. SoundVolumes.com (Imprint)
              </button>

              <button
                type="button"
                onClick={() => setSiteCopySubTab('alec')}
                className={`px-4 py-2 text-xs font-sans font-medium transition-colors whitespace-nowrap ${
                  siteCopySubTab === 'alec'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                }`}
              >
                2. AlecRowell.com (Author)
              </button>

              <button
                type="button"
                onClick={() =>
                  setSiteCopySubTab('laurie')
                }
                className={`px-4 py-2 text-xs font-sans font-medium transition-colors whitespace-nowrap ${
                  siteCopySubTab === 'laurie'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                }`}
              >
                3. LaurieFreeman.com (Writer)
              </button>
            </div>

            {/* SOUND VOLUMES COPY */}
            {siteCopySubTab === 'soundvolumes' && (
              <div className="bg-white border border-stone-300 p-6 sm:p-8 space-y-8 shadow-xs">
                <div className="border-b border-stone-200 pb-3">
                  <h3 className="font-serif text-xl font-medium text-stone-900">
                    Sound Volumes Imprint Identity & Homepage Copy
                  </h3>

                  <p className="text-xs text-stone-500 font-sans mt-0.5">
                    Controls the primary publishing imprint branding at
                    SoundVolumes.com.
                  </p>
                </div>

                <ImageUploadField
                  label="Custom Imprint Colophon / Logo Image"
                  value={
                    data.settings?.soundVolumesCopy
                      ?.heroLogoImage || ''
                  }
                  onChange={(url) =>
                    updateSoundVolumesCopy({
                      heroLogoImage: url
                    })
                  }
                  helperText="Upload a custom imprint emblem or logo (SVG/PNG/JPG). If cleared, the default geometric Colophon SVG is displayed."
                  recommendedSize="200 × 200 px (Square or SVG)"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Hero Title
                    </label>

                    <input
                      type="text"
                      value={
                        data.settings?.soundVolumesCopy
                          ?.heroTitle || 'Sound Volumes'
                      }
                      onChange={(e) =>
                        updateSoundVolumesCopy({
                          heroTitle: e.target.value
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900 font-serif"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Hero Subtitle / Tag
                    </label>

                    <input
                      type="text"
                      value={
                        data.settings?.soundVolumesCopy
                          ?.heroSubtitle || 'Publishing Imprint'
                      }
                      onChange={(e) =>
                        updateSoundVolumesCopy({
                          heroSubtitle: e.target.value
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                    Hero Literary Motto / Quote
                  </label>

                  <textarea
                    rows={2}
                    value={
                      data.settings?.soundVolumesCopy
                        ?.heroQuote || ''
                    }
                    onChange={(e) =>
                      updateSoundVolumesCopy({
                        heroQuote: e.target.value
                      })
                    }
                    className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900 font-serif italic"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Hero Primary CTA Button Label
                    </label>

                    <input
                      type="text"
                      value={
                        data.settings?.soundVolumesCopy
                          ?.heroPrimaryBtnText ||
                        'Browse Catalogue'
                      }
                      onChange={(e) =>
                        updateSoundVolumesCopy({
                          heroPrimaryBtnText: e.target.value
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Hero Secondary Button Label
                    </label>

                    <input
                      type="text"
                      value={
                        data.settings?.soundVolumesCopy
                          ?.heroSecondaryBtnText ||
                        'Authors & Voices'
                      }
                      onChange={(e) =>
                        updateSoundVolumesCopy({
                          heroSecondaryBtnText:
                            e.target.value
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900"
                    />
                  </div>
                </div>

                <div className="border-t border-stone-200 pt-6 space-y-4">
                  <h4 className="font-serif text-lg font-medium text-stone-900">
                    Catalogue Section Headings
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                        Catalogue Section Tag
                      </label>

                      <input
                        type="text"
                        value={
                          data.settings?.soundVolumesCopy
                            ?.catalogueSectionTag ||
                          'Primary Catalogue'
                        }
                        onChange={(e) =>
                          updateSoundVolumesCopy({
                            catalogueSectionTag:
                              e.target.value
                          })
                        }
                        className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                        Catalogue Section Title
                      </label>

                      <input
                        type="text"
                        value={
                          data.settings?.soundVolumesCopy
                            ?.catalogueSectionTitle ||
                          'Jack Comes Back Series'
                        }
                        onChange={(e) =>
                          updateSoundVolumesCopy({
                            catalogueSectionTitle:
                              e.target.value
                          })
                        }
                        className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Catalogue Section Description
                    </label>

                    <input
                      type="text"
                      value={
                        data.settings?.soundVolumesCopy
                          ?.catalogueSectionDescription || ''
                      }
                      onChange={(e) =>
                        updateSoundVolumesCopy({
                          catalogueSectionDescription:
                            e.target.value
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900 font-sans"
                    />
                  </div>
                </div>

                <div className="border-t border-stone-200 pt-6 space-y-4">
                  <h4 className="font-serif text-lg font-medium text-stone-900">
                    Footer & Imprint Colophon Copy
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                        Footer Copyright Text
                      </label>

                      <input
                        type="text"
                        value={
                          data.settings?.soundVolumesCopy
                            ?.footerCopyright || ''
                        }
                        onChange={(e) =>
                          updateSoundVolumesCopy({
                            footerCopyright:
                              e.target.value
                          })
                        }
                        className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                        Footer Imprint Note
                      </label>

                      <input
                        type="text"
                        value={
                          data.settings?.soundVolumesCopy
                            ?.footerImprintNote || ''
                        }
                        onChange={(e) =>
                          updateSoundVolumesCopy({
                            footerImprintNote:
                              e.target.value
                          })
                        }
                        className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ALEC COPY */}
            {siteCopySubTab === 'alec' && (
              <div className="bg-white border border-stone-300 p-6 sm:p-8 space-y-8 shadow-xs">
                <div className="border-b border-stone-200 pb-3">
                  <h3 className="font-serif text-xl font-medium text-stone-900">
                    Alec Rowell Author Details & Photography
                  </h3>

                  <p className="text-xs text-stone-500 font-sans mt-0.5">
                    Controls all copy, portraits, and section headers displayed
                    on AlecRowell.com.
                  </p>
                </div>

                <ImageUploadField
                  label="Alec Rowell Hero Portrait (Cowled Portrait)"
                  value={
                    data.settings?.alecCopy?.heroPhoto ||
                    '/images/alec-cowled.jpg'
                  }
                  onChange={(url) =>
                    updateAlecCopy({
                      heroPhoto: url
                    })
                  }
                  helperText="Primary photo featured prominently in the hero section of AlecRowell.com."
                  recommendedSize="600 × 800 px (3:4 ratio)"
                />

                <ImageUploadField
                  label="Alec Rowell About Page Portrait"
                  value={
                    data.settings?.alecCopy?.aboutPhoto ||
                    '/images/alec-forest.jpg'
                  }
                  onChange={(url) =>
                    updateAlecCopy({
                      aboutPhoto: url
                    })
                  }
                  helperText="Author photograph displayed on Alec Rowell's /about biography page."
                  recommendedSize="600 × 800 px (3:4 ratio)"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Brand Header Name
                    </label>

                    <input
                      type="text"
                      value={
                        data.settings?.alecCopy?.brandName ||
                        'Alec Rowell'
                      }
                      onChange={(e) =>
                        updateAlecCopy({
                          brandName: e.target.value
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900 font-serif"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Brand Subtitle
                    </label>

                    <input
                      type="text"
                      value={
                        data.settings?.alecCopy?.brandSubtitle ||
                        'Novelist & Researcher'
                      }
                      onChange={(e) =>
                        updateAlecCopy({
                          brandSubtitle: e.target.value
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                    Hero Philosophical / Aesthetic Quote
                  </label>

                  <textarea
                    rows={2}
                    value={
                      data.settings?.alecCopy?.heroQuote || ''
                    }
                    onChange={(e) =>
                      updateAlecCopy({
                        heroQuote: e.target.value
                      })
                    }
                    className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900 font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Primary CTA Button Text
                    </label>

                    <input
                      type="text"
                      value={
                        data.settings?.alecCopy
                          ?.heroPrimaryBtnText ||
                        'Explore Jack Comes Back'
                      }
                      onChange={(e) =>
                        updateAlecCopy({
                          heroPrimaryBtnText:
                            e.target.value
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Secondary CTA Button Text
                    </label>

                    <input
                      type="text"
                      value={
                        data.settings?.alecCopy
                          ?.heroSecondaryBtnText ||
                        'Forthcoming Work'
                      }
                      onChange={(e) =>
                        updateAlecCopy({
                          heroSecondaryBtnText:
                            e.target.value
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900"
                    />
                  </div>
                </div>

                <div className="border-t border-stone-200 pt-6 space-y-4">
                  <h4 className="font-serif text-lg font-medium text-stone-900">
                    Biography & Research Statement
                  </h4>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      About Alec Biography Text
                    </label>

                    <textarea
                      rows={4}
                      value={
                        data.settings?.alecCopy?.aboutBio || ''
                      }
                      onChange={(e) =>
                        updateAlecCopy({
                          aboutBio: e.target.value
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900 font-sans leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Active Research Statement
                    </label>

                    <textarea
                      rows={3}
                      value={
                        data.settings?.alecCopy
                          ?.aboutResearchStatement || ''
                      }
                      onChange={(e) =>
                        updateAlecCopy({
                          aboutResearchStatement:
                            e.target.value
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900 font-sans leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* LAURIE COPY */}
            {siteCopySubTab === 'laurie' && (
              <div className="bg-white border border-stone-300 p-6 sm:p-8 space-y-8 shadow-xs">
                <div className="border-b border-stone-200 pb-3">
                  <h3 className="font-serif text-xl font-medium text-stone-900">
                    Laurie Freeman Writer Details & Photography
                  </h3>

                  <p className="text-xs text-stone-500 font-sans mt-0.5">
                    Controls all copy, portraits, and section headers displayed
                    on LaurieFreeman.com.
                  </p>
                </div>

                <ImageUploadField
                  label="Laurie Freeman Hero Portrait"
                  value={
                    data.settings?.laurieCopy?.heroPhoto ||
                    '/images/laurie-portrait.jpg'
                  }
                  onChange={(url) =>
                    updateLaurieCopy({
                      heroPhoto: url
                    })
                  }
                  helperText="Primary author photograph featured in the hero header of LaurieFreeman.com."
                  recommendedSize="600 × 800 px (3:4 ratio)"
                />

                <ImageUploadField
                  label="Laurie Freeman About Page Portrait"
                  value={
                    data.settings?.laurieCopy?.aboutPhoto ||
                    '/images/laurie-portrait.jpg'
                  }
                  onChange={(url) =>
                    updateLaurieCopy({
                      aboutPhoto: url
                    })
                  }
                  helperText="Photograph displayed in Laurie Freeman's /about biography view."
                  recommendedSize="600 × 800 px (3:4 ratio)"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Brand Header Name
                    </label>

                    <input
                      type="text"
                      value={
                        data.settings?.laurieCopy?.brandName ||
                        'Laurie Freeman'
                      }
                      onChange={(e) =>
                        updateLaurieCopy({
                          brandName: e.target.value
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900 font-serif"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Brand Subtitle
                    </label>

                    <input
                      type="text"
                      value={
                        data.settings?.laurieCopy
                          ?.brandSubtitle ||
                        'Fiction & Nonfiction'
                      }
                      onChange={(e) =>
                        updateLaurieCopy({
                          brandSubtitle: e.target.value
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                    Hero Literary Motto / Quote
                  </label>

                  <textarea
                    rows={2}
                    value={
                      data.settings?.laurieCopy?.heroQuote || ''
                    }
                    onChange={(e) =>
                      updateLaurieCopy({
                        heroQuote: e.target.value
                      })
                    }
                    className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900 font-serif italic"
                  />
                </div>

                <div className="border-t border-stone-200 pt-6 space-y-4">
                  <h4 className="font-serif text-lg font-medium text-stone-900">
                    Biography & Micro-Orchard Horticultural Statement
                  </h4>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      About Laurie Biography Text
                    </label>

                    <textarea
                      rows={4}
                      value={
                        data.settings?.laurieCopy?.aboutBio || ''
                      }
                      onChange={(e) =>
                        updateLaurieCopy({
                          aboutBio: e.target.value
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900 font-sans leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Container Orchard & Horticultural Statement
                    </label>

                    <textarea
                      rows={3}
                      value={
                        data.settings?.laurieCopy
                          ?.aboutOrchardStatement || ''
                      }
                      onChange={(e) =>
                        updateLaurieCopy({
                          aboutOrchardStatement:
                            e.target.value
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900 font-sans leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: NEWS & DISPATCHES */}
        {/* ========================================================================= */}
        {activeTab === 'news' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-medium text-stone-900">
                  Manage News & Editorial Notes
                </h2>

                <p className="text-xs text-stone-600 font-sans mt-0.5">
                  Publish dispatches, Notes from the Editor, and toggle
                  Feature on Home.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingNewsId(null);
                  setNewsForm({
                    title: '',
                    category: 'Notes from the Editor',
                    date: new Date().toISOString().split('T')[0],
                    featureOnHome: true,
                    shortContent: '',
                    fullContent: '',
                    published: true
                  });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-stone-50 text-xs uppercase tracking-wider font-sans hover:bg-stone-800"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Dispatch</span>
              </button>
            </div>

            {(editingNewsId !== null ||
              newsForm.title !== undefined) && (
              <form
                onSubmit={handleSaveNews}
                className="bg-white border border-stone-300 p-6 sm:p-8 space-y-4 shadow-sm"
              >
                <h3 className="font-serif text-lg font-medium text-stone-900">
                  {editingNewsId
                    ? `Edit Dispatch: ${newsForm.title}`
                    : 'Compose New Dispatch'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Title
                    </label>

                    <input
                      type="text"
                      required
                      value={newsForm.title || ''}
                      onChange={(e) =>
                        setNewsForm({
                          ...newsForm,
                          title: e.target.value
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Date
                    </label>

                    <input
                      type="date"
                      value={newsForm.date || ''}
                      onChange={(e) =>
                        setNewsForm({
                          ...newsForm,
                          date: e.target.value
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm font-mono text-xs text-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                    Category
                  </label>

                  <select
                    value={
                      newsForm.category ||
                      'Notes from the Editor'
                    }
                    onChange={(e) =>
                      setNewsForm({
                        ...newsForm,
                        category: e.target.value as any
                      })
                    }
                    className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900"
                  >
                    <option value="Notes from the Editor">
                      Notes from the Editor
                    </option>
                    <option value="Publication Announcement">
                      Publication Announcement
                    </option>
                    <option value="Author Note">
                      Author Note
                    </option>
                    <option value="Catalog Update">
                      Catalog Update
                    </option>
                    <option value="Press">Press</option>
                  </select>
                </div>

                <ImageUploadField
                  label="Dispatch Featured Image (Optional)"
                  value={
                    (newsForm.images &&
                      newsForm.images[0]) ||
                    ''
                  }
                  onChange={(url) =>
                    setNewsForm({
                      ...newsForm,
                      images: url ? [url] : []
                    })
                  }
                  helperText="Optional artwork or photography for this editorial note."
                  recommendedSize="800 × 500 px"
                />

                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                    Short Summary (Displays on cards and teasers)
                  </label>

                  <textarea
                    rows={2}
                    value={newsForm.shortContent || ''}
                    onChange={(e) =>
                      setNewsForm({
                        ...newsForm,
                        shortContent: e.target.value
                      })
                    }
                    className="w-full bg-stone-50 border border-stone-300 p-2 text-sm font-sans text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                    Full Content
                  </label>

                  <textarea
                    rows={5}
                    value={newsForm.fullContent || ''}
                    onChange={(e) =>
                      setNewsForm({
                        ...newsForm,
                        fullContent: e.target.value
                      })
                    }
                    className="w-full bg-stone-50 border border-stone-300 p-2 text-sm font-sans text-stone-900 leading-relaxed"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="feature-home"
                    checked={newsForm.featureOnHome || false}
                    onChange={(e) =>
                      setNewsForm({
                        ...newsForm,
                        featureOnHome: e.target.checked
                      })
                    }
                    className="rounded"
                  />

                  <label
                    htmlFor="feature-home"
                    className="text-xs text-stone-700 font-sans"
                  >
                    Feature on Sound Volumes Homepage
                  </label>
                </div>

                <div className="flex items-center gap-4 pt-2 border-t border-stone-200">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-stone-900 text-stone-50 text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors inline-flex items-center gap-2 font-medium"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Dispatch</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingNewsId(null);
                      setNewsForm({});
                    }}
                    className="px-4 py-2.5 border border-stone-300 text-stone-700 text-xs uppercase tracking-widest hover:bg-stone-100 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="bg-white border border-stone-200 divide-y divide-stone-200 shadow-xs">
              {data.news.map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 font-sans">
                      <span>{item.category}</span>
                      <span>·</span>
                      <span>{item.date}</span>

                      {item.featureOnHome && (
                        <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[10px]">
                          Featured on Home
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif text-lg font-medium text-stone-900 mt-0.5">
                      {item.title}
                    </h4>

                    <p className="text-xs text-stone-600 line-clamp-1 mt-1">
                      {item.shortContent}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() =>
                        updateNews(item.id, {
                          featureOnHome: !item.featureOnHome
                        })
                      }
                      className="px-2.5 py-1 text-xs border border-stone-300 text-stone-700 hover:bg-stone-50 rounded"
                    >
                      {item.featureOnHome
                        ? 'Unfeature'
                        : 'Feature'}
                    </button>

                    <button
                      type="button"
                      onClick={() => startEditNews(item)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-medium rounded"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (
                          confirm(
                            `Delete dispatch "${item.title}"?`
                          )
                        ) {
                          deleteNews(item.id);
                          showSaved(
                            `Deleted dispatch: ${item.title}`
                          );
                        }
                      }}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded"
                      title="Delete dispatch"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: EVENTS & COLLOQUIA */}
        {/* ========================================================================= */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-medium text-stone-900">
                  Events, Symposia & Colloquia
                </h2>

                <p className="text-xs text-stone-600 font-sans mt-0.5">
                  Schedule readings, author symposiums, and independent
                  publishing conference appearances.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingEventId(null);
                  setEventForm({
                    title: '',
                    date: new Date().toISOString().split('T')[0],
                    time: '7:00 PM CST',
                    location: 'Austin, Texas',
                    description: '',
                    isUpcoming: true,
                    published: true
                  });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-stone-50 text-xs uppercase tracking-wider font-sans hover:bg-stone-800"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Event</span>
              </button>
            </div>

            {(editingEventId !== null ||
              eventForm.title !== undefined) && (
              <form
                onSubmit={handleSaveEvent}
                className="bg-white border border-stone-300 p-6 sm:p-8 space-y-4 shadow-sm"
              >
                <h3 className="font-serif text-lg font-medium text-stone-900">
                  {editingEventId
                    ? `Edit Event: ${eventForm.title}`
                    : 'Schedule New Event'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Event Title
                    </label>

                    <input
                      type="text"
                      required
                      value={eventForm.title || ''}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          title: e.target.value
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Date
                    </label>

                    <input
                      type="date"
                      value={eventForm.date || ''}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          date: e.target.value
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm font-mono text-xs text-stone-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Time & Timezone
                    </label>

                    <input
                      type="text"
                      value={eventForm.time || ''}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          time: e.target.value
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900"
                      placeholder="e.g. 7:00 PM CST"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Location / Venue
                    </label>

                    <input
                      type="text"
                      value={eventForm.location || ''}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          location: e.target.value
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900"
                      placeholder="e.g. Hyde Park Colloquium Hall, Austin, TX"
                    />
                  </div>
                </div>

                <ImageUploadField
                  label="Event Poster / Artwork"
                  value={eventForm.image || ''}
                  onChange={(url) =>
                    setEventForm({
                      ...eventForm,
                      image: url
                    })
                  }
                  helperText="Optional venue photograph or event banner."
                  recommendedSize="800 × 500 px"
                />

                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                    Event Description
                  </label>

                  <textarea
                    rows={4}
                    value={eventForm.description || ''}
                    onChange={(e) =>
                      setEventForm({
                        ...eventForm,
                        description: e.target.value
                      })
                    }
                    className="w-full bg-stone-50 border border-stone-300 p-2 text-sm font-sans text-stone-900 leading-relaxed"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs text-stone-700 font-sans cursor-pointer">
                    <input
                      type="checkbox"
                      checked={
                        eventForm.isUpcoming !== undefined
                          ? eventForm.isUpcoming
                          : true
                      }
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          isUpcoming: e.target.checked
                        })
                      }
                      className="rounded"
                    />

                    <span>Mark as Upcoming Event</span>
                  </label>
                </div>

                <div className="flex items-center gap-4 pt-2 border-t border-stone-200">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-stone-900 text-stone-50 text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors inline-flex items-center gap-2 font-medium"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Event</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingEventId(null);
                      setEventForm({});
                    }}
                    className="px-4 py-2.5 border border-stone-300 text-stone-700 text-xs uppercase tracking-widest hover:bg-stone-100 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="bg-white border border-stone-200 divide-y divide-stone-200 shadow-xs">
              {data.events.map((evt) => (
                <div
                  key={evt.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 font-sans">
                      <span className="font-medium text-stone-800">
                        {evt.date}
                      </span>

                      <span>·</span>

                      <span>{evt.location}</span>

                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded ${
                          evt.isUpcoming
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {evt.isUpcoming ? 'Upcoming' : 'Past'}
                      </span>
                    </div>

                    <h4 className="font-serif text-lg font-medium text-stone-900 mt-0.5">
                      {evt.title}
                    </h4>

                    <p className="text-xs text-stone-600 line-clamp-1 mt-1">
                      {evt.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() =>
                        updateEvent(evt.id, {
                          isUpcoming: !evt.isUpcoming
                        })
                      }
                      className="px-2.5 py-1 text-xs border border-stone-300 text-stone-700 hover:bg-stone-50 rounded"
                    >
                      {evt.isUpcoming
                        ? 'Move to Past'
                        : 'Mark Upcoming'}
                    </button>

                    <button
                      type="button"
                      onClick={() => startEditEvent(evt)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-medium rounded"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (
                          confirm(
                            `Delete event "${evt.title}"?`
                          )
                        ) {
                          deleteEvent(evt.id);
                          showSaved(
                            `Deleted event: ${evt.title}`
                          );
                        }
                      }}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded"
                      title="Delete event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: EXTRAS & READER OFFER */}
        {/* ========================================================================= */}
        {activeTab === 'extras' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-medium text-stone-900">
                  Character Cards & Reader Extras
                </h2>

                <p className="text-xs text-stone-600 font-sans mt-0.5">
                  Manage the 5 × 8 inch printable Character Cards, artwork
                  folios, and email delivery settings.
                </p>
              </div>
            </div>

            {data.extras.map((extra) => (
              <div
                key={extra.id}
                className="bg-white border border-stone-300 p-6 sm:p-8 space-y-6 shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-stone-500 font-sans block">
                      Associated Property: {extra.associatedProperty}
                    </span>

                    <h3 className="font-serif text-xl font-medium text-stone-900">
                      {extra.title}
                    </h3>
                  </div>

                  <span
                    className={`text-xs px-2.5 py-0.5 rounded font-medium ${
                      extra.visibility
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {extra.visibility
                      ? 'Active Reader Offer'
                      : 'Hidden'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Offer Title
                    </label>

                    <input
                      type="text"
                      value={extra.title}
                      onChange={(e) =>
                        updateExtra(extra.id, {
                          title: e.target.value
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                      Associated Series
                    </label>

                    <input
                      type="text"
                      value={extra.associatedProperty}
                      onChange={(e) =>
                        updateExtra(extra.id, {
                          associatedProperty:
                            e.target.value
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900"
                    />
                  </div>
                </div>

                <ImageUploadField
                  label="Offer Artwork / Banner"
                  value={extra.artwork || ''}
                  onChange={(url) =>
                    updateExtra(extra.id, {
                      artwork: url
                    })
                  }
                  helperText="Primary preview specimen for this extra offer."
                  recommendedSize="800 × 500 px"
                />

                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium mb-1">
                    Editorial Description
                  </label>

                  <textarea
                    rows={3}
                    value={extra.description}
                    onChange={(e) =>
                      updateExtra(extra.id, {
                        description: e.target.value
                      })
                    }
                    className="w-full bg-stone-50 border border-stone-300 p-2 text-sm text-stone-900 font-sans"
                  />
                </div>

                {extra.details?.previewCards && (
                  <div className="border-t border-stone-200 pt-6 space-y-4">
                    <h4 className="font-serif text-lg font-medium text-stone-900">
                      Printable Character Cards (
                      {extra.details.previewCards.length} specimens)
                    </h4>

                    <p className="text-xs text-stone-500 font-sans">
                      Upload individual 5 × 8 card illustrations and
                      update preview quotes for each historical incarnation.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {extra.details.previewCards.map(
                        (card, idx) => (
                          <div
                            key={idx}
                            className="border border-stone-200 bg-stone-50/70 p-4 rounded space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-serif font-medium text-stone-900 text-sm">
                                Card {idx + 1}:{' '}
                                {card.characterName}
                              </span>
                            </div>

                            <ImageUploadField
                              label={`${card.characterName} Artwork`}
                              value={card.image || ''}
                              onChange={(url) => {
                                const updatedCards = [
                                  ...(extra.details
                                    ?.previewCards || [])
                                ];

                                updatedCards[idx] = {
                                  ...updatedCards[idx],
                                  image: url
                                };

                                updateExtra(extra.id, {
                                  details: {
                                    formatSpec:
                                      extra.details
                                        ?.formatSpec ||
                                      '5 × 8 inches',
                                    contents:
                                      extra.details
                                        ?.contents ||
                                      'Character graphic and paragraph',
                                    previewCards:
                                      updatedCards
                                  }
                                });

                                showSaved(
                                  `Updated ${card.characterName} card image`
                                );
                              }}
                              recommendedSize="500 × 800 px (5:8 ratio)"
                            />

                            <div>
                              <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-sans mb-1">
                                Character Name
                              </label>

                              <input
                                type="text"
                                value={card.characterName}
                                onChange={(e) => {
                                  const updatedCards = [
                                    ...(extra.details
                                      ?.previewCards || [])
                                  ];

                                  updatedCards[idx] = {
                                    ...updatedCards[idx],
                                    characterName:
                                      e.target.value
                                  };

                                  updateExtra(extra.id, {
                                    details: {
                                      formatSpec:
                                        extra.details
                                          ?.formatSpec ||
                                        '5 × 8 inches',
                                      contents:
                                        extra.details
                                          ?.contents ||
                                        'Character graphic and paragraph',
                                      previewCards:
                                        updatedCards
                                    }
                                  });
                                }}
                                className="w-full bg-white border border-stone-300 p-1.5 text-xs text-stone-900"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-sans mb-1">
                                Preview Excerpt
                              </label>

                              <textarea
                                rows={2}
                                value={card.previewExcerpt}
                                onChange={(e) => {
                                  const updatedCards = [
                                    ...(extra.details
                                      ?.previewCards || [])
                                  ];

                                  updatedCards[idx] = {
                                    ...updatedCards[idx],
                                    previewExcerpt:
                                      e.target.value
                                  };

                                  updateExtra(extra.id, {
                                    details: {
                                      formatSpec:
                                        extra.details
                                          ?.formatSpec ||
                                        '5 × 8 inches',
                                      contents:
                                        extra.details
                                          ?.contents ||
                                        'Character graphic and paragraph',
                                      previewCards:
                                        updatedCards
                                    }
                                  });
                                }}
                                className="w-full bg-white border border-stone-300 p-1.5 text-xs text-stone-900 font-serif italic"
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 9: ANNOUNCEMENT STRIPS */}
        {/* ========================================================================= */}
        {activeTab === 'announcements' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-medium text-stone-900">
                Announcement Strips Governance
              </h2>

              <p className="text-xs text-stone-600 font-sans mt-0.5">
                Thin, restrained notification bars at the top of each website.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(
                ['soundvolumes', 'alec', 'laurie'] as const
              ).map((siteKey) => {
                const ann =
                  data.settings.announcements[siteKey];

                const siteName =
                  siteKey === 'soundvolumes'
                    ? 'SoundVolumes.com'
                    : siteKey === 'alec'
                    ? 'AlecRowell.com'
                    : 'LaurieFreeman.com';

                return (
                  <div
                    key={siteKey}
                    className="bg-white border border-stone-200 p-5 flex flex-col justify-between shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-serif text-lg font-medium text-stone-900">
                          {siteName}
                        </h4>

                        <span
                          className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-medium ${
                            ann.visibility
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-100 text-stone-500'
                          }`}
                        >
                          {ann.visibility ? 'Active' : 'Dormant'}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">
                            Announcement Text
                          </label>

                          <textarea
                            rows={3}
                            value={ann.text}
                            onChange={(e) =>
                              updateAnnouncement(
                                siteKey,
                                {
                                  text: e.target.value
                                }
                              )
                            }
                            className="w-full bg-stone-50 border border-stone-300 p-2 text-xs font-sans text-stone-900"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">
                            Destination Link
                          </label>

                          <input
                            type="text"
                            value={ann.destination}
                            onChange={(e) =>
                              updateAnnouncement(
                                siteKey,
                                {
                                  destination:
                                    e.target.value
                                }
                              )
                            }
                            className="w-full bg-stone-50 border border-stone-300 p-2 text-xs font-sans text-stone-900"
                            placeholder="/books"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          updateAnnouncement(
                            siteKey,
                            {
                              visibility: !ann.visibility
                            }
                          );

                          showSaved(
                            `Updated ${siteName} announcement visibility`
                          );
                        }}
                        className={`text-xs px-3 py-1.5 font-medium transition-colors rounded ${
                          ann.visibility
                            ? 'bg-stone-200 text-stone-800 hover:bg-stone-300'
                            : 'bg-stone-900 text-stone-50 hover:bg-stone-800'
                        }`}
                      >
                        {ann.visibility
                          ? 'Make Dormant'
                          : 'Enable Strip'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 10: CONTACT ROUTING */}
        {/* ========================================================================= */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-medium text-stone-900">
                Central Contact Routing Rules
              </h2>

              <p className="text-xs text-stone-600 font-sans mt-0.5">
                Configure destination mailboxes for inquiries received through
                the centralized contact desk.
              </p>
            </div>

            <div className="bg-white border border-stone-200 divide-y divide-stone-200 shadow-xs">
              {data.settings.contactRouting.map(
                (rule, idx) => (
                  <div
                    key={rule.key}
                    className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center"
                  >
                    <div className="sm:col-span-4">
                      <div className="font-serif text-base font-medium text-stone-900">
                        {rule.label}
                      </div>

                      <div className="text-[11px] text-stone-500 font-sans">
                        {rule.description}
                      </div>
                    </div>

                    <div className="sm:col-span-5">
                      <input
                        type="email"
                        value={rule.email}
                        onChange={(e) => {
                          const updated = [
                            ...data.settings.contactRouting
                          ];

                          updated[idx].email =
                            e.target.value;

                          updateSettings({
                            contactRouting: updated
                          });

                          showSaved(
                            `Updated routing for ${rule.label}`
                          );
                        }}
                        className="w-full bg-stone-50 border border-stone-300 px-3 py-1.5 text-xs font-mono text-stone-800"
                      />
                    </div>

                    <div className="sm:col-span-3 text-right">
                      <span className="text-[11px] text-stone-400 font-mono">
                        key: {rule.key}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 11: ADMIN PASSWORD & SECURITY */}
        {/* ========================================================================= */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <AdminSecurityTab
              initialEmail={currentAdminEmail}
              onCredentialsUpdated={(newEmail) => {
                setCurrentAdminEmail(newEmail);
                showSaved(
                  'Admin login credentials updated permanently'
                );
              }}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 12: BACKUP, RESTORE & BATCH ONE RESET */}
        {/* ========================================================================= */}
        {activeTab === 'system' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="font-serif text-2xl font-medium text-stone-900">
                CMS Backup, Export & Factory Reset
              </h2>

              <p className="text-xs text-stone-600 font-sans mt-0.5">
                Export your current website content as a portable JSON file,
                restore a backup, or reset to the original Client Batch One
                packet.
              </p>
            </div>

            <div className="bg-white border border-stone-200 p-6 space-y-4 shadow-xs">
              <h3 className="font-serif text-lg font-medium text-stone-900">
                Export CMS Snapshot
              </h3>

              <p className="text-xs text-stone-600 font-sans">
                Download a clean, structured JSON file containing all books,
                authors, works, news, and site settings.
              </p>

              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-stone-50 text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Content Snapshot (JSON)</span>
              </button>
            </div>

            <div className="bg-white border border-stone-200 p-6 space-y-4 shadow-xs">
              <h3 className="font-serif text-lg font-medium text-stone-900">
                Restore / Import JSON Snapshot
              </h3>

              <p className="text-xs text-stone-600 font-sans">
                Paste JSON content to immediately apply snapshot data across
                all three websites.
              </p>

              <textarea
                rows={4}
                value={jsonInput}
                onChange={(e) =>
                  setJsonInput(e.target.value)
                }
                placeholder="Paste valid CMS JSON string here..."
                className="w-full bg-stone-50 border border-stone-300 p-2 text-xs font-mono text-stone-900"
              />

              {importStatus && (
                <div className="text-xs text-stone-600 font-sans">
                  {importStatus}
                </div>
              )}

              <button
                onClick={handleImport}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-stone-800 text-stone-900 text-xs uppercase tracking-widest hover:bg-stone-100 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Apply Imported Snapshot</span>
              </button>
            </div>

            <div className="bg-stone-50 border border-rose-200 p-6 space-y-4 shadow-xs">
              <h3 className="font-serif text-lg font-medium text-rose-900">
                Reset to Batch One Client Packet
              </h3>

              <p className="text-xs text-stone-600 font-sans">
                Revert all books, biographies, project descriptions, and
                settings to the exact frozen Batch One materials supplied by
                the client.
              </p>

              <button
                onClick={() => {
                  if (
                    confirm(
                      'Are you sure you want to reset all CMS content to the Client Batch One materials?'
                    )
                  ) {
                    resetToDefaults();
                    showSaved(
                      'Reset to Batch One Client Packet complete'
                    );
                  }
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-800 hover:bg-rose-900 text-white text-xs uppercase tracking-widest transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset to Batch One Client Packet</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}