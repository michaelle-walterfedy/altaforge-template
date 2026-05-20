import { useQuery } from "@tanstack/react-query";
import { fetchHealthCheck } from "@/api/client";

const POLL_INTERVAL_MS = 15_000;

export function useHealthCheck() {
  return useQuery({
    queryKey: ["healthCheck"],
    queryFn: fetchHealthCheck,
    refetchInterval: POLL_INTERVAL_MS,
    refetchIntervalInBackground: true,
    staleTime: POLL_INTERVAL_MS,
    retry: 1,
  });
}
