import { Elysia } from "elysia";

import { env } from "../../env";

export interface CoreConfig {
	port: number;
	nodeEnv: string;
	databaseUrl: string;
}

function loadCoreConfig(): CoreConfig {
	return {
		port: env.PORT,
		nodeEnv: env.NODE_ENV,
		databaseUrl: env.DATABASE_URL,
	};
}

const coreConfig = new Elysia({ name: "coreConfig" }).decorate(
	"coreConfig",
	loadCoreConfig(),
);

export default coreConfig;
