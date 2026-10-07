"use client";

import { useEffect } from "react";
import { getSleekplanSSOToken } from "@/features/sleekplan/api/getSleekplanSSOToken";

interface SleekplanSDK {
  sso?: (callback: (data: { token: string }) => void) => void;
}

declare global {
  interface Window {
    $sleek?: SleekplanSDK;
    SLEEK_PRODUCT_ID: number;
  }
}

export function SleekplanProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    window.SLEEK_PRODUCT_ID = Number(
      process.env.NEXT_PUBLIC_SLEEKPLAN_PRODUCT_ID,
    );

    window.$sleek = window.$sleek || {};

    window.$sleek.sso = async (callback) => {
      const result = await getSleekplanSSOToken();

      if (!result.success) {
        console.error("[SLEEKPLAN] Failed to get SSO token:", result.error);
        return;
      }

      callback({
        token: result.token,
      });
    };

    const existingScript = document.querySelector(
      'script[src="https://client.sleekplan.com/sdk/e.js"]',
    );

    if (existingScript) {
      return;
    }

    const script = document.createElement("script");

    script.type = "text/javascript";
    script.src = "https://client.sleekplan.com/sdk/e.js";
    script.async = true;

    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return children;
}
