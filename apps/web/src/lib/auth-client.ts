import { createAuthClient } from "better-auth/react";

import { env } from "@/env";

export const authClient = createAuthClient({
	baseURL: env.NEXT_PUBLIC_SERVER_URL,
	fetchOptions: {
		onSuccess: (ctx) => {
			const authToken = ctx.response.headers.get("set-auth-token");
			if (authToken) {
				localStorage.setItem("bearer_token", authToken);
			}
		},
	},
});
