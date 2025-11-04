import z from "zod";

const useSignInFormSchema = () =>
	z.object({
		email: z.string().email(),
		password: z.string().min(8),
	});

export default useSignInFormSchema;
