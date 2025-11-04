import { v4 as uuidv4, v7 as uuidv7 } from "uuid";

// Constants for UUID validation and processing
const UUID_VERSION_4 = 4;
const UUID_VERSION_7 = 7;
const UUID_VALID_VERSIONS = [UUID_VERSION_4, UUID_VERSION_7] as const;
const UUID_V7_TIMESTAMP_LENGTH = 12;
const UUID_V7_HEX_BASE = 16;

// Pre-compiled regex for UUID validation (moved to top level for performance)
const UUID_REGEX =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Generate a UUID v7 (time-ordered UUID)
 *
 * UUID v7 is a time-ordered UUID that provides better database performance
 * due to its sequential nature and includes a timestamp component.
 *
 * @returns A UUID v7 string
 */
export function generateUuidV7(): string {
	return uuidv7();
}
/**
 * Generate a UUID v4 (random UUID)
 *
 * UUID v4 is a random UUID that provides good uniqueness guarantees
 * but may not be optimal for database performance due to random ordering.
 *
 * @returns A UUID v4 string
 */
export function generateUuidV4(): string {
	return uuidv4();
}

/**
 * Generate a UUID with a specified version
 *
 * @param version - The UUID version to generate (4 or 7)
 * @returns A UUID string of the specified version
 * @throws Error if version is not 4 or 7
 */
export function generateUuid(version: 4 | 7 = 7): string {
	if (!UUID_VALID_VERSIONS.includes(version)) {
		throw new Error(
			`Unsupported UUID version: ${version}. Only versions 4 and 7 are supported.`,
		);
	}

	if (version === UUID_VERSION_4) {
		return generateUuidV4();
	}

	return generateUuidV7();
}

/**
 * Validate if a string is a valid UUID
 *
 * @param uuid - The string to validate
 * @returns True if the string is a valid UUID, false otherwise
 */
export function isValidUuid(uuid: string): boolean {
	return UUID_REGEX.test(uuid);
}

/**
 * Extract timestamp from UUID v7
 *
 * @param uuid - The UUID v7 string
 * @returns The timestamp in milliseconds since Unix epoch, or null if invalid
 */
export function extractTimestampFromUuidV7(uuid: string): number | null {
	if (!isValidUuid(uuid)) {
		return null;
	}

	try {
		// UUID v7 has the timestamp in the first 48 bits
		const hex = uuid.replace(/-/g, "");
		const timestampHex = hex.substring(0, UUID_V7_TIMESTAMP_LENGTH);
		const timestamp = Number.parseInt(timestampHex, UUID_V7_HEX_BASE);

		// Convert from milliseconds to seconds and back to get the actual timestamp
		return timestamp;
	} catch {
		return null;
	}
}

/**
 * Default UUID generator (uses v7 for better database performance)
 */
export const generateId = generateUuidV7;

/**
 * Re-export commonly used functions for convenience
 */
export { generateUuidV7 as uuid, generateUuidV7 as id };
