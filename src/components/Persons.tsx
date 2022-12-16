/**
 * Person views
 */

import {
  Button,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  TextField,
  DialogActions,
  FormControl,
} from "@mui/material";
import React, {FormEvent, useState} from "react";
import {IPerson} from "../models";
import moment from "moment";
import CallIcon from "@mui/icons-material/Call";
import UpdateIcon from "@mui/icons-material/Update";
import EditIcon from "@mui/icons-material/Edit";

function dateString(date?: number): string {
  switch (moment.locale()) {
    case "fr":
      return (
        "Dernier contact " +
        (date !== undefined ? moment(date).fromNow() : "il y a bien longtemps")
      );
    case "en":
    default:
      return (
        "Last contact " +
        (date !== undefined ? moment(date).fromNow() : "a long time ago")
      );
  }
}

/**
 * View for a single person
 */
export function PersonView({
  person,
  selected = false,
  onClick,
}: {
  person: IPerson;
  selected: boolean;
  onClick: () => void;
}): JSX.Element {
  let officialName = person.firstname;
  if (person.lastname !== undefined) {
    if (officialName !== undefined) {
      officialName += " " + person.lastname;
    } else {
      officialName = person.lastname;
    }
  }
  let mainName, secondaryName;
  if (person.nickname !== undefined) {
    mainName = person.nickname;
    secondaryName = officialName;
  } else {
    mainName = officialName;
  }
  if (secondaryName !== undefined) {
    secondaryName = " — " + secondaryName;
  }

  const onCallClicked = (): void => {
    console.log("TODO call the person", person.phonenumber);
  };
  const onUpdateContactClicked = (): void => {
    console.log("TODO update last contact", person.lastcontact);
  };
  const onEditClicked = (): void => {
    console.log("TODO edit person", person);
  };

  return (
    <div>
      <ListItemButton onClick={onClick}>
        <ListItemText
          primary={
            <React.Fragment>
              {mainName}
              <Typography
                sx={{display: "inline"}}
                component="span"
                variant="body2"
                color="text.secondary">
                {secondaryName}
              </Typography>
            </React.Fragment>
          }
          secondary={dateString(person.lastcontact)}
        />
      </ListItemButton>
      <Collapse in={selected} timeout="auto" unmountOnExit>
        <div className="flex flex-row place-content-around pl-2">
          <Button onClick={onCallClicked}>
            <CallIcon />
          </Button>
          <Button onClick={onUpdateContactClicked}>
            <UpdateIcon />
          </Button>
          <Button onClick={onEditClicked}>
            <EditIcon />
          </Button>
        </div>
      </Collapse>
    </div>
  );
}

/**
 * View of the persons' list
 */
export function PersonsList({persons}: {persons: IPerson[]}): JSX.Element {
  const [selection, select] = useState<number>(-1);
  const items: JSX.Element[] = [];
  let index = 0;
  for (const person of persons) {
    const key = index++;
    items.push(
      <PersonView
        key={key}
        person={person}
        onClick={() => {
          if (key === selection) {
            select(-1);
          } else {
            select(key);
          }
        }}
        selected={key === selection}
      />
    );
  }
  return <List>{items}</List>;
}

/**
 * Text field for the edit/create dialog
 * @param props Includes:
 * @returns TextField instance
 */
function Field({
  name,
  ...other
}: {
  /** Defines the `label` of the textfield, as well as its `id` and `name` */
  name: string;
  [key: string]: any;
}): JSX.Element {
  return (
    <TextField
      margin="dense"
      fullWidth
      variant="standard"
      label={name}
      name={name.toLowerCase()}
      id={name.toLowerCase()}
      {...other}
    />
  );
}

/**
 * Dialog to create/edit a person.
 * For now, only used for creation.
 */
export function EditPersonDialog({
  person,
  open,
  onCancel,
  onValidate,
}: {
  /** The person to edit (not used for now) */
  person?: IPerson;

  /** Whether the dialog is open */
  open: boolean;

  /** Callback on edition/creation cancellation */
  onCancel: () => void;

  /** Callback onedition/creation validation (with new person as param) */
  onValidate: (person: IPerson) => void;
}): JSX.Element {
  const handleValidate = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const get = (name: string): string | undefined => {
      const value = data.get(name);
      if (typeof value === "string" && value.trim() !== "") {
        return value.trim();
      }
      return undefined;
    };

    onValidate({
      nickname: get("nickname"),
      firstname: get("firstname"),
      lastname: get("lastname"),
    });
  };

  const editing = person !== undefined;
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{editing ? "Person edition" : "New person"}</DialogTitle>
      <DialogContent>
        <FormControl
          component="form"
          id="dialog-form"
          onSubmit={handleValidate}>
          <Field name="Nickname" autoFocus={true} />
          <Field name="Firstname" />
          <Field name="Lastname" />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" form="dialog-form">
          {editing ? "Save changes" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
