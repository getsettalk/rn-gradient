import { QueryClient } from "@tanstack/react-query";

/**
 * This is a simplified mock version of the queryClient
 * since we're not using a backend for this app, but it could
 * be extended later to support real API calls if needed.
 */

// Helper function to check response status
export async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error: ${res.status} ${res.statusText} - ${errorText}`);
  }
}

// Helper function for API requests
export async function apiRequest<T>(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
  body?: any,
  init?: RequestInit
): Promise<T> {
  try {
    const url = path.startsWith("http") ? path : `/api${path}`;
    
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      ...init,
    });
    
    await throwIfResNotOk(response);
    return await response.json();
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
}

// Define behavior for unauthorized requests
type UnauthorizedBehavior = "returnNull" | "throw";

// Helper function to get query function with specific behavior
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => (context: { queryKey: [string, ...any[]] }) => Promise<T | null> = (options) => async (
  context
) => {
  // For frontend-only app, just return mock data or null
  // This can be expanded to actually fetch from an API if needed
  return null;
};

// Create the query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});