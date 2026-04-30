import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type PortfolioRecord = {
  aiResponse: string;
  formData: {
    fullName: string;
    role: string;
    bio: string;
    linkedinUrl: string;
    githubUrl: string;
    skills: string[];
    projects: {
      title: string;
      description: string;
      techStack: string;
      projectLink: string;
    }[];
  };
};

type AtlasDataApiPayload = {
  dataSource: string;
  database: string;
  collection: string;
  document: Record<string, unknown>;
};

async function saveToMongoDataApi(record: Record<string, unknown>) {
  const baseUrl = process.env.MONGODB_DATA_API_URL;
  const apiKey = process.env.MONGODB_DATA_API_KEY;
  const dataSource = process.env.MONGODB_DATA_SOURCE;
  const database = process.env.MONGODB_DATABASE;
  const collection = process.env.MONGODB_COLLECTION;

  if (!baseUrl || !apiKey || !dataSource || !database || !collection) {
    return {
      ok: false,
      reason: "MongoDB Data API is not configured.",
    } as const;
  }

  const payload: AtlasDataApiPayload = {
    dataSource,
    database,
    collection,
    document: record,
  };

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/action/insertOne`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`MongoDB save failed: ${response.status} ${body}`);
  }

  return response.json() as Promise<{ insertedId: string }>;
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clerkUser = await clerkClient().users.getUser(session.userId);
  const body = (await request.json()) as PortfolioRecord;

  if (!body?.aiResponse || !body?.formData?.fullName || !body?.formData?.role) {
    return NextResponse.json({ error: "Invalid portfolio payload" }, { status: 400 });
  }

  const timestamp = new Date().toISOString();
  const record = {
    clerkUserId: session.userId,
    clerkEmail: clerkUser.primaryEmailAddress?.emailAddress ?? null,
    aiResponse: body.aiResponse,
    formData: body.formData,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  try {
    const result = await saveToMongoDataApi(record);

    if (!result.ok) {
      return NextResponse.json(
        {
          error: result.reason,
          savedToDatabase: false,
          savedToLocalOnly: true,
        },
        { status: 202 },
      );
    }

    return NextResponse.json(
      {
        message: "Portfolio saved",
        insertedId: result.insertedId,
        savedToDatabase: true,
      },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save portfolio";
    return NextResponse.json(
      {
        error: message,
        savedToDatabase: false,
        savedToLocalOnly: true,
      },
      { status: 202 },
    );
  }
}
