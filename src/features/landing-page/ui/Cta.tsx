"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CTA() {
  const [mousePosition, setMousePosition] = useState({
    x: 50,
    y: 50,
  });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setMousePosition({ x, y });
  };

  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          onMouseMove={handleMouseMove}
          className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-[#FFFAEE] px-6 py-16 text-center shadow-[0_20px_60px_rgba(0,0,0,0.05)] sm:px-12 sm:py-20 md:px-20"
        >
          {/* Cursor-following splash */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl transition-[left,top] duration-300 ease-out"
            style={{
              left: `${mousePosition.x}%`,
              top: `${mousePosition.y}%`,
              width: "420px",
              height: "420px",
            }}
          />

          {/* Subtle secondary glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-32 w-2/3 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
          />

          <div className="relative z-10 mx-auto max-w-3xl">
            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl"
            >
              Your website is closer
              <br className="hidden sm:block" />
              <span className="text-primary"> than you think.</span>
            </motion.h2>
            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-zinc-600 sm:text-base"
            >
              Tell Sencill what you need, and let AI turn your idea into a
              professional website without the complexity of traditional
              development.
            </motion.p>
            {/* CTA button */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-8 flex justify-center"
            >
              <motion.div
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                }}
              >
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-xl bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25"
                >
                  <Link href="/auth/login">
                    Get started
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
            {/* Trust line */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: 0.55,
              }}
              className="mt-5 text-xs text-zinc-500"
            >
              No coding required · Simple pricing · Cancel anytime
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
