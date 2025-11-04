import { treaty } from "@elysiajs/eden";
import type { Routers } from "@workspace/server";

import { env } from "../env";

export function getToken() {
	if (typeof window === "undefined") {
		return null;
	}

	return localStorage.getItem("bearer_token");
}

// Extract host and port from URL for treaty (e.g., "http://localhost:3001" -> "localhost:3001")
const serverUrl = new URL(env.NEXT_PUBLIC_SERVER_URL);
const serverHost = `${serverUrl.hostname}${serverUrl.port ? `:${serverUrl.port}` : ""}`;

export const client = treaty<Routers>(serverHost, {
	headers: {
		"Content-Type": "application/json",
		Authorization: `Bearer ${getToken()}`,
	},
});
