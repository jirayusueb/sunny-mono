import { Elysia } from "elysia";

import { StatusCodes } from "../../const";
import { auth } from "../../lib";

const authMiddleware = new Elysia({ name: "auth-middleware" }).macro({
	auth: {
		async resolve({ status, request: { headers } }) {
			const session = await auth.api.getSession({
				headers,
			});

			if (!session) {
				return status(StatusCodes.UNAUTHORIZED);
			}

			return {
				user: session.user,
				session: session.session,
			};
		},
	},
});

export default authMiddleware;
