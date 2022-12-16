/**
 * Home page,
 * displaying persons
 */

import * as React from "react";
import Container from "@mui/material/Container";
import {IPerson} from "../models";
import {PersonsList, EditPersonDialog} from "../components/Persons";
import {Fab} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function HomePage(): JSX.Element {
  const [creating, setCreating] = React.useState<boolean>(false);
  const [persons, setPersons] = React.useState<IPerson[]>([]);
  const onCreatePerson = (person: IPerson): void => {
    setCreating(false);
    setPersons([...persons, person]);
  };
  return (
    <Container maxWidth="md">
      <PersonsList persons={persons} />
      <EditPersonDialog
        open={creating}
        onCancel={() => {
          setCreating(false);
        }}
        onValidate={onCreatePerson}
      />
      <Fab
        color="primary"
        aria-label="Create a new person"
        className="fixed bottom-6 right-4"
        onClick={() => setCreating(true)}>
        <AddIcon />
      </Fab>
    </Container>
  );
}
