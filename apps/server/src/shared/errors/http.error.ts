// HTTP-related error classes
export class ValidationError extends Error {
	field?: string;

	constructor(message: string, field?: string) {
		super(message);
		this.name = "ValidationError";
		this.field = field;
	}
}

export class NotFoundError extends Error {
	constructor(resource: string) {
		super(`${resource} not found`);
		this.name = "NotFoundError";
	}
}

export class UnauthorizedError extends Error {
	constructor(message = "Authentication required") {
		super(message);
		this.name = "UnauthorizedError";
	}
}

export class ForbiddenError extends Error {
	constructor(message = "Access denied") {
		super(message);
		this.name = "ForbiddenError";
	}
}

export class ConflictError extends Error {
	constructor(message = "Resource conflict") {
		super(message);
		this.name = "ConflictError";
	}
}
