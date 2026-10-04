import React from 'react';
import { Work } from '@/lib/types';
import { StatusMetadata } from '../common/StatusMetadata';

interface WorkCardProps {
  work: Work;
}

export function WorkCard({ work }: WorkCardProps) {
  const isPlaceholderDescription = work.description === 'DESCRIPTION TO COME.' || !work.description;

  return (
    <div className="bg-[#fcfbf8] border border-[#ddd5c7] hover:border-[#baa794] transition-all p-4 sm:p-5 lg:p-6 flex flex-col justify-between h-full shadow-2xs">
      <div>
        {/* Category / Universe / Series */}
        <div className="flex items-center justify-between gap-2 text-[11px] uppercase tracking-widest text-[#736b62] font-sans mb-1.5">
          <span>{work.universeSeries}</span>
          <span className="text-[#8c847a] font-serif italic lowercase">{work.typeForm}</span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-xl sm:text-2xl text-[#1c1917] font-medium tracking-tight mb-1 break-words">
          {work.title}
        </h3>

        {/* Co-author if applicable */}
        {work.coAuthor && (
          <p className="text-xs text-[#736b62] font-sans mb-3">
            In collaboration with {work.coAuthor}
          </p>
        )}

        {/* Subdued Editorial Status Metadata */}
        <div className="mb-4 pt-1">
          <StatusMetadata status={work.status} timeline={work.targetTimeline} />
        </div>

        {/* Description or intentional placeholder */}
        {isPlaceholderDescription ? (
          <div className="text-xs text-[#8c847a] italic font-serif py-2 border-l border-[#dcd4c4] pl-3">
            Description to come.
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-[#453f38] leading-relaxed font-sans">
            {work.description}
          </p>
        )}
      </div>

      {work.actionLinks && work.actionLinks.length > 0 && (
        <div className="pt-4 mt-4 border-t border-[#eae3d5] flex flex-wrap gap-3">
          {work.actionLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              className="text-xs uppercase tracking-wider text-[#1c1917] hover:text-[#944222] underline underline-offset-4 py-1"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
