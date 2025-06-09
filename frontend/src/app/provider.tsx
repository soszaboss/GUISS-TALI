import { Spinner } from '@/components/ui/spinner';
import { MetronicSplashScreenProvider } from '@/components/ui/splash-screen';
import Error500 from '@/features/errors/components/Error500';
import { AuthProvider } from '@/hooks/auth/Auth';
import { queryConfig } from '@/lib/react-query';
import type { WithChildren } from '@/utils/react18MigrationHelpers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/AppRoutes';
import { QueryRequestProvider } from '@/hooks/_QueryRequestProvider';
import { Toaster } from '@/components/ui/sonner';
import { ListViewProvider } from '@/hooks/_ListViewProvider';
import { PatientQueryResponseProvider } from '@/hooks/patient/PatientQueryResponseProvider';


export const AppProvider = ({ children }: WithChildren) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      }),
  );

  return (
    <React.Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <ErrorBoundary FallbackComponent={Error500}>
        <AuthProvider>
            <MetronicSplashScreenProvider>
                <HelmetProvider>
                  <QueryRequestProvider>
                    <ListViewProvider>
                      <QueryClientProvider client={queryClient}>
                        <PatientQueryResponseProvider>
                            {import.meta.env.DEV && <ReactQueryDevtools />}
                            {children}
                            <RouterProvider router={router} />
                        </PatientQueryResponseProvider>
                      </QueryClientProvider>
                      <Toaster richColors/>
                    </ListViewProvider>
                  </QueryRequestProvider>
                </HelmetProvider>
            </MetronicSplashScreenProvider>
        </AuthProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
};