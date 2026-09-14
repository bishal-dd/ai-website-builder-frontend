"use client";

import { motion } from "framer-motion";
import { Check, ArrowUpRight } from "lucide-react";

import { PRICING_PLANS } from "@/lib/pricing";
import { useUserCountry } from "@/features/preview/domain/api/geo";
import { usePricing } from "../hooks/useGetPricing";

const ease = [0.22, 1, 0.36, 1] as const;

export function Pricing() {
  const countryCode = useUserCountry();
  const { pricing, isLoading } = usePricing();

  const isBhutan = countryCode === "BT";
  const costs = isBhutan ? PRICING_PLANS.BT : PRICING_PLANS.INTL;
  const currency = isBhutan ? "Nu." : "$";

  const currentPricing = isBhutan ? pricing?.BTN : pricing?.USD;

  const generationPrice = currentPricing?.generation ?? 0;
  const hostingPrice = currentPricing?.hosting ?? 0;

  const domainPrice = isBhutan ? 1500 : 15;

  const firstYearTotal = generationPrice + domainPrice + hostingPrice;

  const annualRenewal = domainPrice + hostingPrice;

  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-[#FCFCFC] py-24 md:py-32"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-105 w-200 -translate-x-1/2 rounded-full bg-yellow-200/20 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-75 w-75 rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto max-w-3xl px-6 text-center"
        >
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl md:text-4xl">
            Build your website.
            <br />
            <span className="text-primary">Know what it costs.</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base">
            One-time development with affordable annual fees. No hidden charges.
            Pricing may vary depending on the type and complexity of your
            website.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {costs.map((cost, index) => {
            const isFeatured = index === 0;

            const price =
              cost.key === "generation"
                ? generationPrice
                : cost.key === "hosting"
                  ? hostingPrice
                  : (cost.price ?? 0);

            return (
              <motion.div
                key={cost.name}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.1,
                  ease,
                }}
                whileHover={{ y: -6 }}
                className={`group relative rounded-2xl border p-7 transition-shadow duration-300 md:p-8 ${
                  isFeatured
                    ? "border-zinc-900 bg-zinc-950 text-white shadow-xl"
                    : "border-zinc-200 bg-white shadow-sm hover:shadow-xl"
                }`}
              >
                {/* Featured badge */}
                {isFeatured && (
                  <div className="absolute -top-3.5 left-7">
                    <span className="inline-flex rounded-full bg-primary px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-primary-foreground shadow-sm">
                      One-time fee
                    </span>
                  </div>
                )}

                {/* Card header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3
                      className={`text-xl font-semibold ${
                        isFeatured ? "text-white" : "text-zinc-950"
                      }`}
                    >
                      {cost.name}
                    </h3>

                    <p
                      className={`mt-2 text-sm leading-5 ${
                        isFeatured ? "text-zinc-400" : "text-zinc-500"
                      }`}
                    >
                      {cost.description}
                    </p>
                  </div>

                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      isFeatured
                        ? "bg-white/10 text-white"
                        : "bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>

                {/* Price */}
                <div className="mt-8 flex items-baseline gap-1">
                  <span
                    className={`text-4xl font-semibold tracking-tight ${
                      isFeatured ? "text-white" : "text-zinc-950"
                    }`}
                  >
                    {isLoading
                      ? "..."
                      : `${currency} ${price.toLocaleString()}`}{" "}
                  </span>

                  <span
                    className={`text-sm ${
                      isFeatured ? "text-zinc-500" : "text-zinc-400"
                    }`}
                  >
                    /{cost.period}
                  </span>
                </div>

                {/* Divider */}
                <div
                  className={`my-7 h-px ${
                    isFeatured ? "bg-white/10" : "bg-zinc-100"
                  }`}
                />

                {/* Features */}
                <ul className="space-y-3.5">
                  {cost.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          isFeatured
                            ? "bg-white/10 text-white"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </span>

                      <span
                        className={`text-sm leading-5 ${
                          isFeatured ? "text-zinc-300" : "text-zinc-600"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* First year summary */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.15, ease }}
          className="mt-12"
        >
          <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-500">
                  Total first year cost
                </p>

                <p className="mt-1 text-3xl font-semibold tracking-tight text-zinc-950">
                  {isLoading
                    ? "..."
                    : `${currency} ${firstYearTotal.toLocaleString()}`}{" "}
                </p>

                <p className="mt-1 text-xs text-zinc-400">
                  Development + Domain + Hosting
                </p>
              </div>

              <div className="h-px w-full bg-zinc-100 md:h-12 md:w-px" />

              <div className="md:text-right">
                <p className="text-sm font-medium text-zinc-500">
                  Annual renewal
                </p>

                <p className="mt-1 text-lg font-semibold text-zinc-950">
                  {isLoading
                    ? "..."
                    : `${currency} ${annualRenewal.toLocaleString()}`}{" "}
                  <span className="ml-1 text-sm font-normal text-zinc-400">
                    /year
                  </span>
                </p>

                <p className="mt-1 text-xs text-zinc-400">
                  Domain + Hosting only
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mx-auto mt-8 max-w-xl text-center text-xs leading-5 text-zinc-400"
        >
          Need something more specific? Website pricing can change based on
          functionality, number of pages, integrations, and overall complexity.
        </motion.p>
      </div>
    </section>
  );
}
