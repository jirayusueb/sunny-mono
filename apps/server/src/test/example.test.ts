import { describe, expect, it } from "vitest";

describe("Example Test", () => {
	it("should pass a basic test", () => {
		expect(1 + 1).toBe(2);
	});

	it("should test string operations", () => {
		const message = "Hello, World!";
		expect(message).toContain("World");
		expect(message.length).toBeGreaterThan(0);
	});
});
