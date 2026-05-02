import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import PortfolioDisplay from "@/components/PortfolioDisplay";

export default async function PortfolioPage() {
	// Get authenticated user
	const user = await currentUser();

	if (!user) {
		return (
			<div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
				<div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl shadow-black/30 backdrop-blur-xl">
					<p className="text-white text-lg mb-4">Please sign in to view your portfolio</p>
					<Link href="/sign-in" className="text-cyan-400 hover:text-cyan-300">
						Sign in
					</Link>
				</div>
			</div>
		);
	}

	// Fetch portfolio directly using Clerk user.id
	// (Portfolio.userId is stored as the Clerk user ID, not the MongoDB ObjectId)
	const portfolio = await prisma.portfolio.findUnique({
		where: { userId: user.id },
	});

	if (!portfolio) {
		return (
			<div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
				<div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl shadow-black/30 backdrop-blur-xl">
					<p className="text-white text-lg mb-4">No portfolio data found</p>
					<Link href="/" className="text-cyan-400 hover:text-cyan-300">
						Create your portfolio
					</Link>
				</div>
			</div>
		);
	}

	// Extract and safely parse portfolio data
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
