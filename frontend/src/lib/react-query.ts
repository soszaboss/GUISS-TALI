import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000, // 1 minute
      cacheTime: 300 * 1000, // 5 minutes
    },
    mutations: {
      onSuccess: async () => {
        // Invalider toutes les requêtes après chaque mutation réussie
        await queryClient.invalidateQueries();
      },
      onSettled: async () => {
        // Alternative: invalider après succès ou erreur
        await queryClient.invalidateQueries();
      },
      retry: 1,
      useErrorBoundary: true,
    }
  }
});