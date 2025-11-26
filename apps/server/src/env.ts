import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	clientPrefix: "PUBLIC_",
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
	client: {},
	runtimeEnv: {
		PORT: process.env.PORT,
		NODE_ENV: process.env.NODE_ENV,
		DATABASE_URL: process.env.DATABASE_URL,
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
		SESSION_TIMEOUT: process.env.SESSION_TIMEOUT,
		CORS_ORIGIN: process.env.CORS_ORIGIN,
	},
	emptyStringAsUndefined: true,
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
