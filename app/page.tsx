import UserForm from "@/components/UserForm";
import { auth } from "@clerk/nextjs/server";
import { getDb, mongoClient } from "@/lib/mongodb";

type ProjectInput = {
  title: string;
  description: string;
  techStack: string;
  projectLink: string;
};

type InitialPortfolioData = {
  aiResponse: string;
  formData: {
    fullName: string;
    role: string;
    bio: string;
    linkedinUrl: string;
    githubUrl: string;
    skills: string[];
    projects: ProjectInput[];
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseProjects(value: unknown): ProjectInput[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!isRecord(item)) {
        return null;
      }

      return {
        title: typeof item.title === "string" ? item.title : "",
        description: typeof item.description === "string" ? item.description : "",
        techStack: typeof item.techStack === "string" ? item.techStack : "",
        projectLink: typeof item.projectLink === "string" ? item.projectLink : "",
      };
    })
    .filter((item): item is ProjectInput => Boolean(item));
}

export default async function Home() {
  const session = await auth();
  let initialData: InitialPortfolioData | null = null;

  if (session.userId) {
    if (!mongoClient.topology || !mongoClient.topology.isConnected()) {
      await mongoClient.connect();
    }

    const db = getDb();
    const users = db.collection("User");

    const savedUser = await users.findOne({ clerkId: session.userId });

    if (savedUser && savedUser.portfolio) {
      const projectsPayload = isRecord(savedUser.portfolio.projects)
        ? savedUser.portfolio.projects
        : {};
      const profile = isRecord(projectsPayload.profile) ? projectsPayload.profile : {};
      const links = isRecord(projectsPayload.links) ? projectsPayload.links : {};

      initialData = {
        aiResponse:
          typeof projectsPayload.aiResponse === "string" ? projectsPayload.aiResponse : "",
        formData: {
          fullName:
            typeof profile.fullName === "string"
              ? profile.fullName
              : savedUser.name ?? "",
          role: typeof profile.role === "string" ? profile.role : "",
          bio: savedUser.portfolio.bio ?? "",
          linkedinUrl:
            typeof links.linkedinUrl === "string" ? links.linkedinUrl : "",
          githubUrl: typeof links.githubUrl === "string" ? links.githubUrl : "",
          skills: savedUser.portfolio.skills ?? [],
          projects: parseProjects(projectsPayload.projects),
        },
      };
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_10%,#111827_0%,#030712_45%,#020617_100%)] px-4 py-10 sm:px-8 sm:py-16">
      <UserForm initialData={initialData} />
    </main>
  );
}
