"use client";

import { Suspense } from "react";

import { Loader } from "@/components";

import { LoginContainer } from "@/containers/login";

export default function Page() {
	return (
		<Suspense fallback={<Loader />}>
			<LoginContainer />
		</Suspense>
	);
}
