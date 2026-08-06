"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Globe, Sparkles, Plus } from "lucide-react";
import Link from "next/link";

const exampleSites = [
  {
    title: "Travel Agency Website",
    description:
      "Showcase your travel agency’s services, destinations, and expert guides with a modern, professional layout.",
    category: "Travel",
    image: "/images/category/travel-agency.webp",
    link: "/dashboard/templates/travel-agency",
  },
  {
    title: "Hotel Website",
    description:
      "Beautifully designed website for hotels and resorts featuring rooms, amenities, booking info, and stunning visuals to attract guests.",
    category: "Hospitality",
    image: "/images/category/hotel.webp",
    link: "/dashboard/templates/hotel",
  },
  {
    title: "Restaurant",
    description:
      "Clean and professional landing page for small or medium businesses to showcase services, products, and contact info effectively.",
    category: "Business",
    image: "/images/category/restaurant.webp",
    link: "/dashboard/templates/restaurant",
  },
];

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12">
      {/* Header section */}
      <div className="w-full max-w-7xl mb-6 border-l-4 border-[#FDCA1C] pl-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={16} className="text-[#FDCA1C]" />
          <span className="text-[10px] font-black text-zinc-500/60 uppercase tracking-[0.3em]">
            Default Website Showcase
          </span>
        </div>
        <h2 className="text-3xl font-black text-zinc-900 tracking-tight mb-3">
          Get Inspired.
        </h2>
        <p className="max-w-2xl text-zinc-600/80 leading-relaxed font-medium">
          Real websites created by Sencill AI. Get inspired, explore live
          examples, and launch your own in minutes.
        </p>

        {/* New Project Button */}
        <div className="mt-6">
          <Link
            href="/wizard"
            className="inline-flex items-center gap-2 bg-[#FDCA1C] hover:bg-[#e6b800] text-zinc-900 font-bold px-5 py-3 rounded-xl shadow-md transition-all duration-300"
          >
            <Plus size={16} /> Create New Project
          </Link>
        </div>
      </div>

      {/* Grid Section */}
      <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {exampleSites.map((site, i) => (
          <motion.div
            key={site.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              href={site.link}
              className="group relative flex flex-col rounded-2xl bg-white/30 backdrop-blur-sm border border-zinc-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-500 overflow-hidden"
            >
              {/* Browser Header */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-zinc-200/50 bg-zinc-900/3">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
              </div>

              {/* Image Preview */}
              <div className="relative w-full aspect-16/10 overflow-hidden">
                <Image
                  src={site.image}
                  alt={site.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-zinc-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white text-zinc-900 px-5 py-2 rounded-full text-[10px] font-black tracking-widest flex items-center gap-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    EXPLORE TEMPLATE
                    <Sparkles size={12} />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] font-black text-[#FDCA1C] uppercase tracking-[0.2em] bg-[#FDCA1C]/10 px-2 py-1 rounded">
                    {site.category}
                  </span>

                  <Globe
                    size={16}
                    className="text-zinc-400 group-hover:text-[#FDCA1C] transition-colors"
                  />
                </div>

                <h3 className="text-lg font-bold text-zinc-800 mb-2 group-hover:text-zinc-900 transition-colors">
                  {site.title}
                </h3>

                <p className="text-sm text-zinc-500/90 leading-snug line-clamp-2">
                  {site.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
