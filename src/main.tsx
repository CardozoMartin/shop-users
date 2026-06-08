import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import * as Sentry from '@sentry/react';
import ErrorBoundary from './components/ErrorBoundary';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN || '',
  tracesSampleRate: 0.2,
  environment: import.meta.env.MODE,
});

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Sentry.ErrorBoundary fallback={<p className="p-4 text-center">Error inesperado (Sentry). Recarga la página.</p>}>
        <QueryClientProvider client={queryClient}>
          <App />
          <Toaster />
        </QueryClientProvider>
      </Sentry.ErrorBoundary>
    </ErrorBoundary>
  </StrictMode>
);
