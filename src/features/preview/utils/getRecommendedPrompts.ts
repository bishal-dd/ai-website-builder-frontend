import { websiteTypes } from "@/types";
export function getRecommendedPrompts(
  pageName: string,
  isNewPage: boolean,
  websiteType?: string,
) {
  if (isNewPage) {
    switch (websiteType) {
      case websiteTypes.travelAgency:
        return [
          "Create a Flight Ticketing page",
          "Create a treks page",
          "Create a Transportation and Car Rental page",
        ];
      case websiteTypes.hotel:
        return [
          "Create a Spa and Wellness page",
          "Create a Conference and Events page",
          "Create a Local Attractions page",
        ];
      case websiteTypes.portfolio:
        return [
          "Create a Case Studies page",
          "Create a Resume or Experience page",
          "Create a Skills and Technologies page",
        ];
      case websiteTypes.restaurant:
        return [
          "Create a Catering Services page",
          "Create a Events and Live Music page",
          "Create a Chef Specialties page",
        ];
      case websiteTypes.smallMediumBusiness:
        return [
          "Create a Booking or Appointment page",
          "Create a Careers page",
        ];
      case websiteTypes.realEstate:
        return ["Create a Buyer's Guide page", "Create a Seller's Guide page"];
      default:
        return [
          "Create a FAQ page for common customer questions",
          "Create a pricing page with packages and features",
          "Create a team page with member profiles",
        ];
    }
  }

  const name = pageName.toLowerCase();

  if (name.includes("home") || name === "index") {
    return [
      "Change the hero section to a sliding image carousel",
      "Add a FAQ section to answer common customer questions",
      "Add a testimonials section with 3 customer reviews",
    ];
  }

  if (name.includes("about")) {
    return [
      "Add a mission and values section",
      "Add a team introduction section with short profiles",
      "Make the about section more personal and story-driven",
    ];
  }

  if (name.includes("contact")) {
    return [
      "Add a contact form with name, email, phone, and message fields",
      "Add business hours and location details",
      "Improve the contact page with a map-style location section",
    ];
  }

  if (name.includes("service")) {
    return [
      "Add a pricing or package comparison section",
      "Rewrite the services section to sound more premium",
      "Add a process section explaining how the service works",
    ];
  }

  if (name.includes("tour")) {
    return [
      "Add more tour cards",
      "Add what is included and excluded in the package",
      "Add a booking call-to-action section",
    ];
  }

  if (name.includes("room")) {
    return [
      "Add room amenities with icons",
      "Add a room pricing and availability section",
      "Improve the room detail page with a luxury description",
    ];
  }

  if (name.includes("menu")) {
    return [
      "Organize the menu into clear categories",
      "Add chef recommendations or popular dishes",
      "Add prices and short descriptions for menu items",
    ];
  }

  if (name.includes("project")) {
    return [
      "Add more project cards",
      "Add project goals, process, and results",
      "Improve the project page with a stronger visual layout",
    ];
  }

  if (name.includes("product")) {
    return [
      "Add more product cards",
      "Add customer reviews for this product",
      "Add a stronger product call-to-action section",
    ];
  }

  return [
    "Improve this page with a more premium layout",
    "Add a FAQ section related to this page",
    "Rewrite the content to sound more clear and professional",
  ];
}
