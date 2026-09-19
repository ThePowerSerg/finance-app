import { Box, Container, CssBaseline } from "@mui/material";
import animation from "./assets/images/animation1.svg";

function App() {
  return (
    <>
      <CssBaseline />
      <Container component="main" maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        <Box
          component="section"
          aria-label="FinAlysis hero"
          sx={{
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
          <Box
            component="img"
            src={animation}
            alt=""
            sx={{ display: "block", width: "min(100%, 36svh)", maxWidth: 400, height: "auto" }}
          />
        </Box>
      </Container>
    </>
  );
}
export default App;
