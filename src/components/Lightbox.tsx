"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Photo } from "@/lib/types";

type Props = {
  photos: Photo[];
  activeIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function Lightbox({ photos, activeIndex, onClose, onPrev, onNext }: Props) {
  const active = photos[activeIndex];

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrev();
      if (event.key === "ArrowRight") onNext();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, onNext, onPrev]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={onClose}>
      <button onClick={onClose} className="absolute right-5 top-5 rounded-full bg-white/20 px-3 py-1 text-white transition hover:bg-white/30">
        关闭
      </button>
      <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-4 rounded-full bg-white/20 px-3 py-1 text-white transition hover:bg-white/30 md:left-8">
        上一张
      </button>
      <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-4 rounded-full bg-white/20 px-3 py-1 text-white transition hover:bg-white/30 md:right-8">
        下一张
      </button>

      <div className="max-h-[86vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-white/30 bg-[#1d1714]" onClick={(e) => e.stopPropagation()}>
        <div className="relative h-[58vh] md:h-[72vh]">
          <Image src={active.imageUrl} alt={active.title} fill className="object-cover" />
        </div>
        <div className="bg-[#2d2420] px-5 py-4 text-[#f4e5d8]">
          <h3 className="font-serif text-lg md:text-xl">{active.title}</h3>
          {active.description ? <p className="mt-1 text-sm text-[#dec6b4]">{active.description}</p> : null}
        </div>
      </div>
    </div>
  );
}

