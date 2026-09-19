import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Box, Container, Typography, keyframes } from "@mui/material";
import animation from "../assets/images/animation1.svg";

// The SVG's last shape starts at 1.083332s and runs for 2.5 seconds.
const loopEnd = 3.583332;
const revealName = keyframes`
  from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
`;

export default function Animation() {
  const [animationLoaded, setAnimationLoaded] = useState(false);
  const [nameVisible, setNameVisible] = useState(false);
  const [periodSettled, setPeriodSettled] = useState(false);
  const [playbackId, setPlaybackId] = useState<string | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const periodRef = useRef<HTMLSpanElement>(null);
  const [periodPosition, setPeriodPosition] = useState<{
    left: number;
    top: number;
    width: number;
  } | null>(null);

  useEffect(() => {
    // Restart both the SVG and CSS timelines after mounting or a Vite refresh.
    setAnimationLoaded(false);
    setNameVisible(false);
    setPeriodSettled(false);
    setPeriodPosition(null);
    setPlaybackId(crypto.randomUUID());
  }, []);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const period = periodRef.current;
    if (!nameVisible || !hero || !period) return;

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
        // The final SVG circle has a diameter of 198.6 in its 1080-unit viewBox.
        width: (dotBounds.width * 1080) / 198.6,
      });
    };

    positionCircle();
    const observer = new ResizeObserver(positionCircle);
    observer.observe(hero);
    observer.observe(period);
    if (period.parentElement) observer.observe(period.parentElement);
    return () => observer.disconnect();
  }, [nameVisible]);

  return (
    <>
      <Container component="main" maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        <Box
          component="section"
          ref={heroRef}
          aria-labelledby="hero-title"
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
          {playbackId !== null && (
            <Box
              key={`circle-${playbackId}`}
              component="img"
              src={`${animation}?playback=${playbackId}`}
              alt=""
              onLoad={() => setAnimationLoaded(true)}
              onTransitionEnd={(event) => {
                if (periodPosition && event.propertyName === "transform") {
                  setPeriodSettled(true);
                }
              }}
              sx={{
                position: "absolute",
                left: periodPosition?.left ?? "50%",
                top: periodPosition?.top ?? "50%",
                // Final circle center: (540, 863) in the SVG viewBox.
                transform: periodPosition
                  ? "translate(-50%, -79.907407%)"
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
          <Typography
            key={`title-${playbackId}`}
            id="hero-title"
            component="h1"
            aria-label="Trade.ai"
            onAnimationEnd={(event) => {
              if (
                event.target === event.currentTarget &&
                event.animationName === revealName.name
              ) {
                setNameVisible(true);
              }
            }}
            sx={{
              color: "#206aff",
              fontWeight: 700,
              fontSize: { xs: "clamp(1.75rem, 8vw, 3.5rem)", md: "5rem" },
              whiteSpace: "nowrap",
              lineHeight: 1.1,
              opacity: 0,
              animation: animationLoaded
                ? `${revealName} 0.9s ease-out ${loopEnd}s forwards`
                : "none",
            }}
          >
            Trade
            <Box
              component="span"
              ref={periodRef}
              aria-hidden="true"
              sx={{
                display: "inline-block",
                width: "0.14em",
                height: "0.14em",
                ml: "0.04em",
                verticalAlign: "baseline",
              }}
            />
            <Box
              component="span"
              sx={{
                display: "inline-block",
                opacity: 0,
                animation: periodSettled
                  ? `${revealName} 0.5s ease-out forwards`
                  : "none",
              }}
            >
              ai
            </Box>
          </Typography>
        </Box>
      </Container>
    </>
  );
}
