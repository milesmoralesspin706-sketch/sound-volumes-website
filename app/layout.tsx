import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#f6f3eb'
};

export const metadata: Metadata = {
  title: 'Sound Volumes — Literary Publishing Imprint & Author System',
  description:
    'Sound Volumes publishing imprint, featuring authors Alec Rowell and Laurie Freeman, the Jack Comes Back series, Robin Pike Mysteries, and Sixer Diaspora Universe.',
  openGraph: {
    title: 'Sound Volumes — Literary Publishing Imprint & Author System',
    description:
      'Sound Volumes publishing imprint, featuring authors Alec Rowell and Laurie Freeman, the Jack Comes Back series, Robin Pike Mysteries, and Sixer Diaspora Universe.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sound Volumes — Literary Publishing Imprint & Author System',
    description:
      'Sound Volumes publishing imprint, featuring authors Alec Rowell and Laurie Freeman, the Jack Comes Back series, Robin Pike Mysteries, and Sixer Diaspora Universe.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-[#f6f3eb] text-[#1c1917] antialiased selection:bg-[#ded7c6] selection:text-[#191614]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

