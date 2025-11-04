import { StatusCodes } from "../const";

// Standard API response types
// This file is exported via @/utils barrel export
export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
	code?: string;
	message?: string;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

// Concise API response helpers
export const Response = {
	ok: <T>(data: T, message?: string): ApiResponse<T> => ({
		success: true,
		data,
		...(message && { message }),
	}),

	err: (
		error: string | Error,
		statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
	): { response: ApiResponse; statusCode: number } => ({
		response: {
			success: false,
			error: error instanceof Error ? error.message : error,
			...(error instanceof Error &&
				"code" in error && { code: (error as Error & { code: string }).code }),
		},
		statusCode,
	}),

	paginate: <T>(
		data: T[],
		page: number,
		limit: number,
		total: number,
	): PaginatedResponse<T> => ({
		success: true,
		data,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	}),

	// Common error responses with proper status codes
	badRequest: (error: string | Error) =>
		Response.err(error, StatusCodes.BAD_REQUEST),

	unauthorized: (error: string | Error) =>
		Response.err(error, StatusCodes.UNAUTHORIZED),

	forbidden: (error: string | Error) =>
		Response.err(error, StatusCodes.FORBIDDEN),

	notFound: (error: string | Error) =>
		Response.err(error, StatusCodes.NOT_FOUND),

	conflict: (error: string | Error) =>
		Response.err(error, StatusCodes.CONFLICT),

	unprocessableEntity: (error: string | Error) =>
		Response.err(error, StatusCodes.UNPROCESSABLE_ENTITY),

	tooManyRequests: (error: string | Error) =>
		Response.err(error, StatusCodes.TOO_MANY_REQUESTS),
};
