import { useEffect, useState } from "react";
import { Box, Container, CssBaseline, Typography, keyframes } from "@mui/material";
import animation from "./assets/images/animation1.svg";

// The SVG's last shape starts at 1.733332s and runs for four seconds.
const loopEnd = 5.733332;
const moveDuration = 1;

const moveCircle = keyframes`
  from {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(1);
  }
  to {
    left: calc(100% - 48px);
    top: calc(100% - 48px);
    transform: translate(-55.833333%, -79.907407%) scale(0.65);
  }
`;

const swoopIn = keyframes`
  0% { opacity: 0; transform: translate(-100px, 60px) rotate(-12deg) scale(0.85); }
  75% { opacity: 1; transform: translate(8px, -6px) rotate(2deg) scale(1.03); }
  100% { opacity: 1; transform: translate(0, 0) rotate(0deg) scale(1); }
`;

function App() {
  const [animationLoaded, setAnimationLoaded] = useState(false);
  const [nameVisible, setNameVisible] = useState(false);
  const [playbackId, setPlaybackId] = useState<string | null>(null);

  useEffect(() => {
    // Restart both the SVG and CSS timelines after mounting or a Vite refresh.
    setAnimationLoaded(false);
    setNameVisible(false);
    setPlaybackId(crypto.randomUUID());
  }, []);

  return (
    <>
      <CssBaseline />
      <Container component="main" maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        <Box
          component="section"
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
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.06)",
          }}
        >
          {playbackId !== null && !nameVisible && <Box
            key={`circle-${playbackId}`}
            component="img"
            src={`${animation}?playback=${playbackId}`}
            alt=""
            onLoad={() => setAnimationLoaded(true)}
            sx={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              // The final circle is centered at (603, 863) in the 1080px SVG.
              transformOrigin: "55.833333% 79.907407%",
              display: "block",
              width: "min(100%, 36svh)",
              maxWidth: 400,
              height: "auto",
              animation: animationLoaded
                ? `${moveCircle} ${moveDuration}s cubic-bezier(0.4, 0, 0.2, 1) ${loopEnd}s forwards`
                : "none",
            }}
          />}
          <Typography
            key={`title-${playbackId}`}
            id="hero-title"
            component="h1"
            onAnimationEnd={(event) => {
              if (event.animationName === swoopIn.name) {
                setNameVisible(true);
              }
            }}
            sx={{
              color: "#206aff",
              fontWeight: 700,
              fontSize: { xs: "3.5rem", md: "5rem" },
              lineHeight: 1.1,
              opacity: 0,
              animation: animationLoaded
                ? `${swoopIn} 0.9s ease-out ${loopEnd + moveDuration}s forwards`
                : "none",
            }}
          >
            FinApp
          </Typography>
        </Box>
      </Container>
    </>
  );
}
export default App;
