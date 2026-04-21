"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-red-200 bg-red-50/50 p-8 text-center dark:border-red-900/30 dark:bg-red-950/20">
          <div className="mb-4 rounded-full bg-red-100 p-3 text-red-600 dark:bg-red-900/50 dark:text-red-400">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-red-950 dark:text-red-50">
            Something went wrong
          </h2>
          <p className="mb-6 max-w-md text-red-700/80 dark:text-red-300/80">
            We encountered an unexpected error while rendering this section. Our team has been notified.
          </p>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={this.handleReset}
              className="gap-2 border-red-200 hover:bg-red-100 dark:border-red-900/50 dark:hover:bg-red-900/30"
            >
              <RefreshCcw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
          {process.env.NODE_ENV === "development" && (
            <div className="mt-8 overflow-hidden rounded-lg border border-red-200 bg-white text-left text-xs text-red-900 dark:border-red-900/50 dark:bg-zinc-950 dark:text-red-200">
              <div className="border-b border-red-100 bg-red-50 px-3 py-2 font-mono font-bold dark:border-red-900/30 dark:bg-red-950/40">
                Error Details
              </div>
              <pre className="max-h-[200px] overflow-auto p-3 font-mono">
                {this.state.error?.stack || this.state.error?.message}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
