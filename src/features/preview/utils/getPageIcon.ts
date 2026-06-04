import {
  Home,
  Info,
  Mail,
  Settings,
  ShoppingCart,
  Users,
  Layers,
} from "lucide-react";

export function getPageIcon(pageName: string) {
  const name = pageName.toLowerCase();

  if (name.includes("home") || name === "index" || name === "/") {
    return Home;
  }

  if (name.includes("about")) {
    return Info;
  }

  if (name.includes("contact")) {
    return Mail;
  }

  if (name.includes("setting")) {
    return Settings;
  }

  if (
    name.includes("cart") ||
    name.includes("shop") ||
    name.includes("product")
  ) {
    return ShoppingCart;
  }

  if (name.includes("team") || name.includes("user")) {
    return Users;
  }

  return Layers;
}
