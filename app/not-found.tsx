import Link from 'next/link';
import { Colophon } from '@/components/common/Colophon';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#faf9f5] px-4 py-16">
      <div className="max-w-md w-full text-center border border-stone-200 bg-white p-8 sm:p-12 shadow-xs">
        <div className="inline-flex items-center justify-center mb-6">
          <Colophon size={36} className="text-stone-800" />
        </div>
        <div className="text-[11px] uppercase tracking-widest text-stone-500 font-sans mb-2">
          Folio Missing · 404
        </div>
        <h1 className="font-serif text-3xl text-stone-900 font-medium mb-3">
          Volume Not Found
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed mb-8">
          The requested page or catalogue item does not exist at this location. It may have been archived or repositioned in the publishing record.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs uppercase tracking-widest font-sans font-medium transition-colors"
        >
          Return to Imprint Home
        </Link>
      </div>
    </main>
  );
}
