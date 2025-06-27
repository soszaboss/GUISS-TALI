import { Spinner } from '@/components/ui/spinner';
import { MetronicSplashScreenProvider } from '@/components/ui/splash-screen';
import Error500 from '@/features/errors/components/Error500';
import { AuthInit, AuthProvider } from '@/hooks/auth/Auth';
import type { WithChildren } from '@/utils/react18MigrationHelpers';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
import { AppRoutes } from './routes/AppRoutes';
import { QueryRequestProvider } from '@/hooks/_QueryRequestProvider';
import { Toaster } from '@/components/ui/sonner';
import { ListViewProvider } from '@/hooks/_ListViewProvider';
import { PatientQueryResponseProvider } from '@/hooks/patient/PatientQueryResponseProvider';
import { queryClient } from '@/lib/react-query';


export const AppProvider = ({ children }: WithChildren) => {

  return (
    <React.Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <ErrorBoundary FallbackComponent={Error500}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <MetronicSplashScreenProvider>
              <HelmetProvider>
                <QueryRequestProvider>
                  <ListViewProvider>
                    <AuthInit>
                      <PatientQueryResponseProvider>
                        {/* <MedicalRecordQueryResponseProvider> */}
                          {import.meta.env.DEV && <ReactQueryDevtools />}
                          {children}
                          <AppRoutes />
                          <Toaster richColors/>
                      {/* </MedicalRecordQueryResponseProvider> */}
                      </PatientQueryResponseProvider>
                    </AuthInit>
                  </ListViewProvider>
                </QueryRequestProvider>
              </HelmetProvider>
            </MetronicSplashScreenProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
};