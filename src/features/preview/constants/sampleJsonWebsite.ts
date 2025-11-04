import { WebsiteData } from "../types";

export const sampleWebsite: WebsiteData = {
  elements: [
    {
      page: "home",
      id: 1,
      title: "Wanderly Travels | Explore the World",
      description: "Discover breathtaking destinations with Wanderly Travels.",
      theme: "light",
      pageContent: [
        {
          id: 101,
          tag: "nav",
          class: "bg-white border-b border-gray-200",
          children: [
            {
              id: 102,
              tag: "div",
              class:
                "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16",
              children: [
                {
                  id: 103,
                  tag: "a",
                  class: "text-2xl font-bold text-blue-600",
                  attributes: {
                    href: "/",
                  },
                  content: "Wanderly Travels",
                },
                {
                  id: 104,
                  tag: "div",
                  class: "hidden md:flex space-x-6",
                  children: [
                    {
                      id: 105,
                      tag: "a",
                      class: "text-gray-700 hover:text-blue-600",
                      attributes: { href: "/" },
                      content: "Home",
                    },
                    {
                      id: 106,
                      tag: "a",
                      class: "text-gray-700 hover:text-blue-600",
                      attributes: { href: "/destinations" },
                      content: "Destinations",
                    },
                    {
                      id: 107,
                      tag: "a",
                      class: "text-gray-700 hover:text-blue-600",
                      attributes: { href: "/packages" },
                      content: "Packages",
                    },
                    {
                      id: 108,
                      tag: "a",
                      class: "text-gray-700 hover:text-blue-600",
                      attributes: { href: "/about" },
                      content: "About",
                    },
                    {
                      id: 109,
                      tag: "a",
                      class: "text-gray-700 hover:text-blue-600",
                      attributes: { href: "/contact" },
                      content: "Contact",
                    },
                  ],
                },
                {
                  id: 110,
                  tag: "button",
                  class: "md:hidden text-gray-700",
                  attributes: {
                    "aria-label": "Toggle menu",
                  },
                  content: "☰",
                },
              ],
            },
          ],
        },
        {
          id: 111,
          tag: "section",
          class: "bg-blue-50 py-20 text-center",
          children: [
            {
              id: 112,
              tag: "h1",
              class: "text-4xl font-bold text-gray-800 mb-4",
              content: "Discover the World with Wanderly Travels",
            },
            {
              id: 113,
              tag: "p",
              class: "text-gray-600 text-lg mb-6",
              content:
                "Your adventure starts here. Explore exotic destinations and unique travel experiences.",
            },
            {
              id: 114,
              tag: "a",
              class:
                "bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700",
              attributes: { href: "/packages" },
              content: "View Packages",
            },
          ],
        },
      ],
    },
    {
      page: "destinations",
      id: 2,
      title: "Top Destinations | Wanderly Travels",
      description: "Explore our curated list of popular travel destinations.",
      theme: "light",
      pageContent: [
        {
          id: 201,
          tag: "section",
          class: "max-w-6xl mx-auto py-12 px-4",
          children: [
            {
              id: 202,
              tag: "h2",
              class: "text-3xl font-bold text-center mb-8 text-gray-800",
              content: "Top Destinations",
            },
            {
              id: 203,
              tag: "div",
              class: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8",
              children: [
                {
                  id: 204,
                  tag: "div",
                  class: "bg-white shadow rounded-lg overflow-hidden",
                  children: [
                    {
                      id: 205,
                      tag: "img",
                      class: "w-full h-48 object-cover",
                      attributes: { src: "/images/paris.jpg", alt: "Paris" },
                    },
                    {
                      id: 206,
                      tag: "div",
                      class: "p-4",
                      children: [
                        {
                          id: 207,
                          tag: "h3",
                          class: "text-lg font-semibold mb-2",
                          content: "Paris, France",
                        },
                        {
                          id: 208,
                          tag: "p",
                          class: "text-gray-600",
                          content:
                            "Experience the romance and beauty of the City of Lights.",
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 209,
                  tag: "div",
                  class: "bg-white shadow rounded-lg overflow-hidden",
                  children: [
                    {
                      id: 210,
                      tag: "img",
                      class: "w-full h-48 object-cover",
                      attributes: { src: "/images/tokyo.jpg", alt: "Tokyo" },
                    },
                    {
                      id: 211,
                      tag: "div",
                      class: "p-4",
                      children: [
                        {
                          id: 212,
                          tag: "h3",
                          class: "text-lg font-semibold mb-2",
                          content: "Tokyo, Japan",
                        },
                        {
                          id: 213,
                          tag: "p",
                          class: "text-gray-600",
                          content:
                            "A fusion of tradition and cutting-edge innovation.",
                        },
                      ],
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
      page: "about",
      id: 3,
      title: "About Us | Wanderly Travels",
      description: "Learn more about Wanderly Travels and our mission.",
      theme: "light",
      pageContent: [
        {
          id: 301,
          tag: "section",
          class: "max-w-4xl mx-auto py-16 px-6",
          children: [
            {
              id: 302,
              tag: "h2",
              class: "text-3xl font-bold mb-6 text-gray-800 text-center",
              content: "Our Story",
            },
            {
              id: 303,
              tag: "p",
              class: "text-gray-600 mb-4",
              content:
                "Founded in 2020, Wanderly Travels was created to make travel accessible and enjoyable for everyone. Our passion lies in helping travelers discover new experiences around the globe.",
            },
            {
              id: 304,
              tag: "p",
              class: "text-gray-600",
              content:
                "We partner with trusted agencies worldwide to provide safe, curated, and memorable adventures.",
            },
          ],
        },
      ],
    },
  ],
  metadata: {
    title: "Wanderly Travels",
    description: "A modern travel agency website powered by JSON rendering.",
    theme: "light",
  },
};
