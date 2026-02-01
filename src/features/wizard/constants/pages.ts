import { PageType } from "../types";
import { Section, SectionType } from "../types/section";
import {
  Home,
  User,
  Mail,
  Briefcase,
  Award,
  Users,
  Package,
  ShoppingCart,
  Coffee,
  Bed,
  Heart,
  Map,
  Plane,
  Clock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * ----------------------------------------
 * PAGE OPTIONS
 * ----------------------------------------
 * Master list of available pages that users
 * can select when building their website.
 */
export interface PageOption {
  type: PageType;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const pageOptions: PageOption[] = [
  // Core Pages
  { type: "home", label: "Home", description: "Main landing page", icon: Home },
  { type: "about", label: "About", description: "Tell your story", icon: User },
  {
    type: "contact",
    label: "Contact",
    description: "Get in touch form",
    icon: Mail,
  },

  // Portfolio & Business
  {
    type: "projects",
    label: "Projects",
    description: "Work portfolio showcase",
    icon: Briefcase,
  },
  {
    type: "services",
    label: "Services",
    description: "What you offer",
    icon: Award,
  },
  { type: "team", label: "Team", description: "Meet our team", icon: Users },

  // E-commerce & Products
  {
    type: "products",
    label: "Products",
    description: "Your product catalog",
    icon: Package,
  },
  {
    type: "shop",
    label: "Shop",
    description: "Online store",
    icon: ShoppingCart,
  },

  // Restaurant
  {
    type: "menu",
    label: "Menu",
    description: "Food and drink offerings",
    icon: Coffee,
  },

  // Hotel & Travel
  {
    type: "rooms",
    label: "Rooms",
    description: "Accommodation options",
    icon: Bed,
  },
  {
    type: "amenities",
    label: "Amenities",
    description: "Facilities and services",
    icon: Heart,
  },
  { type: "location", label: "Location", description: "Find us", icon: Map },
  {
    type: "tours",
    label: "Tours",
    description: "Travel packages",
    icon: Plane,
  },

  // Service Pages
  {
    type: "process",
    label: "Process",
    description: "How we work",
    icon: Clock,
  },
];

/**
 * ----------------------------------------
 * WEBSITE TYPE → PAGE PRESETS
 * ----------------------------------------
 * Defines default pages for each type of website.
 * This is used to auto-select pages when the user
 * chooses a website category.
 */
export const websitePagesMap: Record<
  | "portfolio"
  | "restaurant"
  | "hotel"
  | "travel agency"
  | "shop"
  | "smallMediumBusiness",
  PageType[]
> = {
  portfolio: ["home", "about", "projects", "services", "contact"],

  restaurant: ["home", "menu", "about", "contact", "location"],

  hotel: ["home", "rooms", "amenities", "location", "contact"],

  "travel agency": ["home", "tours", "services", "about", "contact"],

  shop: ["home", "products", "about", "contact"],

  smallMediumBusiness: ["home", "services", "about", "products", "contact"],
};

export const websitePageDefaults: Record<
  keyof typeof websitePagesMap,
  {
    required: PageType[];
    defaultSelected: PageType[];
  }
> = {
  portfolio: {
    required: ["home"],
    defaultSelected: ["about", "projects", "contact"],
  },

  restaurant: {
    required: ["home"],
    defaultSelected: ["menu", "about", "contact"],
  },

  hotel: {
    required: ["home"],
    defaultSelected: ["rooms", "amenities", "contact"],
  },

  "travel agency": {
    required: ["home"],
    defaultSelected: ["tours", "about", "contact"],
  },

  shop: {
    required: ["home"],
    defaultSelected: ["products", "about", "contact"],
  },

  smallMediumBusiness: {
    required: ["home"],
    defaultSelected: ["services", "about", "contact"],
  },
};

/**
 * ----------------------------------------
 * PAGE TYPE → ALLOWED SECTION TYPES
 * ----------------------------------------
 * Defines which section types can be added to each page.
 * Controls the section dropdown options in the page editor.
 */
export const pageSectionsMap: Record<PageType, SectionType[]> = {
  // Core Pages
  home: [],
  about: ["content"],
  contact: ["content"],

  // Portfolio & Business
  projects: ["content"],
  services: ["content"], // services, explanation, price, CTA
  team: ["content"], // team info + intro content

  // E-commerce
  products: ["content"], // all product info + highlights + price + CTA
  shop: ["content"], // shop landing, product showcase + highlights + CTA

  // Restaurant
  menu: ["content"], // hero, menu highlights, images, descriptions

  // Hotel & Travel
  rooms: ["content"], // hero, room highlights, images, descriptions
  amenities: ["content"], // facilities + description + visuals
  location: ["content"], // location info + contact
  tours: ["content"], // hero, tour highlights, visuals, descriptions

  // Service Pages
  process: ["content"], // workflow + description
};

export const defaultPagePlaceholders: Record<PageType, Omit<Section, "id">[]> =
  {
    home: [],

    about: [
      {
        type: "content",
        content: "",
        placeholder:
          "👋 Tell visitors who you are, your story, mission, and what makes your business or project special.",
      },
    ],

    contact: [
      {
        type: "content",
        content: "",
        placeholder:
          "📞 Add your contact details here — address, phone number, email, or a form link so people can reach you easily.",
      },
    ],

    projects: [
      {
        type: "content",
        content: "",
        placeholder:
          "🧠 Highlight your best projects or case studies. Include a short description, results, or what made them special.",
      },
    ],

    services: [
      {
        type: "content",
        content: "",
        placeholder:
          "💼 Describe the services you offer and how they help your clients. Be clear and confident.",
      },
    ],

    team: [
      {
        type: "content",
        content: "",
        placeholder:
          "👥 Introduce your team members. Mention their roles, skills, and what makes them awesome.",
      },
    ],

    products: [
      {
        type: "content",
        content: "",
        placeholder:
          "🛒 Showcase your main products. Describe features, benefits, and why people should love them.",
      },
    ],

    shop: [
      {
        type: "content",
        content: "",
        placeholder:
          "🛍️ Welcome visitors to your shop. Describe what kind of products you sell and what makes them unique.",
      },
    ],

    menu: [
      {
        type: "content",
        content: "",
        placeholder:
          "🍴 Add your restaurant’s menu highlights — signature dishes, specials, or must-try meals.",
      },
    ],

    rooms: [
      {
        type: "content",
        content: "",
        placeholder:
          "🛏️ Describe your rooms — comfort, style, and what guests can expect. Mention any special amenities.",
      },
    ],

    amenities: [
      {
        type: "content",
        content: "",
        placeholder:
          "🏊 Highlight your hotel’s facilities — pool, gym, spa, free WiFi, breakfast, and anything else guests will love.",
      },
    ],

    location: [
      {
        type: "content",
        content: "",
        placeholder:
          "📍 Tell visitors where you’re located and why it’s great — nearby attractions, transport links, or scenic views.",
      },
    ],

    tours: [
      {
        type: "content",
        content: "",
        placeholder:
          "🗺️ Describe your available tours or travel packages. Mention what travelers can experience and enjoy.",
      },
    ],

    process: [
      {
        type: "content",
        content: "",
        placeholder:
          "🧩 Explain your workflow or process. Walk visitors through how you deliver your product or service.",
      },
    ],
  };
