import path from "node:path";
import reactSwc from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [reactSwc()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@workspace/server": path.resolve(__dirname, "../server/src"),
			"@workspace/shared": path.resolve(__dirname, "../../packages/shared/src"),
		},
	},
	test: {
		globals: true,
		environment: "happy-dom",
		setupFiles: ["./src/test/setup.ts"],
		include: ["src/**/*.{test,spec}.{ts,tsx}"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			exclude: [
				"node_modules/",
				"src/test/",
				"**/*.d.ts",
				"**/*.config.*",
				"**/mockData/**",
			],
		},
	},
});
