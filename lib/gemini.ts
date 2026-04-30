import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
	throw new Error("Missing NEXT_PUBLIC_GEMINI_API_KEY environment variable.");
}

const genAI = new GoogleGenerativeAI(apiKey);
const modelName = process.env.NEXT_PUBLIC_GEMINI_MODEL ?? "gemini-2.5-flash";

type PortfolioFormValues = {
	fullName: string;
	role: string;
	bio: string;
	skills: { value: string }[];
	projects: { title: string; description: string; techStack: string }[];
};

export async function generatePortfolioContent(userData: PortfolioFormValues) {
	const model = genAI.getGenerativeModel({ model: modelName });

	const prompt = `
You are a professional career coach and portfolio copywriter.
Transform the following information into polished portfolio website copy.

Full Name: ${userData.fullName}
Role: ${userData.role}
Bio: ${userData.bio}
Skills: ${userData.skills.map((skill) => skill.value).filter(Boolean).join(", ")}
Projects: ${userData.projects
	.map(
		(project) =>
			`- ${project.title}: ${project.description} | Tech Stack: ${project.techStack}`,
	)
	.join("\n")}

Return a concise but premium result with:
- a refined professional summary
- a short skills overview
- improved project descriptions
`;

	try {
		const result = await model.generateContent(prompt);
		const response = await result.response;
		return response.text();
	} catch (error) {
		console.error("AI Generation Error:", error);
		throw error;
	}
}