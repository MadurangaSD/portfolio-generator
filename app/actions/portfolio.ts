"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { ObjectId } from "mongodb";
import { getDb, mongoClient } from "@/lib/mongodb";

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

    // Ensure MongoDB client is connected
    if (!mongoClient.topology || !mongoClient.topology.isConnected()) {
      await mongoClient.connect();
    }

    const db = getDb();
    const users = db.collection("User");
    const portfolios = db.collection("Portfolio");

    // Upsert user by clerkId
    const userResult = await users.findOneAndUpdate(
      { clerkId: session.userId },
      {
        $set: {
          clerkId: session.userId,
          email: primaryEmail,
          name: userFromClerk.fullName ?? payload.formData.fullName ?? null,
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true, returnDocument: "after" },
    );

    const dbUser = userResult.value;
    const userId = dbUser._id as ObjectId;

    // Upsert portfolio by userId
    const portfolioResult = await portfolios.findOneAndUpdate(
      { userId: userId },
      {
        $set: {
          userId,
          bio: payload.formData.bio ?? null,
          skills: payload.formData.skills.filter(Boolean),
          projects: buildProjectsJson(payload),
          theme: payload.theme ?? "bento-dark",
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true, returnDocument: "after" },
    );

    const portfolio = portfolioResult.value;

    return { ok: true, portfolioId: portfolio._id.toString() };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save portfolio.";
    return { ok: false, error: message };
  }
}
