import { useMemo } from 'react';
import Image from "next/image";

export default function PolaroidPhoto({ src, alt, caption, url }) {

  const tilt = useMemo(() => {
    const tilts = ['-rotate-3', '-rotate-2', '-rotate-1', 'rotate-0', 'rotate-1', 'rotate-2', 'rotate-3'];
    const randomIndex = Math.floor(Math.random() * tilts.length);
    return tilts[randomIndex];
  }, []);

  return (
    <div 
      className={`cursor-pointer bg-white shadow-lg border border-gray-200 rounded-sm p-2 pb-6 w-full max-w-xs text-center transform transition-transform duration-300 hover:scale-105 hover:rotate-0 ${tilt}`}
      onClick={(e) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
        e.preventDefault();
      }}>
      <div className="relative aspect-square w-full overflow-hidden rounded-sm">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover brightness-95 contrast-110 saturate-75"
        />
        <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none" />
      </div>
      {caption && (
      <p className="text-xs text-gray-700 mt-3 font-mono italic">{caption}</p>
      )}
    </div>
  );
}