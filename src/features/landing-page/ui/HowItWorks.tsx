"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Describe Your Vision",
    description:
      "Tell us about your business, your style preferences, and what you want your website to achieve.",
  },
  {
    number: "02",
    title: "AI Generates Your Site",
    description:
      "Our AI creates a fully-functional, beautiful website tailored to your specific needs.",
  },
  {
    number: "03",
    title: "Customize & Launch",
    description:
      "Make any final tweaks you want, then publish your site with a single click. It's that simple.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden py-24 md:py-32"
    >
      <div className="container mx-auto px-4">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto mb-20 max-w-3xl px-6 text-center"
        >
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl md:text-4xl">
            From idea to live website.
            <br />
            <span className="text-primary">In 3 simple steps.</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base">
            No complicated setup. No coding. Just tell Sencill what you want and
            let AI do the heavy lifting.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="mx-auto max-w-6xl">
          <div className="relative grid gap-12 md:grid-cols-3 md:gap-8">
            {/* Connecting line */}
            <div className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-10 hidden h-px md:block">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 1.2,
                  delay: 0.5,
                  ease: "easeInOut",
                }}
                className="h-px origin-left bg-border"
              />
            </div>

            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{
                  once: true,
                  margin: "-80px",
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.2 + index * 0.2,
                  ease: "easeOut",
                }}
                className="group relative"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Number */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      type: "spring",
                      stiffness: 180,
                      damping: 14,
                      delay: 0.25 + index * 0.2,
                    }}
                    whileHover={{
                      scale: 1.08,
                    }}
                    className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full border bg-background text-2xl font-semibold text-primary shadow-sm transition-shadow duration-300 group-hover:shadow-md"
                  >
                    {/* Inner circle */}
                    <div className="absolute inset-1.5 rounded-full bg-primary/10 transition-colors duration-300 group-hover:bg-primary/15" />

                    <span className="relative">{step.number}</span>
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: 0.4 + index * 0.2,
                    }}
                    className="mt-7 max-w-sm"
                  >
                    <h3 className="text-xl font-semibold tracking-tight text-foreground">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                      {step.description}
                    </p>
                  </motion.div>
                </div>

                {/* Arrow */}
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      x: -10,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: 0.8 + index * 0.2,
                    }}
                    className="absolute -right-5 top-7 hidden md:block"
                  >
                    <ArrowRight className="h-5 w-5 text-primary/60" />
                  </motion.div>
                )}

                {/* Mobile connector */}
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: 0.5 + index * 0.2,
                    }}
                    className="absolute left-1/2 top-[84px] h-12 w-px origin-top bg-border md:hidden"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
