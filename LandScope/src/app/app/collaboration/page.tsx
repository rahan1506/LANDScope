import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { CollaborationPageClient } from "@/components/collaboration/collaboration-page-client";

export default async function CollaborationPage() {
  const ctx = await getAuthenticatedUser();

  // 1. Unauthenticated users cannot access Collaboration
  if (!ctx) {
    redirect("/login?redirect=/app/collaboration");
  }

  return <CollaborationPageClient user={ctx.user} role={ctx.role} />;
}
