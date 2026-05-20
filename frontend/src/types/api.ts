export interface ApiError {
  message: string;
  status: number;
}

export interface HealthCheckResponse {
  status: "ok";
  version: string;
}

// Add your domain types here as you build out the application.
// Keep types co-located with the API functions that return them.
// Example:
//
// export interface Agent {
//   id: string;
//   name: string;
//   status: "idle" | "working" | "blocked";
// }
