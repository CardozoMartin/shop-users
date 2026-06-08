import React from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Sentry hace la captura automáticamente si el componente está envuelto en Sentry.ErrorBoundary,
    // pero dejamos este hook para trazabilidad adicional / fallback locales.
    console.error('Unhandled app error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
          <h1 className="text-2xl font-bold mb-2">Ocurrió un error inesperado</h1>
          <p className="text-sm text-gray-600 mb-4">Por favor recarga la página o vuelve más tarde.</p>
          <button
            type="button"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            Recargar
          </button>
          {this.state.error && <pre className="mt-4 text-xs text-red-600">{this.state.error.message}</pre>}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
