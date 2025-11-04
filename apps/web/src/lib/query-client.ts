/** biome-ignore-all lint/style/noMagicNumbers: Time constants are self-documenting */
import { QueryClient } from "@tanstack/react-query";

const MINUTES_IN_MS = 60 * 1000;
const STALE_TIME = 5 * MINUTES_IN_MS; // 5 minutes
const GC_TIME = 10 * MINUTES_IN_MS; // 10 minutes (formerly cacheTime)

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: STALE_TIME,
			gcTime: GC_TIME,
			refetchOnWindowFocus: false,
		},
		mutations: {
			retry: false,
		},
	},
});
