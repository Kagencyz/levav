/**
 * ============================================================
 * tRPC PROVIDER — Demo Mode with Fallback Data
 * ============================================================
 * In demo mode: Returns sample data for all queries.
 * When backend is online: Uses real API calls.
 * ============================================================
 */

import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import superjson from "superjson";
import type { AppRouter } from "../../api/router";
import type { ReactNode } from "react";

export const trpc = createTRPCReact<AppRouter>();

/* Check if backend URL is configured */
const API_URL = import.meta.env.VITE_API_URL || "/api/trpc";
const HAS_BACKEND = !!import.meta.env.VITE_API_URL;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /* In demo mode, don't retry failed requests */
      retry: HAS_BACKEND ? 3 : false,
      /* In demo mode, data never goes stale */
      staleTime: HAS_BACKEND ? 1000 * 60 * 5 : Infinity,
    },
  },
});

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: API_URL,
      transformer: superjson,
      headers() {
        const token = localStorage.getItem("levav_token");
        return token ? { "x-local-auth-token": token } : {};
      },
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

export function TRPCProvider({ children }: { children: ReactNode }) {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
