import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

authClient.getSession().then(session => {
  console.log(session);
});