export type SiteId = 'soundvolumes' | 'alec' | 'laurie' | 'admin';

export type BookFormat = 'Paperback' | 'Hardcover' | 'E-book' | 'Audiobook' | 'Omnibus Edition';

export interface Book {
  id: string;
  title: string;
  slug: string;
  author: string;
  authorSlug: string;
  cover: string;
  shortDescription: string;
  microDescription: string;
  longDescription: string;
  buyUrl: string;
  publicationInfo: string;
  format: BookFormat;
  images?: string[];
  links?: { label: string; url: string }[];
  audio?: { title: string; url?: string; duration?: string; sampleAvailable: boolean };
  visibility: boolean;
  ordering: number;
  series?: string;
  seriesOrder?: number;
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  shortBio: string;
  fullBio: string;
  photographPrimary: string;
  photographSecondary?: string;
  photographThird?: string;
  website: string;
  selectedWorks: string[];
  visibility: boolean;
  ordering: number;
}

export type WorkStatus = 
  | 'Draft complete'
  | 'In outline'
  | 'In outline/early draft'
  | 'Complete, unpublished'
  | 'Complete first draft'
  | 'Complete but subject to a complete rewrite'
  | 'In work'
  | 'In development'
  | 'In Progress'
  | 'In Revision'
  | 'In Final Preparation'
  | 'Published';

export interface Work {
  id: string;
  title: string;
  slug: string;
  author: string;
  authorSlug: string;
  typeForm: string; // e.g. "Novel", "Novella", "Nonfiction", "Memoir / Personal Essays"
  universeSeries: string; // e.g. "Robin Pike / Hyde, Texas Mysteries", "Sixer Diaspora Universe"
  description: string; // May be "DESCRIPTION TO COME."
  status: WorkStatus;
  targetTimeline?: string; // e.g. "Target publication: 1st Quarter 2027", "Likely 2028 release", "Possibly 2027"
  coAuthor?: string;
  actionLinks?: { label: string; url: string }[];
  visibility: boolean;
  ordering: number;
  siteVisibility: {
    soundvolumes: boolean;
    alec: boolean;
    laurie: boolean;
  };
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  date: string;
  category: 'Notes from the Editor' | 'Publication Announcement' | 'Author Note' | 'Catalog Update' | 'Press';
  shortContent: string;
  fullContent: string;
  images?: string[];
  links?: { label: string; url: string }[];
  featureOnHome: boolean;
  archived: boolean;
  published: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  date: string;
  time?: string;
  location: string;
  description: string;
  image?: string;
  externalLink?: string;
  isUpcoming: boolean;
  archived: boolean;
  published: boolean;
}

export interface ArtworkRecord {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  description?: string;
  additionalInfo?: string;
  associatedBookId?: string; // Optional book association (unassigned if empty)
  associatedBookTitle?: string;
  visibility: boolean;
  ordering: number;
  tags?: string[];
  archived?: boolean;
}

export interface ExtraItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  artwork: string;
  associatedProperty: string; // e.g. "Jack Comes Back"
  emailGated: boolean;
  downloadDestination: string;
  mailingListProvider: string;
  featured: boolean;
  visibility: boolean;
  details?: {
    formatSpec: string; // "Each card is designed to print at 5 × 8 inches."
    contents: string; // "one character graphic and a paragraph of text"
    previewCards: {
      characterName: string;
      previewExcerpt: string;
      image: string;
    }[];
  };
}

export interface Announcement {
  id: string;
  siteId: 'soundvolumes' | 'alec' | 'laurie';
  text: string;
  destination: string;
  visibility: boolean;
}

export interface ContactRoutingRule {
  key: string;
  label: string;
  email: string;
  description: string;
}

export interface SoundVolumesSiteCopy {
  heroTitle: string;
  heroSubtitle: string;
  heroQuote: string;
  heroPrimaryBtnText: string;
  heroSecondaryBtnText: string;
  heroLogoImage?: string; // Optional custom logo image (replaces default SVG colophon if specified)
  catalogueSectionTag: string;
  catalogueSectionTitle: string;
  catalogueSectionDescription: string;
  authorsSectionTag: string;
  authorsSectionTitle: string;
  authorsSectionDescription: string;
  cataloguePageTitle: string;
  cataloguePageDescription: string;
  authorsPageTitle: string;
  authorsPageDescription: string;
  eventsPageTitle: string;
  eventsPageDescription: string;
  extrasPageTitle: string;
  extrasPageDescription: string;
  contactPageTitle: string;
  contactPageDescription: string;
  footerTagline: string;
  footerCopyright: string;
  footerImprintNote: string;
}

export interface AlecSiteCopy {
  brandName: string;
  brandSubtitle: string;
  heroTitle: string;
  heroSubtitle: string;
  heroQuote: string;
  heroPhoto: string;
  heroPrimaryBtnText: string;
  heroSecondaryBtnText: string;
  booksSectionTitle: string;
  booksSectionDescription: string;
  workSectionTitle: string;
  workSectionDescription: string;
  robinPikeTitle: string;
  robinPikeDescription: string;
  sduTitle: string;
  sduDescription: string;
  memoirTitle: string;
  memoirDescription: string;
  aboutTitle: string;
  aboutBio: string;
  aboutPhoto: string;
  aboutResearchStatement: string;
  contactTitle: string;
  contactDescription: string;
}

export interface LaurieSiteCopy {
  brandName: string;
  brandSubtitle: string;
  heroTitle: string;
  heroSubtitle: string;
  heroQuote: string;
  heroPhoto: string;
  heroPrimaryBtnText: string;
  heroSecondaryBtnText: string;
  workSectionTitle: string;
  workSectionDescription: string;
  sduTitle: string;
  sduDescription: string;
  fictionTitle: string;
  fictionDescription: string;
  nonfictionTitle: string;
  nonfictionDescription: string;
  aboutTitle: string;
  aboutBio: string;
  aboutPhoto: string;
  aboutOrchardStatement: string;
  contactTitle: string;
  contactDescription: string;
}

export interface SiteSettings {
  contactRouting: ContactRoutingRule[];
  announcements: Record<'soundvolumes' | 'alec' | 'laurie', Announcement>;
  soundVolumesTagline: string;
  alecSiteActiveAnnouncement: boolean;
  laurieSiteDormantReadFree: boolean;
  showJackOmnibusOnHome: boolean;
  soundVolumesCopy: SoundVolumesSiteCopy;
  alecCopy: AlecSiteCopy;
  laurieCopy: LaurieSiteCopy;
}

export interface CMSData {
  books: Book[];
  authors: Author[];
  works: Work[];
  news: NewsItem[];
  events: EventItem[];
  extras: ExtraItem[];
  artworks: ArtworkRecord[];
  settings: SiteSettings;
}
