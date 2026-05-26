import { useEffect } from "react";
import { GOOGLE_FONTS } from "../constants/chat";

export function useGoogleFonts() {
  useEffect(() => {
    GOOGLE_FONTS.forEach((font) => {
      const id = `font-${font.replace(/\s+/g, "-")}`;

      if (document.getElementById(id)) {
        return;
      }

      const link = document.createElement("link");

      link.id = id;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${font.replace(
        / /g,
        "+",
      )}:wght@300;400;500;600;700&display=swap`;

      document.head.appendChild(link);
    });
  }, []);
}
