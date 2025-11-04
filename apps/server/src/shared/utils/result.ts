/**
 * Result pattern implementation inspired by Rust's Result<T, E>
 *
 * A Result is a type that represents either success (Ok) or failure (Err).
 * This is useful for error handling without throwing exceptions.
 */

export type Result<T, E = Error> = Ok<T> | Err<E>;

export class Ok<T> {
	readonly success = true as const;
	readonly error = false as const;
	readonly value: T;

	constructor(value: T) {
		this.value = value;
	}

	/**
	 * Returns true if the result is Ok
	 */
	isOk(): this is Ok<T> {
		return true;
	}

	/**
	 * Returns false if the result is Ok
	 */
	isErr(): this is Err<never> {
		return false;
	}

	/**
	 * Returns the contained Ok value or throws if the result is Err
	 */
	unwrap(): T {
		return this.value;
	}

	/**
	 * Returns the contained Ok value or a provided default
	 */
	unwrapOr(_defaultValue: T): T {
		return this.value;
	}

	/**
	 * Returns the contained Ok value or computes it from a closure
	 */
	unwrapOrElse(_fn: () => T): T {
		return this.value;
	}

	/**
	 * Maps a Result<T, E> to Result<U, E> by applying a function to a contained Ok value
	 */
	map<U>(fn: (value: T) => U): Result<U, never> {
		return new Ok(fn(this.value));
	}

	/**
	 * Maps a Result<T, E> to Result<T, F> by applying a function to a contained Err value
	 */
	mapErr<F>(_fn: (error: never) => F): Result<T, F> {
		return this as Result<T, F>;
	}

	/**
	 * Returns res if the result is Ok, otherwise returns the Err value of self
	 */
	and<U, F>(res: Result<U, F>): Result<U, F> {
		return res;
	}

	/**
	 * Calls op if the result is Ok, otherwise returns the Err value of self
	 */
	andThen<U, F>(op: (value: T) => Result<U, F>): Result<U, F> {
		return op(this.value);
	}

	/**
	 * Returns res if the result is Err, otherwise returns the Ok value of self
	 */
	or<F>(_res: Result<T, F>): Result<T, F> {
		return this as Result<T, F>;
	}

	/**
	 * Calls op if the result is Err, otherwise returns the Ok value of self
	 */
	orElse<F>(_op: (error: never) => Result<T, F>): Result<T, F> {
		return this as Result<T, F>;
	}

	/**
	 * Returns the contained Ok value or throws with a custom message
	 */
	expect(_msg: string): T {
		return this.value;
	}

	/**
	 * Returns the contained Err value or throws if the result is Ok
	 */
	unwrapErr(): never {
		throw new Error("Called unwrapErr on Ok value");
	}

	/**
	 * Returns the contained Err value or a provided default
	 */
	unwrapErrOr<F>(defaultValue: F): F {
		return defaultValue;
	}

	/**
	 * Returns the contained Err value or computes it from a closure
	 */
	unwrapErrOrElse<F>(fn: () => F): F {
		return fn();
	}

	/**
	 * Converts from Result<T, E> to Option<T>
	 */
	ok(): T | null {
		return this.value;
	}

	/**
	 * Converts from Result<T, E> to Option<E>
	 */
	err(): null {
		return null;
	}

	/**
	 * Returns an iterator over the possibly contained value
	 */
	*[Symbol.iterator](): Iterator<T> {
		yield this.value;
	}

	/**
	 * String representation of the Result
	 */
	toString(): string {
		return `Ok(${this.value})`;
	}
}

export class Err<E> {
	readonly success = false as const;
	readonly isError = true as const;
	readonly error: E;

	constructor(error: E) {
		this.error = error;
	}

	/**
	 * Returns true if the result is Ok
	 */
	isOk(): this is Ok<never> {
		return false;
	}

	/**
	 * Returns false if the result is Ok
	 */
	isErr(): this is Err<E> {
		return true;
	}

	/**
	 * Returns the contained Ok value or throws if the result is Err
	 */
	unwrap(): never {
		throw this.error;
	}

	/**
	 * Returns the contained Ok value or a provided default
	 */
	unwrapOr<T>(defaultValue: T): T {
		return defaultValue;
	}

	/**
	 * Returns the contained Ok value or computes it from a closure
	 */
	unwrapOrElse<T>(fn: () => T): T {
		return fn();
	}

	/**
	 * Maps a Result<T, E> to Result<U, E> by applying a function to a contained Ok value
	 */
	map<U>(_fn: (value: never) => U): Result<U, E> {
		return this as Result<U, E>;
	}

	/**
	 * Maps a Result<T, E> to Result<T, F> by applying a function to a contained Err value
	 */
	mapErr<F>(fn: (error: E) => F): Result<never, F> {
		return new Err(fn(this.error));
	}

	/**
	 * Returns res if the result is Ok, otherwise returns the Err value of self
	 */
	and<U, F>(_res: Result<U, F>): Result<U, E> {
		return this as Result<U, E>;
	}

	/**
	 * Calls op if the result is Ok, otherwise returns the Err value of self
	 */
	andThen<U, F>(_op: (value: never) => Result<U, F>): Result<U, E> {
		return this as Result<U, E>;
	}

	/**
	 * Returns res if the result is Err, otherwise returns the Ok value of self
	 */
	or<T, F>(res: Result<T, F>): Result<T, F> {
		return res;
	}

	/**
	 * Calls op if the result is Err, otherwise returns the Ok value of self
	 */
	orElse<T, F>(op: (error: E) => Result<T, F>): Result<T, F> {
		return op(this.error);
	}

	/**
	 * Returns the contained Ok value or throws with a custom message
	 */
	expect(msg: string): never {
		throw new Error(`${msg}: ${this.error}`);
	}

	/**
	 * Returns the contained Err value or throws if the result is Ok
	 */
	unwrapErr(): E {
		return this.error;
	}

	/**
	 * Returns the contained Err value or a provided default
	 */
	unwrapErrOr<F>(_defaultValue: F): E {
		return this.error;
	}

	/**
	 * Returns the contained Err value or computes it from a closure
	 */
	unwrapErrOrElse<F>(_fn: () => F): E {
		return this.error;
	}

	/**
	 * Converts from Result<T, E> to Option<T>
	 */
	ok(): null {
		return null;
	}

	/**
	 * Converts from Result<T, E> to Option<E>
	 */
	err(): E | null {
		return this.error;
	}

	/**
	 * Returns an iterator over the possibly contained value
	 */
	*[Symbol.iterator](): Iterator<never> {
		// Empty iterator for Err
	}

	/**
	 * String representation of the Result
	 */
	toString(): string {
		return `Err(${this.error})`;
	}
}

/**
 * Creates a successful Result containing the given value
 */
export function ok<T>(value: T): Ok<T> {
	return new Ok(value);
}

/**
 * Creates a failed Result containing the given error
 */
export function err<E>(error: E): Err<E> {
	return new Err(error);
}

/**
 * Utility functions for working with Results
 */
export const R = {
	/**
	 * Creates a successful Result containing the given value
	 */
	ok,

	/**
	 * Creates a failed Result containing the given error
	 */
	err,

	/**
	 * Wraps a function that might throw in a Result
	 */
	try<T>(fn: () => T): Result<T, Error> {
		try {
			return ok(fn());
		} catch (error) {
			return err(error instanceof Error ? error : new Error(String(error)));
		}
	},

	/**
	 * Wraps an async function that might throw in a Result
	 */
	async tryAsync<T>(fn: () => Promise<T>): Promise<Result<T, Error>> {
		try {
			const value = await fn();
			return ok(value);
		} catch (error) {
			return err(error instanceof Error ? error : new Error(String(error)));
		}
	},

	/**
	 * Combines multiple Results into a single Result
	 * Returns Ok with an array of values if all are Ok, otherwise returns the first Err
	 */
	combine<T, E>(results: Result<T, E>[]): Result<T[], E> {
		const values: T[] = [];
		for (const result of results) {
			if (result.isErr()) {
				return result as Result<T[], E>;
			}
			values.push(result.value);
		}
		return ok(values);
	},

	/**
	 * Maps over an array of Results, collecting all Ok values and first Err
	 */
	partition<T, E>(results: Result<T, E>[]): { ok: T[]; err: E[] } {
		const okValues: T[] = [];
		const errValues: E[] = [];

		for (const result of results) {
			if (result.isOk()) {
				okValues.push(result.value);
			} else {
				errValues.push((result as Err<E>).error);
			}
		}

		return { ok: okValues, err: errValues };
	},

	/**
	 * Creates a Result from a value that might be null or undefined
	 */
	fromNullable<T>(
		value: T | null | undefined,
		error = "Value is null or undefined",
	): Result<NonNullable<T>, Error> {
		return value != null ? ok(value as NonNullable<T>) : err(new Error(error));
	},

	/**
	 * Creates a Result from a predicate function
	 */
	fromPredicate<T>(
		value: T,
		predicate: (val: T) => boolean,
		error: string | ((val: T) => string) = "Predicate failed",
	): Result<T, Error> {
		return predicate(value)
			? ok(value)
			: err(new Error(typeof error === "function" ? error(value) : error));
	},
};

/**
 * Type guard to check if a Result is Ok
 */
export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
	return result.isOk();
}

/**
 * Type guard to check if a Result is Err
 */
export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
	return result.isErr();
}

/**
 * Helper type to extract the Ok type from a Result
 */
export type OkType<T> = T extends Result<infer U, unknown> ? U : never;

/**
 * Helper type to extract the Err type from a Result
 */
export type ErrType<T> = T extends Result<unknown, infer E> ? E : never;
