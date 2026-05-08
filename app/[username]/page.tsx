import PortfolioDisplay from "@/components/PortfolioDisplay";
import { notFound } from "next/navigation";
import { ensureConnected, getDb } from "@/lib/mongodb";

type PortfolioDocument = {
  bio: string | null;
  skills: string[];
  theme: string;
  projects: unknown;
  profileImage?: string | null;
  username?: string | null;
};

type Props = {
  params: Promise<{ username: string }>;
};

export default async function UserProfilePage({ params }: Props) {
  const resolvedParams = await params;
  const username = resolvedParams.username?.trim().toLowerCase();

  if (!username) return notFound();

  await ensureConnected();
  const db = getDb();
  const portfolios = db.collection<PortfolioDocument>("Portfolio");

  const portfolio = await portfolios.findOne({ username });

  if (!portfolio) return notFound();

  const projectsData = typeof portfolio.projects === "object" ? portfolio.projects : {};

  return (
    <PortfolioDisplay
      portfolio={{
        bio: portfolio.bio || "",
        skills: portfolio.skills || [],
        theme: portfolio.theme || "bento-dark",
        projects: projectsData,
        profileImage: portfolio.profileImage ?? null,
      }}
    />
  );
}
