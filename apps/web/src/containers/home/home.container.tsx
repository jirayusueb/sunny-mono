"use client";

import { useHealthCheck } from "@/features/common/hooks";

function HomeContainer() {
	const { data: healthData, isLoading, error } = useHealthCheck();

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-background via-background to-muted/20 px-4">
			<div className="mx-auto w-full max-w-4xl text-center">
				{/* Hero Section */}
				<div className="space-y-4">
					<div className="inline-block rounded-lg bg-primary/10 px-3 py-1 font-medium text-primary text-sm">
						Better-T-Stack Template
					</div>

					<h1 className="font-bold text-5xl tracking-tight sm:text-6xl md:text-7xl">
						Welcome to Your
						<span className="block bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
							Full-Stack App
						</span>
					</h1>

					<p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
						A modern TypeScript monorepo with Next.js, Elysia, and Better-Auth.
						Built for speed, type safety, and developer experience.
					</p>
				</div>

				{/* Tech Stack Grid */}
				<div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
					<TechCard description="App Router" title="Next.js 15" />
					<TechCard description="Backend API" title="Elysia" />
					<TechCard description="Type Safety" title="TypeScript" />
					<TechCard description="Monorepo" title="Turborepo" />
				</div>

				{/* System Status Card */}
				<div className="mt-12">
					<div className="mx-auto max-w-md rounded-lg border bg-card p-6 shadow-sm">
						<div className="flex items-center justify-between">
							<h2 className="font-semibold text-lg">System Status</h2>
							<StatusBadge
								error={error}
								healthData={healthData}
								isLoading={isLoading}
							/>
						</div>

						<div className="mt-4">
							{isLoading && (
								<div className="flex items-center justify-center space-x-2">
									<div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
									<p className="text-muted-foreground text-sm">
										Checking system health...
									</p>
								</div>
							)}

							{error && (
								<div className="space-y-2 rounded-md bg-destructive/10 p-4">
									<p className="font-medium text-destructive text-sm">
										System health check failed
									</p>
									<p className="text-muted-foreground text-xs">
										Unable to connect to the server. Make sure the backend is
										running on port 3000.
									</p>
								</div>
							)}

							{healthData?.data?.data && (
								<div className="space-y-3">
									<div className="rounded-md bg-green-500/10 p-4">
										<p className="font-medium text-green-600 text-sm dark:text-green-400">
											All systems operational
										</p>
									</div>

									<div className="grid grid-cols-2 gap-3 text-sm">
										<MetricCard
											label="Uptime"
											value={`${Math.floor(healthData.data.data.uptime)}s`}
										/>
										<MetricCard
											label="Response"
											value={`${healthData.data.data.responseTime}ms`}
										/>
										<MetricCard
											label="Version"
											value={healthData.data.data.version}
										/>
										<MetricCard
											label="Status"
											value={healthData.data.data.status}
										/>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Quick Links */}
				<div className="mt-12 flex flex-wrap items-center justify-center gap-4">
					<a
						className="rounded-md border border-input bg-background px-4 py-2 font-medium text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
						href="http://localhost:3000/api/health"
						rel="noopener noreferrer"
						target="_blank"
					>
						API Docs
					</a>
					<a
						className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90"
						href="https://github.com"
						rel="noopener noreferrer"
						target="_blank"
					>
						View on GitHub
					</a>
				</div>
			</div>
		</div>
	);
}

function TechCard({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<div className="rounded-lg border bg-card p-4 text-center transition-all hover:shadow-md">
			<p className="font-semibold text-sm">{title}</p>
			<p className="mt-1 text-muted-foreground text-xs">{description}</p>
		</div>
	);
}

function StatusBadge({
	isLoading,
	error,
	healthData,
}: {
	isLoading: boolean;
	error: unknown;
	healthData: unknown;
}) {
	if (isLoading) {
		return (
			<span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 font-medium text-blue-600 text-xs dark:text-blue-400">
				Checking...
			</span>
		);
	}

	if (error) {
		return (
			<span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 font-medium text-destructive text-xs">
				Offline
			</span>
		);
	}

	if (healthData) {
		return (
			<span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 font-medium text-green-600 text-xs dark:text-green-400">
				Online
			</span>
		);
	}

	return null;
}

function MetricCard({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-md border bg-muted/50 p-3 text-left">
			<p className="text-muted-foreground text-xs">{label}</p>
			<p className="mt-1 font-medium text-sm">{value}</p>
		</div>
	);
}

export default HomeContainer;
