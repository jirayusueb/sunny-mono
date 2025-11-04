import { z } from "zod";

const MIN_NAME_LENGTH = 2;
const MIN_PASSWORD_LENGTH = 8;

function useSignUpFormSchema() {
	return z.object({
		name: z.string().min(MIN_NAME_LENGTH, "Name must be at least 2 characters"),
		email: z.email("Invalid email address"),
		password: z
			.string()
			.min(MIN_PASSWORD_LENGTH, "Password must be at least 8 characters"),
	});
}

export default useSignUpFormSchema;
