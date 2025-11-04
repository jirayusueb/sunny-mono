import { useQuery } from "@tanstack/react-query";

import { healthKey } from "@/features/consts";
import { client } from "@/lib/client";

function useHealthCheck() {
	return useQuery({
		queryKey: healthKey.all,
		queryFn: async () => await client.health.get(),
		refetchInterval: 30_000, // Refetch every 30 seconds
		refetchIntervalInBackground: true,
	});
}

export default useHealthCheck;
