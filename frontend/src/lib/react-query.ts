import type { DefaultOptions } from "@tanstack/react-query";

export const queryConfig = {
  queries: {
    refetchOnWindowFocus: false, // Évite les requêtes automatiques quand l'utilisateur revient sur l'onglet
    refetchOnReconnect: true, // Permet de récupérer les données après une reconnexion réseau
    retry: 1, // Effectue une seule tentative supplémentaire en cas d'échec
    staleTime: 1000 * 60, // Définit une fraîcheur des données à 60 secondes
    // cacheTime: 1000 * 300, // Conserve les données en cache pendant 5 minutes pour éviter des appels inutiles
    useErrorBoundary: true, // Active la gestion centralisée des erreurs via Error Boundary
  },
} satisfies DefaultOptions;


// export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> =
//   Awaited<ReturnType<FnType>>;

// export type QueryConfig<T extends (...args: any[]) => any> = Omit<
//   ReturnType<T>,
//   'queryKey' | 'queryFn'
// >;

// export type MutationConfig<
//   MutationFnType extends (...args: any) => Promise<any>,
// > = UseMutationOptions<
//   ApiFnReturnType<MutationFnType>,
//   Error,
//   Parameters<MutationFnType>[0]
// >;