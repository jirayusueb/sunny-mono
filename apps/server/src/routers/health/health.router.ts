import { Elysia } from "elysia";

import { StatusCodes } from "../../shared/const";
import { Response } from "../../shared/utils";

const healthRouter = new Elysia({ prefix: "/health" }).get("/", ({ set }) => {
	const startTime = Date.now();
	const responseTime = Date.now() - startTime;

	set.status = StatusCodes.OK;

	return Response.ok({
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
		version: "1.0.0",
		responseTime,
		status: "healthy",
	});
});

export default healthRouter;
