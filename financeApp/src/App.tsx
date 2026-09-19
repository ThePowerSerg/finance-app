import { Container, CssBaseline } from "@mui/material";
import Animation from "./Components/Animation";

function App() {
  return (
    <>
      <CssBaseline />
      <Container component="main" maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        <Animation headingComponent="h1" />
      </Container>
    </>
  );
}
export default App;
