"use client";

import { useState } from "react";

import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () => {
      const client: QueryClient = new QueryClient({
        mutationCache: new MutationCache({
          onSuccess: () => client.invalidateQueries({ predicate: (query) => query.queryKey.includes("public") }),
        }),
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
            refetchOnWindowFocus: false,
          },

          mutations: {
            retry: 0,
          },
        },
      });
      return client;
    },
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
