"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CATEGORY_META } from "@/lib/constants";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { Category, Photo } from "@/lib/types";

type Props = {
  photos: Photo[];
};

function isSeedPlaceholder(id: string): boolean {
  return /^(life|food|travel)-\d+$/.test(id);
}

function pickRandomMany(pool: string[], count: number): string[] {
  if (pool.length === 0) return [];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  if (shuffled.length >= count) return shuffled.slice(0, count);

  const result: string[] = [];
  for (let i = 0; i < count; i += 1) {
    result.push(shuffled[i % shuffled.length]);
  }
  return result;
}

export default function CategoryCards({ photos }: Props) {
  const countByCategory = photos.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + 1;
    return acc;
  }, {});

  const coversByCategory = useMemo(() => {
    const userPhotos = photos.filter((item) => !isSeedPlaceholder(item.id));

    const byCategory: Record<Category, string[]> = {
      life: [],
      food: [],
      travel: []
    };

    (Object.keys(byCategory) as Category[]).forEach((category) => {
      const pool = userPhotos.filter((item) => item.category === category).map((item) => item.imageUrl).filter(Boolean);
      byCategory[category] = pickRandomMany(pool, 3);
    });

    return byCategory;
  }, [photos]);

  return (
    <section id="categories" className="mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-16">
      <div className="mb-10 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-[#ad6d83]">Memory Categories</p>
        <h2 className="section-title mt-2 text-[#4a2e3a]">和宝宝的点点滴滴</h2>
      </div>

      <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid items-stretch gap-7 md:grid-cols-3">
        {CATEGORY_META.map((category) => {
          const stack = coversByCategory[category.id];
          const primary = stack[0] ?? null;
          const second = stack[1] ?? primary;
          const third = stack[2] ?? primary;

          return (
            <motion.div key={category.id} variants={fadeInUp} className="h-full" whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.9 }}>
              <Link
                href={`/gallery/${category.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-[1.7rem] border border-white/50 bg-white/56 backdrop-blur-lg shadow-[0_14px_28px_rgba(101,66,85,0.14)] transition-[transform,box-shadow,background-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white/64 hover:shadow-[0_22px_40px_rgba(101,66,85,0.2)]"
              >
                <div className="relative h-[430px] overflow-hidden bg-[#fff7fb] md:h-[460px]">
                  {primary ? (
                    <>
                      <div className="absolute inset-x-9 bottom-10 top-12 rounded-[1.2rem] border border-white/70 bg-white/65 shadow-[0_18px_32px_rgba(89,54,74,0.16)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-2 group-hover:-translate-y-1 group-hover:-rotate-[7deg]" style={{ transform: "rotate(-5deg)" }}>
                        {second ? <Image src={second} alt="stack second" fill className="rounded-[1.2rem] object-cover" /> : null}
                      </div>
                      <div className="absolute inset-x-9 bottom-10 top-12 rounded-[1.2rem] border border-white/70 bg-white/65 shadow-[0_18px_32px_rgba(89,54,74,0.16)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 group-hover:-translate-y-1 group-hover:rotate-[7deg]" style={{ transform: "rotate(5deg)" }}>
                        {third ? <Image src={third} alt="stack third" fill className="rounded-[1.2rem] object-cover" /> : null}
                      </div>
                      <div className="absolute inset-x-6 bottom-6 top-6 overflow-hidden rounded-[1.35rem] border border-white/75 shadow-[0_20px_32px_rgba(73,43,58,0.2)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5">
                        <Image src={primary} alt={category.title} fill className="object-cover transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#4d2d3d]/48 via-[#6f475a]/10 to-transparent" />
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-[#c59aaa]">暂无照片</div>
                  )}
                </div>

                <div className="min-h-[170px] space-y-2 p-5 transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-white/38">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl text-[#4c2f3d]">{category.title}</h3>
                    <span className="rounded-full bg-[#fbe4ed] px-3 py-1 text-xs text-[#9b6a7d]">{countByCategory[category.id] ?? 0} 张</span>
                  </div>
                  <p className="text-sm leading-6 text-[#7d5a67]">{category.subtitle}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
