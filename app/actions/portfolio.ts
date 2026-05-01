"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import type { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

type ProjectInput = {
  title: string;
  description: string;
  techStack: string;
  projectLink: string;
};

type SavePortfolioInput = {
  formData: {
    fullName: string;
    role: string;
    bio: string;
    linkedinUrl: string;
    githubUrl: string;
    skills: string[];
    projects: ProjectInput[];
  };
  aiResponse: string;
  theme?: string;
};

type SavePortfolioResult =
  | { ok: true; portfolioId: string }
  | { ok: false; error: string };

function buildProjectsJson(payload: SavePortfolioInput): Prisma.InputJsonValue {
  return {
    aiResponse: payload.aiResponse,
    projects: payload.formData.projects,
    links: {
      linkedinUrl: payload.formData.linkedinUrl,
      githubUrl: payload.formData.githubUrl,
    },
    profile: {
      fullName: payload.formData.fullName,
      role: payload.formData.role,
    },
  } as Prisma.InputJsonValue;
}

export async function saveOrUpdatePortfolioAction(
  payload: SavePortfolioInput,
): Promise<SavePortfolioResult> {
  const session = await auth();

  if (!session.userId) {
    return { ok: false, error: "Unauthorized" };
  }

  try {
    const userFromClerk = await clerkClient().users.getUser(session.userId);
    const primaryEmail = userFromClerk.primaryEmailAddress?.emailAddress;

    if (!primaryEmail) {
      return { ok: false, error: "No primary email found for signed-in user." };
    }

    const dbUser = await prisma.user.upsert({
      where: { clerkId: session.userId },
      update: {
        email: primaryEmail,
        name: userFromClerk.fullName ?? payload.formData.fullName || null,
      },
      create: {
        clerkId: session.userId,
        email: primaryEmail,
        name: userFromClerk.fullName ?? payload.formData.fullName || null,
      },
    });

    const portfolio = await prisma.portfolio.upsert({
      where: { userId: dbUser.id },
      update: {
        bio: payload.formData.bio || null,
        skills: payload.formData.skills.filter(Boolean),
        projects: buildProjectsJson(payload),
        theme: payload.theme ?? "bento-dark",
      },
      create: {
        userId: dbUser.id,
        bio: payload.formData.bio || null,
        skills: payload.formData.skills.filter(Boolean),
        projects: buildProjectsJson(payload),
        theme: payload.theme ?? "bento-dark",
      },
    });

    return { ok: true, portfolioId: portfolio.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save portfolio.";
    return { ok: false, error: message };
  }
}
