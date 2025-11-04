import { Elysia } from "elysia";

import { env } from "../../env";

export interface CorsConfig {
	origin: string;
	methods: string[];
	allowedHeaders: string[];
	credentials: boolean;
}

function loadCorsConfig(): CorsConfig {
	return {
		origin: env.CORS_ORIGIN,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	};
}

const corsConfig = new Elysia({ name: "corsConfig" }).decorate(
	"corsConfig",
	loadCorsConfig(),
);

export default corsConfig;
