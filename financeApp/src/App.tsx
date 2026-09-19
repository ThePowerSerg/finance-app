import { Box, Container, CssBaseline, Typography } from "@mui/material";

function App() {
  return (
    <>
      <CssBaseline />
      <Container component="main" maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        <Box
          component="section"
          aria-labelledby="hero-title"
          sx={{
            minHeight: "50svh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            px: { xs: 3, md: 8 },
            py: { xs: 6, md: 8 },
            bgcolor: "common.white",
            border: "1px solid",
            borderColor: "grey.200",
            borderRadius: 3,
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.06)",
          }}
        >
          <Typography
            id="hero-title"
            component="h1"
            variant="h2"
            sx={{ fontWeight: 700, fontSize: { xs: "2.5rem", md: "4rem" } }}
          >
            FinAlysis
          </Typography>
          <Typography
            variant="h5"
            component="p"
            color="text.secondary"
            sx={{ mt: 2, maxWidth: 640, fontSize: { xs: "1.125rem", md: "1.5rem" } }}
          >
            Build your financial knowledge and take your next step with confidence.
          </Typography>
        </Box>
      </Container>
    </>
  );
}
export default App;
