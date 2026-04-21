import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React, { createRef } from "react";
import type { Variants } from "framer-motion";

// Track what props motion.div receives
let lastMotionDivProps: Record<string, any> = {};

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, custom, initial, animate, variants, ...rest }: any) => {
      lastMotionDivProps = { custom, initial, animate, variants };
      return (
        <div
          data-testid="motion-div"
          data-custom={custom}
          data-initial={initial}
          data-animate={animate}
        >
          {children}
        </div>
      );
    },
  },
  useInView: vi.fn(() => false),
}));

vi.mock("@/lib/utils", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

import { TimelineContent } from "@/components/ui/timeline-animation";
import { useInView } from "framer-motion";

function makeTimelineRef() {
  return createRef<HTMLElement | null>() as React.RefObject<HTMLElement | null>;
}

describe("TimelineContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    lastMotionDivProps = {};
    vi.mocked(useInView).mockReturnValue(false);
  });

  describe("rendering", () => {
    it("renders children inside a motion.div", () => {
      const ref = makeTimelineRef();
      render(
        <TimelineContent animationNum={0} timelineRef={ref}>
          <span>Hello world</span>
        </TimelineContent>
      );
      expect(screen.getByText("Hello world")).toBeInTheDocument();
    });

    it("renders with default 'div' outer wrapper", () => {
      const ref = makeTimelineRef();
      const { container } = render(
        <TimelineContent animationNum={0} timelineRef={ref}>
          Content
        </TimelineContent>
      );
      // Default outer wrapper is a div
      expect(container.firstChild?.nodeName).toBe("DIV");
    });

    it("renders with custom 'as' component (section)", () => {
      const ref = makeTimelineRef();
      const { container } = render(
        <TimelineContent animationNum={1} timelineRef={ref} as="section">
          Content
        </TimelineContent>
      );
      expect(container.firstChild?.nodeName).toBe("SECTION");
    });

    it("applies className to the outer wrapper", () => {
      const ref = makeTimelineRef();
      const { container } = render(
        <TimelineContent animationNum={0} timelineRef={ref} className="my-custom-class">
          Content
        </TimelineContent>
      );
      expect((container.firstChild as HTMLElement)?.className).toContain(
        "my-custom-class"
      );
    });
  });

  describe("animation props", () => {
    it("passes animationNum as custom prop to motion.div", () => {
      const ref = makeTimelineRef();
      render(
        <TimelineContent animationNum={3} timelineRef={ref}>
          Content
        </TimelineContent>
      );
      const motionDiv = screen.getByTestId("motion-div");
      expect(motionDiv.getAttribute("data-custom")).toBe("3");
    });

    it("sets initial='hidden' on motion.div", () => {
      const ref = makeTimelineRef();
      render(
        <TimelineContent animationNum={0} timelineRef={ref}>
          Content
        </TimelineContent>
      );
      const motionDiv = screen.getByTestId("motion-div");
      expect(motionDiv.getAttribute("data-initial")).toBe("hidden");
    });

    it("sets animate='hidden' when not in view", () => {
      vi.mocked(useInView).mockReturnValue(false);
      const ref = makeTimelineRef();
      render(
        <TimelineContent animationNum={0} timelineRef={ref}>
          Content
        </TimelineContent>
      );
      const motionDiv = screen.getByTestId("motion-div");
      expect(motionDiv.getAttribute("data-animate")).toBe("hidden");
    });

    it("sets animate='visible' when in view", () => {
      vi.mocked(useInView).mockReturnValue(true);
      const ref = makeTimelineRef();
      render(
        <TimelineContent animationNum={0} timelineRef={ref}>
          Content
        </TimelineContent>
      );
      const motionDiv = screen.getByTestId("motion-div");
      expect(motionDiv.getAttribute("data-animate")).toBe("visible");
    });

    it("calls useInView with once: true and margin: '-100px'", () => {
      const ref = makeTimelineRef();
      render(
        <TimelineContent animationNum={0} timelineRef={ref}>
          Content
        </TimelineContent>
      );
      expect(useInView).toHaveBeenCalledWith(ref, {
        once: true,
        margin: "-100px",
      });
    });
  });

  describe("customVariants (changed from Variant to Variants type)", () => {
    it("uses default variants when no customVariants provided", () => {
      const ref = makeTimelineRef();
      render(
        <TimelineContent animationNum={0} timelineRef={ref}>
          Content
        </TimelineContent>
      );
      // defaultVariants should have hidden with opacity:0 and y:20
      expect(lastMotionDivProps.variants).toHaveProperty("hidden");
      expect(lastMotionDivProps.variants).toHaveProperty("visible");
      expect(lastMotionDivProps.variants.hidden).toMatchObject({
        opacity: 0,
        y: 20,
      });
    });

    it("accepts customVariants as Variants object with hidden and visible keys", () => {
      const ref = makeTimelineRef();
      const customVariants: Variants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
      };
      render(
        <TimelineContent
          animationNum={0}
          timelineRef={ref}
          customVariants={customVariants}
        >
          Content
        </TimelineContent>
      );
      expect(lastMotionDivProps.variants).toEqual(customVariants);
    });

    it("accepts customVariants with visible as a function (Variants supports this)", () => {
      const ref = makeTimelineRef();
      const customVariants: Variants = {
        hidden: { opacity: 0, x: -50 },
        visible: (i: number) => ({
          opacity: 1,
          x: 0,
          transition: { delay: i * 0.05 },
        }),
      };
      render(
        <TimelineContent
          animationNum={2}
          timelineRef={ref}
          customVariants={customVariants}
        >
          Content
        </TimelineContent>
      );
      expect(lastMotionDivProps.variants).toEqual(customVariants);
      // Verify the visible function returns correct values when called
      const visibleFn = lastMotionDivProps.variants.visible;
      expect(typeof visibleFn).toBe("function");
      expect(visibleFn(2)).toMatchObject({ opacity: 1, x: 0, transition: { delay: 0.1 } });
    });

    it("prefers customVariants over defaultVariants when both are available", () => {
      const ref = makeTimelineRef();
      const customVariants: Variants = {
        hidden: { opacity: 0, rotate: 180 },
        visible: { opacity: 1, rotate: 0 },
      };
      render(
        <TimelineContent
          animationNum={0}
          timelineRef={ref}
          customVariants={customVariants}
        >
          Content
        </TimelineContent>
      );
      expect(lastMotionDivProps.variants.hidden).toMatchObject({ rotate: 180 });
    });

    it("defaultVariants visible function returns correct transition delay for animationNum", () => {
      const ref = makeTimelineRef();
      render(
        <TimelineContent animationNum={5} timelineRef={ref}>
          Content
        </TimelineContent>
      );
      const visibleFn = lastMotionDivProps.variants.visible;
      expect(typeof visibleFn).toBe("function");
      const result = visibleFn(5);
      expect(result).toMatchObject({
        opacity: 1,
        y: 0,
        transition: {
          delay: 5 * 0.1,
          duration: 0.5,
          ease: "easeOut",
        },
      });
    });
  });
});