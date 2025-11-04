import { Elysia } from "elysia";

import { env } from "../../env";

export interface AuthConfig {
	secret: string;
	sessionTimeout: number;
}

function loadAuthConfig(): AuthConfig {
	return {
		secret: env.BETTER_AUTH_SECRET,
		sessionTimeout: env.SESSION_TIMEOUT,
	};
}

const authConfig = new Elysia({ name: "authConfig" }).decorate(
	"authConfig",
	loadAuthConfig(),
);

export default authConfig;
