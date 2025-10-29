"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Monitor,
  Smartphone,
  Tablet,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DeviceType = "desktop" | "tablet" | "mobile";

type WebElement = {
  id: number;
  tag: keyof HTMLElementTagNameMap;
  class?: string;
  content?: string;
  type?: string;
  children?: WebElement[];
};

// 🧱 Example JSON-based website structure
const sampleWebsite: WebElement[] = [
  {
    id: 1,
    tag: "div",
    class: "min-h-screen flex flex-col font-sans text-gray-800",
    type: "container",
    children: [
      {
        id: 2,
        tag: "header",
        class:
          "flex items-center justify-between px-8 py-6 bg-white shadow-md sticky top-0 z-50",
        children: [
          {
            id: 3,
            tag: "h1",
            class: "text-2xl font-bold text-blue-600",
            content: "Wanderly",
          },
          {
            id: 4,
            tag: "nav",
            class: "hidden md:flex gap-8 text-sm font-medium",
            children: [
              {
                id: 5,
                tag: "a",
                class: "hover:text-blue-600 transition",
                content: "Home",
              },
              {
                id: 6,
                tag: "a",
                class: "hover:text-blue-600 transition",
                content: "Destinations",
              },
              {
                id: 7,
                tag: "a",
                class: "hover:text-blue-600 transition",
                content: "About",
              },
              {
                id: 8,
                tag: "a",
                class: "hover:text-blue-600 transition",
                content: "Contact",
              },
            ],
          },
          {
            id: 9,
            tag: "button",
            class:
              "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition",
            content: "Book Now",
          },
        ],
      },
      {
        id: 10,
        tag: "section",
        class:
          "relative flex flex-col items-center justify-center text-center py-24 bg-cover bg-center text-white",
        type: "hero",
        children: [
          {
            id: 11,
            tag: "div",
            class:
              "absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center brightness-50",
          },
          {
            id: 12,
            tag: "div",
            class: "relative z-10 max-w-2xl px-4",
            children: [
              {
                id: 13,
                tag: "h2",
                class: "text-5xl font-extrabold mb-6",
                content: "Explore the World with Wanderly",
              },
              {
                id: 14,
                tag: "p",
                class: "text-lg mb-8 text-gray-100",
                content:
                  "Discover breathtaking destinations and unforgettable experiences with our curated travel packages.",
              },
              {
                id: 15,
                tag: "button",
                class:
                  "px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition",
                content: "Start Your Journey",
              },
            ],
          },
        ],
      },
      {
        id: 16,
        tag: "section",
        class: "py-20 bg-gray-50",
        type: "destinations",
        children: [
          {
            id: 17,
            tag: "h3",
            class: "text-3xl font-bold text-center mb-10",
            content: "Popular Destinations",
          },
          {
            id: 18,
            tag: "div",
            class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-8",
            children: [
              {
                id: 19,
                tag: "div",
                class:
                  "rounded-xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition",
                children: [
                  {
                    id: 20,
                    tag: "div",
                    class:
                      "h-48 bg-[url('https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center",
                  },
                  {
                    id: 21,
                    tag: "div",
                    class: "p-5",
                    children: [
                      {
                        id: 22,
                        tag: "h4",
                        class: "text-xl font-semibold mb-2",
                        content: "Paris, France",
                      },
                      {
                        id: 23,
                        tag: "p",
                        class: "text-gray-600",
                        content:
                          "The city of lights, romance, and rich culture awaits you.",
                      },
                    ],
                  },
                ],
              },
              {
                id: 24,
                tag: "div",
                class:
                  "rounded-xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition",
                children: [
                  {
                    id: 25,
                    tag: "div",
                    class:
                      "h-48 bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center",
                  },
                  {
                    id: 26,
                    tag: "div",
                    class: "p-5",
                    children: [
                      {
                        id: 27,
                        tag: "h4",
                        class: "text-xl font-semibold mb-2",
                        content: "Bali, Indonesia",
                      },
                      {
                        id: 28,
                        tag: "p",
                        class: "text-gray-600",
                        content:
                          "Experience tropical paradise, vibrant culture, and stunning beaches.",
                      },
                    ],
                  },
                ],
              },
              {
                id: 29,
                tag: "div",
                class:
                  "rounded-xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition",
                children: [
                  {
                    id: 30,
                    tag: "div",
                    class:
                      "h-48 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center",
                  },
                  {
                    id: 31,
                    tag: "div",
                    class: "p-5",
                    children: [
                      {
                        id: 32,
                        tag: "h4",
                        class: "text-xl font-semibold mb-2",
                        content: "Kyoto, Japan",
                      },
                      {
                        id: 33,
                        tag: "p",
                        class: "text-gray-600",
                        content:
                          "Discover serene temples, cherry blossoms, and timeless traditions.",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 34,
        tag: "section",
        class: "py-20 bg-white",
        type: "features",
        children: [
          {
            id: 35,
            tag: "h3",
            class: "text-3xl font-bold text-center mb-10",
            content: "Why Choose Wanderly?",
          },
          {
            id: 36,
            tag: "div",
            class: "grid grid-cols-1 md:grid-cols-3 gap-8 px-8 text-center",
            children: [
              {
                id: 37,
                tag: "div",
                class:
                  "p-6 bg-gray-50 rounded-xl shadow hover:shadow-md transition",
                children: [
                  {
                    id: 38,
                    tag: "h4",
                    class: "text-xl font-semibold mb-3 text-blue-600",
                    content: "Expert Guides",
                  },
                  {
                    id: 39,
                    tag: "p",
                    class: "text-gray-600",
                    content:
                      "Our experienced travel experts ensure every trip is smooth and unforgettable.",
                  },
                ],
              },
              {
                id: 40,
                tag: "div",
                class:
                  "p-6 bg-gray-50 rounded-xl shadow hover:shadow-md transition",
                children: [
                  {
                    id: 41,
                    tag: "h4",
                    class: "text-xl font-semibold mb-3 text-blue-600",
                    content: "Curated Packages",
                  },
                  {
                    id: 42,
                    tag: "p",
                    class: "text-gray-600",
                    content:
                      "Handpicked destinations, activities, and stays tailored to your taste.",
                  },
                ],
              },
              {
                id: 43,
                tag: "div",
                class:
                  "p-6 bg-gray-50 rounded-xl shadow hover:shadow-md transition",
                children: [
                  {
                    id: 44,
                    tag: "h4",
                    class: "text-xl font-semibold mb-3 text-blue-600",
                    content: "24/7 Support",
                  },
                  {
                    id: 45,
                    tag: "p",
                    class: "text-gray-600",
                    content:
                      "We're here around the clock to help you before, during, and after your trip.",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 46,
        tag: "section",
        class: "py-20 bg-gray-50",
        type: "testimonials",
        children: [
          {
            id: 47,
            tag: "h3",
            class: "text-3xl font-bold text-center mb-10",
            content: "What Our Travelers Say",
          },
          {
            id: 48,
            tag: "div",
            class: "flex flex-col md:flex-row gap-8 px-8 max-w-5xl mx-auto",
            children: [
              {
                id: 49,
                tag: "div",
                class: "bg-white rounded-xl shadow p-6 flex-1",
                children: [
                  {
                    id: 50,
                    tag: "p",
                    class: "text-gray-700 mb-4 italic",
                    content:
                      "“An amazing experience! Everything was perfectly planned, and I had the time of my life.”",
                  },
                  {
                    id: 51,
                    tag: "p",
                    class: "font-semibold text-blue-600",
                    content: "— Sarah M.",
                  },
                ],
              },
              {
                id: 52,
                tag: "div",
                class: "bg-white rounded-xl shadow p-6 flex-1",
                children: [
                  {
                    id: 53,
                    tag: "p",
                    class: "text-gray-700 mb-4 italic",
                    content:
                      "“Wanderly took care of everything. I just showed up and enjoyed paradise!”",
                  },
                  {
                    id: 54,
                    tag: "p",
                    class: "font-semibold text-blue-600",
                    content: "— Jason K.",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 55,
        tag: "footer",
        class: "py-10 bg-blue-600 text-white text-center",
        children: [
          {
            id: 56,
            tag: "p",
            class: "text-lg font-semibold mb-2",
            content: "Ready to start your next adventure?",
          },
          {
            id: 57,
            tag: "button",
            class:
              "px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition",
            content: "Get Started",
          },
          {
            id: 58,
            tag: "p",
            class: "mt-6 text-sm text-blue-100",
            content: "© 2025 Wanderly Travel Agency. All rights reserved.",
          },
        ],
      },
    ],
  },
];

// 🧩 Recursive renderer for JSON elements
function RenderElement({ element }: { element: WebElement }) {
  // ✅ Use React.createElement instead of JSX to avoid TS error
  const children =
    element.children?.map((child) => (
      <RenderElement key={child.id} element={child} />
    )) || element.content;

  return React.createElement(
    element.tag,
    { key: element.id, className: element.class },
    children,
  );
}

export function Preview() {
  const [device, setDevice] = useState<DeviceType>("desktop");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [website, setWebsite] = useState<WebElement[]>(sampleWebsite);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setWebsite([...sampleWebsite]); // simulate reload
    }, 500);
  };

  const deviceSizes = {
    desktop: "w-full h-full",
    tablet: "w-[768px] h-[1024px]",
    mobile: "w-[375px] h-[667px]",
  };

  return (
    <div className="flex h-full flex-col bg-muted">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-semibold text-foreground">Preview</h3>
          <Tabs
            value={device}
            onValueChange={(v) => setDevice(v as DeviceType)}
          >
            <TabsList>
              <TabsTrigger value="desktop" className="gap-2">
                <Monitor className="h-4 w-4" />
                <span className="hidden sm:inline">Desktop</span>
              </TabsTrigger>
              <TabsTrigger value="tablet" className="gap-2">
                <Tablet className="h-4 w-4" />
                <span className="hidden sm:inline">Tablet</span>
              </TabsTrigger>
              <TabsTrigger value="mobile" className="gap-2">
                <Smartphone className="h-4 w-4" />
                <span className="hidden sm:inline">Mobile</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            className={cn(isRefreshing && "animate-spin")}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* JSON-rendered Website Preview */}
      <div className="flex flex-1 items-center justify-center overflow-auto p-6">
        <div
          className={cn(
            "bg-background shadow-2xl transition-all duration-300 rounded-lg overflow-hidden border border-border",
            deviceSizes[device],
            device !== "desktop" && "max-h-full",
          )}
        >
          <div className="h-full w-full overflow-auto p-4">
            {website.map((element) => (
              <RenderElement key={element.id} element={element} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
