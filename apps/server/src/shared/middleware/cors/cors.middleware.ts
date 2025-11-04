import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

import { corsConfig } from "../../config";

const corsMiddleware = new Elysia({ name: "cors-middleware" })
	.use(corsConfig)
	.use(({ decorator: { corsConfig } }) =>
		cors({
			origin: corsConfig.origin,
			methods: corsConfig.methods,
			allowedHeaders: corsConfig.allowedHeaders,
			credentials: corsConfig.credentials,
		}),
	);

export default corsMiddleware;
