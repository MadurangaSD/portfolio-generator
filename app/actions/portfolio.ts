"use server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

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

type ProjectsJson = {
  aiResponse: string;
  projects: ProjectInput[];
  links: {
    linkedinUrl: string;
    githubUrl: string;
  };
  profile: {
    fullName: string;
    role: string;
  };
};

function buildProjectsJson(payload: SavePortfolioInput): ProjectsJson {
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
  };
}

export async function saveOrUpdatePortfolioAction(
  payload: SavePortfolioInput,
): Promise<SavePortfolioResult> {
  console.log("[saveOrUpdatePortfolioAction] Received payload:", {
    hasFormData: !!payload?.formData,
    hasAiResponse: !!payload?.aiResponse,
    formDataKeys: payload?.formData ? Object.keys(payload.formData) : null,
    skillsCount: payload?.formData?.skills?.length ?? 0,
    projectsCount: payload?.formData?.projects?.length ?? 0,
  });

  const user = await currentUser();

  if (!user) {
    console.error("[saveOrUpdatePortfolioAction] No user found - not authenticated");
    return { ok: false, error: "Unauthorized" };
  }

  try {
    console.log("[saveOrUpdatePortfolioAction] Starting save for clerkId:", user.id);

    const primaryEmail = user.primaryEmailAddress?.emailAddress;
    if (!primaryEmail) {
      console.error("[saveOrUpdatePortfolioAction] No primary email found for user");
      return { ok: false, error: "No primary email found for signed-in user." };
    }

    // Upsert User via Prisma using clerkId as unique key
    console.log("[saveOrUpdatePortfolioAction] Upserting user via Prisma with clerkId:", user.id);
    let dbUser;
    try {
      dbUser = await prisma.user.upsert({
        where: { clerkId: user.id },
        update: {
          email: primaryEmail,
          name:
            user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : payload.formData.fullName ?? null,
        },
        create: {
          clerkId: user.id,
          email: primaryEmail,
          name:
            user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : payload.formData.fullName ?? null,
        },
      });
    } catch (prismaUserError) {
      console.error("[saveOrUpdatePortfolioAction] prisma.user.upsert threw error:");
      console.dir(prismaUserError, { depth: null });
      throw prismaUserError;
    }

    if (!dbUser || !dbUser.id) {
      console.error("[saveOrUpdatePortfolioAction] prisma.user.upsert returned no user:", dbUser);
      return { ok: false, error: "Failed to upsert user via Prisma" };
    }

    console.log("[saveOrUpdatePortfolioAction] User upserted via Prisma. id:", dbUser.id);

    // Upsert Portfolio via Prisma using the user's MongoDB id (not Clerk ID) as userId
    console.log("[saveOrUpdatePortfolioAction] Upserting portfolio via Prisma for userId:", dbUser.id);
    let portfolio;
    try {
      const projectsJson = buildProjectsJson(payload);

      portfolio = await prisma.portfolio.upsert({
        where: { userId: dbUser.id },
        update: {
          bio: payload.formData.bio ?? null,
          skills: payload.formData.skills.filter(Boolean),
          projects: projectsJson as Prisma.JsonValue,
          theme: payload.theme ?? "bento-dark",
        },
        create: {
          userId: dbUser.id,
          bio: payload.formData.bio ?? null,
          skills: payload.formData.skills.filter(Boolean),
          projects: projectsJson as Prisma.JsonValue,
          theme: payload.theme ?? "bento-dark",
        },
      });
    } catch (prismaPortfolioError) {
      console.error("[saveOrUpdatePortfolioAction] prisma.portfolio.upsert threw error:");
      console.dir(prismaPortfolioError, { depth: null });
      throw prismaPortfolioError;
    }

    if (!portfolio || !portfolio.id) {
      console.error("[saveOrUpdatePortfolioAction] prisma.portfolio.upsert returned no portfolio:", portfolio);
      return { ok: false, error: "Failed to upsert portfolio via Prisma" };
    }

    console.log("[saveOrUpdatePortfolioAction] Portfolio upserted via Prisma. portfolioId:", portfolio.id);
    return { ok: true, portfolioId: portfolio.id };
  } catch (error) {
    console.error("[saveOrUpdatePortfolioAction] Error:");
    console.dir(error, { depth: null });
    const errorMsg = error instanceof Error ? error.message : JSON.stringify(error);
    return { ok: false, error: errorMsg };
  }
}