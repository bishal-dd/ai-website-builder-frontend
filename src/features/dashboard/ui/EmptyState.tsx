"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const exampleSites = [
  {
    title: "Portfolio Template",
    category: "Personal",
    image: "/images/sample1.png",
    link: "https://newgentravel.online/",
  },
  {
    title: "E-commerce Store",
    category: "Business",
    image: "/images/sample2.png",
    link: "https://www.lightwebx.link/",
  },
  {
    title: "SaaS Landing Page",
    category: "Tech",
    image: "/images/sample1.png",
    link: "https://www.lightwebx.store/",
  },
];

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-12">
      {/* Heading */}
      <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900">
        No Projects Yet
      </h2>

      {/* Subtext */}
      <p className="mb-8 max-w-lg text-lg text-gray-600 leading-relaxed">
        Bring your ideas to life and build stunning websites instantly. Start
        your first project now and see your vision in action!
      </p>

      {/* Primary CTA */}
      <Button
        size="lg"
        className="shadow-lg shadow-primary/25 px-6 py-3 mb-12"
        asChild
      >
        <Link href="/wizard">Create Your First Project</Link>
      </Button>

      {/* Examples Section */}
      <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {exampleSites.map((site, i) => (
          <motion.a
            key={i}
            href={site.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group block rounded-xl overflow-hidden bg-gray-50 shadow hover:shadow-md transition-shadow duration-300 cursor-pointer"
          >
            {/* Website Image */}
            <div className="relative w-full aspect-[16/10]">
              <Image
                src={site.image}
                alt={site.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Title and category */}
            <div className="p-4 bg-white border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {site.title}
              </h3>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                {site.category}
              </p>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
