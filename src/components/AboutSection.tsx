"use client";

import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="mx-auto mt-24 max-w-5xl px-4 pb-20 md:px-8"
    >
      <div className="glass-card rounded-[2rem] border border-[#f0dfcd] p-8 shadow-soft md:p-12">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-[#a17d66]">About Us</p>
        <h2 className="section-title text-[#3d2e27]">写给未来的纪念</h2>
        <div className="golden-divider mt-4" />
        <p className="mt-6 leading-8 text-[#645146]">
          这个小站记录了我们一起生活的细碎时刻。也许只是一次散步、一道晚餐，或某次临时起意的旅行，
          但正是这些看似普通的片段，拼出了我们最珍贵的日子。希望以后每次点开这里，都能重新想起当时的温度。
        </p>
      </div>
    </motion.section>
  );
}

