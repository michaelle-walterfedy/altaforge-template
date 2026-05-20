import { describe, it, expect, vi, beforeEach } from "vitest";
import type { HealthCheckResponse } from "@/types/api";

// vi.hoisted ensures mockGet is defined before vi.mock hoisting runs
const mockGet = vi.hoisted(() => vi.fn());

vi.mock("axios", () => ({
  default: {
    create: vi.fn().mockReturnValue({ get: mockGet }),
    isAxiosError: vi.fn(),
  },
  AxiosError: class AxiosError extends Error {
    isAxiosError = true;
  },
}));

// Import after mocking so the module picks up the mock at init time
const { fetchHealthCheck } = await import("./client");

describe("fetchHealthCheck", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns health data on success", async () => {
    const payload: HealthCheckResponse = { status: "ok", version: "0.1.0" };
    mockGet.mockResolvedValueOnce({ data: payload });

    const result = await fetchHealthCheck();

    expect(result).toEqual(payload);
    expect(mockGet).toHaveBeenCalledWith("/health");
  });

  it("returns null on network error", async () => {
    mockGet.mockRejectedValueOnce(new Error("Network Error"));

    const result = await fetchHealthCheck();

    expect(result).toBeNull();
  });
});
