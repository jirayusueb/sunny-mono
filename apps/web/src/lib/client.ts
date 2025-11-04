import { treaty } from "@elysiajs/eden";
import type { App } from "@workspace/server";

import { env } from "../env";

const isServer = typeof window === "undefined";

export function getToken() {
	if (isServer) {
		return null;
	}

	return localStorage.getItem("bearer_token");
}

// Extract host and port from URL for treaty (e.g., "http://localhost:3001" -> "localhost:3001")
const serverUrl = new URL(env.NEXT_PUBLIC_SERVER_URL);
const serverHost = `${serverUrl.hostname}${serverUrl.port ? `:${serverUrl.port}` : ""}`;

export const client = treaty<App>(serverHost, {
	headers: {
		"Content-Type": "application/json",
		Authorization: `Bearer ${getToken()}`,
	},
});
