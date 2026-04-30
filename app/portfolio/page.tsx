"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, Code, Share2, ArrowRight, Star } from "lucide-react";

interface PortfolioData {
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
}

export default function PortfolioPage() {
	const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const data = localStorage.getItem("portfolioData");
		if (data) {
			try {
				const parsed = JSON.parse(data) as PortfolioData;
				const normalizedSkills = Array.isArray(parsed.formData.skills)
					? parsed.formData.skills.map((skill) =>
						typeof skill === "string" ? skill : String((skill as { value?: string }).value ?? ""),
					)
					: [];

				// eslint-disable-next-line react-hooks/set-state-in-effect
				setPortfolioData({
					...parsed,
					formData: {
						...parsed.formData,
						skills: normalizedSkills.filter(Boolean),
					},
				});
			} catch (error) {
				console.error("Error parsing portfolio data:", error);
			}
		}
		setIsLoading(false);
	}, []);

	if (isLoading) {
		return (
			<div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
				<div className="rounded-3xl border border-white/10 bg-white/5 px-8 py-6 text-white shadow-2xl shadow-black/30 backdrop-blur-xl">
					Loading your portfolio...
				</div>
			</div>
		);
	}

	if (!portfolioData) {
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

	const { formData } = portfolioData;

	return (
		<main className="min-h-screen bg-[#050505] text-white overflow-hidden">
			{/* Mesh Gradient Background */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
				<div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl opacity-50" />
				<div className="absolute -bottom-40 -right-40 w-80 h-80 bg-cyan-600/20 rounded-full blur-3xl opacity-50" />
				<div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl opacity-30 transform -translate-x-1/2 -translate-y-1/2" />
			</div>

			{/* Content */}
			<div className="relative z-10">
				{/* Floating Navbar */}
				<nav className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
					<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-8 py-4 flex items-center gap-8">
						<h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
							{formData.fullName}
						</h1>
						<div className="hidden md:flex gap-6">
							<a href="#projects" className="text-sm text-gray-300 hover:text-white transition">
								Projects
							</a>
							<a href="#skills" className="text-sm text-gray-300 hover:text-white transition">
								Skills
							</a>
							<a href="#contact" className="text-sm text-gray-300 hover:text-white transition">
								Contact
							</a>
						</div>
					</div>
				</nav>

				{/* Hero Section */}
				<section className="min-h-screen flex items-center justify-center px-4 pt-32 pb-20">
					<div className="max-w-5xl w-full text-center space-y-12">
						{/* Profile Avatar with Glow */}
						<div className="flex justify-center mb-8">
							<div className="relative group">
								{/* Glow Effect */}
								<div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
								
								{/* Avatar Container */}
								<div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 p-0.5">
									<div className="w-full h-full rounded-full bg-[#050505] flex items-center justify-center text-6xl border border-white/20">
										✨
									</div>
								</div>
							</div>
						</div>

						{/* Main Heading */}
						<div className="space-y-6">
							<h1 className="text-6xl md:text-8xl font-bold tracking-tight">
								<span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
									{formData.fullName}
								</span>
							</h1>
							
							<p className="text-2xl md:text-3xl text-gray-300 font-light">
								{formData.role}
							</p>

							<p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
								{formData.bio}
							</p>
						</div>

						{/* CTA Buttons */}
						<div className="flex flex-col md:flex-row gap-4 justify-center pt-8">
							<a
								href="#projects"
								className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold text-white overflow-hidden transition hover:shadow-lg hover:shadow-cyan-500/50"
							>
								<div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								<span className="relative flex items-center gap-2 justify-center">
									View My Work
									<ArrowRight size={18} className="group-hover:translate-x-1 transition" />
								</span>
							</a>
							
							<a
								href="#contact"
								className="px-8 py-4 border border-white/20 rounded-lg font-semibold text-white hover:bg-white/5 transition backdrop-blur-xl"
							>
								Get in Touch
							</a>
						</div>
					</div>
				</section>

				{/* Experience & Bio Bento Grid */}
				<section className="px-4 py-20">
					<div className="max-w-6xl mx-auto">
						<h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
							<span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
								About & Experience
							</span>
						</h2>

						<div className="grid md:grid-cols-3 gap-6">
							{/* Large Bio Card */}
							<div className="md:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-cyan-400/50 transition group">
								<div className="space-y-4">
									<h3 className="text-2xl font-bold text-cyan-400">Professional Profile</h3>
									<p className="text-gray-300 leading-relaxed text-lg">
										{formData.bio}
									</p>
									<div className="pt-4 flex items-center gap-2 text-sm text-gray-400">
										<Star size={16} className="text-yellow-400" />
										<span>Passionate about creating innovative solutions</span>
									</div>
								</div>
							</div>

							{/* Stats Card */}
							<div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-purple-400/50 transition">
								<div className="space-y-6">
									<div>
										<p className="text-4xl font-bold text-purple-400">{formData.projects.length}</p>
										<p className="text-gray-400">Projects</p>
									</div>
									<div>
										<p className="text-4xl font-bold text-cyan-400">{formData.skills.length}</p>
										<p className="text-gray-400">Skills</p>
									</div>
									<div>
										<p className="text-2xl font-bold text-blue-400">Expert</p>
										<p className="text-gray-400">Level</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Dynamic Skills Cloud */}
				<section id="skills" className="px-4 py-20">
					<div className="max-w-6xl mx-auto">
						<h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
							<span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
								Skills & Expertise
							</span>
						</h2>

						<div className="flex flex-wrap gap-4 justify-center">
							{formData.skills.map((skill, index) => (
								<div
									key={index}
									className="relative group cursor-pointer"
								>
									{/* Glow on hover */}
									<div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-lg opacity-0 group-hover:opacity-75 transition-opacity duration-300" />
									
									{/* Pill Tag */}
									<div className="relative px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full group-hover:border-cyan-400/50 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20">
										<span className="text-sm font-semibold text-gray-200">{skill}</span>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Premium Project Showcase */}
				<section id="projects" className="px-4 py-20">
					<div className="max-w-6xl mx-auto">
						<h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
							<span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
								Featured Projects
							</span>
						</h2>

						<div className="grid md:grid-cols-2 gap-8">
							{formData.projects.map((project, index) => (
								<div
									key={index}
									className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20"
								>
									{/* Project Header with Icon */}
									<div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 h-40 flex items-center justify-center relative overflow-hidden">
										<div className="text-6xl opacity-20 group-hover:scale-110 transition-transform duration-300">
											📁
										</div>
										{/* Glow on hover */}
										<div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity" />
									</div>

									{/* Project Content */}
									<div className="p-8 space-y-4">
										<h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition">
											{project.title}
										</h3>

										<p className="text-gray-300 leading-relaxed text-sm">
											{project.description}
										</p>

										{/* Tech Stack */}
										<div className="flex flex-wrap gap-2 pt-4">
											{project.techStack.split(",").map((tech, idx) => (
												<span
													key={idx}
													className="px-3 py-1 bg-cyan-500/20 border border-cyan-400/30 rounded-full text-xs font-semibold text-cyan-300"
												>
													{tech.trim()}
												</span>
											))}
										</div>

										{/* Live Demo Button */}
										<div className="pt-6">
											{project.projectLink ? (
												<a
													href={project.projectLink}
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/50 rounded-lg text-cyan-300 font-semibold hover:border-cyan-400 hover:bg-cyan-500/30 transition-all group/btn"
												>
													Live Demo
													<ArrowRight
														size={18}
														className="group-hover/btn:translate-x-1 transition"
													/>
												</a>
											) : (
												<div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-500/20 border border-gray-400/30 rounded-lg text-gray-400 font-semibold">
													No Link Available
												</div>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Contact Footer */}
				<section id="contact" className="px-4 py-20">
					<div className="max-w-4xl mx-auto">
						<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 md:p-16 text-center space-y-8 hover:border-cyan-400/30 transition">
							<h2 className="text-4xl md:text-5xl font-bold">
								<span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
									Let&apos;s Connect
								</span>
							</h2>

							<p className="text-lg text-gray-400 max-w-2xl mx-auto">
							I&apos;m always interested in hearing about new projects, opportunities, and collaborations.
							Feel free to reach out!
						</p>

							{/* Social Links */}
							<div className="flex flex-col md:flex-row gap-6 justify-center pt-8">
								{formData.linkedinUrl && (
									<a
										href={formData.linkedinUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="group px-8 py-4 bg-white/10 border border-white/20 rounded-xl font-semibold text-white hover:bg-blue-500/20 hover:border-blue-400/50 transition-all flex items-center gap-3 justify-center"
									>
										<Share2 size={20} className="group-hover:scale-110 transition" />
										LinkedIn
									</a>
								)}

								{formData.githubUrl && (
									<a
										href={formData.githubUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="group px-8 py-4 bg-white/10 border border-white/20 rounded-xl font-semibold text-white hover:bg-purple-500/20 hover:border-purple-400/50 transition-all flex items-center gap-3 justify-center"
									>
										<Code size={20} className="group-hover:scale-110 transition" />
										GitHub
									</a>
								)}

								<a
									href="mailto:hello@example.com"
									className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center gap-3 justify-center"
								>
									<Mail size={20} className="group-hover:scale-110 transition" />
									Send Email
								</a>
							</div>
						</div>
					</div>
				</section>

				{/* Footer */}
				<footer className="border-t border-white/10 py-8 px-4 mt-20">
					<div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
						<p>
							© {new Date().getFullYear()} {formData.fullName}. Built with Next.js, React & Tailwind CSS.
						</p>
					</div>
				</footer>
			</div>
		</main>
	);
}
