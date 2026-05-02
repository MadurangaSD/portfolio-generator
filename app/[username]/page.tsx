import { prisma } from "@/lib/prisma";
import PortfolioDisplay from "@/components/PortfolioDisplay";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ username: string }>;
};

export default async function UserProfilePage({ params }: Props) {
  const resolvedParams = await params;
  const username = resolvedParams.username?.trim().toLowerCase();

  if (!username) return notFound();

  const portfolio = await prisma.portfolio.findUnique({
    where: { username },
  });

  if (!portfolio) return notFound();

  const projectsData = typeof portfolio.projects === "object" ? portfolio.projects : {};

  return (
    <PortfolioDisplay
      portfolio={{
        bio: portfolio.bio || "",
        skills: portfolio.skills || [],
        theme: portfolio.theme || "bento-dark",
        projects: projectsData,
      }}
    />
  );
}
