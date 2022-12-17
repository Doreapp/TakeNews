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
  Alert,
} from "@mui/material";
import React, {FormEvent, useState} from "react";
import "dayjs/locale/fr";
import {IPerson} from "../models";
import moment from "moment";
import CallIcon from "@mui/icons-material/Call";
import UpdateIcon from "@mui/icons-material/Update";
import EditIcon from "@mui/icons-material/Edit";
import {Dayjs} from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";

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
      name={name.toLowerCase().replaceAll(" ", "-")}
      id={name.toLowerCase().replaceAll(" ", "-")}
      {...other}
    />
  );
}

/**
 * Field for a phone number.
 * Only accept number digits and an optional prefixing `+`.
 */
function PhoneNumberField({
  name,
  ...other
}: {
  /** Defines the `label` of the textfield, as well as its `id` and `name` */
  name: string;
  [key: string]: any;
}): JSX.Element {
  const [value, setValue] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const inputVal = event.target.value;
    let result = "";
    for (const char of inputVal) {
      if (char === "+" && result === "") {
        result = "+";
      } else if (char.match(/[0-9]/) !== null) {
        result += char;
      }
    }
    setValue(result);
  };

  return <Field name={name} value={value} onChange={handleChange} {...other} />;
}

/**
 * Input field for a date
 */
function DateField({
  name,
  ...other
}: {
  /** Defines the `label` of the textfield, as well as its `id` and `name` */
  name: string;
  [key: string]: any;
}): JSX.Element {
  const [value, setValue] = React.useState<Dayjs | null>(null);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
      <DatePicker
        label={name}
        value={value}
        onChange={setValue}
        renderInput={(params) => <Field name={name} {...params} />}
        {...other}
      />
    </LocalizationProvider>
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
  const [error, setError] = React.useState<string | undefined>(undefined);
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

    const person = {
      nickname: get("nickname"),
      firstname: get("firstname"),
      lastname: get("lastname"),
      phoneNumber: get("phone-number"),
      lastContact: get("last-contact"),
    };

    if (
      person.nickname === undefined &&
      person.firstname === undefined &&
      person.lastname === undefined
    ) {
      setError("At least one of the names must be defined");
      return;
    }

    setError(undefined);
    onValidate(person);
  };

  const editing = person !== undefined;
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{editing ? "Person edition" : "New person"}</DialogTitle>
      {error !== undefined && <Alert severity="error">{error}</Alert>}
      <DialogContent>
        <FormControl
          component="form"
          id="dialog-form"
          onSubmit={handleValidate}>
          <Field name="Nickname" autoFocus={true} />
          <Field name="Firstname" />
          <Field name="Lastname" />
          <PhoneNumberField name="Phone number" />
          <DateField
            name="Last contact"
            PopperProps={{
              // Setting an higher z-index for the popper to be above the dialog
              className: "z-[1400]",
            }}
          />
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
