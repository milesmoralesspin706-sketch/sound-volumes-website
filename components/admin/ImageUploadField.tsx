'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Upload, Link as LinkIcon, Image as ImageIcon, Check, X, RefreshCw } from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  helperText?: string;
  recommendedSize?: string;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  helperText,
  recommendedSize
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'upload' | 'url' | 'library'>('upload');
  const [libraryImages, setLibraryImages] = useState<string[]>([]);
  const [showLibrary, setShowLibrary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load library images on demand
  useEffect(() => {
    if (showLibrary && libraryImages.length === 0) {
      fetch('/api/admin/upload-image')
        .then((res) => res.json())
        .then((data) => {
          const all = [...(data.uploadedImages || []), ...(data.libraryImages || [])];
          setLibraryImages(Array.from(new Set(all)));
        })
        .catch(() => {
          // fallback to common presets
          setLibraryImages([
            '/images/stone-dog.jpg',
            '/images/iron-dog.jpg',
            '/images/gold-dog.jpg',
            '/images/steel-dog.jpg',
            '/images/alec-cowled.jpg',
            '/images/alec-forest.jpg',
            '/images/alec-hen.jpg',
            '/images/laurie-portrait.jpg',
            '/images/character-card.jpg'
          ]);
        });
    }
  }, [showLibrary, libraryImages.length]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WEBP, SVG, or GIF).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10MB.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload image.');
      }

      onChange(data.url);
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      setError(message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs uppercase tracking-widest text-stone-700 font-sans font-medium">
          {label}
        </label>
        {recommendedSize && (
          <span className="text-[10px] text-stone-500 font-mono">
            Rec: {recommendedSize}
          </span>
        )}
      </div>

      {helperText && (
        <p className="text-[11px] text-stone-500 font-sans leading-tight">
          {helperText}
        </p>
      )}

      {/* Main Container: Preview + Controls */}
      <div className="p-3 bg-stone-50 border border-stone-300 rounded-sm space-y-3">
        <div className="flex items-start gap-4">
          {/* Thumbnail Preview */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-stone-200 border border-stone-300 rounded overflow-hidden shrink-0 flex items-center justify-center">
            {value ? (
              <>
                <Image
                  src={value}
                  alt={label}
                  fill
                  sizes="120px"
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => onChange('')}
                  title="Remove image"
                  className="absolute top-1 right-1 p-1 bg-stone-900/80 hover:bg-stone-900 text-white rounded-full transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </>
            ) : (
              <div className="text-center p-2 text-stone-400">
                <ImageIcon className="w-6 h-6 mx-auto mb-1 stroke-1" />
                <span className="text-[9px] uppercase tracking-wider block font-sans">No Image</span>
              </div>
            )}
          </div>

          {/* Action buttons & mode tabs */}
          <div className="flex-1 space-y-2.5">
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setMode('upload')}
                className={`px-2.5 py-1 rounded text-xs font-sans transition-colors flex items-center gap-1 ${
                  mode === 'upload'
                    ? 'bg-stone-900 text-stone-50 font-medium'
                    : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <Upload className="w-3 h-3" />
                <span>Upload New</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('url')}
                className={`px-2.5 py-1 rounded text-xs font-sans transition-colors flex items-center gap-1 ${
                  mode === 'url'
                    ? 'bg-stone-900 text-stone-50 font-medium'
                    : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <LinkIcon className="w-3 h-3" />
                <span>Image URL</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('library');
                  setShowLibrary(true);
                }}
                className={`px-2.5 py-1 rounded text-xs font-sans transition-colors flex items-center gap-1 ${
                  mode === 'library'
                    ? 'bg-stone-900 text-stone-50 font-medium'
                    : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <ImageIcon className="w-3 h-3" />
                <span>Imprint Library</span>
              </button>
            </div>

            {/* Sub-Panel: Upload */}
            {mode === 'upload' && (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,image/gif"
                  className="hidden"
                  id={`file-input-${label.replace(/\s+/g, '-').toLowerCase()}`}
                />
                <label
                  htmlFor={`file-input-${label.replace(/\s+/g, '-').toLowerCase()}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 rounded text-xs font-sans font-medium cursor-pointer transition-colors"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-700" />
                      <span>Uploading image...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>{value ? 'Replace with New Image File' : 'Choose Image File to Upload'}</span>
                    </>
                  )}
                </label>
                <span className="block text-[10px] text-stone-500 font-sans mt-1">
                  Supports JPG, PNG, WEBP, SVG (max 10MB). Automatically stored in server uploads.
                </span>
              </div>
            )}

            {/* Sub-Panel: URL */}
            {mode === 'url' && (
              <div className="space-y-1">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="/images/example.jpg or https://..."
                  className="w-full bg-white border border-stone-300 px-2.5 py-1.5 text-xs text-stone-900 font-mono focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
                <span className="block text-[10px] text-stone-500 font-sans">
                  Enter local path (e.g. /images/stone-dog.jpg) or external HTTPS URL.
                </span>
              </div>
            )}

            {/* Sub-Panel: Library Select */}
            {mode === 'library' && (
              <div>
                <button
                  type="button"
                  onClick={() => setShowLibrary(!showLibrary)}
                  className="text-xs text-stone-700 underline font-sans flex items-center gap-1"
                >
                  <span>Select from available images ({libraryImages.length} items)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Library Drawer */}
        {showLibrary && mode === 'library' && (
          <div className="pt-2 border-t border-stone-200">
            <div className="text-[11px] font-sans text-stone-500 mb-2 font-medium">
              Click an image below to select it:
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1 bg-white border border-stone-200 rounded">
              {libraryImages.map((imgPath) => {
                const isSelected = value === imgPath;
                return (
                  <button
                    key={imgPath}
                    type="button"
                    onClick={() => {
                      onChange(imgPath);
                    }}
                    className={`relative aspect-square border rounded overflow-hidden p-0.5 transition-all text-left group ${
                      isSelected
                        ? 'ring-2 ring-stone-900 border-transparent shadow-xs'
                        : 'border-stone-200 hover:border-stone-500'
                    }`}
                  >
                    <Image
                      src={imgPath}
                      alt={imgPath}
                      fill
                      sizes="60px"
                      referrerPolicy="no-referrer"
                      className="object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-stone-900/40 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="p-2 bg-rose-50 border border-rose-300 text-rose-800 text-xs font-sans rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
