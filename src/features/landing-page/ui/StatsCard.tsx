"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import useAdminAnalytics from "@/features/admin/hooks/useAdminAnalytics";

function NumberTicker({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  const isInView = useInView(ref, {
    once: true,
    margin: "-100px",
  });

  const motionValue = useMotionValue(0);

  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 90,
  });

  const displayValue = useTransform(springValue, (latest) =>
    Math.round(latest).toLocaleString(),
  );

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  return <motion.span ref={ref}>{displayValue}</motion.span>;
}

export function StatsBanner() {
  const { stats, countries, isLoading } = useAdminAnalytics();

  const STATS = [
    {
      value: stats?.totalWebsites ?? 0,
      suffix: "+",
      label: "websites created",
    },
    {
      value: countries.length,
      suffix: "+",
      label: "countries reached",
    },
    {
      value: 100,
      suffix: "%",
      label: "customer satisfaction",
    },
  ];

  return (
    <section className="px-6 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="mx-auto max-w-5xl"
      >
        <div className="grid grid-cols-1 divide-y divide-zinc-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col items-center justify-center px-6 py-8 text-center sm:py-4"
            >
              <div className="flex items-baseline tracking-tight">
                <span className="text-5xl font-semibold text-zinc-950 sm:text-6xl">
                  {isLoading ? "—" : <NumberTicker value={stat.value} />}
                </span>

                <span className="ml-1 text-2xl font-semibold text-primary sm:text-3xl">
                  {stat.suffix}
                </span>
              </div>

              <p className="mt-2 text-xs font-medium tracking-wide text-zinc-500 sm:text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
