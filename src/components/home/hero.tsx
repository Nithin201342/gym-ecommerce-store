"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Phone, ShoppingBag } from "lucide-react";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  // Tracks scroll progress across the hero's own height, not the whole page —
  // so the parallax effect is tied to "how far you've scrolled through the
  // hero", not an arbitrary pixel value.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  // Foreground content fades and lifts slightly faster than the scroll,
  // so it visually "exits" before the next section arrives.
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="hero-surface relative overflow-hidden"
    >
      <motion.div
        style={{ y: backgroundY }}
        className="hero-background pointer-events-none absolute inset-0"
      />
      <div className="hero-wash pointer-events-none absolute inset-0" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl flex-col px-5 pb-8 pt-16 sm:px-8 lg:px-12"
      >
        <div className="flex items-center justify-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold tracking-[0.35em] text-white/80"
          >
            PREMIUM PRODUCTS
          </motion.span>
        </div>

        <div className="relative flex flex-1 flex-col items-center justify-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hero-title absolute top-[42%] z-0 -translate-y-1/2 text-[clamp(5rem,18vw,15rem)] font-black uppercase leading-[0.78] tracking-[-0.06em] text-white/90"
          >
            NovaFit
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute left-1/2 top-6 z-10 w-[min(90%,28rem)] -translate-x-1/2 text-sm leading-6 text-white/85 sm:top-10"
          >
            Precision gear and considered essentials for the everyday ritual of
            becoming stronger.
          </motion.p>

        </div>

        <div className="flex items-end justify-between gap-6">
          <div className="hidden items-center gap-3 text-xs text-white/80 sm:flex">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/20"><MapPin size={15} /></span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/20"><Phone size={15} /></span>
            <span className="ml-1 uppercase tracking-[0.18em]">Get in touch</span>
          </div>
          <Link href="/products" className="hero-cta ml-auto">Shop market <ShoppingBag size={16} /></Link>
        </div>

        {/* <div className="absolute left-5 top-1/2 hidden -translate-y-1/2 rounded-2xl border border-white/20 bg-neutral-950/80 p-4 text-white shadow-2xl backdrop-blur-md sm:block lg:left-12">
          <div className="flex items-center gap-1 text-sm font-bold">4.9 <span className="flex text-amber-400">{Array.from({ length: 5 }).map((_, index) => <Star key={index} size={12} fill="currentColor" />)}</span></div>
          <p className="mt-1 text-[10px] uppercase tracking-widest text-white/65">Customer rating</p>
        </div>

        <div className="absolute right-5 top-1/2 hidden -translate-y-1/2 rounded-2xl border border-white/20 bg-neutral-950/80 p-4 text-white shadow-2xl backdrop-blur-md sm:block lg:right-12">
          <div className="text-lg font-bold">5K+</div>
          <p className="mt-1 text-[10px] uppercase tracking-widest text-white/65">Satisfied customers</p>
          <div className="mt-3 flex -space-x-2">{["bg-neutral-900", "bg-neutral-500", "bg-amber-200"].map((color) => <span key={color} className={`h-6 w-6 rounded-full border-2 border-white ${color}`} />)}</div>
        </div> */}
      </motion.div>
    </section>
  );
}
