import { Elysia } from "elysia";

import { StatusCodes } from "../../const";
import {
	ConflictError,
	ForbiddenError,
	NotFoundError,
	UnauthorizedError,
	ValidationError,
} from "../../errors";
import { Response } from "../../utils";

const errorInterceptor = new Elysia({ name: "error-interceptor" }).onError(
	({ error, set }) => {
		console.error("Error occurred:", error);

		// Handle custom errors
		if (error instanceof ValidationError) {
			set.status = StatusCodes.UNPROCESSABLE_ENTITY;
			return Response.unprocessableEntity(error.message);
		}

		if (error instanceof NotFoundError) {
			set.status = StatusCodes.NOT_FOUND;
			return Response.notFound(error.message);
		}

		if (error instanceof UnauthorizedError) {
			set.status = StatusCodes.UNAUTHORIZED;
			return Response.unauthorized(error.message);
		}

		if (error instanceof ForbiddenError) {
			set.status = StatusCodes.FORBIDDEN;
			return Response.forbidden(error.message);
		}

		if (error instanceof ConflictError) {
			set.status = StatusCodes.CONFLICT;
			return Response.conflict(error.message);
		}

		// Handle Elysia validation errors
		if (error instanceof Error && error.message.includes("Validation error")) {
			set.status = StatusCodes.BAD_REQUEST;
			return Response.badRequest("Invalid request data");
		}

		// Handle database errors
		if (
			error instanceof Error &&
			(error.message.includes("database") || error.message.includes("SQL"))
		) {
			set.status = StatusCodes.INTERNAL_SERVER_ERROR;
			return Response.err("Database error occurred");
		}

		// Handle network errors
		if (
			error instanceof Error &&
			(error.message.includes("network") || error.message.includes("fetch"))
		) {
			set.status = StatusCodes.BAD_GATEWAY;
			return Response.err("Network error occurred");
		}

		// Default error handling
		set.status = StatusCodes.INTERNAL_SERVER_ERROR;
		return Response.err("An unexpected error occurred");
	},
);

export default errorInterceptor;
