"use client";

import { useState } from "react";

import { SignInForm, SignUpForm } from "./components";

function LoginContainer() {
	const [showSignIn, setShowSignIn] = useState(false);

	return showSignIn ? (
		<SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
	) : (
		<SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
	);
}

export default LoginContainer;
