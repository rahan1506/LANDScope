import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth/session";

export default async function AppPage() {
  const ctx = await getAuthenticatedUser();

  if (!ctx) {
    redirect("/login");
  }

  // Redirect to user's authorized workspace
  redirect(`/app/${ctx.role.slug}`);
}
