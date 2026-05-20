import axios, { AxiosError } from "axios";
import type { HealthCheckResponse } from "@/types/api";

const http = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

export async function fetchHealthCheck(): Promise<HealthCheckResponse | null> {
  try {
    const { data } = await http.get<HealthCheckResponse>("/health");
    return data;
  } catch (err) {
    if (err instanceof AxiosError) {
      console.error(`Health check failed: ${err.message}`);
    }
    return null;
  }
}

export default http;
