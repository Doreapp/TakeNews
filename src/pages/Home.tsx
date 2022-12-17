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
  const [state, setState] = React.useState<{
    creating: boolean;
    persons: IPerson[];
  }>({creating: false, persons: []});
  const onCreatePerson = (person: IPerson): void => {
    setState({...state, creating: false, persons: [...state.persons, person]});
  };
  return (
    <Container maxWidth="md">
      <PersonsList persons={state.persons} />
      <EditPersonDialog
        open={state.creating}
        onCancel={() => {
          setState({...state, creating: false});
        }}
        onValidate={onCreatePerson}
      />
      <Fab
        color="primary"
        aria-label="Create a new person"
        className="fixed bottom-6 right-4"
        onClick={() => setState({...state, creating: true})}>
        <AddIcon />
      </Fab>
    </Container>
  );
}
