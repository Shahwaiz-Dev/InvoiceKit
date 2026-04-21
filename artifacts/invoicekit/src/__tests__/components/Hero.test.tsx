import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      className,
      ...props
    }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className}>{children}</div>
    ),
  },
}));

vi.mock("lucide-react", () => ({
  Download: () => <svg data-testid="download-icon" />,
  CheckCircle2: () => <svg data-testid="check-circle-icon" />,
}));

vi.mock("@/lib/auth-client", () => ({
  useSession: vi.fn(),
}));

import { Hero } from "@/components/home/Hero";
import { useSession } from "@/lib/auth-client";

describe("Hero component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSession).mockReturnValue({ data: null } as any);
  });

  describe("unauthenticated state (no session)", () => {
    it("renders 'Unlock All Templates' link when not logged in", () => {
      vi.mocked(useSession).mockReturnValue({ data: null } as any);
      render(<Hero />);
      expect(screen.getByText(/Unlock All Templates/i)).toBeInTheDocument();
    });

    it("links to /register with callbackUrl when not logged in", () => {
      vi.mocked(useSession).mockReturnValue({ data: null } as any);
      render(<Hero />);
      const link = screen.getByText(/Unlock All Templates/i).closest("a");
      expect(link).not.toBeNull();
      expect(link?.getAttribute("href")).toContain("/register");
      expect(link?.getAttribute("href")).toContain("callbackUrl");
    });

    it("does NOT render 'Browse All Templates' button when not logged in", () => {
      vi.mocked(useSession).mockReturnValue({ data: null } as any);
      render(<Hero />);
      expect(screen.queryByText(/Browse All Templates/i)).not.toBeInTheDocument();
    });
  });

  describe("authenticated state (with session)", () => {
    const mockSession = { user: { id: "user_1", name: "Test User", email: "test@example.com" } };

    it("renders 'Browse All Templates' button when logged in", () => {
      vi.mocked(useSession).mockReturnValue({ data: mockSession } as any);
      render(<Hero />);
      expect(screen.getByText(/Browse All Templates/i)).toBeInTheDocument();
    });

    it("does NOT render 'Unlock All Templates' link when logged in", () => {
      vi.mocked(useSession).mockReturnValue({ data: mockSession } as any);
      render(<Hero />);
      expect(screen.queryByText(/Unlock All Templates/i)).not.toBeInTheDocument();
    });

    it("calls scrollTo on 'templates' element when Browse All Templates is clicked", () => {
      vi.mocked(useSession).mockReturnValue({ data: mockSession } as any);
      const mockScrollIntoView = vi.fn();
      const mockElement = { scrollIntoView: mockScrollIntoView };
      vi.spyOn(document, "getElementById").mockReturnValue(mockElement as any);

      render(<Hero />);
      const button = screen.getByText(/Browse All Templates/i);
      fireEvent.click(button);

      expect(document.getElementById).toHaveBeenCalledWith("templates");
      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
    });

    it("does not throw when scrollTo target element does not exist", () => {
      vi.mocked(useSession).mockReturnValue({ data: mockSession } as any);
      vi.spyOn(document, "getElementById").mockReturnValue(null);

      render(<Hero />);
      const button = screen.getByText(/Browse All Templates/i);
      // Should not throw when element is not found
      expect(() => fireEvent.click(button)).not.toThrow();
    });
  });

  describe("primary CTA link", () => {
    it("renders 'Use Clean Template' link", () => {
      render(<Hero />);
      expect(screen.getByText(/Use Clean Template/i)).toBeInTheDocument();
    });

    it("links to /editor with template=clean", () => {
      render(<Hero />);
      const link = screen.getByText(/Use Clean Template/i).closest("a");
      expect(link?.getAttribute("href")).toBe("/editor?template=clean");
    });

    it("primary CTA button has w-full sm:w-auto classes (changed from no w-full)", () => {
      render(<Hero />);
      const link = screen.getByText(/Use Clean Template/i).closest("a");
      expect(link?.className).toContain("w-full");
      expect(link?.className).toContain("sm:w-auto");
    });

    it("primary CTA button has font-bold class (changed from font-medium)", () => {
      render(<Hero />);
      const link = screen.getByText(/Use Clean Template/i).closest("a");
      expect(link?.className).toContain("font-bold");
    });

    it("primary CTA button uses primary/90 hover color (changed from hover:bg-secondary)", () => {
      render(<Hero />);
      const link = screen.getByText(/Use Clean Template/i).closest("a");
      expect(link?.className).toContain("hover:bg-primary/90");
    });
  });

  describe("CTA container layout", () => {
    it("CTA container uses items-center (changed from items-start)", () => {
      render(<Hero />);
      // The flex container holding the CTA buttons
      const ctaContainer = screen
        .getByText(/Use Clean Template/i)
        .closest("a")
        ?.closest("div");
      expect(ctaContainer?.className).toContain("items-center");
    });
  });

  describe("second CTA button styling (Browse/Unlock)", () => {
    it("Browse All Templates button has w-full sm:w-auto classes when logged in", () => {
      const mockSession = { user: { id: "user_1" } };
      vi.mocked(useSession).mockReturnValue({ data: mockSession } as any);
      render(<Hero />);
      const button = screen.getByText(/Browse All Templates/i);
      expect(button.className).toContain("w-full");
      expect(button.className).toContain("sm:w-auto");
    });

    it("Unlock All Templates link has w-full sm:w-auto classes when not logged in", () => {
      vi.mocked(useSession).mockReturnValue({ data: null } as any);
      render(<Hero />);
      const link = screen.getByText(/Unlock All Templates/i).closest("a");
      expect(link?.className).toContain("w-full");
      expect(link?.className).toContain("sm:w-auto");
    });

    it("Unlock All Templates link has rounded-full class", () => {
      vi.mocked(useSession).mockReturnValue({ data: null } as any);
      render(<Hero />);
      const link = screen.getByText(/Unlock All Templates/i).closest("a");
      expect(link?.className).toContain("rounded-full");
    });
  });

  describe("static content", () => {
    it("renders the hero heading with Free Invoice Generator text", () => {
      render(<Hero />);
      expect(screen.getByText(/Free Invoice Generator/i)).toBeInTheDocument();
    });

    it("renders feature badges", () => {
      render(<Hero />);
      expect(screen.getByText(/Clean template free/i)).toBeInTheDocument();
      expect(screen.getByText(/7 total templates/i)).toBeInTheDocument();
      expect(screen.getByText(/Instant PDF/i)).toBeInTheDocument();
      expect(screen.getByText(/No Watermarks/i)).toBeInTheDocument();
      expect(screen.getByText(/Free Forever/i)).toBeInTheDocument();
    });
  });
});