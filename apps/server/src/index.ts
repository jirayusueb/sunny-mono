import { Elysia } from "elysia";

import { routers } from "./routers";
import { StatusCodes } from "./shared/const";
import { loggerIntegration, openapiIntegration } from "./shared/integrations";
import { errorInterceptor } from "./shared/interceptors";
import { auth } from "./shared/lib";
import { corsMiddleware } from "./shared/middleware";

const app = new Elysia()
	.use(loggerIntegration)
	.use(openapiIntegration)
	.use(errorInterceptor)
	.use(corsMiddleware)
	.all("/api/auth/*", ({ request, set }) => {
		if (["POST", "GET"].includes(request.method)) {
			return auth.handler(request);
		}

		set.status = StatusCodes.METHOD_NOT_ALLOWED;

		return { error: "Method not allowed" };
	})
	.use(routers);

export default app;
export type App = typeof app;
