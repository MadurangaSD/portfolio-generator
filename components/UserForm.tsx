"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import CloudinaryUpload from "@/components/CloudinaryUpload";
import { generatePortfolioContent } from "@/lib/gemini";
import { saveOrUpdatePortfolioAction } from "@/app/actions/portfolio";

type PortfolioFormValues = {
	username?: string;
	profileImage?: string | null;
	projectImages?: string[];
	fullName: string;
	role: string;
	bio: string;
	linkedinUrl: string;
	githubUrl: string;
	skills: { value: string }[];
	projects: { title: string; description: string; techStack: string; projectLink: string }[];
};

type InitialPortfolioData = {
	aiResponse: string;
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
		projects: { title: string; description: string; techStack: string; projectLink: string }[];
	};
};

const steps = ["Profile", "Links", "Bio", "Skills", "Projects", "Review"] as const;

type UserFormProps = {
	initialData?: InitialPortfolioData | null;
};

export default function UserForm({ initialData }: UserFormProps) {
	const [currentStep, setCurrentStep] = useState(0);
	const [submittedData, setSubmittedData] = useState<PortfolioFormValues | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [aiResponse, setAiResponse] = useState(initialData?.aiResponse ?? "");
	const [saveToast, setSaveToast] = useState<string | null>(null);
	const [redirectTo, setRedirectTo] = useState<string | null>(null);

	const defaultValues = useMemo<PortfolioFormValues>(() => {
		return {
			username: initialData?.formData.username ?? "",
			profileImage: initialData?.formData.profileImage ?? null,
			projectImages: initialData?.formData.projectImages ?? [],
			fullName: initialData?.formData.fullName ?? "",
			role: initialData?.formData.role ?? "",
			bio: initialData?.formData.bio ?? "",
			linkedinUrl: initialData?.formData.linkedinUrl ?? "",
			githubUrl: initialData?.formData.githubUrl ?? "",
			skills:
				initialData?.formData.skills && initialData.formData.skills.length > 0
					? initialData.formData.skills.map((skill) => ({ value: skill }))
					: [{ value: "" }],
			projects:
				initialData?.formData.projects && initialData.formData.projects.length > 0
					? initialData.formData.projects
					: [{ title: "", description: "", techStack: "", projectLink: "" }],
		};
	}, [initialData]);

	const {
		control,
		register,
		setValue,
		handleSubmit,
		trigger,
		formState: { errors, isSubmitting },
	} = useForm<PortfolioFormValues>({
		mode: "onTouched",
		defaultValues,
	});

	const {
		fields: skillFields,
		append: appendSkill,
		remove: removeSkill,
	} = useFieldArray({
		control,
		name: "skills",
	});

	const {
		fields: projectFields,
		append: appendProject,
		remove: removeProject,
	} = useFieldArray({
		control,
		name: "projects",
	});

	const values = useWatch({ control });

	const completion = useMemo(() => {
		return ((currentStep + 1) / steps.length) * 100;
	}, [currentStep]);

// Username availability state
const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
const [checkingUsername, setCheckingUsername] = useState(false);
const usernameDebounceRef = useRef<number | null>(null);

const checkUsernameAvailability = useCallback(async (raw: string) => {
  const name = (raw ?? "").trim().toLowerCase();
	if (!name || name.length < 3) {
		console.debug("[UserForm] Skipping availability check: username too short", { name, length: name.length });
		setUsernameAvailable(null);
		return;
	}
	console.debug("[UserForm] Starting availability check for:", name);
	setCheckingUsername(true);
	try {
		const checkUrl = `/api/username?username=${encodeURIComponent(name)}`;
		console.debug("[UserForm] Fetching availability from:", checkUrl);
		const res = await fetch(checkUrl);
		console.debug("[UserForm] Availability check response status:", res.status);
		if (!res.ok) {
			console.warn("[UserForm] Availability check failed with status:", res.status);
			setUsernameAvailable(false);
		} else {
			const json = await res.json();
			console.debug("[UserForm] Availability check result:", json);
			setUsernameAvailable(Boolean(json.available));
		}
	} catch (e) {
		console.error("[UserForm] username check error", e);
		setUsernameAvailable(false);
	} finally {
		setCheckingUsername(false);
	}
}, []);

// Debounced effect when username changes
useEffect(() => {
	const name = values?.username ?? "";
	// Skip entirely if not valid length
	if (typeof name !== "string" || name.trim().length < 3) {
		return;
	}
	
	if (usernameDebounceRef.current) window.clearTimeout(usernameDebounceRef.current);
	usernameDebounceRef.current = window.setTimeout(() => {
		// only check if pattern roughly valid
		if (typeof name === "string" && /^[A-Za-z0-9_-]{3,}$/.test(name)) {
			checkUsernameAvailability(name);
		} else {
			setUsernameAvailable(null);
		}
	}, 500);
	return () => {
		if (usernameDebounceRef.current) window.clearTimeout(usernameDebounceRef.current);
	};
}, [values?.username, checkUsernameAvailability]);

	const getStepFields = (step: number): Parameters<typeof trigger>[0] => {
		if (step === 0) {
			return ["username", "fullName", "role"];
		}
		if (step === 1) {
			return ["linkedinUrl", "githubUrl"];
		}
		if (step === 2) {
			return ["bio"];
		}
		if (step === 3) {
			return ["skills"];
		}
		if (step === 4) {
			return ["projects"];
		}
		return undefined;
	};

	const nextStep = async () => {
		const valid = await trigger(getStepFields(currentStep));
		if (!valid) {
			return;
		}
		setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
	};

	const prevStep = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 0));
	};

	const onSubmit = async (data: PortfolioFormValues) => {
		setSubmittedData(data);
		setIsLoading(true);
		setSaveToast(null);

		try {
			console.log("[UserForm] Form data to send:", {
				fullName: data.fullName,
				role: data.role,
				bio: data.bio,
				linkedinUrl: data.linkedinUrl,
				githubUrl: data.githubUrl,
				skillsCount: data.skills.length,
				projectsCount: data.projects.length,
				profileImage: data.profileImage ?? null,
				hasFormData: !!data,
			});

			console.log("[UserForm] Starting portfolio generation...");
			const result = await generatePortfolioContent(data);
			console.log("[UserForm] AI generation result:", {
				hasResult: !!result,
				resultLength: result?.length ?? 0,
				resultPreview: result?.substring(0, 100) ?? "NO RESULT",
			});

			setAiResponse(result);
			console.log("[UserForm] AI content generated successfully");

			const portfolioObject = {
				aiResponse: result,
				formData: {
					username: data.username?.trim().toLowerCase(),
					// Always use fresh submit payload from RHF to avoid stale watch values.
					profileImage: data.profileImage ?? null,
					projectImages: data.projectImages ?? [],
					fullName: data.fullName,
					role: data.role,
					bio: data.bio,
					linkedinUrl: data.linkedinUrl,
					githubUrl: data.githubUrl,
					skills: data.skills.map((s) => s.value).filter(Boolean),
					projects: data.projects,
				},
			};

			console.log("[UserForm] Portfolio object prepared:", {
				hasAiResponse: !!portfolioObject.aiResponse,
				formDataComplete: {
					fullName: !!portfolioObject.formData.fullName,
					role: !!portfolioObject.formData.role,
					bio: !!portfolioObject.formData.bio,
					skillsCount: portfolioObject.formData.skills.length,
					projectsCount: portfolioObject.formData.projects.length,
				},
			});

			// Persist to the database via server action (no localStorage fallback)
			try {
				console.log("[UserForm] Calling server action to save portfolio...");
				console.log("[UserForm] profileImage value being sent:", portfolioObject.formData.profileImage);
				const response = await saveOrUpdatePortfolioAction({
					...portfolioObject,
					theme: "bento-dark",
				});

				console.log("Full Server Response:", response);

				// Defensive check: ensure response exists
				if (!response) {
					console.error("[UserForm] No response from server");
					setSaveToast("No response from server. Please try again.");
					return;
				}

				// Use optional chaining to safely check response properties
				if (response?.ok) {
					setSaveToast("✓ Saved to MongoDB successfully!");
					console.log("[UserForm] Server action succeeded, portfolioId:", response?.portfolioId, "username:", response?.username);
				} else {
					const errorMsg = response?.error || "Unknown error";
					setSaveToast(`Error saving to DB: ${errorMsg}`);
					console.error("[UserForm] Server returned error:", errorMsg);
				}

				// Set redirect target and let effect perform navigation
				const destUsername = response?.username ?? portfolioObject.formData.username ?? data.username?.trim().toLowerCase();
				if (destUsername) {
					setRedirectTo(destUsername);
				} else {
					setRedirectTo("/portfolio");
				}
			} catch (dbError) {
				console.error("[UserForm] Exception calling server action:", dbError);
				const errorMsg = dbError instanceof Error ? dbError.message : "Unknown error";
				setSaveToast(`Unexpected error: ${errorMsg}. See console for details.`);
				console.error("[UserForm] Full error object:", dbError);
				// Do NOT write to localStorage per request
			}

			console.log("[UserForm] Portfolio form submitted:", data);
		} catch (error) {
			console.error("[UserForm] Error generating portfolio content:", error);
			setSaveToast("Error generating content. Please try again.");
			setAiResponse("Error generating content. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	// Perform client navigation after submit/response to avoid router-init timing issues
	useEffect(() => {
		if (!redirectTo) return;
		const isPath = redirectTo.startsWith("/");
		const dest = isPath ? redirectTo : `/${redirectTo}`;
		const t = setTimeout(() => {
			window.location.href = dest;
		}, 1200);
		return () => clearTimeout(t);
	}, [redirectTo]);

	return (
		<section className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/95 p-6 shadow-[0_0_60px_-20px_rgba(16,185,129,0.45)] sm:p-10">
			<div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-600/20 blur-3xl" />
			<div className="pointer-events-none absolute -right-28 bottom-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />

			<div className="relative mb-8 space-y-4">
				<p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
					Portfolio Builder
				</p>
				<div className="flex items-center justify-between gap-4">
					<h2 className="text-2xl font-semibold text-zinc-100 sm:text-3xl">
						Professional Portfolio Generator
					</h2>
					<span className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-1 text-xs font-medium text-zinc-300">
						Step {currentStep + 1} / {steps.length}
					</span>
				</div>
				<div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
					<div
						className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500"
						style={{ width: `${completion}%` }}
					/>
				</div>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="relative space-y-8">
				{currentStep === 0 && (
					<div className="grid gap-5 sm:grid-cols-2">
						<div className="space-y-2">
							<label className="text-sm font-medium text-zinc-300">Username</label>
							<input
								type="text"
								placeholder="your-username (no spaces or special chars)"
								className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none transition focus:border-emerald-400"
								{...register("username", {
									required: "Username is required",
									minLength: { value: 3, message: "Username must be at least 3 characters" },
									pattern: { value: /^[A-Za-z0-9_-]+$/, message: "Username may only contain letters, numbers, hyphens and underscores" },
								})}
								onBlur={(e) => {
									const v = e.currentTarget.value?.trim().toLowerCase();
									if (v && /^[A-Za-z0-9_-]{3,}$/.test(v)) checkUsernameAvailability(v);
								}}
							/>
							{errors.username && <p className="text-sm text-rose-400">{errors.username.message}</p>}
							{checkingUsername ? (
						<p className="text-sm text-zinc-400">⏳ Checking availability…</p>
					) : usernameAvailable === true ? (
						<p className="text-sm text-emerald-400">✓ Username is available</p>
					) : usernameAvailable === false ? (
						<p className="text-sm text-rose-400">✕ Username is already taken</p>
							) : null}
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-zinc-300">Profile Picture</label>
							<CloudinaryUpload
								name="profileImage"
								setValue={setValue}
								value={values?.profileImage ?? null}
								uploadPreset="sithum_default"
								buttonLabel="Upload Photo"
							/>
							<input type="hidden" {...register("profileImage")} />
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-zinc-300">Full Name</label>
							<input
								type="text"
								placeholder="e.g. Sithum Madhuranga"
								className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none transition focus:border-emerald-400"
								{...register("fullName", {
									required: "Full name is required",
									minLength: { value: 2, message: "Name must be at least 2 characters" },
								})}
							/>
							{errors.fullName && (
								<p className="text-sm text-rose-400">{errors.fullName.message}</p>
							)}
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium text-zinc-300">Role</label>
							<input
								type="text"
								placeholder="e.g. Full Stack Developer"
								className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none transition focus:border-emerald-400"
								{...register("role", {
									required: "Role is required",
									minLength: { value: 2, message: "Role must be at least 2 characters" },
								})}
							/>
							{errors.role && <p className="text-sm text-rose-400">{errors.role.message}</p>}
						</div>
					</div>
				)}

				{currentStep === 1 && (
					<div className="grid gap-5 sm:grid-cols-2">
						<div className="space-y-2">
							<label className="text-sm font-medium text-zinc-300">LinkedIn URL</label>
							<input
								type="url"
								placeholder="https://linkedin.com/in/yourprofile"
								className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none transition focus:border-emerald-400"
								{...register("linkedinUrl", {
									validate: (value) => {
										if (!value) return true; // Allow empty
										return /^https:\/\/.+/.test(value) || "Please enter a valid URL starting with https://";
									},
								})}
							/>
							{errors.linkedinUrl && (
								<p className="text-sm text-rose-400">{errors.linkedinUrl.message}</p>
							)}
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium text-zinc-300">GitHub URL</label>
							<input
								type="url"
								placeholder="https://github.com/yourprofile"
								className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none transition focus:border-emerald-400"
								{...register("githubUrl", {
									validate: (value) => {
										if (!value) return true; // Allow empty
										return /^https:\/\/.+/.test(value) || "Please enter a valid URL starting with https://";
									},
								})}
							/>
							{errors.githubUrl && (
								<p className="text-sm text-rose-400">{errors.githubUrl.message}</p>
							)}
						</div>
					</div>
				)}

				{currentStep === 2 && (
					<div className="space-y-2">
						<label className="text-sm font-medium text-zinc-300">Professional Bio</label>
						<textarea
							rows={7}
							placeholder="Share your story, impact, and domain expertise..."
							className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none transition focus:border-emerald-400"
							{...register("bio", {
								required: "Professional bio is required",
								minLength: { value: 50, message: "Bio should be at least 50 characters" },
							})}
						/>
						{errors.bio && <p className="text-sm text-rose-400">{errors.bio.message}</p>}
					</div>
				)}

				{currentStep === 3 && (
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-medium text-zinc-100">Skills</h3>
							<button
								type="button"
								onClick={() => appendSkill({ value: "" })}
								className="rounded-lg border border-emerald-400/50 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/20"
							>
								Add Skill
							</button>
						</div>

						<div className="space-y-3">
							{skillFields.map((field, index) => (
								<div key={field.id} className="flex gap-3">
									<input
										type="text"
										placeholder="e.g. TypeScript"
										className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none transition focus:border-emerald-400"
										{...register(`skills.${index}.value`, {
											required: "Skill cannot be empty",
										})}
									/>
									<button
										type="button"
										onClick={() => removeSkill(index)}
										disabled={skillFields.length === 1}
										className="rounded-xl border border-zinc-700 px-4 text-sm font-medium text-zinc-300 transition hover:border-rose-400 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-50"
									>
										Remove
									</button>
								</div>
							))}
						</div>
					</div>
				)}

				{currentStep === 4 && (
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-medium text-zinc-100">Projects</h3>
							<button
								type="button"
								onClick={() =>
									appendProject({ title: "", description: "", techStack: "", projectLink: "" })
								}
								className="rounded-lg border border-cyan-400/50 bg-cyan-500/10 px-3 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/20"
							>
								Add Project
							</button>
						</div>

						<div className="space-y-4">
							{projectFields.map((field, index) => (
								<div key={field.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
									<div className="mb-4 flex items-center justify-between">
										<p className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
											Project {index + 1}
										</p>
										<button
											type="button"
											onClick={() => removeProject(index)}
											disabled={projectFields.length === 1}
											className="rounded-lg border border-zinc-700 px-3 py-1 text-xs font-medium text-zinc-300 transition hover:border-rose-400 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-50"
										>
											Remove
										</button>
									</div>

									<div className="grid gap-3">
										<input
											type="text"
											placeholder="Project title"
											className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-400"
											{...register(`projects.${index}.title`, {
												required: "Project title is required",
											})}
										/>
										<textarea
											rows={4}
											placeholder="Describe the project impact and features"
											className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-400"
											{...register(`projects.${index}.description`, {
												required: "Project description is required",
												minLength: {
													value: 20,
													message: "Description must be at least 20 characters",
												},
											})}
										/>
										<input
											type="text"
											placeholder="Tech stack (e.g. Next.js, Tailwind, PostgreSQL)"
											className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-400"
											{...register(`projects.${index}.techStack`, {
												required: "Tech stack is required",
											})}
										/>
										<input
											type="url"
											placeholder="Project link (https://...)"
											className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-400"
											{...register(`projects.${index}.projectLink`, {
												validate: (value) => {
													if (!value) return true; // Allow empty
													return /^https:\/\/.+/.test(value) || "Please enter a valid URL starting with https://";
												},
											})}
										/>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{currentStep === 5 && (
					<div className="space-y-6">
						<h3 className="text-lg font-medium text-zinc-100">Review Your Information</h3>
						<div className="grid gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 text-sm text-zinc-300">
							<p>
								<span className="font-semibold text-zinc-100">Name:</span> {values.fullName}
							</p>
							<p>
								<span className="font-semibold text-zinc-100">Role:</span> {values.role}
							</p>
							<p>
								<span className="font-semibold text-zinc-100">LinkedIn:</span> {values.linkedinUrl}
							</p>
							<p>
								<span className="font-semibold text-zinc-100">GitHub:</span> {values.githubUrl}
							</p>
							<p>
								<span className="font-semibold text-zinc-100">Bio:</span> {values.bio}
							</p>
							<p>
								<span className="font-semibold text-zinc-100">Skills:</span>{" "}
								{values.skills?.map((skill) => skill.value).join(", ")}
							</p>
							{values.profileImage ? (
								<div className="space-y-2">
									<span className="font-semibold text-zinc-100">Profile Image:</span>
									<div className="h-20 w-20 overflow-hidden rounded-full border border-zinc-700">
										<Image
											src={values.profileImage}
											alt="Profile preview"
											width={80}
											height={80}
											className="h-full w-full object-cover"
										/>
									</div>
								</div>
							) : null}
							<div>
								<span className="font-semibold text-zinc-100">Projects:</span>
								<ul className="mt-2 space-y-2">
									{values.projects?.map((project, index) => (
										<li key={`${project.title}-${index}`} className="rounded-xl border border-zinc-800 p-3">
											<p className="font-medium text-zinc-100">{project.title}</p>
											<p>{project.description}</p>
											<p className="text-zinc-400">{project.techStack}</p>
											<p className="text-cyan-300">{project.projectLink}</p>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				)}

				<div className="flex flex-col gap-3 border-t border-zinc-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
					<button
						type="button"
						onClick={prevStep}
						disabled={currentStep === 0}
						className="rounded-xl border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Previous
					</button>

					{currentStep < steps.length - 1 ? (
						<button
							type="button"
							onClick={nextStep}
							className="rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:brightness-110"
						>
							Continue
						</button>
					) : (
						<button
							type="submit"
							disabled={isSubmitting || isLoading || usernameAvailable === false}
							className="rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:brightness-110 disabled:opacity-60"
							title={usernameAvailable === false ? "Please choose an available username" : undefined}
						>
							{isLoading ? "Generating..." : isSubmitting ? "Submitting..." : "Submit Portfolio"}
						</button>
					)}
				</div>
			</form>

			{aiResponse && (
				<pre className="relative mt-6 overflow-x-auto rounded-2xl border border-cyan-500/40 bg-zinc-900/80 p-4 text-sm leading-6 text-cyan-100 whitespace-pre-wrap">
					{aiResponse}
				</pre>
			)}

			{submittedData && (
				<div className="relative mt-6 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-200">
					Form submitted successfully for {submittedData.fullName}. Redirecting to your portfolio...
				</div>
			)}

			{saveToast ? (
				<div
					role="status"
					aria-live="polite"
					className="fixed right-5 bottom-5 z-50 rounded-2xl border border-emerald-400/40 bg-zinc-950/95 px-4 py-3 text-sm font-medium text-emerald-200 shadow-2xl shadow-emerald-900/30"
				>
					{saveToast}
				</div>
			) : null}
		</section>
	);
}
