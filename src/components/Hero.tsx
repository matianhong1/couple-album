"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[92vh] items-center justify-center overflow-hidden px-4">
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(79, 47, 62, 0.26), rgba(89, 52, 69, 0.42)), url(https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1800&q=80)"
        }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[#fff2f7]/20 to-[#fff2f7]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="glass-card w-full max-w-3xl rounded-[2rem] border border-[#f8d7e2] px-8 py-12 text-center shadow-soft md:px-16"
      >
        <p className="mx-auto mb-4 w-fit rounded-full bg-white/70 px-4 py-1 text-sm text-[#946272]">Couple Album</p>
        <h1 className="font-serif text-4xl font-semibold leading-tight text-[#4e2f3c] md:text-6xl">情侣相册</h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#7f5c68] md:text-base">把我们的日常、好吃的和去过的地方，慢慢存起来。</p>
        <a
          href="#categories"
          className="mt-8 inline-flex items-center rounded-full bg-[#f4bfd1] px-7 py-3 text-sm font-medium text-[#4d2f3c] shadow-soft transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-float hover:brightness-95"
        >
          开始浏览
        </a>
      </motion.div>
    </section>
  );
}
