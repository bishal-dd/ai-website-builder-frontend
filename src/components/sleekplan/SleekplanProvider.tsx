"use client";

import { useEffect } from "react";
import { getSleekplanSSOToken } from "@/features/sleekplan/api/getSleekplanSSOToken";
import { useSession } from "@/shared/session";

type SleekplanSSOCallback = (data: { token: string }) => void;

interface SleekplanSDK {
  sso?: (callback: SleekplanSSOCallback) => void;
  open?: () => void;
  setUser?: (data: { token: string }) => void;
  resetUser?: () => void;
}

declare global {
  interface Window {
    $sleek?: SleekplanSDK;
    SLEEK_PRODUCT_ID?: number;
  }
}

const SLEEKPLAN_SCRIPT = "https://client.sleekplan.com/sdk/e.js";
const PRODUCT_ID = Number(process.env.NEXT_PUBLIC_SLEEKPLAN_PRODUCT_ID);

async function fetchToken(): Promise<string | null> {
  const result = await getSleekplanSSOToken();

  if (!result.success) {
    console.error("[SLEEKPLAN] Failed to get SSO token:", result.error);
    return null;
  }

  return result.token;
}

function isScriptLoaded() {
  return Boolean(document.querySelector(`script[src="${SLEEKPLAN_SCRIPT}"]`));
}

function loadScript() {
  const script = document.createElement("script");
  script.src = SLEEKPLAN_SCRIPT;
  script.async = true;
  document.head.appendChild(script);
}

export function openSleekplan() {
  window.$sleek?.open?.();
}

export function resetSleekplanUser() {
  window.$sleek?.resetUser?.();
}

export function SleekplanProvider({ children }: { children: React.ReactNode }) {
  const { user } = useSession();
  const userKey = user?.email;

  useEffect(() => {
    if (!userKey) return;

    if (!PRODUCT_ID) {
      console.error("[SLEEKPLAN] NEXT_PUBLIC_SLEEKPLAN_PRODUCT_ID is missing");
      return;
    }

    let cancelled = false;

    window.SLEEK_PRODUCT_ID = PRODUCT_ID;
    window.$sleek = window.$sleek || {};

    // Called by the SDK when it initialises
    window.$sleek.sso = async (callback) => {
      const token = await fetchToken();
      if (token && !cancelled) callback({ token });
    };

    if (isScriptLoaded()) {
      // SDK was already initialised for a previous session, so push the new token in
      fetchToken().then((token) => {
        if (token && !cancelled) window.$sleek?.setUser?.({ token });
      });
    } else {
      loadScript();
    }

    return () => {
      cancelled = true;
    };
  }, [userKey]);

  return children;
}
