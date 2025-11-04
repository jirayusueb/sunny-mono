import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

type SignInRequest = {
	email: string;
	password: string;
};

function useSignIn() {
	const router = useRouter();

	return useMutation({
		mutationFn: (request: SignInRequest) =>
			authClient.signIn.email({
				email: request.email,
				password: request.password,
			}),
		onSuccess: () => {
			router.push("/");
			toast.success("Sign in successful");
		},
		onError: () => {
			toast.error("Sign in failed");
		},
	});
}

export default useSignIn;
