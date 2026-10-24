import Image from "next/image";

// fixed sequence so the tilt is the same on the server and the client
const tilts = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2', 'rotate-0', '-rotate-3', 'rotate-3'];

export default function PolaroidPhoto({ src, alt, caption, url, tiltIndex = 0 }) {
  const tilt = tilts[tiltIndex % tilts.length];

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block bg-white shadow-lg border border-gray-200 rounded-sm p-2 pb-6 w-full max-w-xs text-center transform transition-transform duration-300 hover:scale-105 hover:rotate-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 ${tilt}`}>
      <div className="relative aspect-square w-full overflow-hidden rounded-sm">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 640px) 20vw, 40vw"
          className="object-cover brightness-95 contrast-110 saturate-75"
        />
        <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none" />
      </div>
      {caption && (
      <p className="text-xs text-gray-700 mt-3 font-mono italic">{caption}</p>
      )}
    </a>
  );
}
