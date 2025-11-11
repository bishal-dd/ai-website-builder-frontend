import AuthClientPage from "../../features/auth/AuthClient";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/actions/auth-actions";
import { headers } from "next/headers";

export default async function AuthPage() {
  const cookieHeader = (await headers()).get("cookie") || "";

  const session = await getSession(cookieHeader);

  if (session.user) {
    redirect("/wizard");
  }

  return <AuthClientPage />;
}
