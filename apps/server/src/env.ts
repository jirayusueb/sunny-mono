import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	/**
	 * The prefix that client-side variables must have. This is optional and not needed for server-only
	 * variables, but can be helpful if you want to have a similar workflow for both client and
	 * server.
	 */
	clientPrefix: "PUBLIC_",

	/**
	 * Specify your server-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars.
	 */
	server: {
		PORT: z
			.string()
			.optional()
			.default("3001")
			.transform((val) => Number.parseInt(val, 10)),
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.optional()
			.default("development"),
		DATABASE_URL: z.string().min(1),
		BETTER_AUTH_SECRET: z.string().min(1).optional().default("your-secret-key"),
		SESSION_TIMEOUT: z
			.string()
			.optional()
			.default("86400")
			.transform((val) => Number.parseInt(val, 10)),
		CORS_ORIGIN: z.string().url().optional().default("http://localhost:3000"),
	},

	/**
	 * Specify your client-side environment variables schema here.
	 * This is unused for server-side environments.
	 */
	client: {},

	/**
	 * You can't destruct `process.env` as a regular object in the server build step, so you need
	 * to destruct them manually here.
	 */
	runtimeEnv: {
		PORT: process.env.PORT,
		NODE_ENV: process.env.NODE_ENV,
		DATABASE_URL: process.env.DATABASE_URL,
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
		SESSION_TIMEOUT: process.env.SESSION_TIMEOUT,
		CORS_ORIGIN: process.env.CORS_ORIGIN,
	},

	/**
	 * Makes it so that empty strings are treated as undefined.
	 * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
	 */
	emptyStringAsUndefined: true,

	/**
	 * Run `build` or `dev` with SKIP_ENV_VALIDATION to skip env validation.
	 * This is especially useful for Docker builds.
	 */
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});

