import WebsiteWizard from "@/features/wizard/website-wizard";
import { getSession } from "@/lib/actions/auth-actions";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function WizardPage() {
  const cookieHeader = (await headers()).get("cookie") || "";

  const session = await getSession(cookieHeader);

  if (!session.user) {
    redirect("/auth");
  }

  return <WebsiteWizard />;
}
