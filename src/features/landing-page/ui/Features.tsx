"use client";

import {
  ArrowUpRight,
  Check,
  Globe,
  Palette,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Sparkles,
    title: "AI-powered website generation",
    description:
      "Describe your idea and Sencill AI turns it into a complete, professional website.",
  },
  {
    icon: Palette,
    title: "Customize everything",
    description:
      "Change colors, sections, content and layouts without touching code.",
  },
  {
    icon: Smartphone,
    title: "Looks great everywhere",
    description:
      "Your website automatically adapts beautifully to phones, tablets and desktops.",
  },
  {
    icon: Globe,
    title: "Ready to publish",
    description:
      "Connect your domain and put your website online when you're ready.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
            Build more. Worry less.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            Sencill AI handles the complicated parts of building a website, so
            you can focus on your business.
          </p>
        </motion.div>
        {/* Main AI feature */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mt-16 overflow-hidden rounded-3xl border bg-card shadow-sm"
        >
          <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
            {/* Text */}
            <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>

              <p className="mt-8 text-sm font-medium text-primary">
                AI website builder
              </p>

              <h3 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Start with an idea.
                <br />
                End with a website.
              </h3>

              <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
                Tell Sencill what you want to build. Our AI turns your
                description into pages, sections and content designed around
                your idea.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  "Generate complete websites",
                  "Create multiple pages",
                  "AI-generated content",
                  "No coding required",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3 w-3 text-primary" />
                    </div>

                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Animated product preview */}
            <div className="relative min-h-[420px] overflow-hidden border-t bg-muted/30 p-6 lg:border-l lg:border-t-0 sm:p-10">
              {/* Glow */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="relative mx-auto max-w-xl"
              >
                {/* Browser */}
                <div className="overflow-hidden rounded-2xl border bg-background shadow-2xl">
                  {/* Browser header */}
                  <div className="flex h-10 items-center border-b bg-muted/40 px-4">
                    <div className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
                      <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
                      <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
                    </div>

                    <div className="mx-auto rounded-md border bg-background px-4 py-1 text-[10px] text-muted-foreground">
                      sencillai.com
                    </div>

                    <div className="w-10" />
                  </div>

                  {/* Fake generated website */}
                  <div className="p-5 sm:p-7">
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-20 rounded bg-foreground/10" />

                      <div className="flex gap-2">
                        <div className="h-2 w-10 rounded bg-muted" />
                        <div className="h-2 w-10 rounded bg-muted" />
                        <div className="h-2 w-10 rounded bg-muted" />
                      </div>
                    </div>

                    <div className="mt-10">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "75%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="h-5 rounded bg-foreground/10"
                      />

                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "55%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.15 }}
                        className="mt-3 h-3 rounded bg-muted-foreground/10"
                      />

                      <div className="mt-6 h-9 w-28 rounded-lg bg-primary/80" />
                    </div>

                    <div className="mt-12 grid grid-cols-3 gap-3">
                      {[1, 2, 3].map((item) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, y: 12 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.4,
                            delay: 0.3 + item * 0.1,
                          }}
                          className="aspect-[4/3] rounded-xl border bg-muted/40"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI floating card */}
                <motion.div
                  initial={{ opacity: 0, x: 30, y: 10 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  animate={{ y: [0, -6, 0] }}
                  className="absolute -bottom-5 -right-3 w-52 rounded-xl border bg-background p-3 shadow-xl sm:-right-8"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                      <Sparkles className="h-3 w-3 text-primary" />
                    </div>

                    <span className="text-xs font-medium">Sencill AI</span>
                  </div>

                  <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
                    Creating your website...
                  </p>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ x: "-100%" }}
                      whileInView={{ x: "0%" }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1.8,
                        ease: "easeOut",
                      }}
                      className="h-full w-full rounded-full bg-primary"
                    />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
        {/* Feature grid */}
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.slice(1).map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-2xl border bg-card p-6 transition-shadow duration-300 hover:shadow-lg"
              >
                {/* Subtle hover glow */}
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/5 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>

                    <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </div>

                  <h3 className="mt-6 text-lg font-semibold tracking-tight">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
