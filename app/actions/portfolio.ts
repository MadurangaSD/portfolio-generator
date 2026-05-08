"use server";
import { currentUser } from "@clerk/nextjs/server";
import { ensureConnected, getDb } from "@/lib/mongodb";

type ProjectInput = {
  title: string;
  description: string;
  techStack: string;
  projectLink: string;
};

type SavePortfolioInput = {
  formData: {
    username?: string;
    profileImage?: string | null;
    projectImages?: string[];
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
  | { ok: false; error: string }
  | { ok: true; portfolioId: string; username?: string };

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
  profileImage?: string | null;
  projectImages?: string[];
};

type PortfolioDocument = {
  userId: string;
  username: string;
  bio: string | null;
  profileImage: string | null;
  projectImages: string[];
  skills: string[];
  projects: ProjectsJson;
  theme: string;
};

type UserDocument = {
  _id: unknown;
  clerkId: string;
  email: string;
  name: string | null;
  portfolio?: PortfolioDocument | null;
};

function buildProjectsJson(payload: SavePortfolioInput): ProjectsJson {
  const normalizedProfileImage =
    typeof payload.formData.profileImage === "string" && payload.formData.profileImage.trim().length > 0
      ? payload.formData.profileImage.trim()
      : null;

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
    profileImage: normalizedProfileImage,
    projectImages: payload.formData.projectImages ?? [],
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

    await ensureConnected();
    const db = getDb();
    const users = db.collection<UserDocument>("User");
    const portfolios = db.collection<PortfolioDocument>("Portfolio");

    const name =
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : payload.formData.fullName ?? null;

    console.log("[saveOrUpdatePortfolioAction] Upserting user via MongoDB with clerkId:", user.id);
    await users.updateOne(
      { clerkId: user.id },
      {
        $set: {
          clerkId: user.id,
          email: primaryEmail,
          name,
        },
      },
      { upsert: true },
    );

    const savedUser = await users.findOne({ clerkId: user.id });
    if (!savedUser) {
      console.error("[saveOrUpdatePortfolioAction] MongoDB user lookup returned no user after upsert");
      return { ok: false, error: "Failed to upsert user via MongoDB" };
    }

    const projectsJson = buildProjectsJson(payload);

    console.log("[saveOrUpdatePortfolioAction] profileImage in payload:", payload.formData.profileImage);

    const username = payload.formData.username
      ? payload.formData.username.trim().toLowerCase()
      : primaryEmail.split("@")[0];
    const profileImage =
      typeof payload.formData.profileImage === "string" && payload.formData.profileImage.trim().length > 0
        ? payload.formData.profileImage.trim()
        : null;

    const portfolioDocument: PortfolioDocument = {
      userId: String(savedUser._id),
      username,
      bio: payload.formData.bio ?? null,
      profileImage,
      projectImages: payload.formData.projectImages ?? [],
      skills: payload.formData.skills.filter(Boolean),
      projects: projectsJson,
      theme: payload.theme ?? "bento-dark",
    };

    console.log("[saveOrUpdatePortfolioAction] Upserting portfolio via MongoDB for userId:", portfolioDocument.userId);

    await portfolios.updateOne(
      { userId: portfolioDocument.userId },
      {
        $set: portfolioDocument,
      },
      { upsert: true },
    );

    await users.updateOne(
      { clerkId: user.id },
      {
        $set: {
          portfolio: portfolioDocument,
          name,
          email: primaryEmail,
        },
      },
    );

    const savedPortfolio = await portfolios.findOne({ userId: portfolioDocument.userId });
    if (!savedPortfolio) {
      console.error("[saveOrUpdatePortfolioAction] MongoDB portfolio lookup returned no portfolio after upsert");
      return { ok: false, error: "Failed to upsert portfolio via MongoDB" };
    }

    console.log(
      "[saveOrUpdatePortfolioAction] Portfolio upserted via MongoDB. portfolioId:",
      String(savedPortfolio._id),
      "username:",
      savedPortfolio.username,
    );
    return { ok: true, portfolioId: String(savedPortfolio._id), username: savedPortfolio.username ?? undefined };
  } catch (error) {
    console.error("[saveOrUpdatePortfolioAction] Error:");
    console.dir(error, { depth: null });
    const errorMsg = error instanceof Error ? error.message : JSON.stringify(error);
    return { ok: false, error: errorMsg };
  }
}