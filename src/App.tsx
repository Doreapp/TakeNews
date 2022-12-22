import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import HomePage from "./pages/Home";
import {PersonsProvider} from "./core/persons-context";

function Copyright(): JSX.Element {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/Doreapp">
        Antoine Mandin
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function App(): JSX.Element {
  return (
    <PersonsProvider>
      <Container className="min-h-screen flex flex-col place-content-between">
        <HomePage />
        <Copyright />
      </Container>
    </PersonsProvider>
  );
}
