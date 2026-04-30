"use client";

import { useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

type PortfolioFormValues = {
	fullName: string;
	role: string;
	bio: string;
	skills: { value: string }[];
	projects: { title: string; description: string; techStack: string }[];
};

const steps = ["Profile", "Bio", "Skills", "Projects", "Review"] as const;

export default function UserForm() {
	const [currentStep, setCurrentStep] = useState(0);
	const [submittedData, setSubmittedData] = useState<PortfolioFormValues | null>(null);

	const {
		control,
		register,
		handleSubmit,
		trigger,
		formState: { errors, isSubmitting },
	} = useForm<PortfolioFormValues>({
		mode: "onTouched",
		defaultValues: {
			fullName: "",
			role: "",
			bio: "",
			skills: [{ value: "" }],
			projects: [{ title: "", description: "", techStack: "" }],
		},
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

	const getStepFields = (step: number): Parameters<typeof trigger>[0] => {
		if (step === 0) {
			return ["fullName", "role"];
		}
		if (step === 1) {
			return ["bio"];
		}
		if (step === 2) {
			return ["skills"];
		}
		if (step === 3) {
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

	const onSubmit = (data: PortfolioFormValues) => {
		setSubmittedData(data);
		console.log("Portfolio form submitted:", {
			...data,
			skills: data.skills.map((skill) => skill.value.trim()).filter(Boolean),
		});
	};

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
						Multi-step profile form
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
							<label className="text-sm font-medium text-zinc-300">Full Name</label>
							<input
								type="text"
								placeholder="e.g. Aiden Carter"
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
								placeholder="e.g. Frontend Engineer"
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

				{currentStep === 2 && (
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

						{errors.skills?.root?.message && (
							<p className="text-sm text-rose-400">{errors.skills.root.message}</p>
						)}
					</div>
				)}

				{currentStep === 3 && (
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-medium text-zinc-100">Projects</h3>
							<button
								type="button"
								onClick={() => appendProject({ title: "", description: "", techStack: "" })}
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
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{currentStep === 4 && (
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
								<span className="font-semibold text-zinc-100">Bio:</span> {values.bio}
							</p>
							<p>
								<span className="font-semibold text-zinc-100">Skills:</span>{" "}
								{values.skills?.map((skill) => skill.value).join(", ")}
							</p>
							<div>
								<span className="font-semibold text-zinc-100">Projects:</span>
								<ul className="mt-2 space-y-2">
									{values.projects?.map((project, index) => (
										<li key={`${project.title}-${index}`} className="rounded-xl border border-zinc-800 p-3">
											<p className="font-medium text-zinc-100">{project.title}</p>
											<p>{project.description}</p>
											<p className="text-zinc-400">{project.techStack}</p>
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
							disabled={isSubmitting}
							className="rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:brightness-110 disabled:opacity-60"
						>
							{isSubmitting ? "Submitting..." : "Submit Portfolio"}
						</button>
					)}
				</div>
			</form>

			{submittedData && (
				<div className="relative mt-6 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-200">
					Form submitted successfully for {submittedData.fullName}.
				</div>
			)}
		</section>
	);
}
