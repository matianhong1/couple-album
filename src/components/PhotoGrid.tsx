"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Lightbox from "@/components/Lightbox";
import { Photo } from "@/lib/types";

type Props = {
  photos: Photo[];
  emptyText?: string;
};

export default function PhotoGrid({ photos, emptyText = "暂无图片" }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const published = useMemo(() => photos.filter((item) => item.isPublished), [photos]);

  function closeLightbox() {
    setActiveIndex(null);
  }

  function move(step: number) {
    if (activeIndex === null) return;
    const next = (activeIndex + step + published.length) % published.length;
    setActiveIndex(next);
  }

  if (published.length === 0) {
    if (!emptyText) return <div className="min-h-[45vh]" />;
    return <p className="rounded-2xl border border-dashed border-[#ebd5c2] p-8 text-center text-[#866b5a]">{emptyText}</p>;
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {published.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group relative overflow-hidden rounded-2xl border border-[#f0decf] bg-white/70 text-left shadow-soft transition hover:-translate-y-2 hover:scale-[1.02] hover:shadow-float hover:ring-2 hover:ring-[#f3bfd2]/60"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={photo.thumbUrl ?? photo.imageUrl}
                alt={photo.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3f2f27]/45 via-transparent to-transparent opacity-70" />
            </div>
            <div className="p-3">
              <p className="font-serif text-sm text-[#4f3f35] md:text-base">{photo.title}</p>
              {photo.takenAt ? <p className="mt-1 text-xs text-[#8a7261]">{photo.takenAt}</p> : null}
            </div>
          </button>
        ))}
      </div>
      {activeIndex !== null ? (
        <Lightbox
          photos={published}
          activeIndex={activeIndex}
          onClose={closeLightbox}
          onPrev={() => move(-1)}
          onNext={() => move(1)}
        />
      ) : null}
    </>
  );
}
