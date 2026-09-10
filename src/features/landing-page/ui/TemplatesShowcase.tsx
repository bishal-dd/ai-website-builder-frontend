"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Eye } from "lucide-react";
import { useGeneratePreviewTemplate } from "@/features/website-templates/hooks/useGeneratePreviewTemplate";
import { TemplatePreviewDialog } from "@/features/website-templates/ui/TemplatePreviewDialog";

type Template = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
};

const templates: Template[] = [
  {
    id: "9dfefd38-a34f-49ae-996d-58bcee9bd806",
    title: "AXIS",
    category: "Travel",
    description: "A modern website for travel agencies and tour operators.",
    image: "/images/templates/AXIS.webp",
  },
  {
    id: "90499f2e-99a8-47f2-af9b-307187727060",
    title: "Personal Portfolio",
    category: "Portfolio",
    description: "A clean website to showcase your work and experience.",
    image: "/images/templates/NOVARA.webp",
  },
  {
    id: "f0d0f601-bcb7-4e30-a168-22eb4c1a6d6e",
    title: "Restaurant",
    category: "Food & Dining",
    description: "A beautiful website for restaurants and cafés.",
    image: "/images/templates/Ember.webp",
  },
  {
    id: "649206c1-6ae9-4be0-9391-a18bd21cf886",
    title: "Hotel & Resort",
    category: "Hospitality",
    description: "A premium website for hotels and accommodations.",
    image: "/images/templates/Marlow House.webp",
  },
  {
    id: "0515879b-de3c-46bf-81b6-c2bab56e0083",
    title: "Business",
    category: "Business",
    description: "A professional website for growing businesses.",
    image: "/images/templates/Meadowlight.webp",
  },
  {
    id: "418eb57e-c684-4681-a50e-2daf364811d4",
    title: "Creative Studio",
    category: "Creative",
    description: "A bold website for designers and creative studios.",
    image: "/images/templates/Nova Studio.webp",
  },
];

const AUTOPLAY_DELAY = 5000;

const spring = {
  type: "spring" as const,
  stiffness: 260,
  damping: 30,
  mass: 0.9,
};

export function TemplatesShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | undefined>();

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { mutateAsync: generatePreview, isPending: isPreviewLoading } =
    useGeneratePreviewTemplate();

  const count = templates.length;

  const mod = (n: number) => (n + count) % count;

  const goTo = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(mod(index));
  };

  const next = () => {
    setDirection(1);
    setActiveIndex((current) => mod(current + 1));
  };

  const previous = () => {
    setDirection(-1);
    setActiveIndex((current) => mod(current - 1));
  };

  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(next, AUTOPLAY_DELAY);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused, activeIndex]);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const swipe = info.offset.x;

    if (swipe < -60) {
      next();
    } else if (swipe > 60) {
      previous();
    }
  };

  const handlePreview = async (template: Template) => {
    try {
      setPreviewTemplate(template);
      setPreviewUrl(undefined);

      const data = await generatePreview(template.id);

      setPreviewUrl(data.previewUrl);
    } catch (error) {
      console.error("Failed to generate template preview:", error);

      setPreviewTemplate(null);
      setPreviewUrl(undefined);
    }
  };

  const closePreview = () => {
    setPreviewTemplate(null);
    setPreviewUrl(undefined);
  };

  const left = templates[mod(activeIndex - 1)];
  const center = templates[activeIndex];
  const right = templates[mod(activeIndex + 1)];

  return (
    <section
      id="templates"
      className="relative overflow-hidden bg-[#FFFAEE] py-24 md:py-32"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[420px] w-[800px] -translate-x-1/2 rounded-full bg-yellow-200/30 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
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
            Start with a template.
            <br />
            <span className="text-primary">Make it yours.</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base">
            Browse our templates, preview the design, and choose a starting
            point for your website.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative mt-16">
          {/* Desktop */}
          <div className="hidden md:block">
            <div className="relative mx-auto flex h-[470px] max-w-[1400px] items-center justify-center">
              <SideCard
                template={left}
                position="left"
                onSelect={() => goTo(mod(activeIndex - 1))}
              />

              <SideCard
                template={right}
                position="right"
                onSelect={() => goTo(mod(activeIndex + 1))}
              />

              <AnimatePresence
                mode="popLayout"
                custom={direction}
                initial={false}
              >
                <motion.div
                  key={center.id}
                  custom={direction}
                  initial={{
                    opacity: 0,
                    scale: 0.86,
                    x: direction >= 0 ? 90 : -90,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    zIndex: 20,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.86,
                    x: direction >= 0 ? -90 : 90,
                  }}
                  transition={spring}
                  className="absolute w-[620px]"
                >
                  <CenterCard
                    template={center}
                    onPreview={() => handlePreview(center)}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile */}
          <div className="px-6 md:hidden">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={center.id}
                custom={direction}
                initial={{
                  opacity: 0,
                  x: direction >= 0 ? 50 : -50,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: direction >= 0 ? -50 : 50,
                }}
                transition={{
                  duration: 0.28,
                  ease: [0.22, 1, 0.36, 1],
                }}
                drag="x"
                dragConstraints={{
                  left: 0,
                  right: 0,
                }}
                dragElastic={0.6}
                onDragStart={() => setIsPaused(true)}
                onDragEnd={handleDragEnd}
                className="cursor-grab active:cursor-grabbing"
              >
                <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg">
                  <BrowserChrome />

                  <div className="relative aspect-[16/10]">
                    <Image
                      src={center.image}
                      alt={`${center.title} website template`}
                      fill
                      sizes="100vw"
                      className="pointer-events-none select-none object-cover object-top"
                      draggable={false}
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-zinc-950">
                      {center.title}
                    </h3>

                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
                      {center.category}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    {center.description}
                  </p>

                  <div className="mt-5 flex gap-3">
                    <button
                      type="button"
                      onClick={() => handlePreview(center)}
                      disabled={isPreviewLoading}
                      className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-60"
                    >
                      <Eye className="h-4 w-4" />
                      View template
                    </button>

                    <a
                      href={`/auth/login?intent=template&templateId=${center.id}`}
                      className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
                    >
                      Use template
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mx-auto mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={previous}
              aria-label="Previous template"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={next}
              aria-label="Next template"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Template Preview */}
      <TemplatePreviewDialog
        open={previewTemplate !== null}
        onOpenChange={(open) => {
          if (!open) {
            closePreview();
          }
        }}
        previewUrl={previewUrl}
        title={previewTemplate?.title}
        isLoading={isPreviewLoading}
        onUseTemplate={
          previewTemplate
            ? () => {
                window.location.href = `/auth/login?intent=template&templateId=${previewTemplate.id}`;
              }
            : undefined
        }
      />
    </section>
  );
}

function BrowserChrome() {
  return (
    <div className="flex h-10 items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4">
      <div className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
      </div>
    </div>
  );
}

function SideCard({
  template,
  position,
  onSelect,
}: {
  template: Template;
  position: "left" | "right";
  onSelect: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      initial={false}
      animate={{
        x: position === "left" ? "-42%" : "42%",
        opacity: 0.45,
        scale: 0.78,
      }}
      transition={spring}
      className="absolute z-10 w-[620px] cursor-pointer text-left"
      aria-label={`Show ${template.title}`}
    >
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-md">
        <BrowserChrome />

        <div className="relative aspect-[16/9] overflow-hidden bg-zinc-100">
          <Image
            src={template.image}
            alt=""
            fill
            sizes="620px"
            className="object-cover object-top"
          />
        </div>
      </div>
    </motion.button>
  );
}

function CenterCard({
  template,
  onPreview,
}: {
  template: Template;
  onPreview: () => void;
}) {
  return (
    <div>
      <div className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl">
        <BrowserChrome />

        <div className="relative aspect-[16/9] overflow-hidden bg-zinc-100">
          <Image
            src={template.image}
            alt={`${template.title} website template`}
            fill
            sizes="620px"
            className="object-cover object-top"
          />

          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              type="button"
              onClick={onPreview}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-zinc-950 shadow-xl transition-transform hover:scale-105"
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between px-1">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold tracking-tight text-zinc-950">
              {template.title}
            </h3>

            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
              {template.category}
            </span>
          </div>

          <p className="mt-1.5 text-sm text-zinc-500">{template.description}</p>
        </div>

        <a
          href={`/auth/login?intent=template&templateId=${template.id}`}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          Use template
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
