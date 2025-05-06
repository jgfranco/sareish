import Image from "next/image";

export default function PolaroidPhoto({ src, alt, caption }) {
  return (
    <div className="bg-white shadow-lg border border-gray-150 rounded-sm p-2 w-full text-center transform transition-transform hover:scale-105">
      <div className="bg-white pb-4 rounded-sm overflow-hidden">
        <div className="relative w-30 h-40 mx-auto">
          <Image
            src={src}
            alt={alt}
            layout="fill"
            objectFit="cover"
            className="rounded-sm"
          />
        </div>
        {caption && (
          <p className="text-sm text-gray-700 mt-3 font-light italic">{caption}</p>
        )}
      </div>
    </div>
  );
}