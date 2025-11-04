import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

type SignUpRequest = {
	email: string;
	password: string;
	name: string;
};

function useSignUp() {
	const router = useRouter();

	return useMutation({
		mutationFn: (request: SignUpRequest) =>
			authClient.signUp.email({
				email: request.email,
				password: request.password,
				name: request.name,
			}),
		onSuccess: () => {
			router.push("/");
			toast.success("Sign up successful");
		},
		onError: () => {
			toast.error("Sign up failed");
		},
	});
}

export default useSignUp;
