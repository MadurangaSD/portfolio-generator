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

	// Robust generation: retry with exponential backoff and optional fallback model
	const maxRetries = Number(process.env.GENAI_MAX_RETRIES ?? 3);
	const baseDelayMs = Number(process.env.GENAI_BASE_DELAY_MS ?? 500);
	const fallbackModel = process.env.NEXT_PUBLIC_GEMINI_FALLBACK_MODEL;

	const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

	let attemptModel = modelName;
	let lastError: unknown = null;

	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		try {
			const model = genAI.getGenerativeModel({ model: attemptModel });
			const result = await model.generateContent(prompt);
			const response = await result.response;
			return await response.text();
		} catch (error) {
			lastError = error;
			// If we've exhausted attempts and no fallback left, break and report
			const isLastAttempt = attempt === maxRetries;

			console.warn(`[generatePortfolioContent] attempt=${attempt + 1} model=${attemptModel} failed:`, error);

			if (isLastAttempt) {
				// Try fallback model once if configured and not already tried
				if (fallbackModel && fallbackModel !== attemptModel) {
					console.info(`[generatePortfolioContent] switching to fallback model: ${fallbackModel}`);
					attemptModel = fallbackModel;
					// continue loop to attempt with fallback model
					continue;
				}

				// No further retries — construct a helpful error
				const errMsg = `AI generation failed after ${attempt + 1} attempts using model '${attemptModel}'.`;
				console.error(errMsg, error);
				interface ErrorWithOriginal extends Error {
					original?: unknown;
				}

				const err = new Error(errMsg) as ErrorWithOriginal;
				err.original = error;
				throw err;
			}

			// Otherwise wait with exponential backoff + jitter and retry
			const backoff = Math.floor(baseDelayMs * Math.pow(2, attempt) + Math.random() * 200);
			await sleep(backoff);
			// loop continues
		}
	}

	// If somehow we exit loop, throw last error
	const finalErr = new Error("AI generation failed") as ErrorWithOriginal;
	finalErr.original = lastError;
	throw finalErr;
}