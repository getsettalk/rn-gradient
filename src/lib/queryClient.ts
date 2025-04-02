import { QueryClient } from "@tanstack/react-query";

/**
 * This is a simplified mock version of the queryClient
 * since we're not using a backend for this app, but it could
 * be extended later to support real API calls if needed.
 */

export async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const error = new Error(`Error ${res.status}: ${res.statusText}`);
    throw error;
  }
}

export async function apiRequest<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  
  await throwIfResNotOk(res);
  return res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => (path: string) => Promise<T> = () => {
  return async (path: string) => {
    const response = await fetch(path);
    return response.json();
  };
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});