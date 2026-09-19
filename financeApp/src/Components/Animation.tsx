import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Box, Typography, keyframes, useMediaQuery } from "@mui/material";
import animation from "../assets/images/animation1.svg";

// Timing and geometry must match animation1.svg's final frame.
const SVG_END_SECONDS = 1.083332 + 2.5;
const SVG_VIEWBOX_SIZE = 1080;
const SVG_CIRCLE_DIAMETER = 198.6;
const SVG_CIRCLE_CENTER_Y = 863;
const CIRCLE_OFFSET_PERCENT = (SVG_CIRCLE_CENTER_Y / SVG_VIEWBOX_SIZE) * 100;

// Shared entrance animation for the name and its final suffix.
const revealName = keyframes`
  from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
`;

// A single phase keeps the sequential animation states mutually exclusive.
type AnimationPhase = "loading" | "revealing" | "moving" | "complete" | "static";
type AnimationProps = { headingComponent?: "h1" | "h2" | "h3" };

export default function Animation({ headingComponent = "h2" }: AnimationProps) {
  // Instance identity, motion preference, and playback state.
  const titleId = useId();
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", { noSsr: true });
  const [phase, setPhase] = useState<AnimationPhase>("loading");
  const [playbackId, setPlaybackId] = useState<string | null>(null);
  const showStatic = reducedMotion || phase === "static";
  const shouldPosition = !showStatic && (phase === "moving" || phase === "complete");

  // DOM references and the SVG position relative to the hero section.
  const heroRef = useRef<HTMLElement>(null);
  const periodRef = useRef<HTMLSpanElement>(null);
  const [periodPosition, setPeriodPosition] = useState<{
    left: number;
    top: number;
    width: number;
  } | null>(null);

  // Restart on mount, Vite refresh, or a motion-preference change.
  // A new image URL restarts the SVG's internal timeline as well as the CSS.
  useEffect(() => {
    setPhase("loading");
    setPeriodPosition(null);
    setPlaybackId(reducedMotion ? null : crypto.randomUUID());
  }, [reducedMotion]);

  // Measure the period after the heading appears, then track responsive resizing.
  useLayoutEffect(() => {
    const hero = heroRef.current;
    const period = periodRef.current;
    if (!shouldPosition || !hero || !period) return;

    const positionCircle = () => {
      const heroBounds = hero.getBoundingClientRect();
      const dotBounds = period.getBoundingClientRect();
      setPeriodPosition({
        left:
          dotBounds.left -
          heroBounds.left -
          hero.clientLeft +
          dotBounds.width / 2,
        top:
          dotBounds.top -
          heroBounds.top -
          hero.clientTop +
          dotBounds.height / 2,
        width: (dotBounds.width * SVG_VIEWBOX_SIZE) / SVG_CIRCLE_DIAMETER,
      });
    };

    positionCircle();
    const observer = new ResizeObserver(positionCircle);
    observer.observe(hero);
    observer.observe(period);
    if (period.parentElement) observer.observe(period.parentElement);
    return () => observer.disconnect();
  }, [shouldPosition]);

  // The parent owns the page landmark and outer spacing.
  return (
    <Box
      component="section"
      ref={heroRef}
      aria-labelledby={titleId}
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: "50svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: { xs: 3, md: 4 },
        bgcolor: "common.white",
        border: "1px solid",
        borderColor: "grey.200",
        borderRadius: 3,
        boxShadow:
          "0 2px 4px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.06)",
      }}
    >
      {/* Decorative SVG: load failures reveal a static, complete logo. */}
      {!showStatic && playbackId !== null && (
        <Box
          key={`circle-${playbackId}`}
          component="img"
          src={`${animation}?playback=${playbackId}`}
          alt=""
          onLoad={() => setPhase((current) => current === "loading" ? "revealing" : current)}
          onError={() => setPhase("static")}
          onTransitionEnd={(event) => {
            if (phase === "moving" && periodPosition && event.propertyName === "transform") {
              setPhase("complete");
            }
          }}
          sx={{
            position: "absolute",
            left: periodPosition?.left ?? "50%",
            top: periodPosition?.top ?? "50%",
            // Align the SVG circle center with the measured period.
            transform: periodPosition
              ? `translate(-50%, -${CIRCLE_OFFSET_PERCENT}%)`
              : "translate(-50%, -50%)",
            display: "block",
            width: periodPosition?.width ?? "min(100%, 36svh)",
            maxWidth: 400,
            height: "auto",
            pointerEvents: "none",
            transition:
              "left 0.8s ease-in-out, top 0.8s ease-in-out, width 0.8s ease-in-out, transform 0.8s ease-in-out",
          }}
        />
      )}
      {/* Heading: reveal after the SVG finishes, then move its circle. */}
      <Typography
        key={`title-${playbackId}`}
        id={titleId}
        component={headingComponent}
        aria-label="Futures.ai"
        onAnimationEnd={(event) => {
          if (
            phase === "revealing" &&
            event.target === event.currentTarget &&
            event.animationName === revealName.name
          ) {
            setPhase("moving");
          }
        }}
        sx={{
          color: "#206aff",
          fontWeight: 700,
          fontSize: { xs: "clamp(1.75rem, 8vw, 3.5rem)", md: "5rem" },
          whiteSpace: "nowrap",
          lineHeight: 1.1,
          opacity: showStatic || phase === "moving" || phase === "complete" ? 1 : 0,
          animation: !showStatic && phase === "revealing"
            ? `${revealName} 0.9s ease-out ${SVG_END_SECONDS}s forwards`
            : "none",
        }}
      >
        Futures
        {/* Reserve the period space; paint it directly for static playback. */}
        <Box
          component="span"
          ref={periodRef}
          aria-hidden="true"
          sx={{
            display: "inline-block",
            width: "0.14em",
            height: "0.14em",
            borderRadius: "50%",
            bgcolor: showStatic ? "currentColor" : "transparent",
            ml: "0.04em",
            verticalAlign: "baseline",
          }}
        />
        {/* Reveal the suffix once the circle reaches the period. */}
        <Box
          component="span"
          sx={{
            display: "inline-block",
            opacity: showStatic ? 1 : 0,
            animation: !showStatic && phase === "complete"
              ? `${revealName} 0.5s ease-out forwards`
              : "none",
          }}
        >
          ai
        </Box>
      </Typography>
    </Box>
  );
}
