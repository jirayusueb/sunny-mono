import { Suspense } from "react";

import { LoginContainer } from "@/containers/login";

export default function Page() {
	return (
		<Suspense>
			<LoginContainer />
		</Suspense>
	);
}
