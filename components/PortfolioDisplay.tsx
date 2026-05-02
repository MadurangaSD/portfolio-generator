"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, ExternalLink, Link, Tag, ArrowRight, Menu, Sun } from "lucide-react";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode, PointerEvent } from "react";

const plus = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "600", "700"] });

interface Project {
	title: string;
	description: string;
	techStack: string;
	projectLink: string;
}

interface ProjectsData {
	aiResponse?: string;
	projects?: Project[];
	links?: {
		linkedinUrl: string;
		githubUrl: string;
	};
	profile?: {
		fullName: string;
		role: string;
	};
}

type PortfolioDisplayProps = {
	portfolio: {
		bio: string;
		skills: string[];
		theme: string;
		projects: unknown;
		profileImage?: string | null;
		username?: string | null;
	};
};

type ProjectCardData = {
	project: Project;
	index: number;
};

type CTAButtonProps = {
	href: string;
	label: string;
	variant?: "primary" | "secondary";
	icon?: ReactNode;
};

const CTAButton = ({ href, label, variant = "secondary", icon }: CTAButtonProps) => (
	<a
		href={href}
		className={
			variant === "primary"
				? "inline-flex items-center justify-center gap-2 rounded-full bg-white text-slate-950 px-5 py-3 text-sm font-semibold transition hover:scale-[1.02]"
				: "inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white/10"
		}
	>
		{label}
		{icon}
	</a>
);

const FloatingNavbar = ({ fullName, role }: { fullName: string; role: string }) => (
	<motion.header
		initial={{ y: -24, opacity: 0 }}
		animate={{ y: 0, opacity: 1 }}
		transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
		className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
	>
		<div className="mx-auto max-w-7xl">
			<div className="flex items-center justify-between rounded-full border border-white/10 bg-slate-950/55 px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-2xl md:px-6">
				<div className="flex items-center gap-3">
					<div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-white to-slate-400 text-sm font-bold text-slate-950">
						{(fullName || "P").charAt(0)}
					</div>
					<div className="leading-tight">
						<div className="text-sm font-semibold text-white">{fullName}</div>
						<div className="text-xs text-slate-400">{role}</div>
					</div>
				</div>

				<nav className="hidden items-center gap-6 md:flex">
					<a href="#projects" className="text-sm text-slate-300 transition hover:text-white">Projects</a>
					<a href="#skills" className="text-sm text-slate-300 transition hover:text-white">Skills</a>
					<a href="#contact" className="text-sm text-slate-300 transition hover:text-white">Contact</a>
				</nav>

				<div className="flex items-center gap-2">
					<button className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 md:inline-flex">
						Open Work
					</button>
					<button className="inline-flex rounded-full border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10 md:hidden">
						<Menu size={18} />
					</button>
					<button className="inline-flex rounded-full border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10">
						<Sun size={18} />
					</button>
				</div>
			</div>
		</div>
	</motion.header>
);

const IdentityTile = ({ fullName, profileImage, username }: { fullName: string; profileImage: string | null; username: string | null }) => (
	<motion.div
		variants={tileVariants}
		whileHover={{ y: -6, scale: 1.01 }}
		className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl"
	>
		<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_48%)] opacity-90 transition duration-500 group-hover:opacity-100" />
		<div className="pointer-events-none absolute -inset-12 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.22),transparent_55%)] blur-3xl opacity-70 transition duration-500 group-hover:opacity-100" />
		<div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/80">
			<div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_35%,rgba(255,255,255,0.03)_65%,transparent)]" />
			<div className="absolute inset-3 rounded-[1.35rem] border border-white/10" />
			<div className="absolute inset-0 flex items-center justify-center p-5">
				{profileImage ? (
					<Image src={profileImage} alt={fullName} fill sizes="(max-width: 1024px) 70vw, 30vw" className="object-cover" priority />
				) : (
					<div className="flex h-full w-full items-center justify-center rounded-[1.35rem] bg-slate-900 text-5xl text-white/70">✦</div>
				)}
			</div>
			<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-5 pt-16">
				<div className="text-xs uppercase tracking-[0.28em] text-slate-400">Identity</div>
				<div className="mt-2 text-lg font-semibold text-white">{username ? `@${username}` : fullName}</div>
			</div>
		</div>
	</motion.div>
);

const HeroTile = ({
	fullName,
	username,
	role,
	bio,
	linkString,
	githubUrl,
	linkedinUrl,
	projectCount,
}: {
	fullName: string;
	username: string | null;
	role: string | null;
	bio: string;
	linkString: string;
	githubUrl?: string;
	linkedinUrl?: string;
	projectCount: number;
}) => (
	<motion.section
		variants={tileVariants}
		whileHover={{ y: -6 }}
		className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-7 shadow-2xl shadow-black/20 backdrop-blur-xl md:p-8"
	>
		<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.09),transparent_28%)]" />
		<div className="relative flex h-full flex-col justify-between gap-8">
			<div className="space-y-5">
				<div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-slate-300">
					Premium Portfolio
				</div>
				<div>
					<h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-6xl" style={{ letterSpacing: "-0.05em" }}>
						<span className="bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">{fullName}</span>
					</h1>
					{role ? <p className="mt-4 text-base text-slate-300 md:text-lg">{role}</p> : null}
					{username ? <p className="mt-2 text-sm text-slate-400">@{username}</p> : null}
				</div>
				<p className="max-w-2xl text-sm leading-7 text-slate-300 md:text-base md:leading-8">{bio}</p>
			</div>

			<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
				<div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
					<div className="text-xs uppercase tracking-[0.24em] text-slate-400">Projects</div>
					<div className="mt-2 text-2xl font-semibold text-white">{projectCount}</div>
				</div>
				<div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
					<div className="text-xs uppercase tracking-[0.24em] text-slate-400">Contact</div>
					<div className="mt-2 text-sm text-slate-200">{linkString}</div>
				</div>
				<div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 sm:col-span-2 xl:col-span-1">
					<div className="text-xs uppercase tracking-[0.24em] text-slate-400">Connect</div>
					<div className="mt-3 flex items-center gap-3 text-slate-200">
						{githubUrl ? <a href={githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition hover:text-white"><ExternalLink size={16} /> GitHub</a> : null}
						{linkedinUrl ? <a href={linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition hover:text-white"><Link size={16} /> LinkedIn</a> : null}
					</div>
				</div>
			</div>

			<div className="flex flex-wrap gap-3">
				<CTAButton href="#projects" label="View Work" variant="primary" icon={<ArrowRight size={16} />} />
				<CTAButton href={`mailto:${linkString}`} label="Send Email" variant="secondary" icon={<Mail size={16} />} />
			</div>
		</div>
	</motion.section>
);

const SkillsPanel = ({ skills }: { skills: string[] }) => (
	<motion.section variants={tileVariants} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl md:p-7" id="skills">
		<div className="flex items-center justify-between">
			<div>
				<div className="text-xs uppercase tracking-[0.28em] text-slate-400">Skills</div>
				<h2 className="mt-2 text-xl font-semibold text-white">Interactive Skill Badges</h2>
			</div>
			<div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">{skills.length} listed</div>
		</div>

		<div className="mt-5 flex flex-wrap gap-2.5">
			{skills.length > 0 ? skills.map((skill, index) => (
				<motion.span
					key={`${skill}-${index}`}
					variants={badgeVariants}
					whileHover={{ y: -3, scale: 1.02 }}
					className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-slate-200 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/10"
				>
					<Tag size={14} className="text-slate-400" />
					{skill}
				</motion.span>
			)) : (
				<div className="text-sm text-slate-400">No skills added yet.</div>
			)}
		</div>
	</motion.section>
);

const ProjectCard = ({ project, index }: ProjectCardData) => {
	const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
		const target = event.currentTarget;
		const rect = target.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		target.style.setProperty("--spot-x", `${x}px`);
		target.style.setProperty("--spot-y", `${y}px`);
	};

	const techList = project.techStack
		.split(",")
		.map((tech) => tech.trim())
		.filter(Boolean);

	return (
		<motion.article
			variants={tileVariants}
			whileHover={{ y: -6 }}
			onPointerMove={handlePointerMove}
			onPointerLeave={handlePointerMove}
			className="group relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/50 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl transition-transform"
		>
			<div
				className="pointer-events-none absolute inset-0 opacity-90 transition duration-200 group-hover:opacity-100"
				style={{ background: "radial-gradient(500px circle at var(--spot-x,50%) var(--spot-y,50%), rgba(255,255,255,0.16), transparent 40%), linear-gradient(180deg, rgba(255,255,255,0.04), transparent 42%)" }}
			/>
			<div className="relative flex h-full flex-col justify-between gap-6">
				<div className="flex items-start justify-between gap-4">
					<div>
						<div className="text-xs uppercase tracking-[0.28em] text-slate-400">Project {index + 1}</div>
						<h3 className="mt-2 text-xl font-semibold tracking-tight text-white">{project.title}</h3>
					</div>
					<div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-300 transition group-hover:text-white">
						<ArrowRight size={18} />
					</div>
				</div>

				<p className="text-sm leading-7 text-slate-300">{project.description}</p>

				<div className="flex flex-wrap gap-2">
					{techList.map((tech, techIndex) => (
						<span key={`${tech}-${techIndex}`} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
							{tech}
						</span>
					))}
				</div>

				<div className="flex items-center justify-between gap-4 pt-2">
					{project.projectLink ? (
						<a
							href={project.projectLink}
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
						>
							Live Preview
							<ExternalLink size={14} />
						</a>
					) : (
						<div className="text-sm text-slate-500">No live link provided</div>
					)}
				</div>
			</div>
		</motion.article>
	);
};

const Footer = ({ fullName, bio, linkString, githubUrl, linkedinUrl }: { fullName: string; bio: string; linkString: string; githubUrl?: string; linkedinUrl?: string }) => (
	<motion.footer variants={tileVariants} id="contact" className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl md:p-8">
		<div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
			<div className="max-w-xl space-y-3">
				<div className="text-xs uppercase tracking-[0.28em] text-slate-400">Contact</div>
				<h3 className="text-2xl font-semibold text-white md:text-3xl">Let’s build something premium.</h3>
				<p className="text-sm leading-7 text-slate-300 md:text-base">{bio}</p>
			</div>

			<div className="flex flex-wrap gap-3">
				{githubUrl ? <a href={githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"><ExternalLink size={15} /> GitHub</a> : null}
				{linkedinUrl ? <a href={linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"><Link size={15} /> LinkedIn</a> : null}
				<a href={`mailto:${linkString}`} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]">
					<Mail size={15} /> Email {fullName}
				</a>
			</div>
		</div>
		<div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
			<div>© {new Date().getFullYear()} {fullName}. Built with precision.</div>
			<div>Premium dark portfolio template.</div>
		</div>
	</motion.footer>
);

const tileVariants = {
	hidden: { opacity: 0, y: 18 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] } },
};

const badgeVariants = {
	hidden: { opacity: 0, y: 10 },
	visible: { opacity: 1, y: 0 },
};

interface PortfolioDisplayProps {
	portfolio: {
		bio: string;
		skills: string[];
		theme: string;
		projects: unknown;
		profileImage?: string | null;
		username?: string | null;
	};
}

export default function PortfolioDisplay({ portfolio }: PortfolioDisplayProps) {
	const projectsData = typeof portfolio.projects === "object" && portfolio.projects !== null ? portfolio.projects : {};
	const projects = (projectsData as ProjectsData).projects || [];
	const profile = (projectsData as ProjectsData).profile || {};
	const links = (projectsData as ProjectsData).links || {};

	const fullName = profile.fullName || "Portfolio";
	const role = profile.role || "Developer";
	const bio = portfolio.bio || "Welcome to my portfolio";
	const skills = portfolio.skills || [];
	const linkedinUrl = links.linkedinUrl;
	const githubUrl = links.githubUrl;
	const profileImage = typeof portfolio.profileImage === "string" && portfolio.profileImage.trim().length > 0 ? portfolio.profileImage : null;
	const username = (portfolio as unknown as { username?: string }).username ?? profile.fullName ?? null;
	const contactEmail = "hello@example.com";

	return (
		<main className={`${plus.className} relative min-h-screen overflow-hidden bg-[#020617] text-[#f8fafc]`}>
			<div className="pointer-events-none fixed inset-0 -z-10">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.1),transparent_30%)]" />
				<div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35" />
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0,rgba(2,6,23,0.25)_55%,rgba(2,6,23,0.9)_100%)]" />
			</div>

			<FloatingNavbar fullName={fullName} role={role} />

			<motion.div initial="hidden" animate="visible" variants={containerVariants} className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
				<div className="grid gap-6 lg:grid-cols-12">
					<div className="lg:col-span-8">
						<HeroTile
							fullName={fullName}
							username={username}
							role={role}
							bio={bio}
							linkString={contactEmail}
							githubUrl={githubUrl}
							linkedinUrl={linkedinUrl}
							projectCount={projects.length}
						/>
					</div>

					<div className="lg:col-span-4">
						<IdentityTile fullName={fullName} profileImage={profileImage} username={username} />
					</div>
				</div>

				<div className="mt-6 grid gap-6 lg:grid-cols-12">
					<div className="lg:col-span-7">
						<SkillsPanel skills={skills} />
					</div>
					<div className="lg:col-span-5">
						<motion.section variants={tileVariants} className="h-full rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl md:p-7">
							<div className="text-xs uppercase tracking-[0.28em] text-slate-400">Highlights</div>
							<h2 className="mt-2 text-xl font-semibold text-white">Clean structure, premium spacing, responsive by default.</h2>
							<p className="mt-4 text-sm leading-7 text-slate-300">This layout keeps your existing portfolio data model intact while presenting it through a darker, higher-end visual system with glass layers and subtle depth.</p>
							<div className="mt-6 grid gap-3 sm:grid-cols-2">
								<div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
									<div className="text-xs uppercase tracking-[0.24em] text-slate-400">Profile</div>
									<div className="mt-2 text-sm text-slate-200">{fullName}</div>
								</div>
								<div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
									<div className="text-xs uppercase tracking-[0.24em] text-slate-400">Theme</div>
									<div className="mt-2 text-sm text-slate-200">Premium Dark</div>
								</div>
							</div>
						</motion.section>
					</div>
				</div>

				<section id="projects" className="mt-6">
					<div className="mb-5 flex items-end justify-between gap-4">
						<div>
							<div className="text-xs uppercase tracking-[0.28em] text-slate-400">Showcase</div>
							<h2 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">Project Showcase</h2>
						</div>
						<div className="hidden text-sm text-slate-400 md:block">Spotlight hover cards with glass surfaces</div>
					</div>

					<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-12">
						{projects.length > 0 ? projects.map((project: Project, index: number) => (
							<div key={`${project.title}-${index}`} className={index === 0 ? "xl:col-span-7" : index === 1 ? "xl:col-span-5" : "xl:col-span-4"}>
								<ProjectCard project={project} index={index} />
							</div>
						)) : (
							<div className="col-span-full rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center text-slate-400 backdrop-blur-xl">
								No projects added yet.
							</div>
						)}
					</div>
				</section>

				<div className="mt-6">
					<Footer fullName={fullName} bio={bio} linkString={contactEmail} githubUrl={githubUrl} linkedinUrl={linkedinUrl} />
				</div>
			</motion.div>
		</main>
	);
}

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.08, delayChildren: 0.08 },
	},
};
