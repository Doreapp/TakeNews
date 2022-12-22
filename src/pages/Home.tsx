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
import {usePersonsContext} from "../core/persons-context";

interface HomeState {
  creating: boolean;
  editing?: IPerson;
}

export default function HomePage(): JSX.Element {
  const [state, setState] = React.useState<HomeState>({
    creating: false,
    editing: undefined,
  });
  const {persons, createPerson, deletePerson, updatePerson} =
    usePersonsContext();

  const onCreateOrEditPerson = (newPerson: IPerson): void => {
    if (state.creating) {
      createPerson(newPerson);
    } else if (state.editing !== undefined) {
      updatePerson(newPerson);
    }
    setState({...state, creating: false, editing: undefined});
  };

  const onDeletePerson = (toDelete: IPerson): void => {
    if (toDelete.id !== undefined) {
      deletePerson(toDelete.id);
    }
  };

  return (
    <Container maxWidth="md">
      <PersonsList
        persons={persons}
        onEditClicked={(person: IPerson) =>
          setState({...state, editing: person})
        }
        onDeleteClicked={onDeletePerson}
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
