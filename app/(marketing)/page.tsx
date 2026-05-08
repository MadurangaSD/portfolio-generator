import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import LandingPageClient from "./landing";

export default async function MarketingPage() {
  // Server-side Clerk auth check
  const user = await currentUser();

  // If user is authenticated, redirect to dashboard
  if (user) {
    redirect("/dashboard");
  }

  // If no user, show the landing page
  return <LandingPageClient />;
}
