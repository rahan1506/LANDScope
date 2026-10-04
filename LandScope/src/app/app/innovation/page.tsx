import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { InnovationPageClient } from "@/components/innovation/innovation-page-client";

export default async function InnovationPage() {
  const ctx = await getAuthenticatedUser();

  // Unauthenticated users are redirected to login with redirect param
  if (!ctx) {
    redirect("/login?redirect=/app/innovation");
  }

  return <InnovationPageClient user={ctx.user} role={ctx.role} />;
}
