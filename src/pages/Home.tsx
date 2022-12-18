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
    editing?: IPerson;
    persons: IPerson[];
  }>({
    creating: false,
    editing: undefined,
    persons: [],
  });
  const onCreateOrEditPerson = (newPerson: IPerson): void => {
    if (state.creating) {
      setState({
        ...state,
        creating: false,
        persons: [...state.persons, newPerson],
      });
    } else if (state.editing !== undefined) {
      const newPersons = state.persons.map((person: IPerson) =>
        person === state.editing ? newPerson : person
      );
      setState({...state, editing: undefined, persons: newPersons});
    }
  };
  return (
    <Container maxWidth="md">
      <PersonsList
        persons={state.persons}
        onEditClicked={(person: IPerson) =>
          setState({...state, editing: person})
        }
      />
      <EditPersonDialog
        person={state.editing}
        open={state.creating || state.editing !== undefined}
        onCancel={() => {
          setState({...state, creating: false, editing: undefined});
        }}
        onValidate={onCreateOrEditPerson}
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
