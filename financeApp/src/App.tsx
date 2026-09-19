import { useEffect, useState } from "react";
import { Box, Container, CssBaseline, Typography, keyframes } from "@mui/material";
import animation from "./assets/images/animation1.svg";

// The SVG's last shape starts at 1.733332s and runs for four seconds.
const loopEnd = 5.733332;
const revealName = keyframes`
  from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
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
              display: "block",
              width: "min(100%, 36svh)",
              maxWidth: 400,
              height: "auto",
            }}
          />}
          <Typography
            key={`title-${playbackId}`}
            id="hero-title"
            component="h1"
            onAnimationEnd={(event) => {
              if (event.animationName === revealName.name) {
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
                ? `${revealName} 0.9s ease-out ${loopEnd}s forwards`
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
