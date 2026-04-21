import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

// Mock the Button component to avoid lucide-react / tailwind issues
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, className, variant }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: string;
  }) => (
    <button onClick={onClick} className={className} data-variant={variant}>
      {children}
    </button>
  ),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  AlertTriangle: () => <svg data-testid="alert-triangle" />,
  RefreshCcw: () => <svg data-testid="refresh-icon" />,
}));

import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

// A component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error message");
  }
  return <div>No error</div>;
};

// Suppress console.error in tests for cleaner output
const originalConsoleError = console.error;

describe("ErrorBoundary", () => {
  beforeEach(() => {
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div>Child content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("renders the default error UI when a child throws", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders the error description text", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(
      screen.getByText(/unexpected error while rendering this section/i)
    ).toBeInTheDocument();
  });

  it("renders a 'Try Again' button", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText(/try again/i)).toBeInTheDocument();
  });

  it("renders a custom fallback when provided and an error is thrown", () => {
    const customFallback = <div>Custom fallback UI</div>;
    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText("Custom fallback UI")).toBeInTheDocument();
    expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
  });

  it("does NOT render the custom fallback when there is no error", () => {
    const customFallback = <div>Custom fallback UI</div>;
    render(
      <ErrorBoundary fallback={customFallback}>
        <div>Normal content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText("Normal content")).toBeInTheDocument();
    expect(screen.queryByText("Custom fallback UI")).not.toBeInTheDocument();
  });

  it("calls console.error when a child throws", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(console.error).toHaveBeenCalled();
  });

  it("reloads the page when 'Try Again' is clicked", () => {
    const reloadMock = vi.fn();
    Object.defineProperty(window, "location", {
      value: { reload: reloadMock },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const tryAgainButton = screen.getByText(/try again/i);
    fireEvent.click(tryAgainButton);
    expect(reloadMock).toHaveBeenCalled();
  });

  it("getDerivedStateFromError sets hasError to true", () => {
    // Verify the static method behavior by checking the rendered state after error
    const { container } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    // The error UI should be shown, confirming hasError=true
    expect(container.querySelector(".border-red-200")).toBeInTheDocument();
  });

  it("renders error details in development mode", () => {
    const originalEnv = process.env.NODE_ENV;
    (process.env as { NODE_ENV: string }).NODE_ENV = "development";

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // The error details section should appear in dev
    expect(screen.getByText("Error Details")).toBeInTheDocument();

    (process.env as { NODE_ENV: string }).NODE_ENV = originalEnv;
  });

  it("does not render error details in production mode", () => {
    const originalEnv = process.env.NODE_ENV;
    (process.env as { NODE_ENV: string }).NODE_ENV = "production";

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.queryByText("Error Details")).not.toBeInTheDocument();

    (process.env as { NODE_ENV: string }).NODE_ENV = originalEnv;
  });
});