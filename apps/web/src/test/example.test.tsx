import { describe, expect, it } from "vitest";

import { render, screen } from "./test-utils";

function ExampleComponent() {
	return <div>Hello, World!</div>;
}

describe("Example Test", () => {
	it("should render example component", () => {
		render(<ExampleComponent />);
		expect(screen.getByText("Hello, World!")).toBeInTheDocument();
	});
});
