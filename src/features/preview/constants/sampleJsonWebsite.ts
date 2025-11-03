import { WebsiteData } from "../types";

export const sampleWebsite: WebsiteData = {
  elements: [
    // ==============================
    // HOME PAGE
    // ==============================
    {
      page: "home",
      id: 1,
      title: "Home",
      description: "Welcome to Wanderlust Travels",
      theme: "default",
      pageContent: [
        {
          id: 1,
          tag: "div",
          class: "min-h-screen bg-gray-50 flex flex-col",
          children: [
            {
              id: 2,
              tag: "header",
              class:
                "bg-white/90 backdrop-blur-md shadow-md p-6 flex justify-between items-center sticky top-0 z-50",
              children: [
                {
                  id: 3,
                  tag: "h1",
                  class: "text-2xl font-bold text-blue-700",
                  content: "Wanderlust Travels",
                },
                {
                  id: 4,
                  tag: "button",
                  class: "md:hidden text-gray-700 focus:outline-none",
                  attributes: {
                    type: "button",
                    "aria-label": "Toggle menu",
                    onclick:
                      "document.getElementById('mobile-menu').classList.toggle('hidden')",
                  },
                  children: [
                    {
                      id: 5,
                      tag: "svg",
                      class: "w-6 h-6",
                      attributes: {
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        xmlns:
                          "[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)",
                      },
                      children: [
                        {
                          id: 6,
                          tag: "path",
                          attributes: {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M4 6h16M4 12h16M4 18h16",
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 7,
                  tag: "nav",
                  class: "hidden md:flex space-x-6 text-gray-700 font-medium",
                  children: [
                    {
                      id: 8,
                      tag: "a",
                      class: "hover:text-blue-600",
                      content: "Home",
                      attributes: { href: "/" },
                    },
                    {
                      id: 9,
                      tag: "a",
                      class: "hover:text-blue-600",
                      content: "Destinations",
                      attributes: { href: "/destinations" },
                    },
                    {
                      id: 10,
                      tag: "a",
                      class: "hover:text-blue-600",
                      content: "Services",
                      attributes: { href: "/services" },
                    },
                    {
                      id: 11,
                      tag: "a",
                      class: "hover:text-blue-600",
                      content: "About",
                      attributes: { href: "/about" },
                    },
                    {
                      id: 12,
                      tag: "a",
                      class: "hover:text-blue-600",
                      content: "Contact",
                      attributes: { href: "/contact" },
                    },
                  ],
                },
              ],
            },
            {
              id: 13,
              tag: "div",
              class:
                "md:hidden hidden flex-col space-y-2 bg-white shadow-md absolute top-full right-0 w-48 py-4 px-4 z-40",
              attributes: { id: "mobile-menu" },
              children: [
                {
                  id: 14,
                  tag: "a",
                  class: "block py-2 px-3 hover:bg-gray-100 rounded",
                  content: "Home",
                  attributes: { href: "/" },
                },
                {
                  id: 15,
                  tag: "a",
                  class: "block py-2 px-3 hover:bg-gray-100 rounded",
                  content: "Destinations",
                  attributes: { href: "/destinations" },
                },
                {
                  id: 16,
                  tag: "a",
                  class: "block py-2 px-3 hover:bg-gray-100 rounded",
                  content: "Services",
                  attributes: { href: "/services" },
                },
                {
                  id: 17,
                  tag: "a",
                  class: "block py-2 px-3 hover:bg-gray-100 rounded",
                  content: "About",
                  attributes: { href: "/about" },
                },
                {
                  id: 18,
                  tag: "a",
                  class: "block py-2 px-3 hover:bg-gray-100 rounded",
                  content: "Contact",
                  attributes: { href: "/contact" },
                },
              ],
            },
            // ... rest of your home page content remains unchanged
          ],
        },
      ],
    },
    // ==============================
    // DESTINATIONS PAGE
    // ==============================
    {
      page: "destinations",
      id: 2,
      title: "Destinations",
      description: "Explore our top travel spots",
      theme: "default",
      pageContent: [
        {
          id: 100,
          tag: "div",
          class: "min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-10",
          children: [
            {
              id: 101,
              tag: "h1",
              class: "text-4xl font-bold text-center text-gray-900 mb-12",
              content: "Top Destinations Around the World",
            },
            {
              id: 102,
              tag: "div",
              class: "grid md:grid-cols-3 gap-10 max-w-6xl mx-auto",
              children: [
                {
                  id: 103,
                  tag: "div",
                  class:
                    "rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition group",
                  children: [
                    {
                      id: 104,
                      tag: "img",
                      class:
                        "w-full h-64 object-cover group-hover:scale-105 transition-transform",
                      attributes: {
                        src: "[https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80](https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80)",
                        alt: "Paris city view",
                      },
                    },
                    {
                      id: 105,
                      tag: "div",
                      class: "p-6",
                      children: [
                        {
                          id: 106,
                          tag: "h4",
                          class: "text-xl font-semibold text-gray-800 mb-2",
                          content: "Paris, France",
                        },
                        {
                          id: 107,
                          tag: "p",
                          class: "text-gray-600",
                          content:
                            "Experience romance and culture in the city of lights.",
                        },
                      ],
                    },
                  ],
                },
                // ... add other destinations here
              ],
            },
          ],
        },
      ],
    },
  ],
};
