"use client";

import {
  ArrowUpRight,
  Code2,
  Globe,
  Palette,
  Rocket,
  Shield,
  Smartphone,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Palette,
    title: "Customizable Websites",
    description: "Customize your website with your own content",
  },
  {
    icon: Rocket,
    title: "Lightning Fast Setup",
    description:
      "Generate a complete website in minutes. Our AI understands your needs and creates the perfect site instantly.",
  },
  {
    icon: Smartphone,
    title: "Mobile Responsive",
    description:
      "Every website is fully responsive and looks stunning on all devices, from phones to desktops.",
  },
  {
    icon: Code2,
    title: "No Coding Required",
    description:
      "Build professional websites without writing a single line of code. Perfect for non-technical users.",
  },
  {
    icon: Globe,
    title: "SEO Optimized",
    description:
      "All websites are built with SEO best practices, helping you rank higher in search results.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description:
      "Enterprise-grade security and 90% uptime guarantee. Your website is always safe and accessible.",
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

        {/* Feature grid */}
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
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
