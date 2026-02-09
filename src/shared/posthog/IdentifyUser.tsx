import { useEffect } from "react";
import posthog from "posthog-js";
import { useSession } from "../session";

export function PostHogIdentify() {
  const { user } = useSession();

  useEffect(() => {
    if (!user) {
      posthog.reset(); // logout or not loaded yet
      return;
    }

    const email = user.email;

    if (email) {
      posthog.identify(user.id, {
        email,
        name: user.name,
      });
    }
  }, [user]);

  return null;
}
